const sql_query = {
  // TODO: change this to using the Person table
  userpass: "SELECT * FROM users WHERE username=$1",
  add_user: 'INSERT INTO person (email, password, first_name, last_name) VALUES ($1,$2,$3,$4)',
};

export default sql_query;
