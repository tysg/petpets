export const sql_query = {
  // TODO: change this to using the Person table
  userpass: "SELECT * FROM person WHERE username=$1",
  add_user:
    "INSERT INTO person (email, username, password, address, phone, avatar_link) VALUES ($1,$2,$3,$4,$5,$6)",
};

export const pet_query = {
  get_pet: "SELECT * FROM pet WHERE name=$1 AND owner=$2",
  delete_pet: "DELETE * FROM pet WHERE name=$1 AND owner=$2",
  create_pet: "INSERT INTO pet (name, owner, requirements, remarks) VALUES ($1, $2, $3, $4)",
  update_pet: "UPDATE pet SET (name, owner, requirements, remarks) = ($1, $2, $3, $4) WHERE name=$1 AND email=$2"
}

export default sql_query;
