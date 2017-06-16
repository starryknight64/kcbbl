var express = require("express")
var router = express.Router()
var db = require("../../includes/db")
var seasonsREST = require("./seasons")

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

function getCoach(id) {
  return db.get("coach", id, ["coach.id", "coach.name"])
}
function getCoaches(wheres, values, joins) {
  return db.getMany("coach", ["coach.id", "coach.name"], wheres, values, joins)
}
function getCoachesForSeason(seasonID) {
  return seasonsREST.getSeason(seasonID)
    .then((season) => {
      return getCoaches(["team.season_id"], [season.id], ["INNER JOIN team ON team.coach_id = coach.id"])
    })
}

module.exports = {
  router: router,
  getCoach: getCoach,
  getCoaches: getCoaches,
  getCoachesForSeason: getCoachesForSeason
}
