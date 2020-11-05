-- select sum(ct_price), mm, yy FROM (
-- 	select ct_price, dd, mm, yy, ROW_NUMBER() over (partition by mm, yy order by date || pet_owner || pet_name || ct_email asc) as r FROM
-- 	(select
-- 		pet_owner,
-- 		pet_name,
-- 		ct_email,
-- 		ct_price,
-- 		to_char(ac.date,'DD') as dd, 
-- 		to_char(ac.date,'MM') as mm, 
-- 		extract(year from ac.date) as yy,
-- 		date
-- 		FROM 
-- 		(select                                                                              
-- 			generate_series(
-- 				date_trunc('month', startend.sd),
-- 				startend.ed, '1 day'
-- 			)::date as date
-- 			from
-- 			(select min(start_date) as sd, max(end_date) as ed from bid WHERE ct_email='ftct@gmail.com') as startend
-- 			order by 1
-- 		) as ac, (select * FROM bid WHERE ct_email='ftct@gmail.com') as p
-- 		where ac.Date >= p.start_date and ac.Date <= p.end_date 
-- 		ORDER BY ac.date) as monthdates
-- 	) ranked
--     WHERE ranked.r > 60
-- 	group by mm, yy;


-- select sum( (least(bid.end_date, endmonth) + 1 - greatest(bid.start_date, startmonth)) * ct_price) * 0.75, endmonth from 
--         (select                                                                              
--             generate_series(
--                 date_trunc('month', startend.sd),
--                 startend.ed, '1 month'
--             )::date as startmonth,
--             (generate_series(
--                 date_trunc('month', startend.sd),
--                 startend.ed, '1 month'
--             ) + interval '1 month' - interval '1 day' )::date as endmonth
--             from
--             (select min(start_date) as sd, max(end_date) as ed from bid WHERE ct_email=$1) as startend
--             order by 1
--     ) as sem, bid 
--     WHERE bid.start_date <= sem.endmonth
--     AND sem.startmonth <= bid.end_date
--     AND bid.bid_status = 'confirmed'
--     GROUP BY sem.endmonth
--     HAVING endmonth <= CURRENT_DATE


-- (select                                                                              
-- 	generate_series(
-- 		date_trunc('month', startend.sd),
-- 		startend.ed, '1 day'
-- 	)::date as day,
-- 	from
-- 	(select min(start_date) as sd, max(end_date) as ed from bid WHERE ct_email=$1) as startend
-- 	order by 1
--     )

-- select count(*) FROM 
-- 		(select
-- 			ac.date as date
-- 			from (
-- 				select                                                                              
-- 					generate_series(
-- 						date_trunc('month', NEW.start_date),
-- 						NEW.end_date, '1 day'
-- 					)::date as date
-- 			) as ac, (select * FROM bid WHERE ct_email='ptct@gmail.com') as p
-- 			where ac.Date >= p.start_date and ac.Date <= p.end_date 
-- 		ORDER BY ac.date) as overlapDates
-- 	group by overlapDates.date
-- 	having count(*) > pet_count;


-- Non-overlapping constraints for caretaker

-- NOTE, functions not allowed to take parameters when used in triggers, so no choice. 
-- WAC, lots of dasani

CREATE OR REPLACE FUNCTION not_part_time()
RETURNS TRIGGER AS 
$t$ 
DECLARE overlap NUMERIC;
BEGIN 
	SELECT COUNT(*) INTO overlap FROM part_time_ct WHERE email=NEW.email;
	IF overlap > 0 THEN
		RAISE EXCEPTION 'User is already a part timer!';
	ELSE
		RETURN NEW;
	END IF;
END;
$t$ LANGUAGE PLpgSQL;

CREATE TRIGGER check_ft_ct
BEFORE INSERT ON full_time_ct
FOR EACH ROW EXECUTE PROCEDURE not_part_time();

CREATE OR REPLACE FUNCTION not_full_time()
RETURNS TRIGGER AS 
$t$ 
DECLARE overlap NUMERIC;
BEGIN 
	SELECT COUNT(*) INTO overlap FROM full_time_ct WHERE email=NEW.email;
	IF overlap > 0 THEN
		RAISE EXCEPTION 'User is already a full timer!';
	ELSE
		RETURN NEW;
	END IF;
