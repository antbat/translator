export interface IConfig {
    mongoDB: {
        connectionString: string,
        collection: {
            word: string,
            relation: string,
            dictionary: string
        }
    },
    elasticSearch: {
        index: {
            word: string,
            relation: string
        },
        options: {
            node: string,
            log: string,
            keepAlive: boolean
        }
    }
}
