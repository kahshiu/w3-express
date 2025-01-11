import { ProfileStatus } from "@src/helpers/enums"
import { z } from "zod";

export class ClientRecord {
    income_tax_no: string | null = null
    income_tax_branch: string | null = null
    profile_status: number = ProfileStatus.EMPTY
}

export class ClientModel {
    incomeTaxNo: string | null = null
    incomeTaxBranch: string | null = null
    profileStatus: ProfileStatus = ProfileStatus.EMPTY

    validate(dto: unknown) {
        const schema = z.object({
            incomeTaxNo: z.string().nullable().optional(),
            incomeTaxBranch: z.string().nullable().optional(),
            profileStatus: z.nativeEnum(ProfileStatus),
        })
        return schema.safeParse(dto).success;
    }

    fromRecord<T extends ClientRecord>(target: T) {
        this.incomeTaxNo = target.income_tax_no;
        this.incomeTaxBranch = target.income_tax_branch;
        this.profileStatus = target.profile_status;
    }

    fromDto<T extends ClientModel>(target: T) {
        this.incomeTaxNo = target.incomeTaxNo;
        this.incomeTaxBranch = target.incomeTaxBranch;
        this.profileStatus = target.profileStatus;
    }
}
