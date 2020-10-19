const sql_query = {
  // TODO: change this to using the Person table
  userpass: "SELECT * FROM person WHERE username=$1",
  add_user:
    "INSERT INTO person (email, username, password, first_name, last_name, address, phone, avatar) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
};

export default sql_query;
