import { selectTemplate } from "@src/db/templates";
import { runningNo } from "@src/helpers/util";
import { PoolClient } from "pg";

export const getTaskCustomColumns = async (
    options: {
        client: PoolClient,
        criteria: {
            dataTypes?: string[],
        }
    }
) => {
    const { client, criteria: { dataTypes } } = options;

    const whereArr: string[] = [];
    const valueArr: string[] = [];
    const no = runningNo(1)
    if (dataTypes && dataTypes.length > 0) {
        const placeholders = dataTypes.map((d) => `$${no.next()}`)
        whereArr.push(`data_type in (${placeholders}) or udt_name in (${placeholders})`)
        valueArr.push(...dataTypes)
    }
    const whereClause = whereArr.length > 0 ? `and ${whereArr.join(" and ")}` : "";

    const result = await client.query({
        name: "select task custom columns",
        text: `select column_name
            from information_schema.columns 
            where table_schema = 'my_way2' 
                and table_name = 'entity_tasks'
                and ordinal_position > 14
                ${whereClause}
        `,
        values: valueArr,
    })

    return result.rows.map((row) => selectTemplate(row));
}