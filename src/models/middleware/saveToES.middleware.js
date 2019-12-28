import { client } from '../../connections/elasticsearch.connection';

module.exports = index => {
    return (doc, next) => {

        const body = Object.assign({}, doc.toObject());
        const id = doc.id;

        delete body._id;

        client.index({ index, id , body, refresh: true }, function(err){
            if(err){
                next(err);
            } else {
                next();
            }
        });
    };
};