END;
$t$ LANGUAGE PLpgSQL;

CREATE TRIGGER check_pt_ct
BEFORE INSERT ON part_time_ct
FOR EACH ROW EXECUTE PROCEDURE not_full_time();


-- REMOVED cos caretaker overlap enforcement + FK constraint should already enforce this
-- -- NONOVERLAPPING constraints for schedule
-- CREATE OR REPLACE FUNCTION not_in_pt_schedule()
-- RETURNS TRIGGER AS 
-- $t$ 
-- DECLARE overlap NUMERIC;
-- BEGIN 
-- 	SELECT COUNT(*) INTO overlap FROM pt_free_schedule WHERE email=NEW.email;
-- 	IF overlap > 0 THEN
-- 		RAISE EXCEPTION 'User is already a part timer!';
-- 	ELSE
-- 		RETURN NEW;
-- 	END IF;
-- END;
-- $t$ LANGUAGE PLpgSQL;
-- CREATE TRIGGER check_pt_schedule
-- BEFORE INSERT ON ft_leave_schedule
-- FOR EACH ROW EXECUTE PROCEDURE not_in_pt_schedule();

-- CREATE OR REPLACE FUNCTION not_in_ft_schedule()
-- RETURNS TRIGGER AS 
-- $t$ 
-- DECLARE overlap NUMERIC;
-- BEGIN 
-- 	SELECT COUNT(*) INTO overlap FROM ft_leave_schedule WHERE email=NEW.email;
-- 	IF overlap > 0 THEN
-- 		RAISE EXCEPTION 'User is already a full timer!';
-- 	ELSE
-- 		RETURN NEW;
-- 	END IF;
-- END;
-- $t$ LANGUAGE PLpgSQL;
-- CREATE TRIGGER check_ft_schedule
-- BEFORE INSERT ON pt_free_schedule
-- FOR EACH ROW EXECUTE PROCEDURE not_in_ft_schedule();

-- Schedule Overlap check
-- part time
CREATE OR REPLACE FUNCTION date_non_overlap_pt_schedule()
RETURNS TRIGGER AS 
$t$ 
DECLARE overlap NUMERIC;
BEGIN
	SELECT COUNT(*) INTO overlap FROM 
		pt_free_schedule p 
		WHERE p.email=NEW.email 
		AND 
		((NEW.start_date >= p.start_date AND NEW.start_date <= p.end_date) 
		OR (NEW.end_date >= p.start_date AND NEW.end_date <= p.end_date));

	IF overlap > 0 THEN
		RAISE EXCEPTION 'New schedule overlaps!';
	ELSE
		RETURN NEW;
	END IF;
END;
$t$ LANGUAGE PLpgSQL;

CREATE TRIGGER check_pt_schedule_no_date_overlap
BEFORE INSERT ON pt_free_schedule
FOR EACH ROW EXECUTE PROCEDURE date_non_overlap_pt_schedule();


-- full tiem
CREATE OR REPLACE FUNCTION date_non_overlap_ft_schedule()
RETURNS TRIGGER AS 
$t$ 
DECLARE overlap NUMERIC;
BEGIN
	SELECT COUNT(*) INTO overlap FROM 
		ft_leave_schedule ft 
		WHERE ft.email=NEW.email 
		AND 
		((NEW.start_date >= ft.start_date AND NEW.start_date <= ft.end_date) 
		OR (NEW.end_date >= ft.start_date AND NEW.end_date <= ft.end_date));
	IF overlap > 0 THEN
		RAISE EXCEPTION 'New schedule overlaps!';
	ELSE
		RETURN NEW;
	END IF;
END;
$t$ LANGUAGE PLpgSQL;

CREATE TRIGGER check_ft_schedule_no_date_overlap
BEFORE INSERT ON ft_leave_schedule
FOR EACH ROW EXECUTE PROCEDURE date_non_overlap_ft_schedule();

-- for debugging
-- DROP TABLE IF EXISTS count_sched;

