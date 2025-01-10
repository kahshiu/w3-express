import { isDate, isNull, isString } from "es-toolkit";

export const isLikeNull = (value: unknown) => {
    const isNullDate = isDate(value) && value.getFullYear() === 1900;
    const isNullString = isString(value) && value === "";
    return isNull(value) || isNullDate || isNullString;
}
