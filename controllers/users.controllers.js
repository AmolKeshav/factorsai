/**
 * Controller corresponding to the users
 */

const async = require("async");
const postgres = require("../utils/postgres");
const config = require("../config");
const stringService = require("../services/string.service");

module.exports = {
  addUser: (req, res) => {
    let newUser = req.body.user;

    async.waterfall([
      (callback) => {
        postgres.getAllUsers(callback);
      },
      (users, callback) => {
        console.log("ALL USERS:: ", users.rows)
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
          console.log("MATCHED SCORE ", match_score);
          console.log("MATCHED_ID: ", matched_id);

          newUser.match_score = match_score;
          newUser.matched_id = matched_id;
          postgres.createUser(newUser, callback);
        }
      }
    ], (err, result) => {
      if (err) {
        console.error(err);
        res.status(200).json({
          message: "Something Went Wrong! User cannot be added!"
        });
      } else {
        // console.log("Final Result: ", result)
        res.status(200).json({
          message: "User Added!"
        })
      }
    });
  }
}