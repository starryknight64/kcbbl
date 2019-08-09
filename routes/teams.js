var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getTeamsUnique().then((teams) => {
    calls.getPlayersForTeam(teams[0].id).then((players) => {
      calls.getSeasonsForTeam(teams[0].id).then((seasons) => {
        calls.getCurrentSeason().then((curSeason) => {
          var promises = []
          for( var i in players ) {
            promises.push(calls.getSkillsForPlayerIDAndPlayerTypeID(players[i].id, players[i].type.id))
          }
          Promise.all(promises).then((skillData) => {
            for( var i in players ) {
              if( skillData[i] ) {
                players[i]["skills"] = skillData[i]
              } else {
                players[i]["skills"] = []
              }
            }
            var renderJSON = {
              "seasons": seasons,
              "teams": teams,
              "curSeason": curSeason,
              "curTeam": teams[0],
              "players": players,
              "stats": getTeamStats(players)
            }
            res.render("teams", renderJSON)
          })
        })
      })
    })
  }).catch(next)
})

router.get("/:teamid/seasons/:seasonid", function (req, res, next) {
  var teamID = req.params.teamid
  var seasonID = req.params.seasonid
  calls.getTeam(teamID).then((team) => {
    calls.getPlayersForTeam(team.id).then((players) => {
      calls.getSeason(seasonID).then((selectedSeason) => {
        calls.getTeamsForSeason(selectedSeason.id).then((teams) => {
          calls.getSeasons().then((seasons) => {
            calls.getCurrentSeason().then((curSeason) => {
              var promises = []
              for( var i in players ) {
                promises.push(calls.getSkillsForPlayerIDAndPlayerTypeID(players[i].id, players[i].type.id))
              }
              Promise.all(promises).then((skillData) => {
                for( var i in players ) {
                  if( skillData[i] ) {
                    players[i]["skills"] = skillData[i]
                  } else {
                    players[i]["skills"] = []
                  }
                }
                var renderJSON = {
                  "seasons": seasons,
                  "teams": teams,
                  "curSeason": curSeason,
                  "curTeam": team,
                  "players": players,
                  "selectedSeason": selectedSeason,
                  "stats": getTeamStats(players)
                }
                res.render("teams", renderJSON)
              })
            })
          })
        })
      })
    })
  }).catch(next)
})


router.get("/:id", function (req, res, next) {
  var id = req.params.id
  calls.getTeam(id).then((team) => {
    calls.getPlayersForTeam(team.id).then((players) => {
      calls.getTeams().then((teams) => {
        calls.getSeasonsForTeam(team.id).then((seasons) => {
          calls.getCurrentSeason().then((curSeason) => {
            var promises = []
            for( var i in players ) {
              promises.push(calls.getSkillsForPlayerIDAndPlayerTypeID(players[i].id, players[i].type.id))
            }
            Promise.all(promises).then((skillData) => {
              for( var i in players ) {
                if( skillData[i] ) {
                  players[i]["skills"] = skillData[i]
                } else {
                  players[i]["skills"] = []
                }
              }
              var renderJSON = {
                "seasons": seasons,
                "teams": teams,
                "curSeason": curSeason,
                "curTeam": team,
                "players": players,
                "stats": getTeamStats(players)
              }
              res.render("teams", renderJSON)
            })
          })
        })
      })
    })
  }).catch(next)
})

function getTeamStats(players) {
  var mostCas = 0
  var mostTDs = 0
  var mostKills = 0
  var mostSPPs = 0

  var mostCasPlayer = null
  var mostTDsPlayer = null
  var mostKillsPlayer = null
  var mostSPPsPlayer = null

  for( var i in players ) {
    if( players[i].casualties > mostCas ) {
      mostCas = players[i].casualties
      mostCasPlayer = players[i]
    }
    if( players[i].touchdowns > mostTDs ) {
      mostTDs = players[i].touchdowns
      mostTDsPlayer = players[i]
    }
    if( players[i].kills > mostKills ) {
      mostKills = players[i].kills
      mostKillsPlayer = players[i]
    }
    if( players[i].spp > mostSPPs ) {
      mostSPPs = players[i].spp
      mostSPPsPlayer = players[i]
    }
  }

  var stats = {
    "mostCas": mostCas,
    "mostCasPlayer": mostCasPlayer,
    "mostTDs": mostTDs,
    "mostTDsPlayer": mostTDsPlayer,
    "mostKills": mostKills,
    "mostKillsPlayer": mostKillsPlayer,
    "mostSPPs": mostSPPs,
    "mostSPPsPlayer": mostSPPsPlayer
  }
  return stats
}

module.exports = router
