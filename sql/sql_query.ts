export const sql_query = {
  // TODO: change this to using the Person table
  userpass: "SELECT email, username, password, avatar_link FROM person WHERE email=$1 LIMIT 1",
  add_user:
    "INSERT INTO person (email, username, password, address, phone, avatar_link) VALUES ($1,$2,$3,$4,$5,$6)",
};

export const pet_query = {
  get_pet: "SELECT * FROM pet WHERE name=$1 AND owner=$2",
  index_owner: "SELECT * FROM pet WHERE owner=$1",
  delete_pet: "DELETE * FROM pet WHERE name=$1 AND owner=$2",
  create_pet: "INSERT INTO pet (name, owner, category, requirements, description) VALUES ($1, $2, $3, $4, $5)",
  update_pet: "UPDATE pet SET (name, owner, category, requirements, description) = ($1, $2, $3, $4, $5) WHERE name=$1 AND email=$2"
};

export default sql_query;
