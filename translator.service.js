/*
* translator
* it's a service which has several method
* */

module.exports = {
    commandLine: require('./methods/commandLine.translator.method'),
    package: require('./methods/jsonPackage.translator.method')
};
