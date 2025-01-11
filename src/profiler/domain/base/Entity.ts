import { Constants } from "@src/helpers/constants"
import { EntityClass, EntityStatus, PrimaryType, SecondaryType } from "@src/helpers/enums"
import { z } from "zod";

export class EntityRecord {
    entity_id: number = Constants.EMPTY_NUMBER
    entity_name: string = Constants.EMPTY_STRING
    entity_class: number = EntityClass.EMPTY
    entity_type_primary: number = PrimaryType.EMPTY
    entity_type_secondary: number = SecondaryType.EMPTY
    entity_status: EntityStatus = EntityStatus.EMPTY
}

export class EntityModel {
    entityId: number = Constants.EMPTY_NUMBER
    entityName: string = Constants.EMPTY_STRING
    entityClass: EntityClass = EntityClass.EMPTY
    entityTypePrimary: PrimaryType = PrimaryType.EMPTY
    entityTypeSecondary: SecondaryType = SecondaryType.EMPTY
    entityStatus: EntityStatus = EntityStatus.EMPTY

    validate(dto: unknown) {
        const schema = z.object({
            entityId: z.number().optional(),
            entityName: z.string(),
            // entityClass: z.nativeEnum(EntityClass),
            // entityTypePrimary: z.nativeEnum(PrimaryType),
            entityTypeSecondary: z.nativeEnum(SecondaryType).optional(),
            entityStatus: z.nativeEnum(EntityStatus),
        })
        return schema.safeParse(dto);
    }

    // converters 
    fromRecord<T extends EntityRecord>(target: T) {
        this.entityId = target?.entity_id ?? 0
        this.entityName = target.entity_name
        this.entityStatus = target.entity_status
    }

    fromDto<T extends EntityModel>(target: T) {
        this.entityId = target?.entityId ?? 0
        this.entityName = target.entityName
        this.entityStatus = target.entityStatus
    }
}