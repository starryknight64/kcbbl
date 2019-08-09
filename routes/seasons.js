var express = require("express")
var router = express.Router()
var util = require("../includes/util")
var calls = require("./rest/calls")

/* GET home page. */
router.get("/", function (req, res, next) {
  return calls.getSeasons().then((seasons) => {
    return calls.getCurrentSeason().then((curSeason) => {
      return calls.getWinningTeamForSeason(curSeason.id).then((winningTeam) => {
        return calls.getCoachesForSeason(curSeason.id).then((coaches) => {
          return calls.getTeamsForSeason(curSeason.id).then((teams) => {
            var promises = []
            for( var i in teams ) {
              promises.push(calls.getPlayersForTeam(teams[i].id))
            }
            Promise.all(promises).then((playersData) => {
              for( var i in teams ) {
                if( playersData[i] ) {
                  teams[i]["players"] = playersData[i]
                } else {
                  teams[i]["players"] = []
                }
              }
              var renderJSON = {
                seasons: seasons,
                currentSeason: curSeason,
                selectedSeason: curSeason,
                selectedSeasonWinningTeam: winningTeam,
                selectedSeasonCoaches: coaches,
                selectedSeasonTeams: teams,
                trophyImage: curSeason.trophy.img,
                stats: getSeasonStats(teams)
              }
              res.render("seasons", renderJSON)
            })
          })
        })
      })
    })
  }).catch(next)
})

router.get("/:id", function (req, res, next) {
  var id = req.params.id
  return calls.getSeason(id).then((season) => {
    return calls.getSeasons().then((seasons) => {
      return calls.getCurrentSeason().then((curSeason) => {
        return calls.getPreviousSeason(season.id).then((prevSeason) => {
          return calls.getNextSeason(season.id).then((nextSeason) => {
            return calls.getWinningTeamForSeason(season.id).then((winningTeam) => {
              return calls.getCoachesForSeason(season.id).then((coaches) => {
                return calls.getTeamsForSeason(season.id).then((teams) => {
                  var promises = []
                  for( var i in teams ) {
                    promises.push(calls.getPlayersForTeam(teams[i].id))
                  }
                  Promise.all(promises).then((playersData) => {
                    for( var i in teams ) {
                      if( playersData[i] ) {
                        teams[i]["players"] = playersData[i]
                      } else {
                        teams[i]["players"] = []
                      }
                    }
                    var renderJSON = {
                      seasons: seasons,
                      currentSeason: curSeason,
                      prevSeason: prevSeason,
                      nextSeason: nextSeason,
                      selectedSeason: season,
                      selectedSeasonWinningTeam: winningTeam,
                      selectedSeasonCoaches: coaches,
                      selectedSeasonTeams: teams,
                      trophyImage: season.trophy.img,
                      stats: getSeasonStats(teams)
                    }
                    res.render("seasons", renderJSON)
                  })
                })
              })
            })
          })
        })
      })
    })
  }).catch(next)
})

function getSeasonStats(teams) {
  var mostCas = 0
  var mostTDs = 0
  var mostKills = 0
  var mostSPPs = 0

  var mostCasTeam = null
  var mostTDsTeam = null
  var mostKillsTeam = null
  var mostSPPsTeam = null

  for( var j in teams ) {
    var totalCas = 0
    var totalTDs = 0
    var totalKills = 0
    var totalSPPs = 0

    var players = teams[j].players
    for( var i in players ) {
      totalCas += players[i].casualties
      totalTDs += players[i].touchdowns
      totalKills += players[i].kills
      totalSPPs += players[i].spp
    }

    if( totalCas > mostCas ) {
      mostCas = totalCas
      mostCasTeam = teams[j]
    }
    if( totalTDs > mostTDs ) {
      mostTDs = totalTDs
      mostTDsTeam = teams[j]
    }
    if( totalKills > mostKills ) {
      mostKills = totalKills
      mostKillsTeam = teams[j]
    }
    if( totalSPPs > mostSPPs ) {
      mostSPPs = totalSPPs
      mostSPPsTeam = teams[j]
    }
  }

  var stats = {
    "mostCas": mostCas,
    "mostCasTeam": mostCasTeam,
    "mostTDs": mostTDs,
    "mostTDsTeam": mostTDsTeam,
    "mostKills": mostKills,
    "mostKillsTeam": mostKillsTeam,
    "mostSPPs": mostSPPs,
    "mostSPPsTeam": mostSPPsTeam
  }
  return stats
}

module.exports = router
