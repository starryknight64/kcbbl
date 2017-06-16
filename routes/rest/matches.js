var express = require("express")
var router = express.Router()
var db = require("../../includes/db")
var seasonsREST = require("./seasons")
var coachesREST = require("./coaches")
var matchTypesREST = require("./matchTypes")
var teamsREST = require("./teams")

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

function getMatch(id) {
  return db.get("match", id)
}
function getMatches(wheres, values, joins) {
  return db.getMany("match", ["*"], wheres, values, joins)
}
function getMatchesForSeason(seasonID, matchTypeID) {
  return seasonsREST.getSeason(seasonID).then((season) => {
    wheres = ["season_id"]
    values = [season.id]

    return new Promise((resolve, reject) => {
      if (matchTypeID !== undefined) {
        return matchTypesREST.getMatchType(matchTypeID)
          .then((matchType) => {
            wheres.push("match_type_id")
            values.push(matchType.id)
            return resolve(matchType)
          }).catch(reject)
      }
      return resolve(null)
    }).then((matchType) => {
      return getMatches(wheres, values)
    })
  })
}
function getMatchesForCoach(coachID, seasonID, teamID, matchTypeID) {
  return coachesREST.getCoach(coachID).then((coach) => {
    wheres = ["team.coach_id"]
    values = [coach.id]
    joins = ["INNER JOIN team ON (team.id = match.team1_id OR team.id = match.team2_id)"]

    return new Promise((resolve, reject) => {
      if (seasonID !== undefined) {
        return seasonsREST.getSeason(seasonID)
          .then((season) => {
            wheres.push("match.season_id")
            values.push(season.id)
            return resolve(season)
          }).catch(reject)
      }
      return resolve(null)
    }).then((season) => {
      if (teamID !== undefined) {
        return teamsREST.getTeam(teamID)
          .then((team) => {
            wheres.push("team.id")
            values.push(team.id)
            return resolve(team)
          }).catch(reject)
      }
      return resolve(null)
    }).then((team) => {
      if (matchTypeID !== undefined) {
        return matchTypesREST.getMatchType(matchTypeID)
          .then((matchType) => {
            wheres.push("match.match_type_id")
            values.push(matchType.id)
            return resolve(matchType)
          }).catch(reject)
      }
      return resolve(null)
    }).then((matchType) => {
      return getMatches(wheres, values, joins)
    })
  })
}

module.exports = {
  router: router,
  getMatch: getMatch,
  getMatches: getMatches,
  getMatchesForCoach: getMatchesForCoach,
  getMatchesForSeason: getMatchesForSeason
}
