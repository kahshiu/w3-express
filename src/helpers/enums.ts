export enum ProfileStatus {
    "EMPTY" = 0,
    "PRE_ACTIVATION" = 1,
    "ACTIVE" = 11,
    "RESIGNED" = 101,
};

export enum EntityType {
    "MASTER_COMPANY" = "master_company",
    "MASTER_PERSON" = "master_person",
    "SERVICE_PROVIDER_COMPANY" = "service_provider_company",
    "SERVICE_PROVIDER_PERSON" = "service_provider_person",
    "CLIENT_COMPANY" = "client_company",
    "CLIENT_PERSON" = "client_person"
}

export enum EntityClass {
    "EMPTY" = 0,
    "MASTER" = 1,
    "CLIENT" = 2,
    "SERVICE_PROVIDER" = 3,
}

export enum PrimaryType {
    "EMPTY" = 0,
    "COMPANY" = 1,
    "PERSONAL" = 2,
};

export enum SecondaryType {
    "EMPTY" = 0,
    "SOLE_PROP" = 101,
    "PARTNERSHIP" = 102,
    "SDN_BHD" = 103,
    "LLP" = 104,
};

export enum EntityStatus {
    "EMPTY" = 0,
    "ACTIVE" = 11,
    "DORMANT" = 101,
    "STRIKE_OFF" = 102,
};

export enum IcType {
    "EMPTY" = 0,
    "NEW_IC" = 1,
    "OLD_IC" = 2,
};

export enum RelationStatus {
    "ACTIVE" = 1,
    "KEEP_AS_HISTORY" = 2,
    "REMOVE" = 901,
};