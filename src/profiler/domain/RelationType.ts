import { HttpBadRequest } from "@src/errors/HttpError";
import { logger } from "@src/logger";
import { record, z } from "zod";

// SECTION: Dto schema
export const RelationTypeSchema = z.object({
    relationId: z.number(),
    relationName: z.string(),
    relationDescription: z.string(),
})

export type RelationTypeDto = z.infer<typeof RelationTypeSchema>

export interface IRelationTypeModel {
    relationId: number
    relationName: string
    relationDescription: string
}

export const relationTypeFromDto = (dto: RelationTypeDto) => {
    try {
        RelationTypeSchema.parse(dto)
    } catch (err) {
        logger.warn(err, "Relation type validation error.");
        throw new HttpBadRequest("Relation type validation error.");
    }
    return dto as IRelationTypeModel
}

export const relationTypeToDto = (model: IRelationTypeModel) => {
    return model as RelationTypeDto; 
}
