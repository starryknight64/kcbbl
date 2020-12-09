var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

function getImprovements(skills) {
  var improvements = { "MV": 0, "ST": 0, "AG": 0, "AV": 0 }
  for (var i in skills) {
    var improvement = skills[i].name.substring(1)
    if (Object.keys(improvements).indexOf(improvement) >= 0) {
      var value = 1
      var plusOrMinus = skills[i].name[0]
      if (plusOrMinus == "-") {
        value = -1
      }
      improvements[improvement] += value
    }
  }
  return improvements
}

router.get("/", function (req, res, next) {
  calls.getPlayers().then((players) => {
    calls.getSkillsForPlayerIDAndPlayerTypeID(players[0].id, players[0].type.id).then((skills) => {
      calls.getSeasonsForPlayer(players[0].id).then((playerSeasons) => {
        calls.getCurrentSeason().then((curSeason) => {
					calls.getTeamsForSeason(players[0].team.season.id).then((curSeasonTeams) => {
						calls.getPlayersForTeam(players[0].team.id).then((curTeamPlayers) => {
							calls.getSeasons().then((seasons) => {
								var improvements = getImprovements(skills)
								curSeasonTeams.sort((a, b) => (a.name > b.name) ? 1 : -1)
								res.render("players", { "curTeamPlayers": curTeamPlayers, "curPlayer": players[0], "curPlayerSkills": skills, "curPlayerSeasons": playerSeasons, "curSeasonTeams": curSeasonTeams, "curSeason": curSeason, "seasons": seasons, "improvements": improvements })
							})
						})
					})
				})
      })
    })
  })
})

router.get("/:id", function (req, res, next) {
  var id = req.params.id
  calls.getPlayer(id).then((player) => {
    calls.getSkillsForPlayerIDAndPlayerTypeID(player.id, player.type.id).then((skills) => {
      calls.getSeasonsForPlayer(player.id).then((playerSeasons) => {
        calls.getCurrentSeason().then((curSeason) => {
					calls.getTeamsForSeason(player.team.season.id).then((curSeasonTeams) => {
						calls.getPlayersForTeam(player.team.id).then((curTeamPlayers) => {
							calls.getSeasons().then((seasons) => {
								var improvements = getImprovements(skills)
								curSeasonTeams.sort((a, b) => (a.name > b.name) ? 1 : -1)
								res.render("players", { "curTeamPlayers": curTeamPlayers, "curPlayer": player, "curPlayerSkills": skills, "curPlayerSeasons": playerSeasons, "curSeasonTeams": curSeasonTeams, "curSeason": curSeason, "seasons": seasons, "improvements": improvements })
							})
						})
					})
        })
      })
    })
  })
})

module.exports = router
