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
        return schema.safeParse(dto);
    }

    fromDto<T extends ClientModel>(target: T) {
        this.incomeTaxNo = target.incomeTaxNo;
        this.incomeTaxBranch = target.incomeTaxBranch;
        this.profileStatus = target.profileStatus;
    }
}
