/**
 * We connect with PostGres here
 */

const { Client, Pool } = require("pg");
const connectionString = 'postgressql://amolkeshav:postgrespsswd@localhost:5432/factorsaidb';

const client = new Client({
  connectionString: connectionString
});
client.connect();

client.query('SELECT * FROM users', (err, res) => {
  if (err) {
    console.error(err);
  }
  console.log(res);
  client.end();
});