var express = require("express")
var router = express.Router()
var db = require("../../includes/db")

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

function getSkill(id) {
  return db.get("skill", id)
}
function getSkills(wheres, values, joins) {
  return db.getMany("skill", ["*"], wheres, values, joins)
}

module.exports = {
  router: router,
  getSkill: getSkill,
  getSkills: getSkills
}
