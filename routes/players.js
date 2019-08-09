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
      calls.getSeasonsForPlayer(players[0].id).then((seasons) => {
        calls.getCurrentSeason().then((curSeason) => {
          var improvements = getImprovements(skills)
          res.render("players", { "players": players, "curPlayer": players[0], "curPlayerSkills": skills, "curPlayerSeasons": seasons, "curSeason": curSeason, "improvements": improvements })
        })
      })
    })
  })
})

router.get("/:id", function (req, res, next) {
  var id = req.params.id
  calls.getPlayer(id).then((player) => {
    calls.getSkillsForPlayerIDAndPlayerTypeID(player.id, player.type.id).then((skills) => {
      calls.getSeasonsForPlayer(player.id).then((seasons) => {
        calls.getCurrentSeason().then((curSeason) => {
          calls.getPlayers().then((players) => {
            var improvements = getImprovements(skills)
            res.render("players", { "players": players, "curPlayer": player, "curPlayerSkills": skills, "curPlayerSeasons": seasons, "curSeason": curSeason, "improvements": improvements })
          })
        })
      })
    })
  })
})

module.exports = router
