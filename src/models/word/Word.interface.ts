import { ITimeStampsMongo } from "../../utils/TimeStampsMongo.intarface";
import { Document } from 'mongoose';
import { IDictionary } from "../dictionary/Dictionary.interface";

export interface IWord extends ITimeStampsMongo{
    text: string;
    tuple: IWord[];
    dictionaries: string[] | IDictionary[];
}
export interface IWordModel extends IWord, Document {}
