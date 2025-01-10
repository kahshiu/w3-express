import { isLikeNull } from "@src/helpers/util";
import { camelCase, isDate, isNull, isString, isUndefined, omitBy, snakeCase } from "es-toolkit";

// SECTION: column pipeline handlers
export const renameColumn = (str: any): string => snakeCase(str);
export const renameKey = (str: any): string => camelCase(str);

/* 
function: transformColumnValue 
description: 
    null             - remain as NULL
    date: 1900-01-01 - transform to NULL
    string: ""       - transform to NULL
    value            - remain as VALUE 
*/
export const transformColumnValue = (value: any) => {
    if (isLikeNull(value)) return null;
    if (isDate(value)) return value.toISOString();
    return value;
}

export const adaptColumnValue = (value: any) => {
    if (isNull(value)) return "null";
    if (isDate(value) || isString(value)) return "'" + value + "'";
    return value;
}

export const fromModelToRecord = (key: string, value: any) => {
    const processedKey = renameColumn(key);
    const processedValue = adaptColumnValue(transformColumnValue(value))
    return {
        k: processedKey,
        v: processedValue,
    }
}

export const fromRecordToModel = (key: string, value: any) => {
    const processedKey = renameKey(key);
    return {
        k: processedKey,
        v: value,
    }
}

// SECTION: sql template handlers 
export const useInsertTemplate = (data: any) => {
    const keys: string[] = [];
    const values: string[] = [];

    const filteredData = omitBy(data, (key: string) => { return isUndefined(key) })
    for (const key in filteredData) {
        const { k, v } = fromModelToRecord(key, filteredData[key])
        keys.push(k)
        values.push(v)
    }
    return { keys, values }
}

export const useUpdateTemplate = (data: any) => {
    const { keys, values } = useInsertTemplate(data);
    return keys.map((key, i) => {
        const value = values[i];
        return `${key} = ${value}`
    })
}

export const useSelectTemplate = (data: any) => {
    const model: any = {};
    for (const key in data) {
        const value = data[key];
        const { k, v } = fromRecordToModel(key, value)
        model[k] = v;
    }
    return model;
}