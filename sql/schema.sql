DROP TABLE IF EXISTS credit_card;
DROP TABLE IF EXISTS pt_specializes_in;
DROP TABLE IF EXISTS ft_specializes_in;
DROP TABLE IF EXISTS pet;
DROP TABLE IF EXISTS pet_category;
DROP TABLE IF EXISTS pt_free_schedule;
DROP TABLE IF EXISTS ft_leave_schedule;
DROP VIEW IF EXISTS caretaker;
DROP TABLE IF EXISTS full_time_ct;
DROP TABLE IF EXISTS part_time_ct;
DROP TABLE IF EXISTS person;
DROP TYPE IF EXISTS user_role;

CREATE TYPE user_role AS ENUM ('admin', 'user');

CREATE TABLE person(
	email varchar(64) PRIMARY KEY,
	fullname varchar(64) NOT NULL,
	password varchar(64) NOT NULL,
	address varchar(64) NOT NULL,
	phone int NOT NULL,
	role user_role NOT NULL,
	avatar_link varchar
);

CREATE TABLE pet_category(
	type_name varchar(64) PRIMARY KEY,
	base_daily_price int NOT NULL
);

CREATE TABLE pet(
	name varchar(64),
	owner varchar(64) REFERENCES person(email),
	category varchar(64) REFERENCES pet_category(type_name) ON UPDATE CASCADE,
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

CREATE TABLE part_time_ct (
	email varchar(64) PRIMARY KEY REFERENCES person(email) ON DELETE CASCADE
);

CREATE TABLE full_time_ct (
	email varchar(64) PRIMARY KEY REFERENCES person(email) ON DELETE CASCADE
);

CREATE VIEW caretaker (email, caretaker_status, rating) AS (
	SELECT email, 1 as caretaker_status, 4.1 as rating FROM part_time_ct 
	UNION 
	SELECT email, 2 as caretaker_status, 4.2 as rating FROM full_time_ct
);

CREATE TABLE pt_specializes_in (
	email varchar(64) REFERENCES part_time_ct(email) ON DELETE CASCADE,
	type_name varchar(64) REFERENCES pet_category(type_name) ON DELETE CASCADE ON UPDATE CASCADE,
	ct_price_daily int NOT NULL,
	CONSTRAINT pt_specializes_in_id PRIMARY KEY (email, type_name)
);

CREATE TABLE ft_specializes_in (
	email varchar(64) REFERENCES full_time_ct(email) ON DELETE CASCADE,
	type_name varchar(64) REFERENCES pet_category(type_name) ON DELETE CASCADE ON UPDATE CASCADE,
	ct_price_daily int NOT NULL,
	CONSTRAINT ft_specializes_in_id PRIMARY KEY (email, type_name)
);

CREATE VIEW specializes_in (email, type_name, ct_price_daily) as (
	SELECT email, type_name, ct_price_daily FROM pt_specializes_in
	UNION
	SELECT email, type_name, ct_price_daily FROM ft_specializes_in
);

CREATE TABLE pt_free_schedule (
	email varchar(64) REFERENCES part_time_ct(email) ON DELETE CASCADE,
	start_date date NOT NULL,
	end_date date NOT NULL,
	CONSTRAINT end_after_start CHECK (end_date >= start_date),
	CONSTRAINT within_next_year CHECK (extract(year FROM end_date) <= (1 + extract(year FROM CURRENT_DATE)))
);

CREATE TABLE ft_leave_schedule (
	email varchar(64) REFERENCES full_time_ct(email) ON DELETE CASCADE,
	start_date date NOT NULL,
	end_date date NOT NULL,
	CONSTRAINT end_after_start CHECK (end_date >= start_date)
);
