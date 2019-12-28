import { Client } from '@elastic/elasticsearch';
import { IConfig } from "../utils/Config.interface";
import currentConfig from 'config';

const config: IConfig = currentConfig as any;
export const client = new Client(config.elasticSearch.options);

client.cluster.health({},function(err, resp) {
    if(err){
        console.error('ES cluster health was retrieved with error', err);
    } else {
        console.info('ES cluster health ', resp);
    }
});
