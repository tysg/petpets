INSERT INTO person VALUES ('jan@gmail.com', 'jan', '$2b$10$yHkpPyW2w/xqIeO4Efi2teHkkG4ZK8p64MWo0M6jJfcjwkNfBjcte', '123 Clementi Rd', '82792172', 'user', 'gravatar.com');
INSERT INTO person VALUES ('p@gmail.com', 'p', '$2b$10$7Fl/H4DxhlQrfHeHAvrQyOXkHDBO5Cmwy9I4lKokJKjHyLORxujcy', '81 pgp Rd', '62353535', 'user');
INSERT INTO person VALUES ( 'admin@email.com', 'Bran Bong', '$2b$10$JUPcABQnf.k8qqW44CHAnuNK4ieRo6YOlZXw/db8ecl6PM/Q3aNEO', 'php', '91231233', 'admin'); 

-- pet categories
INSERT INTO pet_category values ('Cat', 29);
INSERT INTO pet_category values ('Dog', 28);
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
INSERT INTO ft_specializes_in VALUES ('ftct@gmail.com', 'Dog', 129);

-- PART TIME
INSERT INTO person VALUES ('ptct@gmail.com', 'ptct', '$2b$10$7Fl/H4DxhlQrfHeHAvrQyOXkHDBO5Cmwy9I4lKokJKjHyLORxujcy', '101 Johor Rd', '81003333', 'user');
INSERT INTO part_time_ct VALUES ('ptct@gmail.com');
INSERT INTO pt_specializes_in VALUES ('ptct@gmail.com', 'Dog', 4);

INSERT INTO person VALUES ('ptct2@gmail.com', 'ptct2', '$2b$10$7Fl/H4DxhlQrfHeHAvrQyOXkHDBO5Cmwy9I4lKokJKjHyLORxujcy', '101 Johor Rd', '81003333', 'user');
INSERT INTO part_time_ct VALUES ('ptct2@gmail.com');
INSERT INTO pt_specializes_in VALUES ('ptct2@gmail.com', 'Cat', 10);
INSERT INTO pt_specializes_in VALUES ('ptct2@gmail.com', 'Dog', 4);

-- schedules
INSERT INTO pt_free_schedule VALUES ('ptct@gmail.com', '2020-05-05', '2020-12-10');
INSERT INTO ft_leave_schedule VALUES ('ftct@gmail.com', '2020-10-27', '2020-10-28');
INSERT INTO ft_leave_schedule VALUES ('ftct@gmail.com', '2021-05-31', '2021-06-01');
INSERT INTO ft_leave_schedule VALUES ('ftct@gmail.com', '2021-10-30', '2021-10-31');
-- INSERT INTO ft_leave_schedule VALUES ('ftct@gmail.com', '2020-05-22', '2020-05-23'); 

-- bids

INSERT INTO bid VALUES('ftct@gmail.com', '50', '2020-09-10', '2020-09-30', 'true', NULL, 'pickup', 'jan@gmail.com', 'Crab', 'confirmed', '');
INSERT INTO bid VALUES('ftct@gmail.com', '69', '2020-09-10', '2020-09-30', 'true', NULL, 'pickup', 'jan@gmail.com', 'Apple', 'confirmed', '');
INSERT INTO bid VALUES('ptct@gmail.com', '69', '2020-09-10', '2020-09-30', 'true', NULL, 'pickup', 'jan@gmail.com', 'Pear', 'submitted', '');
INSERT INTO bid VALUES('ptct@gmail.com', '69', '2020-10-10', '2020-10-30', 'true', NULL, 'pickup', 'jan@gmail.com', 'Pear', 'submitted', '');
INSERT INTO bid VALUES('ftct@gmail.com', '69', '2020-09-10', '2020-09-30', 'true', NULL, 'pickup', 'jan@gmail.com', 'Pear', 'confirmed', '');
-- INSERT INTO bid VALUES('ftct@gmail.com', '69', '2020-09-10', '2020-09-30', 'true', NULL, 'pickup', 'Brandt_Metz10@yahoo.com', 'Jailyn', 'confirmed', '');
-- INSERT INTO bid VALUES('ptct@gmail.com', '69', '2020-09-10', '2020-09-30', 'true', NULL, 'pickup', 'Cristobal33@yahoo.com', 'Einar', 'confirmed', '');
-- -- INSERT INTO bid VALUES('ftct@gmail.com', '69', '2020-09-10', '2020-09-30', 'true', NULL, 'pickup', 'Cristobal33@yahoo.com', 'Einar', 'confirmed', '');
-- INSERT INTO bid VALUES('ptct@gmail.com', '69', '2020-09-10', '2020-09-30', 'true', NULL, 'pickup', 'Kattie75@hotmail.com', 'Jermaine', 'confirmed', '');
-- INSERT INTO bid VALUES('ptct2@gmail.com', '69', '2020-09-05', '2020-09-09', 'true', NULL, 'pickup', 'Kattie75@hotmail.com', 'Jermaine', 'confirmed', '');

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