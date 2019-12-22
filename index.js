const translatorService = require('./translator.service');
const readFile = require('./utils/readFile');

const urlCoreGrammarDictionary = './dictionaries/DictionaryCoreGrammar.json';
const url3000Dictionary = './dictionaries/Dictionary3000.json';

( async () => {
    const coreGrammarDictionary = await readFile(urlCoreGrammarDictionary);
    try {
        const dictionaryPackage = JSON.parse(coreGrammarDictionary);
        const report = await translatorService.package(dictionaryPackage);
        console.log(report);
    } catch (err) {
        console.error(err);
    }
})();


