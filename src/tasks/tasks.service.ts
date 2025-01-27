import { PoolClient } from "pg";
import { addTaskCustomColumn, dropTaskCustomColumn, getTaskCustomColumns, isColumnPopulated } from "./tasks.repository";
import { logger } from "@src/logger";

export const createTaskColumn = async (
    columnName: string,
    dataType: string,
    options: { client: PoolClient }
) => {
    logger.info({ columnName, dataType }, "tracing name of new column")
    const existingColumns = await getTaskCustomColumns({
        ...options,
        criteria: { columnNames: [columnName] }
    });
    const isExistsColumn = existingColumns.find((c) => c.columnName === columnName);
    if (isExistsColumn) return false;

    await addTaskCustomColumn(columnName, dataType, options);
    return true;
}

export const removeTaskColumn = async (
    columnName: string,
    options: { client: PoolClient }
) => {
    const hasData = await isColumnPopulated(columnName, options);
    if (hasData.length > 0) return false;

    await dropTaskCustomColumn(columnName, options);
    return true;
}