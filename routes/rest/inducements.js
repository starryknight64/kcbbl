var express = require("express")
var router = express.Router()
var db = require("../../includes/db")

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

function getInducement(id) {
  return db.get("inducement", id)
}
function getInducements(wheres, values, joins) {
  return db.getMany("inducement", ["*"], wheres, values, joins)
}

module.exports = router
module.exports = getInducement
module.exports = getInducements
