var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getPlayers().then((players) => {
    calls.getSkillsForPlayer(players[0].id).then((skills) => {
      res.render("players", { "players": players, "curPlayer": players[0], "curPlayerSkills": skills })
    })
  })
})

router.get("/:id", function (req, res, next) {
  var id = req.params.id
  calls.getPlayer(id).then((player) => {
    calls.getSkillsForPlayer(player.id).then((skills) => {
      calls.getPlayers().then((players) => {

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

        res.render("players", { "players": players, "curPlayer": player, "curPlayerSkills": skills, "improvements": improvements })
      })
    })
  })
})

module.exports = router
