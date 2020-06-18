/**
 * Defining the route for graph data-structure
 */

const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");

router.use((req, res, next) => {
  console.log("Request to users routes arrived at: ", new Date().toISOString());
  next();
});

router.post("/addUser", Controllers.UserController.addUser);
router.post("/submitUser", Controllers.UserController.submitUser);

module.exports = router;
