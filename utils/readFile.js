const fs = require('fs');

module.exports = async URL => {
    return new Promise( (resolve, reject) => {
        fs.readFile(URL, 'utf8', function(err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
};
