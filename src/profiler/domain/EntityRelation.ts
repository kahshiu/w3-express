import { Constants } from "@src/helpers/constants";
import { RelationStatus } from "@src/helpers/enums";

export class EntityRelationRecord {
    parent_id: number = Constants.EMPTY_NUMBER;
    child_id: number = Constants.EMPTY_NUMBER;
    relation_id: number = Constants.EMPTY_NUMBER;
    relation_attributes: any = Constants.EMPTY_OBJECT;
    relation_status: number = Constants.EMPTY_NUMBER;
}

export class EntityRelationModel {
    parentId: number = Constants.EMPTY_NUMBER;
    childId: number = Constants.EMPTY_NUMBER;
    relationId: number = Constants.EMPTY_NUMBER;
    relationAttributes: any = Constants.EMPTY_OBJECT;
    relationStatus: number = RelationStatus.ACTIVE;

    fromDto(model: Omit<EntityRelationModel, "parentId">, parentId: number) {
        this.parentId = parentId;
        this.childId = model.childId;
        this.relationId = model.relationId;
        this.relationAttributes = model.relationAttributes;
        this.relationStatus = model.relationStatus;
    }

    fromRecord(record: EntityRelationRecord) {
        this.parentId = record.parent_id;
        this.childId = record.child_id;
        this.relationId = record.relation_id;
        this.relationAttributes = record.relation_attributes;
        this.relationStatus = record.relation_status;
    }
}