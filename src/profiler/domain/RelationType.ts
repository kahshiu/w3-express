import { Constants } from "@src/helpers/constants";

export class RelationTypeRecord {
    relation_id: number = Constants.EMPTY_NUMBER
    relation_name: string = Constants.EMPTY_STRING
    relation_description: string = Constants.EMPTY_STRING
}

export class RelationTypeModel {
    relationId: number = Constants.EMPTY_NUMBER
    relationName: string = Constants.EMPTY_STRING
    relationDescription: string = Constants.EMPTY_STRING
}

export class RelationType {
    constructor(
        public relationId: number = Constants.EMPTY_NUMBER,
        public relationName: string = Constants.EMPTY_STRING,
        public relationDescription: string = Constants.EMPTY_STRING
    ) { }

    fromDto(model: RelationTypeModel) {
        this.relationId = model.relationId
        this.relationName = model.relationName
        this.relationDescription = model.relationDescription
    }
}
