CREATE OR REPLACE FUNCTION my_way2.ceiling_year(diff interval)
RETURNS interval
LANGUAGE plpgsql
AS $function$ 
declare
	year_max smallint;
begin 
	year_max := case when extract(month from diff) > 0 
		then extract(year from diff) + 1
		else extract(year from diff)
	end;
	return year_max * interval '1 year';
end;
$function$
;


CREATE OR REPLACE FUNCTION my_way2.to_next_financial_year(
	date_deadline timestamptz,
	date_cutoff timestamptz 
		DEFAULT date_trunc(
			'year'::text, 
			(CURRENT_DATE)::timestamptz
		)
) RETURNS timestamptz
LANGUAGE plpgsql
AS $function$ 
declare
	year_max smallint;
begin 
	return date_deadline + my_way2.ceiling_year(age(date_cutoff, date_deadline));
end;
$function$
;