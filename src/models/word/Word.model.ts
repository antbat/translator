import { IWordModel } from './Word.interface';
import { IConfig } from "../../utils/Config.interface";
import {
    Schema, // class
    Model, // interface generic
    model  // factory of Model
} from 'mongoose';
import currentConfig from 'config'
import { client } from '../../connections/elasticsearch.connection';
import { RequestParams } from '@elastic/elasticsearch'

const config: IConfig = currentConfig as any;
const ObjectId = Schema.Types.ObjectId;

const itemSchema = new Schema({
    text: String,
    tuple: [{ type: ObjectId, ref: config.mongoDB.collection.word }],
    dictionaries: [{ type: ObjectId, ref: config.mongoDB.collection.dictionary }]
}, { timestamps: true });

itemSchema.post<IWordModel>('save', async function(doc) {
    const id = doc.id;
    const body: any = Object.assign({}, doc.toObject());
    delete body._id;
    const one: RequestParams.Index = {
        index: config.elasticSearch.index.word,
        id, body
    };
    try {
        await client.index(one)
    } catch (err) {
        console.error(err);
    }
});

export const WordModel: Model<IWordModel> = model<IWordModel>(
    config.mongoDB.collection.word,
    itemSchema
);
