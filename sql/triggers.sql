
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



-- NONOVERLAPPING constraints for schedule
CREATE OR REPLACE FUNCTION not_in_pt_schedule()
RETURNS TRIGGER AS 
$t$ 
DECLARE overlap NUMERIC;
BEGIN 
	SELECT COUNT(*) INTO overlap FROM pt_free_schedule WHERE email=NEW.email;
	IF overlap > 0 THEN
		RAISE EXCEPTION 'User is already a part timer!';
	ELSE
		RETURN NEW;
	END IF;
END;
$t$ LANGUAGE PLpgSQL;
CREATE TRIGGER check_pt_schedule
BEFORE INSERT ON ft_leave_schedule
FOR EACH ROW EXECUTE PROCEDURE not_in_pt_schedule();

CREATE OR REPLACE FUNCTION not_in_ft_schedule()
RETURNS TRIGGER AS 
$t$ 
DECLARE overlap NUMERIC;
BEGIN 
	SELECT COUNT(*) INTO overlap FROM ft_leave_schedule WHERE email=NEW.email;
	IF overlap > 0 THEN
		RAISE EXCEPTION 'User is already a full timer!';
	ELSE
		RETURN NEW;
	END IF;
END;
$t$ LANGUAGE PLpgSQL;
CREATE TRIGGER check_ft_schedule
BEFORE INSERT ON pt_free_schedule
FOR EACH ROW EXECUTE PROCEDURE not_in_ft_schedule();