var express = require("express")
var router = express.Router()
var db = require("../../includes/db")
var coachesREST = require("./coaches")

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

function getSeason(id) {
  return db.get("season", id)
}
function getSeasons(wheres, values, joins) {
  return db.getMany("season", undefined, wheres, values, joins)
}
function getSeasonsForCoach(coachID) {
  return coachesREST.getCoach(coachID)
    .then((coach) => {
      return getSeasons(["team.coach_id"], [coach.id], ["INNER JOIN team ON team.season_id = season.id"])
    })
}

module.exports = router
module.exports = getSeason
module.exports = getSeasons
module.exports = getSeasonsForCoach
