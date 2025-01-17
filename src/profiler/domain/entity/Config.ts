import { Constants } from "@src/helpers/constants"
import { EntityClass, PrimaryType, SecondaryType, EntityStatus, IcType, ProfileStatus } from "@src/helpers/enums"
import { BaseSchema, CompanySchema, ClientSchema, PersonSchema, EntityRelationSchema } from "./IDto"
import { IBaseModel, IClientModel, ICompanyModel, IPersonModel } from "./IModel"
import { strToDate, dateToStr } from "@src/helpers/util"

export const entityFragments = {
    entity: {
        columns: [
            "entityId", "entityName", "entityClass",
            "entityTypePrimary", "entityTypeSecondary", "entityStatus"
        ],
        defaults: {
            entityId: Constants.EMPTY_NUMBER,
            entityName: Constants.EMPTY_STRING,
            entityClass: EntityClass.EMPTY,
            entityTypePrimary: PrimaryType.EMPTY,
            entityTypeSecondary: SecondaryType.EMPTY,
            entityStatus: EntityStatus.EMPTY,
        } as IBaseModel,
        fromDtoAdapter: {},
        toDtoAdapter: {},
    },
    company: {
        columns: [
            "coRegNoOld", "coRegNoNew", "employerNo",
            "dateIncorp", "dateCommence", "yearEndMonth", "arDueMonth",
            "directorName", "directorPassword"
        ],
        defaults: {
            coRegNoOld: null,
            coRegNoNew: null,
            employerNo: null,
            dateIncorp: null,
            dateCommence: null,
            yearEndMonth: null,
            arDueMonth: null,
            directorName: null,
            directorPassword: null,
        } as ICompanyModel,
        fromDtoAdapter: {
            dateIncorp: strToDate,
            dateCommence: strToDate,
        },
        toDtoAdapter: {
            dateIncorp: dateToStr,
            dateCommence: dateToStr,
        },
    },
    person: {
        columns: ["icType", "icNo"],
        fromDtoAdapter: {},
        defaults: {
            icType: IcType.EMPTY,
            icNo: Constants.EMPTY_STRING,
        } as IPersonModel,
        toDtoAdapter: {},
    },
    client: {
        columns: ["incomeTaxBranch", "incomeTaxNo", "profileStatus"],
        defaults: {
            incomeTaxBranch: null,
            incomeTaxNo: null,
            profileStatus: ProfileStatus.EMPTY
        } as IClientModel,
        fromDtoAdapter: {},
        toDtoAdapter: {},
    }
}

