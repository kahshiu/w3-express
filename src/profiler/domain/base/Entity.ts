import { Constants } from "@src/helpers/constants"
import { EntityClass, PrimaryType, SecondaryType } from "@src/helpers/enums"
import { z } from "zod";

export class EntityRecord {
    entity_id: number = Constants.EMPTY_NUMBER
    entity_name: string = Constants.EMPTY_STRING
    entity_class: number = EntityClass.EMPTY
    entity_type_primary: number = PrimaryType.EMPTY
    entity_type_secondary: number = SecondaryType.EMPTY
}

export class EntityModel {
    entityId: number = Constants.EMPTY_NUMBER
    entityName: string = Constants.EMPTY_STRING
    entityClass: EntityClass = EntityClass.EMPTY
    entityTypePrimary: PrimaryType = PrimaryType.EMPTY
    entityTypeSecondary: SecondaryType = SecondaryType.EMPTY

    validate(dto: unknown) {
        const schema = z.object({
            entityId: z.number().optional(),
            entityName: z.string(),
            entityClass: z.nativeEnum(EntityClass),
            entityTypePrimary: z.nativeEnum(PrimaryType),
            entityTypeSecondary: z.nativeEnum(SecondaryType),
        })
        return schema.safeParse(dto).success;
    }

    // converters 
    fromRecord<T extends EntityRecord>(target: T) {
        this.entityId = target?.entity_id ?? 0
        this.entityName = target.entity_name
    }

    fromDto<T extends EntityModel>(target: T) {
        this.entityId = target?.entityId ?? 0
        this.entityName = target.entityName
    }
}