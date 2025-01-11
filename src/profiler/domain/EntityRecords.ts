import { EntityType, EntityClass, PrimaryType } from "@src/helpers/enums";
import { ClientRecord } from "./base/Client";
import { CompanyRecord } from "./base/Company";
import { EntityRecord } from "./base/Entity";
import { PersonRecord } from "./base/Person";

export class AbstractEntityRecord {
    constructor(
        entityType: EntityType,
        private entity: EntityRecord | null,
        private company: CompanyRecord | null,
        private person: PersonRecord | null,
        private client: ClientRecord | null,
    ) { }

    getValues() {
        const entity = this.entity ?? {};
        const company = this.company ?? {};
        const person = this.person ?? {};
        const client = this.client ?? {};
        return Object.assign(entity, company, person, client);
    }
}

// SECTION: concrete classes
export class MasterCompanyRecord extends AbstractEntityRecord {
    constructor() {
        const entity = new EntityRecord();
        const company = new CompanyRecord();
        const person = null;
        const client = new ClientRecord();

        entity.entity_class = EntityClass.MASTER;
        entity.entity_type_primary = PrimaryType.COMPANY;

        super(EntityType.MASTER_COMPANY, entity, company, person, client)
    }
}

export class MasterPersonRecord extends AbstractEntityRecord {
    constructor() {
        const entity = new EntityRecord();
        const company = null;
        const person = new PersonRecord();
        const client = new ClientRecord();

        entity.entity_class = EntityClass.MASTER;
        entity.entity_type_primary = PrimaryType.PERSONAL;

        super(EntityType.MASTER_PERSON, entity, company, person, client)
    }
}

export class ClientCompanyRecord extends AbstractEntityRecord {
    constructor() {
        const entity = new EntityRecord();
        const company = new CompanyRecord();
        const person = null;
        const client = new ClientRecord();

        entity.entity_class = EntityClass.CLIENT;
        entity.entity_type_primary = PrimaryType.COMPANY;

        super(EntityType.CLIENT_COMPANY, entity, company, person, client)
    }
}

export class ClientPersonRecord extends AbstractEntityRecord {
    constructor() {
        const entity = new EntityRecord();
        const company = null;
        const person = new PersonRecord();
        const client = new ClientRecord();

        entity.entity_class = EntityClass.CLIENT;
        entity.entity_type_primary = PrimaryType.PERSONAL;

        super(EntityType.CLIENT_PERSON, entity, company, person, client)
    }
}

export class ServiceProviderCompanyRecord extends AbstractEntityRecord {
    constructor() {
        const entity = new EntityRecord();
        const company = new CompanyRecord();
        const person = null;
        const client = null;

        entity.entity_class = EntityClass.SERVICE_PROVIDER;
        entity.entity_type_primary = PrimaryType.COMPANY;

        super(EntityType.SERVICE_PROVIDER_COMPANY, entity, company, person, client)
    }
}

export class ServiceProviderPersonRecord extends AbstractEntityRecord {
    constructor() {
        const entity = new EntityRecord();
        const company = null;
        const person = new PersonRecord();
        const client = null;

        entity.entity_class = EntityClass.SERVICE_PROVIDER;
        entity.entity_type_primary = PrimaryType.PERSONAL;

        super(EntityType.SERVICE_PROVIDER_PERSON, entity, company, person, client)
    }
}

export class EntityRecordManager {
    instance: AbstractEntityRecord;

    constructor(entityType: EntityType) {
        this.instance = this.getInstance(entityType);
    }
    private getInstance(entityType: EntityType) {
        if (entityType === EntityType.MASTER_COMPANY) return new MasterCompanyRecord();
        if (entityType === EntityType.MASTER_PERSON) return new MasterPersonRecord();
        if (entityType === EntityType.CLIENT_COMPANY) return new ClientCompanyRecord();
        if (entityType === EntityType.CLIENT_PERSON) return new ClientPersonRecord();
        if (entityType === EntityType.SERVICE_PROVIDER_COMPANY) return new ServiceProviderCompanyRecord();
        if (entityType === EntityType.SERVICE_PROVIDER_PERSON) return new ServiceProviderPersonRecord();
        return new ClientCompanyRecord()
    }
}