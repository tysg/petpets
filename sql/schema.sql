DROP TABLE IF EXISTS person;
CREATE TABLE person(
	email varchar(64) PRIMARY KEY,
	username varchar(64) NOT NULL,
	password varchar(64) NOT NULL,
	address varchar(64) NOT NULL,
	phone int NOT NULL,
	avatar_link varchar NOT NULL
);

DROP TABLE IF EXISTS pet_cateogry;
CREATE TABLE pet_cateogry(
	category int PRIMARY KEY,
	type varchar(64) NOT NULL,
	base_daily_price int NOT NULL
);

DROP TABLE IF EXISTS pet;
CREATE TABLE pet(
	name varchar(64),
	owner varchar(64) REFERENCES person,
	requirements text NOT NULL,
	remarks text NOT NULL,
	category REFERENCES pet_cateogry,
	CONSTRAINT pet_id PRIMARY KEY (name, owner)
);
