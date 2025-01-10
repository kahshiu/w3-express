import { EntityClass, PrimaryType } from "@src/helpers/enums"
import { CompanyModel, CompanyRecord } from "./Company"
import { EntityModel, EntityRecord } from "./Entity"
import { PersonModel, PersonRecord } from "./Person"

// NOTE: company record and model
export class ServiceProviderCompanyRecord {
    entity: EntityRecord = new EntityRecord()
    company: CompanyRecord = new CompanyRecord()

    constructor() {
        this.entity.entity_class = EntityClass.SERVICE_PROVIDER
        this.entity.entity_type_primary = PrimaryType.COMPANY
    }

    getValues() {
        return {
            ...this.entity,
            ...this.company,
        }
    }
}

export class ServiceProviderCompanyModel {
    entity: EntityModel = new EntityModel()
    company: CompanyModel = new CompanyModel()

    constructor() {
        this.entity.entityClass = EntityClass.SERVICE_PROVIDER
        this.entity.entityTypePrimary = PrimaryType.COMPANY
    }

    fromRecord(record: EntityRecord & CompanyRecord) {
        this.entity.fromRecord(record);
        this.company.fromRecord(record);

        this.entity.entityId = record.entity_id
        this.entity.entityTypeSecondary = record.entity_type_secondary
    }

    fromDto(dto: EntityModel & CompanyModel, entityId: number) {
        this.entity.fromDto(dto);
        this.company.fromDto(dto);

        this.entity.entityId = entityId
        this.entity.entityTypeSecondary = dto.entityTypeSecondary
    }

    getValues() {
        return {
            ...this.entity,
            ...this.company,
        }
    }
}

// NOTE: person record and model
export class ServiceProviderPersonRecord {
    entity: EntityRecord = new EntityRecord()
    company: PersonRecord = new PersonRecord()

    constructor() {
        this.entity.entity_class = EntityClass.SERVICE_PROVIDER
        this.entity.entity_type_primary = PrimaryType.PERSONAL
    }

    getValues() {
        return {
            ...this.entity,
            ...this.company,
        }
    }
}

export class ServiceProviderPersonModel {
    entity: EntityModel = new EntityModel()
    person: PersonModel = new PersonModel()

    constructor() {
        this.entity.entityClass = EntityClass.SERVICE_PROVIDER
        this.entity.entityTypePrimary = PrimaryType.PERSONAL
    }

    fromRecord(record: EntityRecord & PersonRecord) {
        this.entity.fromRecord(record);
        this.person.fromRecord(record);

        this.entity.entityId = record.entity_id
    }

    fromDto(dto: EntityModel & PersonModel, entityId: number) {
        this.entity.fromDto(dto);
        this.person.fromDto(dto);

        this.entity.entityId = entityId
    }

    getValues() {
        return {
            ...this.entity,
            ...this.person,
        }
    }
}