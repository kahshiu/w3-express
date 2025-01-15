import { Constants } from "@src/helpers/constants";
import { RelationStatus } from "@src/helpers/enums";

export class RelationDto {
    parentId?: number = Constants.EMPTY_NUMBER;
    childId?: number = Constants.EMPTY_NUMBER;
    relationId: number = Constants.EMPTY_NUMBER;
    relationAttributes: any = Constants.EMPTY_OBJECT;
    relationStatus: number = RelationStatus.ACTIVE;
}

export class RelationModel extends RelationDto { }

export class RelationRecord {
    parent_id?: number = Constants.EMPTY_NUMBER;
    child_id?: number = Constants.EMPTY_NUMBER;
    relation_id: number = Constants.EMPTY_NUMBER;
    relation_attributes: any = Constants.EMPTY_OBJECT;
    relation_status: number = Constants.EMPTY_NUMBER;
}

export class RelationUtils {
    static fromDto(model: RelationModel, dto: RelationDto) {
        model.parentId = dto.parentId;
        model.childId = dto.childId;
        model.relationId = dto.relationId;
        model.relationAttributes = dto.relationAttributes;
        model.relationStatus = dto.relationStatus;
    }
    static toDto(model: RelationModel, dto: RelationDto) {
        dto.parentId = model.parentId;
        model.childId = dto.childId;
        dto.relationId = model.relationId;
        dto.relationAttributes = model.relationAttributes;
        dto.relationStatus = model.relationStatus;
    }
    static fromRecord(model: RelationModel, dto: RelationRecord) {
        model.parentId = dto.parent_id;
        model.childId = dto.child_id;
        model.relationId = dto.relation_id;
        model.relationAttributes = dto.relation_attributes;
        model.relationStatus = dto.relation_status;
    }
    static toRecord(model: RelationModel, dto: RelationRecord) {
        dto.parent_id = model.parentId; 
        dto.child_id = model.childId; 
        dto.relation_id = model.relationId; 
        dto.relation_attributes = model.relationAttributes; 
        dto.relation_status = model.relationStatus; 
    }
}
