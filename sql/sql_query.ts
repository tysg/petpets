export const sql_query = {
  // TODO: change this to using the Person table
<<<<<<< HEAD
  userpass: "SELECT * FROM person WHERE username=$1",
  add_user:
    "INSERT INTO person (email, username, password, first_name, last_name, address, phone, avatar) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
=======
  userpass: "SELECT email, username, password, avatar_link FROM person WHERE email=$1 LIMIT 1",
  add_user:
    "INSERT INTO person (email, username, password, address, phone, avatar_link) VALUES ($1,$2,$3,$4,$5,$6)",
>>>>>>> master
};

export const pet_query = {
  get_pet: "SELECT * FROM pet WHERE name=$1 AND owner=$2",
  index_owner: "SELECT * FROM pet WHERE owner=$1",
  delete_pet: "DELETE FROM pet WHERE name=$1 AND owner=$2",
  create_pet: "INSERT INTO pet (name, owner, category, requirements, description) VALUES ($1, $2, $3, $4, $5)",
  update_pet: "UPDATE pet SET (name, owner, category, requirements, description) = ($1, $2, $3, $4, $5) WHERE name=$1 AND email=$2"
};


export const credit_card_query = {
  get_credit_card: "SELECT * FROM credit_card WHERE cardNumber=$1 AND cardholder=$2",
  index_cardholder: "SELECT * FROM credit_card WHERE cardholder=$1",
  delete_credit_card: "DELETE FROM credit_card WHERE cardNumber=$1 AND cardholder=$2",
  create_credit_card: "INSERT INTO credit_card (cardNumber, cardholder, expiryDate, securityCode) VALUES ($1, $2, $3, $4)",
  update_credit_card: "UPDATE credit_card SET (cardNumber, cardholder, expiryDate, securityCode) = ($1, $2, $3, $4) WHERE cardNumber=$1 AND cardholder=$2"
}


export default sql_query;
