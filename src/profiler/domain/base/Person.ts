import { IcType } from "@src/helpers/enums";
import { NullableNumber, NullableString } from "@src/helpers/interfaces"
import { logger } from "@src/logger"
import { z } from "zod";

export class PersonRecord {
    public ic_type: NullableNumber = null
    public ic_no: NullableString = null
}

export class PersonDto {
    public icType: NullableNumber = null
    public icNo: NullableString = null
}

export class PersonModel {
    public icType: NullableNumber = null
    public icNo: NullableString = null

    validate<T extends PersonDto>(dto: T) {
        const schema = z.object({
            icType: z.nativeEnum(IcType),
            icNo: z.string().nullable().optional(),
        })
        const validationResult = schema.safeParse(dto);
        if (!validationResult.success) {
            logger.info(validationResult.error, "person validation failed")
        }
        return validationResult;
    }

    fromDto<T extends PersonDto>(target: T) {
        this.icType = target.icType;
        this.icNo = target.icNo;
    }

    toDto() {
        const dto = new PersonDto();
        this.icType = dto.icType;
        this.icNo = dto.icNo;
        return dto;
    }

    fromRecord<T extends PersonRecord>(record: T) {
        this.icType = record.ic_type
        this.icNo = record.ic_no
    }

    toRecord() { }
}