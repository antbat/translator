import { Report } from "../models/report/Report";
import fs from 'fs';
import { TranslatorService } from "./translator.service";
import {ReportStream} from "../models/stream/reportStream.interface";

export class DictionaryService {
    reportStream: ReportStream;

    constructor(stream: ReportStream) {
        this.reportStream = stream;
    }
    async upload(URL: string): Promise<Report|null> {
        const rawData = await this.readFile(URL);
        const data = JSON.parse(rawData);
        try {
            const translator = new TranslatorService(this.reportStream);
            const report = await translator.fromJson(data);
            this.reportStream.info(report.toString());
            return report;
        } catch (err) {
            this.reportStream.error(err);
            return null;
        }

    }

    private readFile (URL: string): Promise<string> {
        return new Promise<string>( (resolve, reject) => {
            fs.readFile(URL, (err, data) => {
                if (err) return reject(err);
                resolve(data.toString());
            })
        } )
    }

}
