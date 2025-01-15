import { EntityClass, PrimaryType, SecondaryType, EntityStatus, IcType, ProfileStatus } from "@src/helpers/enums"
import { NullableString, NullableDate, NullableNumber } from "@src/helpers/interfaces"

// SECTION: model interfaces
export interface IBaseModel {
    entityId: number,
    entityName: string,
    entityClass: EntityClass,
    entityTypePrimary: PrimaryType,
    entityTypeSecondary: SecondaryType,
    entityStatus: EntityStatus,
}

export interface ICompanyModel {
    coRegNoOld: NullableString,
    coRegNoNew: NullableString,
    employerNo: NullableString,
    dateIncorp: NullableDate,
    dateCommence: NullableDate,
    yearEndMonth: NullableNumber,
    arDueMonth: NullableNumber,
    directorName: NullableString,
    directorPassword: NullableString,
}

export interface IPersonModel {
    icType: IcType,
    icNo: NullableString,
}

export interface IClientModel {
    incomeTaxNo: NullableString
    incomeTaxBranch: NullableString
    profileStatus: ProfileStatus
}

export type IEntityModel = IBaseModel & Partial<ICompanyModel> & Partial<IPersonModel> & Partial<IClientModel>