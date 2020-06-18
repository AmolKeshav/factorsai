/**
 * We connect with PostGres here
 */

const { Client, Pool } = require("pg");
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: process.env.DATABASE_USER,
  database: 'factorsaidb',
  password: process.env.DATABASE_PWD
})

const getAllUsers = (callback) => {
  pool.query("SELECT * FROM users", (err, results) => {
    callback(err, results);
  })
};

const createUser = (userObject, callback) => {
  pool.query("INSERT INTO users (first_name, last_name, email, city, browser, device, match_score, matched_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [
    userObject.first_name,
    userObject.last_name,
    userObject.email,
    userObject.city,
    userObject.browser,
    userObject.device,
    userObject.match_score ? userObject.match_score : "1",
    (userObject.matched_id) ? userObject.matched_id : "self"
  ], (err, results) => {
    callback(err, results);
  });
}

module.exports = {
  getAllUsers,
  createUser
}