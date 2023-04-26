import { Sequelize } from 'sequelize-typescript'
import { Users } from '../model/user.model';

export const connect = () => {

    const hostName = process.env.HOST;
    const userName = process.env.USER;
    const password = process.env.USER;
    const database = process.env.DB;
    const dialect: any = process.env.DIALECT;


    const operatorsAliases: any = false;

    const sequelize = new Sequelize(database, userName, password, {
        host: hostName,
        dialect,
        operatorsAliases,
        repositoryMode: true,
        pool: {
            max: 10,
            min: 0,
            acquire: 20000,
            idle: 5000
        }
    });

    sequelize.addModels([Users]);

    const db: any = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    
    return db;

}