import path from 'path';
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, '../') + "config/";
import { mongooseConnection } from './connections/mongoose.connection';
import {DictionaryService} from "./services/dictioinary.service";

const urlCoreDictionary = path.join(__dirname, '../') + 'dictionaries/DictionaryCoreGrammar.json';
const url3000Dictionary = path.join(__dirname, '../') + 'dictionaries/Dictionary3000.json';

( async () => {
    try {
        await mongooseConnection;
        const dictionaryServiceForCore = new DictionaryService(console);

        await dictionaryServiceForCore.upload(urlCoreDictionary);
        await dictionaryServiceForCore.upload(url3000Dictionary);
    } catch (err) {
        console.error(err);
    }
})();
