import { isDate, isNull, isString } from "es-toolkit";
import { each, isNumber } from "es-toolkit/compat";

export const isLikeNull = (value: unknown) => {
    const isNullDate = isDate(value) && value.getFullYear() === 1900;
    const isNullString = isString(value) && value === "";
    return isNull(value) || isNullDate || isNullString;
}

// SECTION: columns adapters
export const strToDate = (field: Date | string | number | null | undefined) => {
    if (isString(field) || isNumber(field)) return new Date(field);
    return field;
}
export const dateToStr = (field: Date | null | undefined) => {
    if (isDate(field)) field.toISOString();
    return field;
}
export const dashMYIcNo = (str: string) => {
    const p1 = str.slice(0, 6);
    const p2 = str.slice(6, 8);
    const p3 = str.slice(8, 12);
    return `${p1}-${p2}-${p3}`;
}

// SECTION: adapter
export const adaptValue = <
    T extends object,
    U extends { [K in keyof T]: any }
>(
    obj: T,
    adapters: { [K in keyof T]: (field: T[K]) => U[K] | T[K] }
) => {
    const adaptedObj = { ...obj };
    each(adaptedObj, (value, key) => {
        const adapter = adapters[key];
        if (adapter) {
            adaptedObj[key] = adapter(value);
        }
    })
    return adaptedObj;
}

