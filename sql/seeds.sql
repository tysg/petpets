INSERT INTO pet_category VALUES ('dog', 4);
INSERT INTO pet_category VALUES ('cat', 5);
INSERT INTO person VALUES ('jan@gmail.com', 'jan', '$2b$10$yHkpPyW2w/xqIeO4Efi2teHkkG4ZK8p64MWo0M6jJfcjwkNfBjcte', '123 Clementi Rd', '82792172', 'user', 'gravatar.com');
INSERT INTO person VALUES ('p@gmail.com', 'p', '$2b$10$7Fl/H4DxhlQrfHeHAvrQyOXkHDBO5Cmwy9I4lKokJKjHyLORxujcy', '81 pgp Rd', '62353535', 'user');
INSERT INTO person VALUES ( 'admin@email.com', 'Bran Bong', '$2b$10$JUPcABQnf.k8qqW44CHAnuNK4ieRo6YOlZXw/db8ecl6PM/Q3aNEO', 'php', '91231233', 'admin'); 
-- care takers

-- FULL TIME
INSERT INTO person VALUES ('ftct@gmail.com', 'ftct', '$2b$10$7Fl/H4DxhlQrfHeHAvrQyOXkHDBO5Cmwy9I4lKokJKjHyLORxujcy', '81 pgp Rd', '62353535', 'user');
INSERT INTO full_time_ct VALUES ('ftct@gmail.com');
INSERT INTO specializes_in VALUES ('ftct@gmail.com', 'cat');
INSERT INTO specializes_in VALUES ('ftct@gmail.com', 'dog');

-- PART TIME
INSERT INTO person VALUES ('ptct@gmail.com', 'ptct', '$2b$10$7Fl/H4DxhlQrfHeHAvrQyOXkHDBO5Cmwy9I4lKokJKjHyLORxujcy', '101 Johor Rd', '81003333', '');
INSERT INTO part_time_ct VALUES ('ptct@gmail.com');
INSERT INTO specializes_in VALUES ('ptct@gmail.com', 'dog');

-- schedules
INSERT INTO pt_free_schedule VALUES ('ptct@gmail.com', '2020-11-05', '2020-11-10');
INSERT INTO ft_leave_schedule VALUES ('ftct@gmail.com', '2020-11-07', '2020-11-10');

-- credit cards
-- Postgresql uses the yyyy-mm-dd format
INSERT INTO credit_card
VALUES (
    '1111111111111111',
    'p@gmail.com',
    '2022-12-01',
    023
  );