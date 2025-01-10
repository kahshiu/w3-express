import { NullableNumber, NullableString } from "@src/helpers/interfaces"

export class PersonRecord {
    ic_type: NullableNumber = null
    ic_no: NullableString = null
}

export class PersonModel {
    icType: NullableNumber = null
    icNo: NullableString = null

    fromRecord<T extends PersonRecord>(target: T) {
        this.icType = target.ic_type;
        this.icNo = target.ic_no;
    }

    fromDto<T extends PersonModel>(target: T) {
        this.icType = target.icType;
        this.icNo = target.icNo;
    }
}