import { Constants } from "@src/helpers/constants"
import { NullableString, NullableDate, NullableNumber } from "@src/helpers/interfaces"

export class CompanyRecord {
    co_reg_no_old: NullableString = null
    co_reg_no_new: NullableString = null
    employer_no: NullableString = null
    date_incorp: NullableDate = null
    date_commence: NullableDate = null
    year_end_month: NullableNumber = null
    ar_due_month: NullableNumber = null
    director_name: NullableString = null
    director_password: NullableString = null
}

export class CompanyModel {
    coRegNoOld: NullableString = null
    coRegNoNew: NullableString = null
    employerNo: NullableString = null
    dateIncorp: NullableDate = null
    dateCommence: NullableDate = null
    yearEndMonth: NullableNumber = null
    arDueMonth: NullableNumber = null
    directorName: NullableString = null
    directorPassword: NullableString = null

    // converters 
    fromRecord<T extends CompanyRecord>(record: T) {
        this.coRegNoOld = record.co_reg_no_old
        this.coRegNoNew = record.co_reg_no_new
        this.employerNo = record.employer_no
        this.dateIncorp = record.date_incorp
        this.dateCommence = record.date_commence
        this.yearEndMonth = record.year_end_month
        this.arDueMonth = record.ar_due_month
        this.directorName = record.director_name
        this.directorPassword = record.director_password
    }

    fromDto<T extends CompanyModel>(dto: T) {
        this.coRegNoOld = dto.coRegNoOld
        this.coRegNoNew = dto.coRegNoNew
        this.employerNo = dto.employerNo
        this.dateIncorp = dto.dateIncorp ? new Date(dto.dateIncorp) : Constants.EMPTY_DATE
        this.dateCommence = dto.dateCommence ? new Date(dto.dateCommence) : Constants.EMPTY_DATE
        this.yearEndMonth = dto.yearEndMonth
        this.arDueMonth = dto.arDueMonth
        this.directorName = dto.directorName
        this.directorPassword = dto.directorPassword
    }
}