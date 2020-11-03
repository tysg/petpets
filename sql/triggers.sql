
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
CREATE OR REPLACE FUNCTION pt_schedule_constraints()
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

CREATE TRIGGER check_pt_overlap
BEFORE INSERT ON pt_free_schedule
FOR EACH ROW EXECUTE PROCEDURE pt_schedule_constraints();


-- full tiem
CREATE OR REPLACE FUNCTION ft_schedule_cosntraints()
RETURNS TRIGGER AS 
$t$ 
DECLARE overlap NUMERIC;
DECLARE stretch NUMERIC;
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

CREATE TRIGGER check_ft_overlap
BEFORE INSERT ON ft_leave_schedule
FOR EACH ROW EXECUTE PROCEDURE ft_schedule_cosntraints();

DROP TABLE IF EXISTS count_sched;

CREATE TABLE count_sched (
	c1 int
);

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

	INSERT INTO count_sched VALUES (stretch_start + stretch_start2 + stretch_end + stretch_end2);
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