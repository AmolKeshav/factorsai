/**
 * Controller corresponding to the users
 */

const async = require("async");
const postgres = require("../utils/postgres");
const config = require("../config");
const stringService = require("../services/string.service");
const similarityCheck = require("../utils/taskmanage");

module.exports = {
  addUser: (req, res) => {
    let newUser = req.body.user;

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
      if (err) {
        console.error(err);
        res.status(200).json({
          message: "Something Went Wrong! User cannot be added!"
        });
      } else {
        res.status(200).json({
          message: "User Added!"
        })
      }
    });
  },

  addUser_taskmng: (req, res) => {
    similarityCheck.add({
      "user": {
        "first_name": "Amol",
        "last_name": "Kesha",
        "email": "amolkeshavsinha@gmail.com",
        "city": "New Del",
        "browser": "Chroa",
        "device": "MacOS"
      }
    }, (err, response) => {
      console.log(err);
      console.log(response);

      res.status(200).json({});
    });
  }
}