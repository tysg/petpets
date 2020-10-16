DROP TABLE IF EXISTS person;

CREATE TABLE person(
	email varchar(64)  PRIMARY KEY,
	password   varchar(64) NOT NULL,
	first_name varchar(64) NOT NULL,
	last_name  varchar(64) NOT NULL
);
