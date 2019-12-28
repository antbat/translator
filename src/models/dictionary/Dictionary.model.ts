import { IDictionaryModel } from './Dictionary.interface';
import { IConfig } from "../../utils/Config.interface";
import {
    Schema, // class
    Model, // interface generic
    model  // factory of Model
} from 'mongoose';
import currentConfig from 'config'

const config: IConfig = currentConfig as any;

const itemSchema = new Schema({
    title: String,
    description: String,
    version: String
}, { timestamps: true });

export const DictionaryModel: Model<IDictionaryModel> = model<IDictionaryModel>(
    config.mongoDB.collection.dictionary,
    itemSchema
);
