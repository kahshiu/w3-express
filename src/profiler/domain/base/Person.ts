import { IcType } from "@src/helpers/enums";
import { NullableNumber, NullableString } from "@src/helpers/interfaces"
import { z } from "zod";

export class PersonRecord {
    ic_type: NullableNumber = null
    ic_no: NullableString = null
}

export class PersonModel {
    icType: NullableNumber = null
    icNo: NullableString = null

    validate(dto: unknown) {
        const schema = z.object({
            icType: z.nativeEnum(IcType),
            icNo: z.string().nullable().optional(),
        })
        return schema.safeParse(dto);
    }

    fromDto<T extends PersonModel>(target: T) {
        this.icType = target.icType;
        this.icNo = target.icNo;
    }
}