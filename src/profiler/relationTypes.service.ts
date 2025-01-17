import { deleteEntityRelations } from "./entityRelations.repository";
import { selectRelationTypes } from "./relationTypes.repository";
import { PoolClient } from "pg";

export const removeEntityRelations = (
    parentId: number,
    childId: number,
    options: { client: PoolClient }
) => {
    return deleteEntityRelations(parentId, childId, options);
}

export const findRelationType = async (
    options: { client: PoolClient },
    targetRelationId?: number,
    targetRelationName?: string,
) => {
    if (targetRelationId === undefined && targetRelationName === undefined) return undefined;

    const { client } = options;
    const relations = await selectRelationTypes({ client });
    return relations.find(({ relationId, relationName }) => {
        const foundById = targetRelationId === undefined ? false : targetRelationId === relationId;
        const foundByName = targetRelationName === undefined ? false : targetRelationName === relationName;
        return foundById || foundByName;
    })
}
