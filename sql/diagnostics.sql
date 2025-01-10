-- check active connection count
SELECT 
    pid,
    usename AS username,
    datname AS database_name,
    application_name,
    client_addr,
    client_port,
    backend_start,
    state,
    query
FROM 
    pg_stat_activity
WHERE 
    state = 'active';

