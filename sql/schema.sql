DROP TABLE IF EXISTS credit_card;
DROP TABLE IF EXISTS specialised_for;
DROP TABLE IF EXISTS pet;
DROP TABLE IF EXISTS pet_category;
DROP TABLE IF EXISTS pt_free_schedule;
DROP TABLE IF EXISTS ft_leave_schedule;
DROP TABLE IF EXISTS full_time_ct;
DROP TABLE IF EXISTS part_time_ct;
DROP TABLE IF EXISTS care_taker;
DROP TABLE IF EXISTS person;
CREATE TABLE person(
	email varchar(64) PRIMARY KEY,
	fullname varchar(64) NOT NULL,
	password varchar(64) NOT NULL,
	address varchar(64) NOT NULL,
	phone int NOT NULL,
	avatar_link varchar,
	ct_status smallint DEFAULT 0 CHECK (ct_status IN (0,1,2)) 
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

CREATE TABLE care_taker (
	email varchar(64) PRIMARY KEY REFERENCES person(email) ON DELETE CASCADE,
	rating decimal DEFAULT NULL --TODO look into how to implement
);

CREATE TABLE specialised_for (
	email varchar(64) REFERENCES care_taker(email) ON DELETE CASCADE,
	type_name varchar(64) REFERENCES pet_category(type_name) ON DELETE CASCADE,
	CONSTRAINT specialied_for_id PRIMARY KEY (email, type_name)
);

CREATE TABLE part_time_ct (
	email varchar(64) PRIMARY KEY REFERENCES care_taker(email) ON DELETE CASCADE
);

CREATE TABLE full_time_ct (
	email varchar(64) PRIMARY KEY REFERENCES care_taker(email) ON DELETE CASCADE
);

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