-- CREATE TABLE count_sched (
-- 	c1 int
-- );
CREATE OR REPLACE FUNCTION ft_150_constraint()
RETURNS TRIGGER AS 
$t$ 
DECLARE 
	stretch_end NUMERIC;
	stretch_end2 NUMERIC;
	stretch_start NUMERIC;
	stretch_start2 NUMERIC;
	start_y DOUBLE PRECISION;
	end_y DOUBLE PRECISION;

BEGIN
	SELECT extract(year from NEW.end_date) into end_y;
	SELECT extract(year from NEW.start_date) into start_y;

	-- somehow can't create view with NEW.end_date inside the WHERE clause, 
	-- so we expanded the view into the queries used for checking constraint
	
	-- CREATE VIEW start_year (email, start_date, end_date) AS (
	-- 	SELECT * FROM ft_leave_schedule ft
	-- 	WHERE (SELECT extract(year from new.end_date)) = (select extract(year FROM ft.start_date))
	-- );

	-- CREATE VIEW end_year (email, start_date, end_date) AS (
	-- 	SELECT * FROM ft_leave_schedule ft
	-- 	WHERE (select extract(year FROM ft.end_date)) = (select extract(year FROM NEW.end_date))
	-- );

	SELECT COUNT(*) INTO stretch_start FROM ft_leave_schedule s1
		WHERE extract(year from (s1.start_date - '150 day'::interval)) = extract(year from NEW.start_date)
		AND extract(year FROM s1.start_date) = (start_y)
		AND NOT EXISTS (
			SELECT 1 FROM ft_leave_schedule s2
				WHERE extract(year FROM s2.start_date) = (start_y)
				AND (s1.start_date - '150 day'::interval) <= s2.end_date
				AND s2.start_date < s1.start_date
		);

	SELECT COUNT(*) INTO stretch_start2 FROM ft_leave_schedule s1
	WHERE extract(year from (s1.start_date - '300 day'::interval)) = extract(year from NEW.start_date)
	AND extract(year FROM s1.start_date) = (start_y)
	AND NOT EXISTS (
		SELECT 1 FROM ft_leave_schedule s2
		WHERE extract(year FROM s2.start_date) = (start_y)
		AND (s1.start_date - '300 day'::interval) <= s2.end_date
		AND s2.start_date < s1.start_date
	);

	
	SELECT COUNT(*) INTO stretch_end FROM ft_leave_schedule s1
	WHERE extract(year from (s1.end_date + '150 day'::interval)) = extract(year from NEW.end_date)
	AND extract(year FROM s1.end_date) = (end_y)
	AND NOT EXISTS (
		SELECT 1 FROM ft_leave_schedule s2
		WHERE  (s1.end_date + '150 day'::interval) >= s2.start_date
		AND extract(year FROM s2.end_date) = (end_y)
		AND s2.end_date > s1.end_date
	);

	SELECT COUNT(*) INTO stretch_end2 FROM ft_leave_schedule s1
	WHERE  extract(year from (s1.end_date + '300 day'::interval)) = extract(year from NEW.end_date)
	AND extract(year FROM s1.end_date) = (end_y)
	AND NOT EXISTS (
		SELECT 1 FROM ft_leave_schedule s2
		WHERE (s1.end_date + '300 day'::interval) >= s2.start_date
		AND extract(year FROM s2.end_date) = (end_y)
		AND s2.end_date > s1.end_date
	);

	-- INSERT INTO count_sched VALUES (stretch_start + stretch_start2 + stretch_end + stretch_end2);

	IF start_y = end_y THEN
		IF stretch_start + stretch_start2 + stretch_end + stretch_end2 < 2 THEN
			RAISE EXCEPTION 'Not enough consecutive working days! %', stretch_start + stretch_start2 + stretch_end + stretch_end2;
		END IF;
	ELSE
		IF stretch_start + stretch_start2 < 2 THEN
			RAISE EXCEPTION 'Not enough consecutive working days! %', stretch_start + stretch_start2;
		ELSIF stretch_end + stretch_end2 < 2 THEN
			RAISE EXCEPTION 'Not enough consecutive working days! %', stretch_end + stretch_end2;
		END IF;
	END IF;
	RETURN NEW;
END;
$t$ LANGUAGE PLpgSQL;
CREATE TRIGGER check_ft_150
AFTER INSERT ON ft_leave_schedule
FOR EACH ROW EXECUTE PROCEDURE ft_150_constraint();