/**
 * Aggregates all routes
 */

const UserRoutes = require("./users.routes");
const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  console.log("New api request arrived at: ", new Date().toISOString());
  next();
})
router.use('/users', UserRoutes);

module.exports = router;