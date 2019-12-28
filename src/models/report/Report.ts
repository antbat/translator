import { WordModel } from '../word/Word.model';
import { RelationModel} from '../relation/Relation.model';

export class Condition {
    items = 0;
    tuples = 0;
    relations = 0;
    toString(): string {
        let str = '';
        str += `items: ${this.items}\n`;
        str += `tuples: ${this.tuples}\n`;
        str += `relations: ${this.relations}\n`;
        return str;
    }
}
export class Changes {
    created = 0;
    updated = 0;
    deleted = 0;
    toString(): string {
        let str = '';
        str += `created: ${this.created}\n`;
        str += `updated: ${this.updated}\n`;
        str += `deleted: ${this.deleted}\n`;
        return str;
    }
}
export class Report {
    get startStamp(): Condition {
        return this._startStamp;
    }

    get finishStamp(): Condition {
        return this._finishStamp;
    }
    private _startStamp = new Condition();
    private _finishStamp = new Condition();

    items = new Changes();
    tuples = new Changes();
    relations = new Changes();

    async start(){
        this._startStamp.items = await WordModel.count({'tuple.1': {$exists: false}});
        this._startStamp.tuples = await WordModel.count({'tuple.1': {$exists: true}});
        this._startStamp.relations = await RelationModel.count({});
    };
    async finish(){
        this._finishStamp.items = await WordModel.count({'tuple.1': {$exists: false}});
        this._finishStamp.tuples = await WordModel.count({'tuple.1': {$exists: true}});
        this._finishStamp.relations = await RelationModel.count({});
    };
    toString(): string {
        let str = '';
        str += 'report \n';
        str += 'start: \n' + this._startStamp.toString() + '\n';
        str += 'finish:\n' + this._finishStamp.toString() + '\n';
        str += 'items:\n' + this.items.toString() +'\n';
        str += 'tuples:\n' + this.tuples.toString() + '\n';
        str += 'relations:\n' + this.relations.toString() +'\n';
        return str;
    }
}
