var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")


router.get("/", function (req, res, next) {
  calls.getStarPlayers().then((starPlayers) => {
    res.render("starplayers", { "starPlayers": starPlayers, "curStarPlayer": starPlayers[0] })
  })
})

router.get("/:id", function (req, res, next) {
  var id = req.params.id
  calls.getPlayerType(id).then((starPlayer) => {
    calls.getStarPlayers().then((starPlayers) => {
      var curStarPlayer = starPlayers[0]
      for (var i in starPlayers) {
        if (starPlayers[i].name == starPlayer.name) {
          curStarPlayer = starPlayers[i]
          break
        }
      }
      res.render("starplayers", { "starPlayers": starPlayers, "curStarPlayer": curStarPlayer })
    })
  })
})

module.exports = router
