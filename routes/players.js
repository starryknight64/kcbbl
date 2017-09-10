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
        res.render("players", { "players": players, "curPlayer": player, "curPlayerSkills": skills })
      })
    })
  })
})

module.exports = router
