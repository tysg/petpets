export const user_query = {
  userpass:
    "SELECT email, fullname, password, avatar_link FROM person WHERE email=$1 LIMIT 1",
  add_user:
    "INSERT INTO person (email, fullname, password, address, phone, avatar_link) VALUES ($1,$2,$3,$4,$5,$6)",
};

export const pet_query = {
  get_pet: "SELECT * FROM pet WHERE name=$1 AND owner=$2",
  index_owner: "SELECT * FROM pet WHERE owner=$1",
  delete_pet: "DELETE FROM pet WHERE name=$1 AND owner=$2",
  create_pet:
    "INSERT INTO pet (name, owner, category, requirements, description) VALUES ($1, $2, $3, $4, $5)",
  update_pet:
    "UPDATE pet SET (name, owner, category, requirements, description) = ($1, $2, $3, $4, $5) WHERE name=$1 AND email=$2",
};

export const credit_card_query = {
  get_credit_card:
    "SELECT * FROM credit_card WHERE cardNumber=$1 AND cardholder=$2",
  index_cardholder: "SELECT * FROM credit_card WHERE cardholder=$1",
  delete_credit_card:
    "DELETE FROM credit_card WHERE cardNumber=$1 AND cardholder=$2",
  create_credit_card:
    "INSERT INTO credit_card (cardNumber, cardholder, expiryDate, securityCode) VALUES ($1, $2, $3, $4)",
  update_credit_card:
    "UPDATE credit_card SET (cardNumber, cardholder, expiryDate, securityCode) = ($1, $2, $3, $4) WHERE cardNumber=$1 AND cardholder=$2",
export const sql_query = {
    // TODO: change this to using the Person table
    userpass:
        'SELECT email, username, password, avatar_link FROM person WHERE email=$1 LIMIT 1',
    add_user:
        'INSERT INTO person (email, username, password, address, phone, avatar_link) VALUES ($1,$2,$3,$4,$5,$6)',
};

const CARETAKER_DETAILS = "username, phone, address, email, avatarUrl, caretaker_status";

export const caretaker_query = {
    create_part_time_ct: `
    BEGIN TRANSACTION;
      UPDATE person SET (caretaker_status) VALUES (1);
      INSERT INTO caretaker (email) VALUES ($1);
      INSERT INTO part_time_ct (email) VALUES ($1);
    COMMIT TRANSACTION;
    `,
    create_full_time_ct: `
    BEGIN TRANSACTION;
      UPDATE person SET (caretaker_status) VALUES (2);
      INSERT INTO caretaker (email) VALUES ($1);
      INSERT INTO full_time_ct (email) VALUES ($1);
    COMMIT TRANSACTION;
  `,
    get_caretaker: `SELECT ${CARETAKER_DETAILS} FROM caretaker NATURAL JOIN person WHERE email=$1`,
    index_caretaker: `SELECT ${CARETAKER_DETAILS} FROM caretaker NATURAL JOIN person`,
    search_caretaker: `
    SELECT ${CARETAKER_DETAILS} FROM 
    (SELECT DISTINCT email FROM part_time_ct NATURAL JOIN pt_free_schedule 
      WHERE start_date <= $1 AND end_date >= $1)
    UNION
    (SELECT email from full_time_ct ftct
      WHERE NOT EXISTS (
        SELECT 1 from ft_leave_schedule fts
          WHERE fts.email = ftct.email AND
          start_date <= $1 AND end_date >= $1
      )
      NATURAL JOIN person
    `,
    delete_caretaker: `
   BEGIN TRANSACTION;
    DELETE FROM caretaker where email=$1
    UPDATE person SET (caretaker_status) VALUES (0);
   COMMIT TRANSACTION;
   `
};

export const schedule_query = {
    index_pt_schedule: `SELECT * FROM pt_free_schedule WHERE email = $1`,
    index_ft_schedule: `SELECT * FROM ft_leave_schedule WHERE email = $1`,
    delete_pt_schedule: `DELETE FROM pt_free_schedule WHERE email = $1 AND start_date=$2 AND end_date=$3`,
    delete_ft_schedule: `DELETE FROM ft_leave_schedule WHERE email = $1 AND start_date=$2 AND end_date=$3`,
    create_pt_schedule: `INSERT INTO pt_free_schedule VALUES ($1, $2, $3)`,
    create_ft_schedule: `INSERT INTO ft_leave_schedule VALUES ($1, $2, $3)`
};

export default { user_query, pet_query, credit_card_query };
