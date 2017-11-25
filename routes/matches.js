var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getMatches().then((matches) => {
    var curMatch = matches[0]
    calls.getPlayersForMatchAndTeam(curMatch.id, curMatch.team1.id).then((team1MatchPlayers) => {
      calls.getPlayersForMatchAndTeam(curMatch.id, curMatch.team2.id).then((team2MatchPlayers) => {
        res.render("matches", { "matches": matches, "curMatch": curMatch, "team1MatchPlayers": team1MatchPlayers, "team2MatchPlayers": team2MatchPlayers })
      })
    })
  })
})

router.get("/:id", function (req, res, next) {
  var id = req.params.id
  calls.getMatch(id).then((curMatch) => {
    calls.getMatches().then((matches) => {
      calls.getPlayersForMatchAndTeam(curMatch.id, curMatch.team1.id).then((team1MatchPlayers) => {
        calls.getPlayersForMatchAndTeam(curMatch.id, curMatch.team2.id).then((team2MatchPlayers) => {
          res.render("matches", { "matches": matches, "curMatch": curMatch, "team1MatchPlayers": team1MatchPlayers, "team2MatchPlayers": team2MatchPlayers })
        })
      })
    })
  })
})

module.exports = router;
