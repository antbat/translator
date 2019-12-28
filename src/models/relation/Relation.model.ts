import {IRelationModel} from "./Relation.interface";
import {Model, model, Schema} from 'mongoose';

import {IConfig} from "../../utils/Config.interface";
import currentConfig from 'config'
import {RequestParams} from "@elastic/elasticsearch";
import {client} from "../../connections/elasticsearch.connection";
import {WordModel} from "../word/Word.model";

const config: IConfig = currentConfig as any;

const ObjectId = Schema.Types.ObjectId;
const toWordPopulatedType = { type: ObjectId, ref: config.mongoDB.collection.word };

const relationSchema = new Schema({
    text: String,
    from: toWordPopulatedType,
    to: toWordPopulatedType,
    what: toWordPopulatedType,
    dictionaries: [{ type: ObjectId, ref: config.mongoDB.collection.dictionary }]
}, { timestamps: true });

relationSchema.post<IRelationModel>('save', async function(doc) {
    const from  = await WordModel.findById(doc.from);
    if (from) {
        const id = doc.from.toString();
        const body: any = Object.assign({}, from.toObject());
        delete body._id;

        const relations = await RelationModel.find({ from: doc.from }).lean();
        body.tags = relations.map(e => {
            return {
                to: e.to._id.toString(),
                what: e.what._id.toString()
            }
        });
        const one: RequestParams.Index = {
            index: config.elasticSearch.index.word,
            id, body
        };
        await client.index(one)
    }

});

export const RelationModel: Model<IRelationModel> = model<IRelationModel>(
    config.mongoDB.collection.relation,
    relationSchema
);

