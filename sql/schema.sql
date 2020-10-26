DROP TABLE IF EXISTS pet;
DROP TABLE IF EXISTS pet_category;
DROP TABLE IF EXISTS person;

CREATE TABLE person(
	email varchar(64) PRIMARY KEY,
	username varchar(64) NOT NULL,
	password varchar(64) NOT NULL,
	address varchar(64) NOT NULL,
	phone int NOT NULL,
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
