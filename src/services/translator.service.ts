import {Report} from "../models/report/Report";
import {ReportStream} from "../models/stream/reportStream.interface";
import {WordModel} from "../models/word/Word.model";
import {RelationModel} from "../models/relation/Relation.model";
import {DictionaryModel} from "../models/dictionary/Dictionary.model";
import {IDictionaryModel} from "../models/dictionary/Dictionary.interface";
import {IWordModel} from "../models/word/Word.interface";

export class TranslatorService {

    report: Report;
    stream: ReportStream;

    constructor (stream: ReportStream) {
        this.stream = stream;
        this.report = new Report();
    }
    async fromJson(data: any): Promise<Report> {
        const start = new Date();
        this.stream.info(`Start time: ${start}`);
        await this.report.start();

        const dictionary = await DictionaryModel.create({
            title: data.name,
            description: data.description,
            version: data.version
        });

        if (data && data.words && data.words.length > 0) {
            await this.extrudeWords(data.words, dictionary);
        }

        if (data && data.tuples && data.tuples.length > 0) {
            await this.extrudeTuples(data.tuples, dictionary);
        }

        if (data && data.relations && data.relations.length > 0) {
            await this.extrudeRelations(data.relations, dictionary);
        }

        await this.report.finish();
        const finish = new Date();
        this.stream.info(`Finish time: ${finish}`);
        const delay = (finish.getTime() - start.getTime())/1000;
        this.stream.info(`Duration: ${ delay.toFixed(2)} seconds.`);
        return this.report;
    }
    async extrudeWords(items: any[], dictionary: IDictionaryModel): Promise<void> {
        if (!items) {
            throw new Error('words is null');
        }
        for (let i = 0, max = items.length; i < max; i++) {
            const item = items[i];
            const existed = await WordModel.findOne({ text: item });
            if (!existed) {
                await WordModel.create({
                    text: item,
                    dictionaries: [dictionary._id]
                });
                this.report.items.created++;
                this.stream.info('items' + this.report.items.created.toString());
            }
        }
    }
    async extrudeTuples(tuples: any[], dictionary: IDictionaryModel): Promise<void> {
        if (!tuples) {
            throw new Error('tuples is null');
        }
        for (let i = 0, max = tuples.length; i < max; i++) {
            const tuple = tuples[i];
            const existedTuple = await WordModel.findOne({ text: tuple});
            if (!existedTuple) {

                // let's create new unique tuple
                const words = tuple.split('|');
                if (!words || words.length === 0 ) {
                    throw new Error(`the tuple ${tuple} is wrong formatted (without "|")`);
                }
                const existedWordIds = [];
                for (let j = 0, maxWords = words.length; j < maxWords; j++) {
                    const word = words[j];
                    const one = await WordModel.findOne({ text: word});
                    if (!one) {
                        throw new Error(`"${word}" from "${tuple}" is not in DB`)
                    }
                    existedWordIds.push(one.id.toString());
                }
                await WordModel.create({
                    text: tuple,
                    tuple : existedWordIds,
                    dictionaries: [dictionary._id]
                });
                this.report.tuples.created++;
                this.stream.info('tuples' + this.report.tuples.created.toString());
            }
        }
    }
    async extrudeRelations(relations: any[], dictionary: IDictionaryModel): Promise<void> {
        if (!relations) {
            throw new Error('relations is null');
        }
        for (let i = 0, max = relations.length; i < max; i++) {
            const relation = relations[i];
            const from = await WordModel.findOne({ text: relation[0] }).lean();
            const what = await WordModel.findOne({ text: relation[1] }).lean();

            if (typeof relation[2] === 'string') {
                const to = await WordModel.findOne({ text: relation[2] }).lean();
                await this.checkAndCreate(from, what, to, dictionary);
            } else if (relation[2] && relation[2].length && relation[2].length > 0) {
                const wordsTo = relation[2];
                for (let j = 0, maxWordsTo = wordsTo.length; j < maxWordsTo; j++) {
                    const to = await WordModel.findOne({ text: relation[2][j] }).lean();
                    await this.checkAndCreate(from, what, to, dictionary);
                }
            }

        }
    }
    private async checkAndCreate(from: IWordModel, what: IWordModel, to: IWordModel, dictionary: IDictionaryModel) {
        if (to && from && what) {
            const one: any = {
                from: from._id.toString(),
                to: to._id.toString(),
                what: what._id.toString(),
            };
            const existedRelation = await RelationModel.findOne(one);
            one.dictionaries = [dictionary._id];
            if (!existedRelation) {
                await RelationModel.create(one);
                this.report.relations.created++;
                this.stream.info('relations ' + this.report.relations.created.toString());
            }
        }
    }
}
