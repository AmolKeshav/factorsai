/**
 * Task manager using Bull
 */

const Queue = require("bull");
const async = require("async");
const config = require("../config");
const postgres = require("../utils/postgres");
const stringService = require("../services/string.service");

let similarityCheck = new Queue("similarity check", 'redis://127.0.0.1:6379');

similarityCheck.process((job, done) => {
  let newUser = job.data.user;
  job.progress(42);
  console.log(newUser)
  async.waterfall([
    (callback) => {
      postgres.getAllUsers(callback);
    },
    (users, callback) => {
      if (!users.rows.length) {
        postgres.createUser(newUser, callback);
      } else {
        let keys = config.relevanceKeys;
        let match_score = -1, matched_id = null;
        for (let itr = 0; itr < users.rows.length; itr++) {
          let concatedStringExistingUser = "", concatedStringNewUser = "";
          for (let jtr = 0; jtr < keys.length; jtr++) {
            concatedStringExistingUser += users.rows[itr][keys[jtr]] + " ";
            concatedStringNewUser += newUser[keys[jtr]];
          }
          
          let similarityValue = stringService.similarity(concatedStringExistingUser, concatedStringNewUser);

          if (similarityValue > match_score) { 
            match_score = similarityValue; 
            matched_id = users.rows[itr].user_id; 
          }
        }
        
        newUser.match_score = match_score;
        newUser.matched_id = matched_id;
        postgres.createUser(newUser, callback);
      }
    }
  ], (err, result) => {
    console.log(err, result)
    if (err) {
      console.error(err);
      done({
        message: "Something Went Wrong! User cannot be added!",
        code: "22000"
      });
    } else {
      done({
        message: "User Added!",
        code: "000"
      })
    }
  });
});

module.exports = similarityCheck;