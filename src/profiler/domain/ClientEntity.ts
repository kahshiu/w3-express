import { EntityClass, PrimaryType } from "@src/helpers/enums"
import { ClientModel, ClientRecord } from "./Client"
import { CompanyModel, CompanyRecord } from "./Company"
import { EntityModel, EntityRecord } from "./Entity"
import { PersonModel, PersonRecord } from "./Person"

// NOTE: company record and model
export class ClientCompanyRecord {
    entity: EntityRecord = new EntityRecord()
    company: CompanyRecord = new CompanyRecord()
    client: ClientRecord = new ClientRecord()

    constructor() {
        this.entity.entity_class = EntityClass.CLIENT
        this.entity.entity_type_primary = PrimaryType.COMPANY
    }

    getValues() {
        return {
            ...this.entity,
            ...this.client,
            ...this.company,
        }
    }
}

export class ClientCompanyModel {
    entity: EntityModel = new EntityModel()
    company: CompanyModel = new CompanyModel()
    client: ClientModel = new ClientModel()

    constructor() {
        this.entity.entityClass = EntityClass.CLIENT
        this.entity.entityTypePrimary = PrimaryType.COMPANY
    }

    fromRecord(record: EntityRecord & CompanyRecord & ClientRecord) {
        this.entity.fromRecord(record);
        this.company.fromRecord(record);
        this.client.fromRecord(record);

        this.entity.entityId = record.entity_id
        this.entity.entityTypeSecondary = record.entity_type_secondary
    }

    fromDto(dto: EntityModel & CompanyModel & ClientModel, entityId: number) {
        this.entity.fromDto(dto);
        this.company.fromDto(dto);
        this.client.fromDto(dto);

        this.entity.entityId = entityId
        this.entity.entityTypeSecondary = dto.entityTypeSecondary
    }

    getValues() {
        return {
            ...this.entity,
            ...this.company,
            ...this.client,
        }
    }
}

// NOTE: person record and model
export class ClientPersonRecord {
    entity: EntityRecord = new EntityRecord()
    person: PersonRecord = new PersonRecord()
    client: ClientRecord = new ClientRecord()

    constructor() {
        this.entity.entity_class = EntityClass.CLIENT
        this.entity.entity_type_primary = PrimaryType.PERSONAL
    }

    getValues() {
        return {
            ...this.entity,
            ...this.client,
            ...this.person,
        }
    }
}

export class ClientPersonModel {
    entity: EntityModel = new EntityModel()
    person: PersonModel = new PersonModel()
    client: ClientModel = new ClientModel()

    constructor() {
        this.entity.entityClass = EntityClass.CLIENT
        this.entity.entityTypePrimary = PrimaryType.PERSONAL
    }

    fromRecord(record: EntityRecord & PersonRecord & ClientRecord) {
        this.entity.fromRecord(record);
        this.person.fromRecord(record);
        this.client.fromRecord(record);

        this.entity.entityId = record.entity_id
    }

    fromDto(dto: EntityModel & PersonModel & ClientModel, entityId: number) {
        this.entity.fromDto(dto);
        this.person.fromDto(dto);
        this.client.fromDto(dto);

        this.entity.entityId = entityId
    }

    getValues() {
        return {
            ...this.entity,
            ...this.person,
            ...this.client,
        }
    }
}