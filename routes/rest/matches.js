var express = require("express")
var router = express.Router()
var calls = require("./calls")
var util = require("../../includes/util")

router.get("/", function (req, res) {
  calls.getMatches()
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id", function (req, res) {
  var id = req.params.id
  calls.getMatch(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id/players", function (req, res, next) {
  var id = req.params.id
  calls.getMatch(id).then((match) => {
    calls.getPlayersForMatchAndTeam(match.id, match.team1.id).then((team1Players) => {
      calls.getPlayersForMatchAndTeam(match.id, match.team2.id).then((team2Players) => {
        res.send({ "team1_players": team1Players, "team2_players": team2Players })
      })
    })
  }).catch((error) => util.handleRESTError(res, error))
})

module.exports = {
  router: router
}
