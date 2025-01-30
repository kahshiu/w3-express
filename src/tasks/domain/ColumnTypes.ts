export const ColumnTypes: Record<string, string> = {
    timestamptz: "timestamptz",
    smallint: "smallint",
    int: "int",
    text: "text",
    money: "money",
}

export const DataTypes = [
    "timestamptz",
    "smallint",
    "int",
    "text",
    "money",
] as const

export interface ColumnDefinition {
    columnName: string,
    dataType: string,
    udtName: string,
}