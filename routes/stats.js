var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getTeams().then((teams) => {
    calls.getTeamsUnique().then((teamsUnique) => {
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

          // for (var j in teamsUnique) {
          //   if (teams[i].id == teamsUnique[j].id) {
          //     teamsUnique[j]["players"] = teams[i]["players"]
          //   }
          // }
        }

        res.render("stats", { stats: getStats(teams, teamsUnique) })
      })
    })
  })
})

function getStats(teams, teamsUnique) {
  var teamsMostTDs = 0
  var teamsMostCmp = 0
  var teamsMostInt = 0
  var teamsMostCas = 0
  var teamsMostKills = 0

  var teamsMostTDsTeam = null
  var teamsMostCmpTeam = null
  var teamsMostIntTeam = null
  var teamsMostCasTeam = null
  var teamsMostKillsTeam = null

  var playersMostTDs = 0
  var playersMostCmp = 0
  var playersMostInt = 0
  var playersMostCas = 0
  var playersMostKills = 0

  var playersMostTDsPlayer = null
  var playersMostCmpPlayer = null
  var playersMostIntPlayer = null
  var playersMostCasPlayer = null
  var playersMostKillsPlayer = null

  var coachesMostTDs = 0
  var coachesMostCmp = 0
  var coachesMostInt = 0
  var coachesMostCas = 0
  var coachesMostKills = 0

  var coachesMostTDsCoach = null
  var coachesMostCmpCoach = null
  var coachesMostIntCoach = null
  var coachesMostCasCoach = null
  var coachesMostKillsCoach = null

  var coachTotals = {}

  for (var j in teams) {
    var team = teams[j]

    // TEAMS and COACHES
    var totalTeamTDs = 0
    var totalTeamCmp = 0
    var totalTeamInt = 0
    var totalTeamCas = 0
    var totalTeamKills = 0
    for (var i in team.players) {
      var player = team.players[i]
      totalTeamTDs += player.touchdowns
      totalTeamCmp += player.completions
      totalTeamInt += player.interceptions
      totalTeamCas += player.casualties
      totalTeamKills += player.kills
    }
    if (totalTeamTDs > teamsMostTDs) {
      teamsMostTDs = totalTeamTDs
      teamsMostTDsTeam = team
    }
    if (totalTeamCmp > teamsMostCmp) {
      teamsMostCmp = totalTeamCmp
      teamsMostCmpTeam = team
    }
    if (totalTeamInt > teamsMostInt) {
      teamsMostInt = totalTeamInt
      teamsMostIntTeam = team
    }
    if (totalTeamCas > teamsMostCas) {
      teamsMostCas = totalTeamCas
      teamsMostCasTeam = team
    }
    if (totalTeamKills > teamsMostKills) {
      teamsMostKills = totalTeamKills
      teamsMostKillsTeam = team
    }

    // PLAYERS
    for (var i in team.players) {
      var player = team.players[i]
      if (player.touchdowns > playersMostTDs) {
        playersMostTDs = player.touchdowns
        playersMostTDsPlayer = player
      }
      if (player.completions > playersMostCmp) {
        playersMostCmp = player.completions
        playersMostCmpPlayer = player
      }
      if (player.interceptions > playersMostInt) {
        playersMostInt = player.interceptions
        playersMostIntPlayer = player
      }
      if (player.casualties > playersMostCas) {
        playersMostCas = player.casualties
        playersMostCasPlayer = player
      }
      if (player.kills > playersMostKills) {
        playersMostKills = player.kills
        playersMostKillsPlayer = player
      }
    }

    // COACHES
    for (var i in teamsUnique) {
      var teamUnique = teamsUnique[i]
      if (teamUnique.id == team.id) {
        if (!coachTotals.hasOwnProperty(teamUnique.coach.id)) {
          coachTotals[teamUnique.coach.id] = {
            coach: teamUnique.coach,
            tds: 0,
            cmp: 0,
            int: 0,
            cas: 0,
            kills: 0
          }
        }
        coachTotals[teamUnique.coach.id].tds += totalTeamTDs
        coachTotals[teamUnique.coach.id].cmp += totalTeamCmp
        coachTotals[teamUnique.coach.id].int += totalTeamInt
        coachTotals[teamUnique.coach.id].cas += totalTeamCas
        coachTotals[teamUnique.coach.id].kills += totalTeamKills
        break
      }
    }
  }

  for (var coachID in coachTotals) {
    var coachTotal = coachTotals[coachID]
    if (coachTotal.tds > coachesMostTDs) {
      coachesMostTDs = coachTotal.tds
      coachesMostTDsCoach = coachTotal.coach
    }
    if (coachTotal.cmp > coachesMostCmp) {
      coachesMostCmp = coachTotal.cmp
      coachesMostCmpCoach = coachTotal.coach
    }
    if (coachTotal.int > coachesMostInt) {
      coachesMostInt = coachTotal.int
      coachesMostIntCoach = coachTotal.coach
    }
    if (coachTotal.cas > coachesMostCas) {
      coachesMostCas = coachTotal.cas
      coachesMostCasCoach = coachTotal.coach
    }
    if (coachTotal.kills > coachesMostKills) {
      coachesMostKills = coachTotal.kills
      coachesMostKillsCoach = coachTotal.coach
    }
  }

  var stats = {
    teamsMostTDs: teamsMostTDs,
    teamsMostCmp: teamsMostCmp,
    teamsMostInt: teamsMostInt,
    teamsMostCas: teamsMostCas,
    teamsMostKills: teamsMostKills,
    teamsMostTDsTeam: teamsMostTDsTeam,
    teamsMostCmpTeam: teamsMostCmpTeam,
    teamsMostIntTeam: teamsMostIntTeam,
    teamsMostCasTeam: teamsMostCasTeam,
    teamsMostKillsTeam: teamsMostKillsTeam,
    playersMostTDs: playersMostTDs,
    playersMostCmp: playersMostCmp,
    playersMostInt: playersMostInt,
    playersMostCas: playersMostCas,
    playersMostKills: playersMostKills,
    playersMostTDsPlayer: playersMostTDsPlayer,
    playersMostCmpPlayer: playersMostCmpPlayer,
    playersMostIntPlayer: playersMostIntPlayer,
    playersMostCasPlayer: playersMostCasPlayer,
    playersMostKillsPlayer: playersMostKillsPlayer,
    coachesMostTDs: coachesMostTDs,
    coachesMostCmp: coachesMostCmp,
    coachesMostInt: coachesMostInt,
    coachesMostCas: coachesMostCas,
    coachesMostKills: coachesMostKills,
    coachesMostTDsCoach: coachesMostTDsCoach,
    coachesMostCmpCoach: coachesMostCmpCoach,
    coachesMostIntCoach: coachesMostIntCoach,
    coachesMostCasCoach: coachesMostCasCoach,
    coachesMostKillsCoach: coachesMostKillsCoach
  }
  return stats
}

module.exports = router
