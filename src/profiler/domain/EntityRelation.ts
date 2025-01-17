import { IEntityDto } from "./entity/IDto";

export interface IRelationModel {
    parentId: number
    childId: number
    relationId: number
    relationAttributes: any
    relationStatus: number
}

export const relationfromEntityDto = (dto: IEntityDto) => {
    const { relatedChildren, relatedParents, entityId } = dto;

    const childrenModel = relatedChildren.map((child) => {
        const { entityId: childId, ...rest } = child;
        return {
            parentId: entityId,
            childId,
            ...rest,
        } as IRelationModel;
    })

    const parentsModel = relatedParents.map((parent) => {
        const { entityId: parentId, ...rest } = parent;
        return {
            parentId,
            childId: entityId,
            ...rest,
        } as IRelationModel;
    })

    return { childrenModel, parentsModel };
}

export const relationfromEntityModel = (
    childrenModel: IRelationModel[],
    parentsModel: IRelationModel[],
) => {
    const relatedChildren = childrenModel.map((child) => {
        const { childId, ...rest } = child;
        return rest;
    })

    const relatedParents = parentsModel.map((parent) => {
        const { parentId, ...rest } = parent;
        return rest;
    })

    return { relatedChildren, relatedParents };
}