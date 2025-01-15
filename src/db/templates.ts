import { isLikeNull } from "@src/helpers/util";
import { camelCase, isDate, isUndefined, omitBy, snakeCase } from "es-toolkit";

/* SECTION: column pipeline handlers
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

export const toColumnName = (str: any): string => snakeCase(str);
export const fromColumnName = (str: any): string => camelCase(str);

export const toRecord = (key: string, value: any) => {
    const processedKey = toColumnName(key);
    const processedValue = transformColumnValue(value);
    return {
        k: processedKey,
        v: processedValue,
    }
}

export const fromRecord = (key: string, value: any) => {
    const processedKey = fromColumnName(key);
    return {
        k: processedKey,
        v: value,
    }
}

// SECTION: sql template handlers 
export const upsertTemplate = (data: any, options: { indexStart: number } = { indexStart: 1 }) => {
    const { indexStart } = options;
    const result = [];
    let index = indexStart ?? 1;

    const filteredData = omitBy(data, (key: string) => { return isUndefined(key) })
    for (const key in filteredData) {
        const { k, v } = toRecord(key, filteredData[key])
        result.push({
            columnOrig: key,
            valueOrig: filteredData[key],
            column: k,
            value: v,
            placeholder: `$${index}`,
            updatePlaceholder: `${k} = $${index}`,
            updateExcludedColumn: `${k} = excluded.${k}`,
        });
        index++;
    }
    return result;
}

export const selectTemplate = <T extends object>(data: T) => {
    const model = {} as Record<string, any>;
    for (const key in data) {
        const value = data[key];
        const { k, v } = fromRecord(key, value)
        model[k] = v;
    }
    return model;
}