var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getCoaches().then((coaches) => {
    calls.getSeasonsForCoach(coaches[0].id).then((seasons) => {
      calls.getTeamsForCoach(coaches[0].id).then((teams) => {
        var promises = []
        for (var i in teams) {
          promises.push(calls.getPlayersForTeam(teams[i].id))
        }
        Promise.all(promises).then((playersData) => {
          for (var i in teams) {
            if (playersData[i]) {
              teams[i]["players"] = playersData[i]
            } else {
              teams[i]["players"] = []
            }
          }
          var renderJSON = {
            "coaches": coaches,
            "curCoach": coaches[0],
            "teams": teams,
            "seasons": seasons,
            "stats": getCoachStats(teams)
          }

          res.render("coaches", renderJSON)
        })
      })
    })
  })
})


router.get("/:id", function (req, res, next) {
  var id = req.params.id
  calls.getCoach(id).then((coach) => {
    calls.getTeamsForCoach(coach.id).then((teams) => {
      calls.getSeasonsForCoach(coach.id).then((seasons) => {
        calls.getCoaches().then((coaches) => {
          var promises = []
          for (var i in teams) {
            promises.push(calls.getPlayersForTeam(teams[i].id))
          }
          Promise.all(promises).then((playersData) => {
            for (var i in teams) {
              if (playersData[i]) {
                teams[i]["players"] = playersData[i]
              } else {
                teams[i]["players"] = []
              }
            }
            var renderJSON = {
              "coaches": coaches,
              "curCoach": coach,
              "teams": teams,
              "seasons": seasons,
              "stats": getCoachStats(teams)
            }
            res.render("coaches", renderJSON)
          })
        })
      })
    })
  })
})


function getCoachStats(teams) {
  var mostCas = 0
  var mostTDs = 0
  var mostKills = 0
  var mostSPPs = 0

  var mostCasTeam = null
  var mostTDsTeam = null
  var mostKillsTeam = null
  var mostSPPsTeam = null

  for (var j in teams) {
    var totalCas = 0
    var totalTDs = 0
    var totalKills = 0
    var totalSPPs = 0

    var players = teams[j].players
    for (var i in players) {
      totalCas += players[i].casualties
      totalTDs += players[i].touchdowns
      totalKills += players[i].kills
      totalSPPs += players[i].spp
    }

    if (totalCas > mostCas) {
      mostCas = totalCas
      mostCasTeam = teams[j]
    }
    if (totalTDs > mostTDs) {
      mostTDs = totalTDs
      mostTDsTeam = teams[j]
    }
    if (totalKills > mostKills) {
      mostKills = totalKills
      mostKillsTeam = teams[j]
    }
    if (totalSPPs > mostSPPs) {
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
