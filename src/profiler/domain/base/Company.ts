import { Constants } from "@src/helpers/constants"
import { NullableString, NullableDate, NullableNumber } from "@src/helpers/interfaces"
import { logger } from "@src/logger"
import { z } from "zod";

export class CompanyRecord {
    public co_reg_no_old: NullableString = null
    public co_reg_no_new: NullableString = null
    public employer_no: NullableString = null
    public date_incorp: NullableDate = null
    public date_commence: NullableDate = null
    public year_end_month: NullableNumber = null
    public ar_due_month: NullableNumber = null
    public director_name: NullableString = null
    public director_password: NullableString = null
}

export class CompanyDto {
    public coRegNoOld: NullableString = null
    public coRegNoNew: NullableString = null
    public employerNo: NullableString = null
    public dateIncorp: NullableDate = null
    public dateCommence: NullableDate = null
    public yearEndMonth: NullableNumber = null
    public arDueMonth: NullableNumber = null
    public directorName: NullableString = null
    public directorPassword: NullableString = null
}

export class CompanyModel {
    public coRegNoOld: NullableString = null
    public coRegNoNew: NullableString = null
    public employerNo: NullableString = null
    public dateIncorp: NullableDate = null
    public dateCommence: NullableDate = null
    public yearEndMonth: NullableNumber = null
    public arDueMonth: NullableNumber = null
    public directorName: NullableString = null
    public directorPassword: NullableString = null

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
        const validationResult = schema.safeParse(dto);
        if (!validationResult.success) {
            logger.info(validationResult.error, "company validation failed")
        }
        return validationResult
    }

    fromDto<T extends CompanyDto>(dto: T) {
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

    toDto() {
        const dto = new CompanyDto()
        dto.coRegNoOld = this.coRegNoOld
        dto.coRegNoNew = this.coRegNoNew
        dto.employerNo = this.employerNo
        dto.dateIncorp = this.dateIncorp ? (dto.dateIncorp as Date).toISOString() : null
        dto.dateCommence = this.dateCommence ? (dto.dateCommence as Date).toISOString() : null
        dto.yearEndMonth = this.yearEndMonth
        dto.arDueMonth = this.arDueMonth
        dto.directorName = this.directorName
        dto.directorPassword = this.directorPassword
        return dto;
    }

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

    toRecord() { }
}