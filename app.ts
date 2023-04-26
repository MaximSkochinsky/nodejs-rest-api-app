import * as bodyParser from "body-parser";
import * as express from "express";
import { APILogger } from "./logger/api.logger";
import { UserController } from "./controller/user.controller";
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import 'dotenv/config';
import * as  jwt from 'jsonwebtoken';
import * as cors from 'cors'
import * as multer from 'multer'
import * as path from 'path'
import * as PDFDocument from 'pdfkit'

  
// Create a document


class App {

    public express: express.Application;
    public logger: APILogger;
    public userController: UserController;
    public upload: any
    public doc: typeof PDFDocument

    /* Swagger files start */
    private swaggerFile: any = (process.cwd()+"/swagger/swagger.json");
    private swaggerData: any = fs.readFileSync(this.swaggerFile, 'utf8');
    private customCss: any = fs.readFileSync((process.cwd()+"/swagger/swagger.css"), 'utf8');
    private swaggerDocument = JSON.parse(this.swaggerData);
    /* Swagger files end */


    constructor() {
        this.doc = new PDFDocument();
        this.express = express();
        this.middleware();     
        this.routes();
        this.logger = new APILogger();
        this.userController = new UserController();

        
      
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cors())
        this.express.use(express.static('public'))
        this.upload = multer({ dest: 'uploads/' })
    }

    private routes(): void {


      const storage = multer.diskStorage({
          destination: function (req, file, cb) {
              cb(null, 'uploads')
          },
          filename: function (req, file, cb) {
              cb(null, file.fieldname + '-' + Date.now())
          }
      })

      

        this.express.post("/api/login", async (req, res, next) => {
            let { email, password } = req.body;
           
            let existingUser;
            try {
              existingUser = await this.userController.getUser(email);
            } catch {
              const error = new Error("Error! Something went wrong.");
              return next(error);
            }
            if (!existingUser || existingUser.password != password) {
              const error = Error("Wrong details please check at once");
              return next(error);
            }
            let token;
            try {
              //Creating jwt token
              token = jwt.sign(
                { userId: existingUser.id, email: existingUser.email },
                "secretkeyappearshere",
                { expiresIn: "300h" }
              );
            } catch (err) {
              console.log(err);
              const error = new Error("Error! Something went wrong.");
              return next(error);
            }
           
            res
              .status(200)
              .json({
                success: true,
                data: {
                  userId: existingUser.id,
                  email: existingUser.email,
                  token: token,
                },
              });
          });
           

        const checkJWT = (req, res, next) => {
            const token = req.headers.authorization?.split(' ')[1]; 
            //Authorization: 'Bearer TOKEN'
            if(!token)
            {
                res.status(401).json({success:false, message: "Error! Token was not provided."});
            }
            //Decoding the token
            const decodedToken = jwt.verify(token,"secretkeyappearshere" );
            next()
        }  
          


        this.express.get('/api/users', (req, res) => {
            this.userController.getUsers().then(data => res.json(data));
        });

        this.express.post('/api/pdf', checkJWT, async (req, res) => {
            const email = req.body.email
            const data = await this.userController.getUser(email)

            if (data) {
              
              this.doc.pipe(fs.createWriteStream(`./pdf/${data.firstName}__${data.lastName}.pdf`));

              this.doc
              .fontSize(27)
              .text(data.firstName + "   " + data.lastName, 100, 100);
              
            // Adding an image in the pdf.
              
              this.doc.image(data.image, {
                fit: [300, 300],
                align: 'center',
                valign: 'center'
              });
              
                this.doc
                .addPage()
                .fontSize(15)
                .text('Generating PDF with the help of pdfkit', 100, 100);
                
              
               
                // Apply some transforms and render an SVG path with the 
                // 'even-odd' fill rule
                this.doc
                  .scale(0.6)
                  .translate(470, -380)
                  .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
                  .fill('red', 'even-odd')
                  .restore();
                  
                  
                // Finalize PDF file
                this.doc.end();


                const pdfData = fs.readFileSync(`./pdf/${data.firstName}__${data.lastName}.pdf`)

                const newUserObject = {
                  id: data.id,
                  email: data.email,
                  password: data.password,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  image: data.image,
                  pdf: String(pdfData)
                }

                const result = await this.userController.updateUser(newUserObject)
                if (result) {
                  res.json({
                    "status": "true"
                  })
                }
                  else res.json({
                    "status": "false"
                })
            }

        })

        
        this.express.post('/api/user', (req, res) => {
            this.userController.createUser(req.body.user).then(data => res.json(data));
        });
        
        this.express.put('/api/user',checkJWT, (req, res) => {
            this.userController.updateUser(req.body.user).then(data => res.json(data));
        });
        
        this.express.delete('/api/user/:id',checkJWT, (req, res) => {
            this.userController.deleteUser(req.params.id).then(data => res.json(data));
        });

        this.express.post('/api/upload', this.upload.single('avatar'), async (req, res) => {
      
            let userObject = req.body
            userObject['image'] = path.join(__dirname, req.file.path) 


            const data = await this.userController.getUser(userObject.email)
            if (!data) 
              this.userController.createUser(userObject).then(data => res.json(data));
            else {
              res.json({})
            }

        })

        this.express.get("/", (req, res, next) => {
            res.send("Typescript App works!!");
        });

      

        // swagger docs
        this.express.use('/api/docs', swaggerUi.serve,
            swaggerUi.setup(this.swaggerDocument, null, null, this.customCss));

        // handle undefined routes
        this.express.use("*", (req, res, next) => {
            res.send("Make sure url is correct!!!");
        });
    }
}

export default new App().express;