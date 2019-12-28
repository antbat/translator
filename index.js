const translatorService = require('./translator.service');
const readFile = require('./utils/readFile');

const urlCoreGrammarDictionary = './dictionaries/DictionaryCoreGrammar.json';
const url3000Dictionary = './dictionaries/Dictionary3000.json';

( async () => {
    try {
        let report = `started ${new Date}/n`;

        report += await addFileByTranslatingWithReport(urlCoreGrammarDictionary);
        report += await addFileByTranslatingWithReport(url3000Dictionary);

        console.log(report);

    } catch (err) {
        console.error(err);
    }
})();

async function addFileByTranslatingWithReport(url) {
    const coreGrammarDictionary = await readFile(url);
    const dictionaryPackage = JSON.parse(coreGrammarDictionary);
    return await translatorService.package(dictionaryPackage);
}


