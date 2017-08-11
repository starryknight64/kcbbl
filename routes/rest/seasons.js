var express = require("express")
var router = express.Router()
var db = require("../../includes/db")
var util = require("../../includes/util")
var coachesREST = require("./coaches")
var teamsREST = require("./teams")
var matchesREST = require("./matches")
var playersREST = require("./players")
var trophiesREST = require("./trophies")

router.get("/", function (req, res) {
  getSeasons()
    .then((seasons) => res.send(seasons))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id", function (req, res) {
  var id = req.params.id
  if (id == "current") {
    id = 3
  }
  getSeason(id)
    .then((season) => res.send(season))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id/teams", function (req, res) {
  var id = req.params.id
  teamsREST.getTeamsForSeason(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id/matches", function (req, res) {
  var id = req.params.id
  var matchTypeID = req.query.matchtype
  matchesREST.getMatchesForSeason(id, matchTypeID)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id/coaches", function (req, res) {
  var id = req.params.id
  coachesREST.getCoachesForSeason(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id/players", function (req, res) {
  var id = req.params.id
  playersREST.getPlayersForSeason(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})


function getSeason(id) {
  return db.get("season", id)
    .then((season) => {
      return new Promise((resolve, reject) => {
        trophiesREST.getTrophy(season.trophy_id).then((trophy) => {
          delete season.trophy_id
          season["trophy"] = trophy
          return resolve(season)
        }).catch(reject)
      })
    })
}
function getSeasons(wheres, values, joins) {
  return db.getMany("season", undefined, wheres, values, joins)
    .then((seasons) => {
      return new Promise((resolve, reject) => {
        trophiesREST.getTrophies().then((trophies) => {
          for (var i in seasons) {
            var trophyID = seasons[i].trophy_id
            for (var j in trophies) {
              if (trophies[j].id == trophyID) {
                delete seasons[i].trophy_id
                seasons[i]["trophy"] = trophies[j]
                break
              }
            }
          }
          return resolve(seasons)
        }).catch(reject)
      })
    })
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
