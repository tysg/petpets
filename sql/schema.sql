DROP TABLE IF EXISTS credit_card;
DROP TABLE IF EXISTS specializes_in;
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
CREATE TYPE transport_method AS ENUM ('delivery', 'pickup', 'PCS');

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
	category varchar(64) REFERENCES pet_category(type_name),
	requirements text,
	description text,
	CONSTRAINT pet_id PRIMARY KEY (name, owner)
);

CREATE TABLE credit_card(
	card_number bigint,
	cardholder varchar(64) REFERENCES person(email),
	expiryDate Date,
	securityCode smallint,
	CONSTRAINT credit_card_id PRIMARY KEY (card_number, cardholder)
);

CREATE TABLE specializes_in (
	email varchar(64) REFERENCES person(email) ON DELETE CASCADE,
	type_name varchar(64) REFERENCES pet_category(type_name) ON DELETE CASCADE,
	daily_price int NOT NULL,
	CONSTRAINT specializes_in_id PRIMARY KEY (email, type_name)
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

CREATE VIEW pet_owner (email, pet_name) (
	SELECT email, name as pet_name
	FROM person NATURAL JOIN pet
);


CREATE TABLE bid (
	amount int NOT NULL,
	is_cash boolean NOT NULL,
	credit_card bigint REFERENCES credit_card(card_number,cardholder)
	start_date DATE,
	end_date DATE NOT NULL,
	transport_method transport_method NOT NULL,
	FOREIGN KEY (pet, pet_owner, pet_category) REFERENCES pet(name, owner, category),
	FOREIGN KEY (ct_email, ct_price) REFERENCES specializes_in(email, daily_price),
	PRIMARY KEY (pet, pet_owner, start_date),
	CONSTRAINT credit_card CHECK (is_cash AND credit_card IS NULL) OR (!is_cash AND credit_card IS NOT NULL)
)

