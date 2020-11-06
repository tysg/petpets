INSERT INTO person VALUES ('jan@gmail.com', 'jan', '$2b$10$yHkpPyW2w/xqIeO4Efi2teHkkG4ZK8p64MWo0M6jJfcjwkNfBjcte', '123 Clementi Rd', '82792172', 'user', 'gravatar.com');
INSERT INTO person VALUES ('p@gmail.com', 'p', '$2b$10$7Fl/H4DxhlQrfHeHAvrQyOXkHDBO5Cmwy9I4lKokJKjHyLORxujcy', '81 pgp Rd', '62353535', 'user');
INSERT INTO person VALUES ( 'admin@email.com', 'Bran Bong', '$2b$10$JUPcABQnf.k8qqW44CHAnuNK4ieRo6YOlZXw/db8ecl6PM/Q3aNEO', 'php', '91231233', 'admin'); 

-- pets
INSERT INTO pet VALUES ('Apple','jan@gmail.com','Cat','allergic to peanuts','a petty pet');
INSERT INTO pet VALUES ('Pear','jan@gmail.com','Dog','allergic to peanuts','a petty pet');
INSERT INTO pet VALUES ('Orange','jan@gmail.com','Cat','allergic to peanuts','a petty pet');
INSERT INTO pet VALUES ('Crab','jan@gmail.com','Dog','allergic to peanuts','a petty pet');
INSERT INTO pet VALUES ('Pear','p@gmail.com','Cat','allergic to peanuts','a petty pet');
INSERT INTO pet VALUES ('Apple','p@gmail.com','Cat','allergic to peanuts','a petty pet');

-- care takers

-- FULL TIME
INSERT INTO person VALUES ('ftct@gmail.com', 'ftct', '$2b$10$7Fl/H4DxhlQrfHeHAvrQyOXkHDBO5Cmwy9I4lKokJKjHyLORxujcy', '81 pgp Rd', '62353535', 'user');
INSERT INTO full_time_ct VALUES ('ftct@gmail.com');
INSERT INTO ft_specializes_in VALUES ('ftct@gmail.com', 'Cat', 2);
INSERT INTO ft_specializes_in VALUES ('ftct@gmail.com', 'Dog', 3);

-- PART TIME
INSERT INTO person VALUES ('ptct@gmail.com', 'ptct', '$2b$10$7Fl/H4DxhlQrfHeHAvrQyOXkHDBO5Cmwy9I4lKokJKjHyLORxujcy', '101 Johor Rd', '81003333', 'user');
INSERT INTO part_time_ct VALUES ('ptct@gmail.com');
INSERT INTO pt_specializes_in VALUES ('ptct@gmail.com', 'Dog', 4);

-- schedules
INSERT INTO pt_free_schedule VALUES ('ptct@gmail.com', '2020-11-05', '2020-11-10');
INSERT INTO ft_leave_schedule VALUES ('ftct@gmail.com', '2020-12-30', '2021-01-05');
-- will throw not enought consecutive working days error
-- INSERT INTO ft_leave_schedule VALUES ('ftct@gmail.com', '2020-09-20', '2021-09-30'); 

-- bids
INSERT INTO bid VALUES('ftct@gmail.com', '20', '2020-10-10', '2020-10-30', 'true', NULL, 'pickup', 'jan@gmail.com', 'Crab', 'Dog', 'confirmed', '');
INSERT INTO bid VALUES('ftct@gmail.com', '50', '2020-10-12', '2020-10-30', 'true', NULL, 'pickup', 'jan@gmail.com', 'Crab', 'Dog', 'confirmed', '');
INSERT INTO bid VALUES('ftct@gmail.com', '69', '2020-10-01', '2020-10-30', 'true', NULL, 'pickup', 'jan@gmail.com', 'Apple', 'Cat', 'confirmed', '');
INSERT INTO bid VALUES('ftct@gmail.com', '69', '2020-08-15', '2020-08-20', 'true', NULL, 'pickup', 'jan@gmail.com', 'Pear', 'Dog', 'confirmed', '');
INSERT INTO bid VALUES('ptct@gmail.com', '69', '2020-09-15', '2020-09-20', 'true', NULL, 'pickup', 'jan@gmail.com', 'Pear', 'Dog', 'confirmed', '');

-- credit cards
-- Postgresql uses the yyyy-mm-dd format
INSERT INTO credit_card
VALUES (
    '1111111111111111',
    'p@gmail.com',
    '2022-12-01',
    023
  );

INSERT INTO credit_card
VALUES (
    '4000400040004000',
    'jan@gmail.com',
    '2025-12-05',
    344
  );

INSERT INTO credit_card
VALUES (
    '7200123456781234',
    'jan@gmail.com',
    '2023-10-05',
    890
  );