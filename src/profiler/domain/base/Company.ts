import { Constants } from "@src/helpers/constants"
import { NullableString, NullableDate, NullableNumber } from "@src/helpers/interfaces"
import { z } from "zod";

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
    
    validate(dto: unknown) {
        const schema = z.object({
            coRegNoOld: z.string().nullable().optional(),
            coRegNoNew: z.string().nullable().optional(),
            employerNo: z.string().nullable().optional(),
            dateIncorp: z.string().datetime().nullable().optional(),
            dateCommence: z.string().datetime().nullable().optional(),
            yearEndMonth: z.number().nullable().optional(),
            arDueMonth: z.number().nullable().optional(),
            directorName: z.string().nullable().optional(),
            directorPassword: z.string().nullable().optional(),
        })
        return schema.safeParse(dto);
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