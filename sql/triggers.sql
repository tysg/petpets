
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


-- CREATE OR REPLACE FUNCTION ft_rating()
-- RETURNS TRIGGER AS 
-- $t$
-- DECLARE avg_rating NUMERIC;
-- BEGIN
-- 	IF NEW.rating is not NULL THEN
-- 		UPDATE full_time_ct 
-- 		SET (rating) = (SELECT AVG(rating) FROM bid WHERE ct_email=NEW.ct_email AND rating IS NOT NULL) 
-- 		WHERE email=NEW.ct_email;
-- 	END IF;
-- 	RETURN NEW;
-- END;
-- $t$ LANGUAGE PLpgSQL;

-- CREATE TRIGGER get_ft_rating
-- BEFORE INSERT OR UPDATE ON bid
-- FOR EACH ROW EXECUTE PROCEDURE ft_rating();


CREATE OR REPLACE FUNCTION avg_rating()
RETURNS TRIGGER AS 
$t$
DECLARE avg_rating NUMERIC;
DECLARE ct_status INTEGER;
BEGIN
	SELECT caretaker_status INTO ct_status FROM caretaker WHERE email=NEW.ct_email;
	IF NEW.rating is not NULL THEN
		IF ct_status = 2 THEN 
			UPDATE full_time_ct 
				SET (rating) = 
					(SELECT AVG(rating) FROM bid WHERE ct_email=NEW.ct_email AND rating IS NOT NULL) 
				WHERE email=NEW.ct_email;
		ELSE
			UPDATE part_time_ct 
				SET (rating) =
					(SELECT AVG(rating) FROM bid WHERE ct_email=NEW.ct_email AND rating IS NOT NULL) 
				WHERE email=NEW.ct_email;
		END IF;
	END IF;
	RETURN NEW;
END;
$t$ LANGUAGE PLpgSQL;

CREATE TRIGGER get_avg_rating
AFTER INSERT OR UPDATE ON bid
FOR EACH ROW EXECUTE PROCEDURE avg_rating();

-- Check that bid made isn't overlapping for pet
CREATE OR REPLACE FUNCTION no_bid_overlap()
RETURNS TRIGGER AS 
$t$
DECLARE overlap INTEGER;
DECLARE pt_overlap INTEGER;
BEGIN
	-- only allow for multiple submitted bids with overlap and essentially are the same bid
	SELECT COUNT(*) INTO overlap FROM bid
		WHERE NEW.start_date <= end_date
		AND NEW.end_date >= start_date
		AND NEW.pet_owner=pet_owner
		AND NEW.pet_name=pet_name;

	SELECT COUNT(*) INTO pt_overlap FROM bid b
		WHERE NEW.start_date=b.start_date
		AND NEW.end_date=b.end_date
		AND NEW.pet_owner=b.pet_owner
		AND NEW.pet_name=b.pet_name
		AND b.bid_status='submitted';

	IF (overlap-pt_overlap) > 0 THEN
		RAISE EXCEPTION 'Bid for pet overlaps!';
	ELSE
		RETURN NEW;
	END IF;
	RETURN NEW;
END;
$t$ LANGUAGE PLpgSQL;

CREATE TRIGGER check_no_bid_overlap
BEFORE INSERT ON bid
FOR EACH ROW EXECUTE PROCEDURE no_bid_overlap();

CREATE OR REPLACE FUNCTION close_bid()
RETURNS TRIGGER AS 
$t$
BEGIN
	IF NEW.bid_status = 'confirmed' THEN
		UPDATE bid SET bid_status='closed'
			WHERE pet_name = NEW.pet_name 
			AND pet_owner = NEW.pet_owner 
			AND start_date = NEW.start_date 
			AND bid_status = 'submitted';
	END IF;
	RETURN NEW;
END;
$t$ LANGUAGE PLpgSQL;

CREATE TRIGGER close_pt_bid
BEFORE INSERT OR UPDATE ON bid
FOR EACH ROW EXECUTE PROCEDURE close_bid();


-- for debugging
DROP TABLE IF EXISTS count_limit;

CREATE TABLE count_limit (
	c1 int
);


CREATE OR REPLACE FUNCTION pet_limit()
RETURNS TRIGGER AS 
$t$
DECLARE pet_count INTEGER;
DECLARE transgression INTEGER;

BEGIN
	select 
		case 
			when caretaker_status=2 OR rating > 4 then 4
			else 1 end
		into pet_count from caretaker where email=NEW.ct_email;

	select count(*) into transgression FROM 
		(select
			ac.date as date
			from (
				select                                                                              
					generate_series(
						date_trunc('month', NEW.start_date),
						NEW.end_date, '1 day'
					)::date as date
			) as ac, (select * FROM bid WHERE ct_email='ptct@gmail.com') as p
			where ac.Date >= p.start_date and ac.Date <= p.end_date 
		ORDER BY ac.date) as overlapDates
	group by overlapDates.date
	having count(*) > pet_count;

	insert into count_limit values (transgression);

	IF transgression > 0 THEN
		RAISE EXCEPTION 'limit reached for period!';
	ELSE
		RETURN NEW;
	END IF;
END;
$t$ LANGUAGE PLpgSQL;

CREATE TRIGGER check_pet_limit
BEFORE INSERT ON bid
FOR EACH ROW EXECUTE PROCEDURE pet_limit();


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


-- full time
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

-- old enumerating of dates
-- select count(*) into transgression FROM 
	-- 	(select
	-- 		ac.date as date
	-- 		from (
	-- 			select CURRENT_DATE - (a.a + (10 * b.a) + (100 * c.a) + (1000 * d.a) || ' days')::interval as date
	-- 			from (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as a
	-- 			cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as b
	-- 			cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as c
	-- 			cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as d
	-- 		) as ac, (select * FROM bid WHERE ct_email=NEW.ct_email) as p
	-- 		where ac.Date >= p.start_date and ac.Date <= p.end_date 
	-- 	ORDER BY ac.date) as overlapDates
	-- group by overlapDates.date
	-- having count(*) > pet_count;
