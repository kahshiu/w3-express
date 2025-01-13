import { Constants } from "@src/helpers/constants"
import { EntityClass, EntityStatus, PrimaryType, SecondaryType } from "@src/helpers/enums"
import { logger } from "@src/logger"
import { z } from "zod";

export class EntityRecord {
    public entity_id: number = Constants.EMPTY_NUMBER
    public entity_name: string = Constants.EMPTY_STRING
    public entity_class: number = Constants.EMPTY_NUMBER
    public entity_type_primary: number = Constants.EMPTY_NUMBER
    public entity_type_secondary: number = Constants.EMPTY_NUMBER
    public entity_status: EntityStatus = EntityStatus.EMPTY
}

export class EntityDto {
    public entityId: number = Constants.EMPTY_NUMBER
    public entityName: string = Constants.EMPTY_STRING
    public entityClass: EntityClass = EntityClass.EMPTY
    public entityTypePrimary: PrimaryType = PrimaryType.EMPTY
    public entityTypeSecondary: SecondaryType = SecondaryType.EMPTY
    public entityStatus: EntityStatus = EntityStatus.EMPTY
}

export class EntityModel {
    public entityId: number = Constants.EMPTY_NUMBER
    public entityName: string = Constants.EMPTY_STRING
    public entityClass: EntityClass = EntityClass.EMPTY
    public entityTypePrimary: PrimaryType = PrimaryType.EMPTY
    public entityTypeSecondary: SecondaryType = SecondaryType.EMPTY
    public entityStatus: EntityStatus = EntityStatus.EMPTY

    validate<T extends EntityDto>(dto: T) {
        const schema = z.object({
            entityId: z.number().optional(),
            entityName: z.string(),
            // entityClass, applied internally 
            // entityTypePrimary, applied internally
            entityTypeSecondary: z.nativeEnum(SecondaryType).optional(),
            entityStatus: z.nativeEnum(EntityStatus),
        })
        const validationResult = schema.safeParse(dto);
        if (!validationResult.success) {
            logger.info(validationResult.error, "entity validation failed")
        }
        return validationResult
    }

    fromDto<T extends EntityDto>(target: T) {
        this.entityId = target?.entityId ?? 0
        this.entityName = target.entityName
        this.entityTypeSecondary = target.entityTypeSecondary
        this.entityStatus = target.entityStatus
    }

    toDto() {
        const dto = new EntityDto()
        dto.entityId = this.entityId;
        dto.entityName = this.entityName;
        dto.entityClass = this.entityClass;
        dto.entityTypePrimary = this.entityTypePrimary;
        dto.entityTypeSecondary = this.entityTypeSecondary;
        dto.entityStatus = this.entityStatus;
        return dto;
    }

    fromRecord<T extends EntityRecord>(record: T) {
        this.entityId = record.entity_id
        this.entityName = record.entity_name
        this.entityClass = record.entity_class
        this.entityTypePrimary = record.entity_type_primary
        this.entityTypeSecondary = record.entity_type_secondary
        this.entityStatus = record.entity_status
    }

    toRecord() { }
}