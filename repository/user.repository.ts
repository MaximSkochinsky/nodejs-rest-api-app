import { connect } from "../config/db.config";
import { APILogger } from '../logger/api.logger';
import { Users } from "../model/user.model";

export class UserRepository {

    private logger: APILogger;
    private db: any = {};
    private userRespository: any;

    constructor() {
        this.db = connect();
        // For Development
        this.db.sequelize.sync({ force: true }).then(() => {
            console.log("Drop and re-sync db.");
        });
        this.userRespository = this.db.sequelize.getRepository(Users);
    }

    async getUsers() {
        
        try {
            const users = await this.userRespository.findAll();
            users.forEach(user => {
                if (user.pdf) user.pdf = 'binary data'
            });
            return users;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async createUser(user) {
        let data = {};
        try {
            user.createdate = new Date().toISOString();
            data = await this.userRespository.create(user);
        } catch(err) {
            console.log('Error::' + err);
        }
        return data;
    }

    async updateUser(user) {
        let data = {};
        try {
            user.updateddate = new Date().toISOString();
            data = await this.userRespository.update({...user}, {
                where: {
                    id: user.id
                }
            });
        } catch(err) {
            console.log('Error::' + err);
        }
        return data;
    }

    async deleteUser(userId) {
        let data = {};
        try {
            data = await this.userRespository.destroy({
                where: {
                    id: userId
                }
            });
        } catch(err) {
            this.logger.error('Error::' + err);
        }
        return data;
    }


    async getUser(email) {
        try {
            const user = await this.userRespository.findOne({where: {
                email: email,
              }});
            return user;
        } catch (err) {
            console.log(err);
            return [];
        }
    } 

}