-- select * from information_schema.tables
create schema my_way2;

drop table if exists my_way2.entity_tasks;
drop table if exists my_way2.client_services;
drop table if exists my_way2.service_deadlines;
drop table if exists my_way2.service_types;
drop table if exists my_way2.relation_types;
drop table if exists my_way2.entity_relations;
drop table if exists my_way2.entity;

create table my_way2.entity (
    -- entity general attributes
    entity_id serial,
    entity_name text,
    entity_class smallint,
    entity_type_primary smallint,
    entity_type_secondary smallint,
    entity_status smallint,
    contacts jsonb,
    remarks jsonb,

    -- person attributes
    ic_type smallint,
    ic_no text,

    -- company attributes
    co_reg_no_old text,
    co_reg_no_new text,
    employer_no text,
    date_incorp timestamptz,
    date_commence timestamptz,
    year_end_month smallint,
    ar_due_month smallint,
    director_name text,
    director_password text,

    -- client attribtes
    income_tax_no text,
    income_tax_branch text,
    profile_status smallint,

    -- keys
    constraint pk_entity primary key (entity_id)
);

create table my_way2.relation_types (
    relation_id int,
    relation_name text,
    relation_description text,

    -- keys
    constraint pk_relation_types primary key (relation_id)
);

create table my_way2.entity_relations (
    parent_id int,
    child_id int,
    relation_id int,
    relation_attributes jsonb,

    -- keys
    constraint pk_entity_relations primary key (parent_id, child_id),
    constraint fk_parent_id foreign key (parent_id) references my_way2.entity(entity_id),
    constraint fk_child_id foreign key (child_id) references my_way2.entity(entity_id)
);

create table my_way2.service_types (
    service_type_id smallint,
    service_type_name text,
    service_type_description text,
    service_type_grouping text,
    service_type_deadlines text, -- comma-delimited list of deadlines, for filtering purposes

    -- keys
    constraint pk_service_types primary key (service_type_id)
);

create table my_way2.service_deadlines (
    deadline_id smallint,
    deadline_name text,
    date_start text,
    interval_added interval,
    service_type_id smallint,

    -- keys
    constraint pk_deadline_types primary key (deadline_id),
    constraint fk_service_id foreign key (service_type_id) references my_way2.service_types(service_type_id)
);

create table my_way2.client_services (
    -- service general attributes
    service_id int,
    service_created_by int,
    service_created_date timestamptz,
    service_status smallint,

    -- contract specific attributes
    entity_id int,
    service_type_id int,
    default_service_provider_id int,
    default_service_staff_id int,
    remarks jsonb,

    -- keys
    constraint pk_client_service_type primary key (service_id),
    constraint fk_client_id foreign key (entity_id) references my_way2.entity(entity_id),
    constraint fk_service_type_id foreign key (service_type_id) references my_way2.service_types(service_type_id)
);
create unique index idx_entity_service_type ON my_way2.client_services (entity_id, service_type_id);

create table my_way2.entity_tasks (
    -- task general attributes
    task_id serial,
    task_year smallint,
    task_status smallint,
    task_created_by int,
    task_created_date timestamptz,
    remarks jsonb,

    -- reference keys, duplicate columns for ease of reference
    entity_id int,
    service_type_id int,
    service_id int,
    service_name text,
    service_provider_id int,
    service_staff_id int,

    -- workflow
    workflow_history jsonb,
    workflow_current jsonb,

    -- task details
    fee_type text,
    fee numeric,
    engagement_type text,
    closing_stock int,

    date_audit_due timestamptz,
    date_ready_audit timestamptz,
    date_queries_received timestamptz,
    date_queries_replied timestamptz,
    date_audit_page_signed timestamptz,
    date_tax_page_signed timestamptz,
    date_cosec_acc_page_signed timestamptz,
    date_sendback_client timestamptz,
    date_sendback_audit timestamptz,
    date_report_scanned timestamptz,
    date_late_filing timestamptz,
    is_late_filing smallint,
    account_by_us smallint,

    date_docs_in timestamptz,
    date_draft_review timestamptz,
    date_draft_return timestamptz,
    date_client_signed timestamptz,
    is_fee_paid smallint,

    date_submission timestamptz,
    has_management_acc smallint,
    date_management_acc timestamptz,

    has_tax_draft_1 smallint, date_tax_draft_1 timestamptz,
    has_audit_draft smallint, date_audit_draft timestamptz,
    date_tax_draft_wip timestamptz,
    date_tax_draft_to_review timestamptz,
    date_tax_draft_from_review timestamptz,
    date_tax_draft_to_client timestamptz,
    date_tax_draft_signed_back timestamptz,

    submission1 text,
    revision1 text,
    revision2 text,
    revision_mth_11 text,
    invoice_no text,
    invoice_amount numeric,
    invoice_date timestamptz,
    payment_note text,
    payment_date timestamptz,
    invoice_status_code int2,

    -- keys
    constraint pk_entity_tasks primary key (task_id),
    constraint fk_service_id foreign key (service_id) references my_way2.client_services(service_id)
);
