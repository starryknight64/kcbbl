var express = require("express")
var router = express.Router()
var db = require("../../includes/db")

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

function getMatchType(id) {
  return db.get("match_type", id)
}
function getMatchTypes(wheres, values, joins) {
  return db.getMany("match_type", ["*"], wheres, values, joins)
}

module.exports = router
module.exports = getMatchType
module.exports = getMatchTypes