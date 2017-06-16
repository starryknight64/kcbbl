var express = require("express")
var router = express.Router()
var db = require("../../includes/db")

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

function getPlayerType(id) {
  return db.get("player_type", id)
}
function getPlayerTypes(wheres, values, joins) {
  return db.getMany("player_type", ["*"], wheres, values, joins)
}

module.exports = router
module.exports = getPlayerType
module.exports = getPlayerTypes
