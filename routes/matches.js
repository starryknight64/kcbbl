var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")
var util = require("../includes/util")

router.get("/", function (req, res, next) {
  calls.getMatches().then((matches) => {
    var curMatch = matches[0]
    calls.getPlayersForMatchAndTeam(curMatch.id, curMatch.team1.id).then((team1MatchPlayers) => {
      calls.getPlayersForMatchAndTeam(curMatch.id, curMatch.team2.id).then((team2MatchPlayers) => {
        curMatch.team1_tv = util.formatNumberWithCommas(curMatch.team1_tv)
        curMatch.team2_tv = util.formatNumberWithCommas(curMatch.team2_tv)
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
          curMatch.team1_tv = util.formatNumberWithCommas(curMatch.team1_tv)
          curMatch.team2_tv = util.formatNumberWithCommas(curMatch.team2_tv)
          res.render("matches", { "matches": matches, "curMatch": curMatch, "team1MatchPlayers": team1MatchPlayers, "team2MatchPlayers": team2MatchPlayers })
        })
      })
    })
  })
})

module.exports = router;