export const entitySpecs = {
    "master_company": {
        dtoSchema: BaseSchema.merge(CompanySchema).merge(ClientSchema).merge(EntityRelationSchema),
        columns: [
            ...entityFragments.entity.columns,
            ...entityFragments.company.columns,
            ...entityFragments.client.columns,
        ],
        defaults: {
            ...entityFragments.entity.defaults,
            ...entityFragments.company.defaults,
            ...entityFragments.client.defaults,
            entityClass: EntityClass.MASTER,
            entityTypePrimary: PrimaryType.COMPANY,
        },
        fromDtoAdapter: {
            ...entityFragments.entity.fromDtoAdapter,
            ...entityFragments.company.fromDtoAdapter,
            ...entityFragments.client.fromDtoAdapter,
        },
        toDtoAdapter: {
            ...entityFragments.entity.toDtoAdapter,
            ...entityFragments.company.toDtoAdapter,
            ...entityFragments.client.toDtoAdapter,
        },
        enforceDefaults: <Model extends IBaseModel>(model: Model) => {
            model.entityClass = EntityClass.SERVICE_PROVIDER
            model.entityTypePrimary = PrimaryType.COMPANY
        },
    },
    "master_person": {
        dtoSchema: BaseSchema.merge(PersonSchema).merge(ClientSchema).merge(EntityRelationSchema),
        columns: [
            ...entityFragments.entity.columns,
            ...entityFragments.person.columns,
            ...entityFragments.client.columns,
        ],
        defaults: {
            ...entityFragments.entity.defaults,
            ...entityFragments.person.defaults,
            ...entityFragments.client.defaults,
            entityClass: EntityClass.MASTER,
            entityTypePrimary: PrimaryType.PERSONAL,
        },
        fromDtoAdapter: {
            ...entityFragments.entity.fromDtoAdapter,
            ...entityFragments.person.fromDtoAdapter,
            ...entityFragments.client.fromDtoAdapter,
        },
        toDtoAdapter: {
            ...entityFragments.entity.toDtoAdapter,
            ...entityFragments.person.toDtoAdapter,
            ...entityFragments.client.toDtoAdapter,
        },
        enforceDefaults: <Model extends IBaseModel>(model: Model) => {
            model.entityClass = EntityClass.SERVICE_PROVIDER
            model.entityTypePrimary = PrimaryType.PERSONAL
        },
    },
    "client_company": {
        dtoSchema: BaseSchema.merge(CompanySchema).merge(ClientSchema).merge(EntityRelationSchema),
        columns: [
            ...entityFragments.entity.columns,
            ...entityFragments.company.columns,
            ...entityFragments.client.columns
        ],
        defaults: {
            ...entityFragments.entity.defaults,
            ...entityFragments.company.defaults,
            ...entityFragments.client.defaults,
            entityClass: EntityClass.CLIENT,
            entityTypePrimary: PrimaryType.COMPANY,
        },
        fromDtoAdapter: {
            ...entityFragments.entity.fromDtoAdapter,
            ...entityFragments.company.fromDtoAdapter,
            ...entityFragments.client.fromDtoAdapter,
        },
        toDtoAdapter: {
            ...entityFragments.entity.toDtoAdapter,
            ...entityFragments.company.toDtoAdapter,
            ...entityFragments.client.toDtoAdapter,
        },
        enforceDefaults: <Model extends IBaseModel>(model: Model) => {
            model.entityClass = EntityClass.CLIENT
            model.entityTypePrimary = PrimaryType.COMPANY
        },
    },
    "client_person": {
        dtoSchema: BaseSchema.merge(PersonSchema).merge(ClientSchema).merge(EntityRelationSchema),
        columns: [
            ...entityFragments.entity.columns,
            ...entityFragments.person.columns,
            ...entityFragments.client.columns,
        ],
        defaults: {
            ...entityFragments.entity.defaults,
            ...entityFragments.person.defaults,
            ...entityFragments.client.defaults,
            entityClass: EntityClass.CLIENT,
            entityTypePrimary: PrimaryType.PERSONAL,
        },
        fromDtoAdapter: {
            ...entityFragments.entity.fromDtoAdapter,
            ...entityFragments.person.fromDtoAdapter,
            ...entityFragments.client.fromDtoAdapter,
        },
        toDtoAdapter: {
            ...entityFragments.entity.toDtoAdapter,
            ...entityFragments.person.toDtoAdapter,
            ...entityFragments.client.toDtoAdapter,
        },
        enforceDefaults: <Model extends IBaseModel>(model: Model) => {
            model.entityClass = EntityClass.CLIENT
            model.entityTypePrimary = PrimaryType.PERSONAL
        },
    },
    "service_provider_company": {
        dtoSchema: BaseSchema.merge(CompanySchema).merge(EntityRelationSchema),
        columns: [
            ...entityFragments.entity.columns,
            ...entityFragments.company.columns,
        ],
        defaults: {
            ...entityFragments.entity.defaults,
            ...entityFragments.company.defaults,
            entityClass: EntityClass.SERVICE_PROVIDER,
            entityTypePrimary: PrimaryType.COMPANY,
        },
        fromDtoAdapter: {
            ...entityFragments.entity.fromDtoAdapter,
            ...entityFragments.company.fromDtoAdapter,
        },
        toDtoAdapter: {
            ...entityFragments.entity.toDtoAdapter,
            ...entityFragments.company.toDtoAdapter,
        },
        enforceDefaults: <Model extends IBaseModel>(model: Model) => {
            model.entityClass = EntityClass.SERVICE_PROVIDER
            model.entityTypePrimary = PrimaryType.COMPANY
        },
    },
    "service_provider_person": {
        dtoSchema: BaseSchema.merge(PersonSchema).merge(EntityRelationSchema),
        columns: [
            ...entityFragments.entity.columns,
            ...entityFragments.person.columns,
        ],
        defaults: {
            ...entityFragments.entity.defaults,
            ...entityFragments.person.defaults,
            entityClass: EntityClass.SERVICE_PROVIDER,
            entityTypePrimary: PrimaryType.PERSONAL,
        },
        fromDtoAdapter: {
            ...entityFragments.entity.fromDtoAdapter,
            ...entityFragments.person.fromDtoAdapter,
        },
        toDtoAdapter: {
            ...entityFragments.entity.toDtoAdapter,
            ...entityFragments.person.toDtoAdapter,
        },
        enforceDefaults: <Model extends IBaseModel>(model: Model) => {
            model.entityClass = EntityClass.SERVICE_PROVIDER
            model.entityTypePrimary = PrimaryType.PERSONAL
        },
    },
}