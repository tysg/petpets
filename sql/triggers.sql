 -- Non-overlapping constraints for caretaker

-- NOTE, functions not allowed to take parameters when used in triggers, so no choice. 
-- WAC, lots of dasani

-- CREATE OR REPLACE FUNCTION get_ct_pet_limit(text) RETURNS integer AS 
-- 	'SELECT CASE 
-- 			when (caretaker_status=2 OR rating > 4) then 5
-- 			else 2 end
-- 		from caretaker where email=$1;'
-- 	LANGUAGE PLpgSQL;

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

-- TODO set constraint for bids for schedule -> can't bid for leave
-- TODO set constraint for schedule with bids -> can't take leave if bids

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

CREATE OR REPLACE FUNCTION check_bid_update_status()
RETURNS TRIGGER AS
$t$
BEGIN
	IF (OLD.bid_status = 'closed' OR OLD.bid_status = 'reviewed') THEN
		RAISE EXCEPTION 'Bid is closed for modification';
	ELSE
		IF OLD.bid_status = 'submitted' THEN 
			IF NEW.bid_status = 'closed' OR NEW.bid_status = 'confirmed' THEN
				RETURN NEW;
			ELSE RAISE EXCEPTION 'Invalid new status';
			END IF;
		ELSEIF OLD.bid_status = 'confirmed' THEN
			IF NEW.bid_status = 'reviewed' THEN 
				RETURN NEW;
			ELSE RAISE EXCEPTION 'Invalid new status';
			END IF;
		ELSE 
			RAISE EXCEPTION 'Old status corrupted';
		END IF;
	END IF;
	RETURN NEW;
END;
$t$
LANGUAGE PLpgSQL;

CREATE TRIGGER check_bid_update_status
BEFORE UPDATE ON bid
FOR EACH ROW EXECUTE PROCEDURE check_bid_update_status();

CREATE OR REPLACE FUNCTION check_bid_confirm_time()
RETURNS TRIGGER AS
$t$
BEGIN
	IF NEW.bid_status = 'confirmed' THEN
		IF OLD.start_date < NOW() THEN
			OLD.bid_status = 'closed';
			RAISE EXCEPTION 'The bid starting date has passed!';
		END IF;
	END IF;
	RETURN NEW;
END;
$t$
LANGUAGE PLpgSQL;

CREATE TRIGGER check_bid_confirm_time
BEFORE UPDATE ON bid
FOR EACH ROW EXECUTE PROCEDURE check_bid_confirm_time();

-- CREATE OR REPLACE FUNCTION check_bid_insert_status()
-- RETURNS TRIGGER AS
-- $t$
-- BEGIN
-- 	IF (NEW.bid_status = 'confirmed' OR NEW.bid_status = 'submitted') THEN
-- 		RETURN NEW;
-- 	ELSE
-- 		RAISE EXCEPTION 'Wrong input for insert status';
-- 	END IF;
-- END;
-- $t$
-- LANGUAGE PLpgSQL;

-- CREATE TRIGGER check_bid_insert_status
-- BEFORE INSERT ON bid
-- FOR EACH ROW EXECUTE PROCEDURE check_bid_insert_status();

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
	SELECT 0 into transgression;

	IF (TG_OP='INSERT') OR (TG_OP='UPDATE' AND OLD.bid_status!='confirmed')  THEN 
		select count(*) into transgression FROM
			(select
				dates.date
				from (
					select
						generate_series(
							NEW.start_date, NEW.end_date, '1 day'
						)::date as date
				) as dates, (select * FROM bid WHERE ct_email=NEW.ct_email AND bid_status='confirmed') as p
				where dates.date >= p.start_date and dates.date <= p.end_date 
			ORDER BY dates.date) as overlapDates
		group by overlapDates.date
		having count(*) > pet_count;
	END IF;

	IF transgression > 0 THEN
		RAISE EXCEPTION 'limit reached for period!';
	ELSE
		RETURN NEW;
	END IF;
END;
$t$ LANGUAGE PLpgSQL;

