import { EntityClass, EntityType, PrimaryType } from "@src/helpers/enums"
import { CompanyModel, CompanyRecord } from "./base/Company"
import { EntityModel, EntityRecord } from "./base/Entity"
import { PersonModel, PersonRecord } from "./base/Person"
import { ClientModel, ClientRecord } from "./base/Client"
import { HttpBadRequest } from "@src/errors/HttpError"

export type TEntityDto = EntityModel & CompanyModel & PersonModel & ClientModel
export type TEntityModel = EntityModel & CompanyModel & PersonModel & ClientModel
export type TEntityRecord = EntityRecord & CompanyRecord & PersonRecord & ClientRecord

export class AbstractEntityModel {
    constructor(
        public entityType: EntityType,
        public entity: EntityModel,
        public company: CompanyModel | null,
        public person: PersonModel | null,
        public client: ClientModel | null,
    ) { }

    validate(dto: TEntityDto) {
        const isValidEntity = this.entity ? this.entity.validate(dto).success : true;
        const isValidCompany = this.company ? this.company.validate(dto).success : true;
        const isValidPerson = this.person ? this.person.validate(dto).success : true;
        const isValidClient = this.client ? this.client.validate(dto).success : true;

        const isValid = isValidEntity && isValidCompany && isValidPerson && isValidClient
        if (!isValid) {
            throw new HttpBadRequest("entity validation error")
        }
    }

    fromDto(dto: TEntityModel, entityId: number) {
        if (this.entity) {
            this.entity.fromDto(dto);
            this.entity.entityId = entityId;
        }
        if (this.company) this.company.fromDto(dto);
        if (this.person) this.person.fromDto(dto);
        if (this.client) this.client.fromDto(dto);
    }

    toDto() {
        const entity = this.entity?.toDto() ?? {};
        const company = this.company?.toDto() ?? {};
        const person = this.person?.toDto() ?? {};
        const client = this.client?.toDto() ?? {};
        return { ...entity, ...company, ...person, ...client }
    }

    fromRecord(record: TEntityRecord) {
        if(this.entity) this.entity.fromRecord(record);
        if(this.company) this.company.fromRecord(record);
        if(this.person) this.person.fromRecord(record);
        if(this.client) this.client.fromRecord(record);
    }

    getValues() {
        const entity = this.entity;
        const company = this.company ?? {};
        const person = this.person ?? {};
        const client = this.client ?? {};
        return Object.assign(entity, company, person, client);
    }
}

// SECTION: concrete classes
export class MasterCompanyModel extends AbstractEntityModel {
    constructor() {
        const entity = new EntityModel();
        const company = new CompanyModel();
        const person = null;
        const client = new ClientModel();

        entity.entityClass = EntityClass.MASTER;
        entity.entityTypePrimary = PrimaryType.COMPANY;

        super(EntityType.MASTER_COMPANY, entity, company, person, client)
    }
}

export class MasterPersonModel extends AbstractEntityModel {
    constructor() {
        const entity = new EntityModel();
        const company = null;
        const person = new PersonModel();
        const client = new ClientModel();

        entity.entityClass = EntityClass.MASTER;
        entity.entityTypePrimary = PrimaryType.PERSONAL;

        super(EntityType.MASTER_PERSON, entity, company, person, client)
    }
}

export class ClientCompanyModel extends AbstractEntityModel {
    constructor() {
        const entity = new EntityModel();
        const company = new CompanyModel();
        const person = null;
        const client = new ClientModel();

        entity.entityClass = EntityClass.CLIENT;
        entity.entityTypePrimary = PrimaryType.COMPANY;

        super(EntityType.CLIENT_COMPANY, entity, company, person, client)
    }
}

export class ClientPersonModel extends AbstractEntityModel {
    constructor() {
        const entity = new EntityModel();
        const company = null;
        const person = new PersonModel();
        const client = new ClientModel();

        entity.entityClass = EntityClass.CLIENT;
        entity.entityTypePrimary = PrimaryType.PERSONAL;

        super(EntityType.CLIENT_PERSON, entity, company, person, client)
    }
}

export class ServiceProviderCompanyModel extends AbstractEntityModel {
    constructor() {
        const entity = new EntityModel();
        const company = new CompanyModel();
        const person = null;
        const client = null;

        entity.entityClass = EntityClass.SERVICE_PROVIDER;
        entity.entityTypePrimary = PrimaryType.COMPANY;

        super(EntityType.SERVICE_PROVIDER_COMPANY, entity, company, person, client)
    }
}

export class ServiceProviderPersonModel extends AbstractEntityModel {
    constructor() {
        const entity = new EntityModel();
        const company = null;
        const person = new PersonModel();
        const client = null;

        entity.entityClass = EntityClass.SERVICE_PROVIDER;
        entity.entityTypePrimary = PrimaryType.PERSONAL;

        super(EntityType.SERVICE_PROVIDER_PERSON, entity, company, person, client)
    }
}

export class EntityModelManager {
    instance: AbstractEntityModel;

    constructor(entityType: EntityType) {
        this.instance = this.getInstance(entityType);
    }
    private getInstance(entityType: EntityType) {
        if (entityType === EntityType.MASTER_COMPANY) return new MasterCompanyModel();
        if (entityType === EntityType.MASTER_PERSON) return new MasterPersonModel();
        if (entityType === EntityType.CLIENT_COMPANY) return new ClientCompanyModel();
        if (entityType === EntityType.CLIENT_PERSON) return new ClientPersonModel();
        if (entityType === EntityType.SERVICE_PROVIDER_COMPANY) return new ServiceProviderCompanyModel();
        if (entityType === EntityType.SERVICE_PROVIDER_PERSON) return new ServiceProviderPersonModel();
        return new ClientCompanyModel()
    }
}