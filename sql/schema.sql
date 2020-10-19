DROP TABLE IF EXISTS person;

CREATE TABLE person(
	email       varchar(64) PRIMARY KEY,
	username    varchar(64) NOT NULL,
	password    varchar(64) NOT NULL,
	first_name  varchar(64) NOT NULL,
	last_name   varchar(64) NOT NULL,
	address     varchar(64) NOT NULL,
	phone       int         NOT NULL,
	avatar_link varchar(64) NOT NULL
);
