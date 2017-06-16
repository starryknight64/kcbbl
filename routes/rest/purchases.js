var express = require("express")
var router = express.Router()
var db = require("../../includes/db")

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

function getPurchase(id) {
  return db.get("purchase", id)
}
function getPurchases(wheres, values, joins) {
  return db.getMany("purchase", ["*"], wheres, values, joins)
}

module.exports = {
  router: router,
  getPurchase: getPurchase,
  getPurchases: getPurchases
}
