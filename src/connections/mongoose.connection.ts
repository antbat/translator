import mongoose from 'mongoose';
import {IConfig} from "../utils/Config.interface";

const currentConfig = require('config');
const config: IConfig = currentConfig as any;

mongoose.Promise = Promise;

if (process.env.MONGOOSE_DEBUG) {
    mongoose.set('debug', true);
}

const db = mongoose.connection;

db.on('connected', () => console.info('Mongoose connection was opened'));
db.on('error', err => console.error('Mongoose connection has occured ', err));
db.on('disconnected', () => console.info('Mongoose was disconnected'));

process.on('SIGINT', () => {
    db.close().then(() => {
        console.info('Mongoose connection is disconnected due to application termination');
        process.exit(0);
    });
});

export const mongooseConnection = mongoose.connect(config.mongoDB.connectionString);

