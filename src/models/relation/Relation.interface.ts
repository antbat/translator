import { IWord } from "../word/Word.interface";
import {ITimeStampsMongo} from "../../utils/TimeStampsMongo.intarface";
import { Document } from 'mongoose';
import {IDictionary} from "../dictionary/Dictionary.interface";

export interface IRelation extends ITimeStampsMongo{
    from: IWord;
    to: IWord;
    what: IWord;
    degree: number;
    dictionaries: string[] | IDictionary[];
}
export interface IRelationModel extends IRelation, Document {}


