-- database 
insert into my_way2.relation_types (
    relation_id,
    relation_name,
    relation_description
) values (
    1,
    'employer-employee',
    'parent is company, child is staff'
);


insert into my_way2.entity (
    entity_name, 
    entity_class, 
    entity_type_primary, 
    entity_type_secondary, 
    entity_type, 
    profile_status
) values (
    'Waymaker',
    'master entity',
    2,
    1
)


select * from my_way2.entity


select * from my_way2.deadline_types
    
select * from my_way2.service_types

select * from my_way2.relation_types

delete from my_way2.relation_types
where relation_id = 10
returning relation_id


select relation_id, relation_name, relation_description 
        from my_way2.relation_types


-- delete from my_way2.relation_types