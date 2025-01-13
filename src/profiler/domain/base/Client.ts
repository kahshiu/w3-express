import { ProfileStatus } from "@src/helpers/enums"
import { NullableString } from "@src/helpers/interfaces";
import { logger } from "@src/logger"
import { z } from "zod";

export class ClientRecord {
    income_tax_no: NullableString = null
    income_tax_branch: NullableString = null
    profile_status: number = ProfileStatus.EMPTY
}

export class ClientDto {
    incomeTaxNo: NullableString = null
    incomeTaxBranch: NullableString = null
    profileStatus: ProfileStatus = ProfileStatus.EMPTY
}

export class ClientModel {
    incomeTaxNo: NullableString = null
    incomeTaxBranch: NullableString = null
    profileStatus: ProfileStatus = ProfileStatus.EMPTY

    validate<T extends ClientDto>(dto: T) {
        const schema = z.object({
            incomeTaxNo: z.string().nullable().optional(),
            incomeTaxBranch: z.string().nullable().optional(),
            profileStatus: z.nativeEnum(ProfileStatus),
        })

        const validationResult = schema.safeParse(dto);
        if (!validationResult.success) {
            logger.info(validationResult.error, "client validation failed")
        }
        return validationResult
    }

    fromDto<T extends ClientDto>(target: T) {
        this.incomeTaxNo = target.incomeTaxNo;
        this.incomeTaxBranch = target.incomeTaxBranch;
        this.profileStatus = target.profileStatus;
    }

    toDto() {
        const dto = new ClientDto()
        dto.incomeTaxNo = this.incomeTaxNo;
        dto.incomeTaxBranch = this.incomeTaxBranch;
        dto.profileStatus = this.profileStatus;
        return dto;
    }

    fromRecord<T extends ClientRecord>(record: T) {
        this.incomeTaxNo = record.income_tax_no
        this.incomeTaxBranch = record.income_tax_branch
        this.profileStatus = record.profile_status
    }

    toRecord() { }
}
