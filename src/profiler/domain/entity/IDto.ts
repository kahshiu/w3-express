import { 
    SecondaryType, 
    EntityStatus, 
    IcType, 
    ProfileStatus, 
    RelationStatus, 
    EntityClass,
    PrimaryType
} from "@src/helpers/enums";
import { z } from "zod";

// SECTION: Dto schema: entity only
export const BaseSchema = z.object({
    entityId: z.number().optional(),
    entityName: z.string(),
    entityClass: z.nativeEnum(EntityClass).optional(),
    entityTypePrimary: z.nativeEnum(PrimaryType).optional(),
    entityTypeSecondary: z.nativeEnum(SecondaryType).optional(),
    entityStatus: z.nativeEnum(EntityStatus),
})

export const CompanySchema = z.object({
    coRegNoOld: z.string().nullable().optional(),
    coRegNoNew: z.string().nullable().optional(),
    employerNo: z.string().nullable().optional(),
    dateIncorp: z.string().datetime().nullable().optional(),
    dateCommence: z.string().datetime().nullable().optional(),
    yearEndMonth: z.number().nullable().optional(),
    arDueMonth: z.number().nullable().optional(),
    directorName: z.string().nullable().optional(),
    directorPassword: z.string().nullable().optional(),
})

export const PersonSchema = z.object({
    icType: z.nativeEnum(IcType),
    icNo: z.string().nullable().optional(),
})

export const ClientSchema = z.object({
    incomeTaxNo: z.string().nullable().optional(),
    incomeTaxBranch: z.string().nullable().optional(),
    profileStatus: z.nativeEnum(ProfileStatus),
});

// SECTION: Dto schema: entity relations
export const ChildRelationSchema = z.object({
    entityId: z.number(),
    relationId: z.number(),
    relationAttributes: z.object({}),
    relationStatus: z.nativeEnum(RelationStatus),
})

export const ParentRelationSchema = z.object({
    entityId: z.number(),
    relationId: z.number(),
    relationAttributes: z.object({}),
    relationStatus: z.nativeEnum(RelationStatus),
})

export const EntityRelationSchema = z.object({
    relatedChildren: z.array(ChildRelationSchema),
    relatedParents: z.array(ParentRelationSchema),
})

// SECTION: dto
export type BaseDto = z.infer<typeof BaseSchema>;
export type CompanyDto = z.infer<typeof CompanySchema>;
export type PersonDto = z.infer<typeof PersonSchema>;
export type ClientDto = z.infer<typeof ClientSchema>;
export type EntityRelationDto = z.infer<typeof EntityRelationSchema>;

export type IEntityDto = BaseDto & CompanyDto & PersonDto & ClientDto & EntityRelationDto