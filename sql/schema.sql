DROP TABLE IF EXISTS credit_card CASCADE;
DROP VIEW IF EXISTS specializes_in CASCADE;
DROP TABLE IF EXISTS pt_specializes_in CASCADE;
DROP TABLE IF EXISTS ft_specializes_in CASCADE;
DROP TABLE IF EXISTS pet CASCADE;
DROP TABLE IF EXISTS pet_category CASCADE;
DROP TABLE IF EXISTS pt_free_schedule CASCADE;
DROP TABLE IF EXISTS ft_leave_schedule CASCADE;
DROP VIEW IF EXISTS caretaker CASCADE;
DROP TABLE IF EXISTS full_time_ct CASCADE;
DROP TABLE IF EXISTS part_time_ct CASCADE;
DROP TABLE IF EXISTS person CASCADE;
DROP TABLE IF EXISTS bid;
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS transport_method;
DROP TYPE IF EXISTS bid_status;
DROP TYPE IF EXISTS caretaker_status;

CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE transport_method AS ENUM ('delivery', 'pickup', 'pcs');
CREATE TYPE bid_status AS ENUM ('submitted', 'confirmed', 'reviewed', 'closed');
CREATE TYPE caretaker_status AS ENUM ('not_ct', 'part_time_ct', 'full_time_ct');

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
	card_number bigint,
	cardholder varchar(64) REFERENCES person(email),
	expiry_date Date,
	security_code smallint,
	CONSTRAINT credit_card_id PRIMARY KEY (card_number, cardholder)
);

CREATE TABLE part_time_ct (
	email varchar(64) PRIMARY KEY REFERENCES person(email) ON DELETE CASCADE,
	rating real DEFAULT NULL
);

CREATE TABLE full_time_ct (
	email varchar(64) PRIMARY KEY REFERENCES person(email) ON DELETE CASCADE,
	rating real DEFAULT NULL
);

CREATE VIEW caretaker (email, caretaker_status, rating) AS (
	SELECT email, 1, rating FROM  part_time_ct 
	UNION 
	SELECT email, 2, rating FROM full_time_ct
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
	CONSTRAINT pt_schedule_id PRIMARY KEY (email, start_date, end_date),
	CONSTRAINT end_after_start CHECK (end_date >= start_date),
	CONSTRAINT within_next_year CHECK (extract(year FROM end_date) <= (1 + extract(year FROM CURRENT_DATE)))
);

CREATE TABLE ft_leave_schedule (
	email varchar(64) REFERENCES full_time_ct(email) ON DELETE CASCADE,
	start_date date NOT NULL,
	end_date date NOT NULL,
	CONSTRAINT ft_schedule_id PRIMARY KEY (email, start_date, end_date),
	CONSTRAINT end_after_start CHECK (end_date >= start_date),
	CONSTRAINT within_next_year CHECK (extract(year FROM end_date) <= (1 + extract(year FROM CURRENT_DATE)))
);


CREATE TABLE bid (
	ct_email varchar(64) REFERENCES person(email),
	ct_price int NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	is_cash boolean NOT NULL,
	credit_card bigint,
	transport_method transport_method NOT NULL,
	pet_owner varchar(64),
	pet_name varchar(64),
	bid_status bid_status NOT NULL,
	feedback text DEFAULT NULL,
	rating int DEFAULT NULL,
	FOREIGN KEY (pet_owner, credit_card) REFERENCES credit_card(cardholder, card_number),
	FOREIGN KEY (pet_owner, pet_name) REFERENCES pet(owner, name),
	CONSTRAINT bid_id PRIMARY KEY (ct_email, pet_name, pet_owner, start_date),
	CONSTRAINT valid_date CHECK(end_date >= start_date),
	CONSTRAINT xor_cash_credit CHECK ((is_cash AND credit_card IS NULL) OR (NOT is_cash AND credit_card IS NOT NULL))
);