CREATE TRIGGER check_pet_limit
BEFORE INSERT OR UPDATE ON bid
FOR EACH ROW EXECUTE PROCEDURE pet_limit();




CREATE OR REPLACE FUNCTION close_bid()
RETURNS TRIGGER AS 
$t$
BEGIN
	IF NEW.bid_status = 'confirmed' THEN
		UPDATE bid SET bid_status='closed'
			WHERE pet_name = NEW.pet_name 
			AND pet_owner = NEW.pet_owner 
			AND start_date = NEW.start_date 
			AND end_date = NEW.end_date 
			AND bid_status = 'submitted';
	END IF;
	RETURN NEW;
END;
$t$ LANGUAGE PLpgSQL;

CREATE TRIGGER close_pt_bid
AFTER INSERT OR UPDATE ON bid
FOR EACH ROW EXECUTE PROCEDURE close_bid();


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
		AND NEW.start_date <= p.end_date 
		AND NEW.end_date >= p.start_date;
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
		AND NEW.start_date <= ft.end_date 
		AND NEW.end_date >= ft.start_date;
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

CREATE OR REPLACE FUNCTION ft_150_constraint()
RETURNS TRIGGER AS 
$t$ 
DECLARE 
	count_150 NUMERIC;
	count_300 NUMERIC;
	new_end_year NUMERIC;
	new_start_year NUMERIC;
BEGIN

	SELECT extract(year from NEW.start_date) into new_start_year;
	SELECT extract(year from NEW.end_date) into new_end_year;

	select COUNT(*) into count_150 FROM ( 
		select * from (
			select *, row_number() over (partition by 1) as r1 from (
				select (Date(new_start_year||'-01-01')-'1 day'::interval) as ed1
				union
				SELECT end_date as ed1 FROM ft_leave_schedule f1
				WHERE email=NEW.email AND start_date >= Date(new_start_year||'-01-01') order by ed1 ASC
			) t1 
		) ord1 inner join 
		(
			select *, row_number() over (partition by 1) as r2 from (
				select (Date(new_end_year||'-01-01')+'1 year'::interval) as sd2
				union
				select start_date as sd2 FROM ft_leave_schedule f2
				WHERE email=NEW.email AND start_date >= Date(new_start_year||'-01-01') order by sd2 ASC
			) t2
		) ord2 on ord1.r1=ord2.r2
	) as cc
	WHERE Date(cc.sd2)-Date(cc.ed1) > 150;

	select COUNT(*) into count_300 FROM ( 
		select * from (
			select *, row_number() over (partition by 1) as r1 from (
				select (Date(new_start_year||'-01-01')-'1 day'::interval) as ed1
				union
				SELECT end_date as ed1 FROM ft_leave_schedule f1
				WHERE email=NEW.email AND start_date >= Date(new_start_year||'-01-01') order by ed1 ASC
			) t1 
		) ord1 inner join 
		(
			select *, row_number() over (partition by 1) as r2 from (
				select (Date(new_end_year||'-01-01')+'1 year'::interval) as sd2
				union
				select start_date as sd2 FROM ft_leave_schedule f2
				WHERE email=NEW.email AND start_date >= Date(new_start_year||'-01-01') order by sd2 ASC
			) t2
		) ord2 on ord1.r1=ord2.r2
	) as cc
	WHERE Date(cc.sd2)-Date(cc.ed1) > 300;

	IF new_start_year != new_end_year THEN
		IF count_300 = 2 OR count_150 = 4 OR (count_150 = 2 AND count_300 = 1) THEN 
			RETURN NEW;
		ELSE
			RAISE EXCEPTION 'No 2 times 150 consecutive working days!';
		END IF;
	ELSE
		IF count_150 = 2 OR count_300 = 1 THEN 
			RETURN NEW;
		ELSE
			RAISE EXCEPTION 'No 2 times 150 consecutive working days!';
		END IF;
	END IF;
	
END;
$t$ LANGUAGE PLpgSQL;
CREATE TRIGGER check_ft_150
AFTER INSERT ON ft_leave_schedule
FOR EACH ROW EXECUTE PROCEDURE ft_150_constraint();
