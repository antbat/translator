import { ITimeStampsMongo } from "../../utils/TimeStampsMongo.intarface";
import { Document } from 'mongoose';

export interface IDictionary extends ITimeStampsMongo{
    title: string;
    description: string;
    version: string;
}
export interface IDictionaryModel extends IDictionary, Document {}
