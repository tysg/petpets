DROP TABLE IF EXISTS credit_card;
DROP TABLE IF EXISTS specialised_for;
DROP TABLE IF EXISTS pet;
DROP TABLE IF EXISTS pet_category;
DROP TABLE IF EXISTS pt_free_schedule;
DROP TABLE IF EXISTS ft_leave_schedule;
DROP VIEW IF EXISTS caretaker;
DROP TABLE IF EXISTS full_time_ct;
DROP TABLE IF EXISTS part_time_ct;
DROP TABLE IF EXISTS person;

CREATE TABLE person(
	email varchar(64) PRIMARY KEY,
	fullname varchar(64) NOT NULL,
	password varchar(64) NOT NULL,
	address varchar(64) NOT NULL,
	phone int NOT NULL,
	avatar_link varchar,
	caretaker_status smallint DEFAULT 0 CHECK (caretaker_status IN (0,1,2)) 
);

CREATE TABLE pet_category(
	type_name varchar(64) PRIMARY KEY,
	base_daily_price int NOT NULL
);

CREATE TABLE pet(
	name varchar(64),
	owner varchar(64) REFERENCES person(email),
	category varchar(64) REFERENCES pet_category(type_name),
	requirements text,
	description text,
	CONSTRAINT pet_id PRIMARY KEY (name, owner)
);

CREATE TABLE credit_card(
	cardNumber bigint,
	cardholder varchar(64) REFERENCES person(email),
	expiryDate Date,
	securityCode smallint,
	CONSTRAINT credit_card_id PRIMARY KEY (cardNumber, cardholder)
);

CREATE TABLE specialised_for (
	email varchar(64) REFERENCES person(email) ON DELETE CASCADE,
	type_name varchar(64) REFERENCES pet_category(type_name) ON DELETE CASCADE,
	CONSTRAINT specialied_for_id PRIMARY KEY (email, type_name)
);

CREATE TABLE part_time_ct (
	email varchar(64) PRIMARY KEY REFERENCES person(email) ON DELETE CASCADE
);

CREATE TABLE full_time_ct (
	email varchar(64) PRIMARY KEY REFERENCES person(email) ON DELETE CASCADE
);


CREATE VIEW caretaker (email) AS (SELECT * FROM part_time_ct UNION select * FROM full_time_ct);

CREATE TABLE pt_free_schedule (
	email varchar(64) REFERENCES part_time_ct(email) ON DELETE CASCADE,
	start_date date NOT NULL,
	end_date date NOT NULL
);

CREATE TABLE ft_leave_schedule (
	email varchar(64) REFERENCES full_time_ct(email) ON DELETE CASCADE,
	start_date date NOT NULL,
	end_date date NOT NULL
);

-- Non-overlapping constraints

CREATE OR REPLACE FUNCTION not_part_time()
RETURNS TRIGGER AS 
$t$ 
BEGIN 
	RETURN 
	CASE WHEN EXISTS (SELECT * FROM part_time_ct WHERE email=NEW.email) THEN
		NULL
	ELSE
		NEW
	END;
END;
$t$ LANGUAGE PLpgSQL;

CREATE TRIGGER check_ft_ct
BEFORE INSERT ON full_time_ct
FOR EACH ROW EXECUTE PROCEDURE not_part_time();

CREATE OR REPLACE FUNCTION not_full_time()
RETURNS TRIGGER AS 
$t$ 
BEGIN 
	RETURN 
	CASE WHEN EXISTS (SELECT * FROM full_time_ct WHERE email=NEW.email) THEN
		NULL
	ELSE
		NEW
	END;
END;
$t$ LANGUAGE PLpgSQL;

CREATE TRIGGER check_pt_ct
BEFORE INSERT ON part_time_ct
FOR EACH ROW EXECUTE PROCEDURE not_full_time();
