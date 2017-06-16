var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("You searched for '" + req.query.q + "'");
});

module.exports = router;
