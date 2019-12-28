/*
this script converts 3000.txt file into 3000 dictionary.json
it extrudes word and setup relations (tags)
e.g.
"word"
"word","type of speech", "noun",
*/

const fs = require('fs');

const URL = __dirname + '/3000.txt';
const URL_DICTIONARY = __dirname + '/Dictionary3000.json';

const dictionary = {
    name: "3000",
    description: "The most important words to learn in English",
    version: "0.0.1",
    author: "Anton Batalin",
    words: [
        "it is a(n)",
        "entry",
        "type of text",
            "word",
        "English Study Level",
            "A1 (Beginner)",
            "A2 (Elementary English)",
            "B1 (Intermediate English)",
            "B2 (Upper Intermediate English)",
        "part of speech",
            "noun",
            "pronoun",
            "verb",
                "auxiliary verb",
                "modal verb",
            "adjective",
            "adverb",
            "preposition",
            "conjunction",
            "article (determiner)",
            "exclamation",
            "infinitive marker",
            "number",
            // the result of script:
            // "abandon"
    ],
    tuples: [],
    relations: [
        // the result of script:
        // ["abandon", "part of speech", "verb"]
        // ["abandon|verb", "it is a(n)", "entry"]
        // ["abandon|verb", "English Study Level", "B2 (Upper Intermediate English)"]
    ],
    contexts: []
};

( async () => {
   const data = await readFromTxt();
   data
       .split('\n')
       .filter(e => e !== '')
       .forEach( (base, index ) => {
            const parts = base.split(' - ');
            if (parts.length !== 2) {
                const error = new Error(`base "${base}" parsing error`);
                console.log(error);
                return; // next base
            }
            const word = parts[0].trim();
            addItem(word, dictionary);

            parts[1].trim().split(',').map( entry => {
                const parts = entry.split(' ').filter(e => e !=='');
                let partOfSpeech = '';
                let levelOfEnglish = '';

                switch (parts.length) {
                    case 1:
                        partOfSpeech = getPartOfSpeech(parts[0]);
                        break;
                    case 2:
                        partOfSpeech = getPartOfSpeech(parts[0]);
                        levelOfEnglish = getLevel(parts[1]);
                        break;
                    case 3:
                        partOfSpeech = getPartOfSpeech(`${parts[0]} ${parts[1]}`);
                        levelOfEnglish = getLevel(parts[2]);
                        break;
                    case 0:
                    default:
                        const error = new Error(`entry "${entry}" parsing error`);
                        console.log(error);
                        return ''; // next entry
                }
                if (word && partOfSpeech) {

                    // ["abandon", "part of speech", "verb"]
                    addRelation(word, 'part of speech', partOfSpeech, dictionary);

                    // ["abandon|verb", "it is a(n)", "entry"]
                    const entryName = `${word}|${partOfSpeech}`;
                    addItem(entryName, dictionary);

                    addRelation(entryName, 'it is a(n)', 'entry', dictionary);
                    if (levelOfEnglish) {

                        // ["abandon|verb", "English Study Level", "B2 (Upper Intermediate English)"]
                        addRelation(entryName, 'English Study Level', levelOfEnglish, dictionary);

                        // ["abandon|verb", "part of speech", "verb"]
                        addRelation(entryName, 'part of speech', partOfSpeech, dictionary);
                    }
                }
            });
        });
   console.log('the end');
   let dictionaryData = JSON.stringify(dictionary, null, 4);
   await saveAsJson(dictionaryData);
})();

async function readFromTxt() {
    return new Promise( (resolve, reject) => {
        fs.readFile(URL, 'utf8', function(err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
}
async function saveAsJson(data) {
    return new Promise( (resolve, reject) => {
        fs.writeFile(URL_DICTIONARY, data, function(err) {
            if (err) reject(err);
            resolve();
        });
    });
}
function getPartOfSpeech(str) {
    switch(str) {
        case 'auxiliary v.': return 'auxiliary verb';
        case 'modal v.': return 'modal verb';
        case 'infinitive marker': return 'infinitive marker';
        case 'n.': return 'noun';
        case 'v.': return 'verb';
        case 'exclam.': return 'exclamation';
        case 'adj.': return 'adjective';
        case 'adv.': return 'adverb';
        case 'conj.': return 'conjunction';
        case 'pron.': return 'pronoun';
        case 'number': return 'number';
        case 'prep.': return 'preposition';

        case 'det.':
        case 'indefinite(article)':
        case 'definite(article)': return 'article (determiner)';

        default:
            console.error(`wrong part of speech ${str}`);
            return ''
    }
}
function getLevel(str) {
    switch(str) {
        case 'A1': return 'A1 (Beginner)';
        case 'A2': return 'A2 (Elementary English)';
        case 'B1': return 'B1 (Intermediate English)';
        case 'B2': return 'B2 (Upper Intermediate English)';
        case 'C1': return 'C1 (Advanced English)';
        case 'C2': return 'C2 (Proficiency)';
        default:
            console.error(`wrong part of speech ${str}`);
            return ''
    }
}
function checkIfItemExist(str, dictionary) {
    const flag = dictionary.items.find( e => e === str) || dictionary.tuples.find( e => e === str);
    return !!flag
}

function addItem(word, dictionary) {
    if (checkIfItemExist(word, dictionary)) {
        console.error(`${word} already exist in Dictionary`);
    }
    if (word.indexOf('|') != -1) {
        // save into tuples
        dictionary.tuples.push(word);
        console.log(`add word: "${word}" into items`);
    } else {
        // save as items
        dictionary.items.push(word);
        console.log(`add word: "${word}" into items`);
    }
}

function addRelation(from, nameRelation, to, dictionary) {
    if ([from, nameRelation, to].every ( e => checkIfItemExist(e, dictionary))) {
        dictionary.relations.push([from, nameRelation, to]);
        console.log(`add relation: "${from}" "${nameRelation}" "${to}"`);
    } else {
        console.error(`bad relation ${from} ${nameRelation} ${to}`);
    }
}

