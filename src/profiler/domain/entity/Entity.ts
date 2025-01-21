import { HttpBadRequest } from "@src/errors/HttpError";
import { EntityType } from "@src/helpers/enums";
import { adaptValue } from "@src/helpers/util";
import { logger } from "@src/logger";
import { pick } from "es-toolkit/compat";
import { entitySpecs } from "./Config";
import { IEntityDto } from "./IDto";
import { IEntityModel } from "./IModel";

// SECTION: converter function
export const entityFromDto = (entityType: EntityType, dto: IEntityDto, options: {} = {}) => {
    const specs = entitySpecs[entityType];

    try {
        specs.dtoSchema.parse(dto);
    } catch (err) {
        logger.warn(err, "Entity validation error.");
        throw new HttpBadRequest("Entity validation error.");
    }

    const filtered = pick(dto, specs.columns);
    const model = adaptValue(filtered, specs.fromDtoAdapter) as IEntityModel;
    specs.enforceDefaults(model)
    return model
}

export const entityToDto = (entityType: EntityType, model: IEntityModel, options: {} = {}) => {
    const specs = entitySpecs[entityType];
    const filtered = pick(model, specs.columns);
    const dto = adaptValue(filtered, specs.toDtoAdapter);
    return dto;
}
