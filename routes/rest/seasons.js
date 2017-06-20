var express = require("express")
var router = express.Router()
var db = require("../../includes/db")
var util = require("../../includes/util")
var coachesREST = require("./coaches")
var teamsREST = require("./teams")
var matchesREST = require("./matches")
var playersREST = require("./players")

router.get("/", function (req, res) {
  getSeasons()
    .then((obj) => res.send(obj))
    .catch((error) => util.handleError(res, error))
})

router.get("/:id", function (req, res) {
  var id = req.params.id
  if (id == "current") {
    id = 2
  }
  getSeason(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleError(res, error))
})

router.get("/:id/teams", function (req, res) {
  var id = req.params.id
  teamsREST.getTeamsForSeason(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleError(res, error))
})

router.get("/:id/matches", function (req, res) {
  var id = req.params.id
  var matchTypeID = req.query.matchtype
  matchesREST.getMatchesForSeason(id, matchTypeID)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleError(res, error))
})

router.get("/:id/coaches", function (req, res) {
  var id = req.params.id
  coachesREST.getCoachesForSeason(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleError(res, error))
})

router.get("/:id/players", function (req, res) {
  var id = req.params.id
  playersREST.getPlayersForSeason(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleError(res, error))
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

module.exports = {
  router: router,
  getSeason: getSeason,
  getSeasons: getSeasons,
  getSeasonsForCoach: getSeasonsForCoach
}
