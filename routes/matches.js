var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")
var util = require("../includes/util")

router.get("/", function (req, res, next) {
  calls.getMatches().then((matches) => {
    var curMatch = matches[0]
    calls.getPlayersForMatchAndTeam(curMatch.id, curMatch.team1.id).then((team1MatchPlayers) => {
      calls.getPlayersForMatchAndTeam(curMatch.id, curMatch.team2.id).then((team2MatchPlayers) => {
        calls.getInducementsForMatchAndTeam(curMatch.id, curMatch.team1.id).then((team1Inducements) => {
          calls.getInducementsForMatchAndTeam(curMatch.id, curMatch.team2.id).then((team2Inducements) => {
            calls.getPurchasesForMatchAndTeam(curMatch.id, curMatch.team1.id).then((team1Purchases) => {
              calls.getPurchasesForMatchAndTeam(curMatch.id, curMatch.team2.id).then((team2Purchases) => {
                curMatch.team1_inducements_value = 0
                curMatch.team2_inducements_value = 0
                if (curMatch.team1_tv < curMatch.team2_tv) {
                  curMatch.team1_inducements_value = curMatch.team2_tv - curMatch.team1_tv + curMatch.team1_petty_cash
                } else if (curMatch.team2_tv < curMatch.team1_tv) {
                  curMatch.team2_inducements_value = curMatch.team1_tv - curMatch.team2_tv + curMatch.team2_petty_cash
                }
                curMatch.team1_tv = util.formatNumberWithCommas(curMatch.team1_tv)
                curMatch.team2_tv = util.formatNumberWithCommas(curMatch.team2_tv)
                res.render("matches", { "matches": matches, "curMatch": curMatch, "team1MatchPlayers": team1MatchPlayers, "team2MatchPlayers": team2MatchPlayers, "team1Inducements": team1Inducements, "team2Inducements": team2Inducements, "team1Purchases": team1Purchases, "team2Purchases": team2Purchases })
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
  calls.getMatch(id).then((curMatch) => {
    calls.getMatches().then((matches) => {
      calls.getPlayersForMatchAndTeam(curMatch.id, curMatch.team1.id).then((team1MatchPlayers) => {
        calls.getPlayersForMatchAndTeam(curMatch.id, curMatch.team2.id).then((team2MatchPlayers) => {
          calls.getInducementsForMatchAndTeam(curMatch.id, curMatch.team1.id).then((team1Inducements) => {
            calls.getInducementsForMatchAndTeam(curMatch.id, curMatch.team2.id).then((team2Inducements) => {
              calls.getPurchasesForMatchAndTeam(curMatch.id, curMatch.team1.id).then((team1Purchases) => {
                calls.getPurchasesForMatchAndTeam(curMatch.id, curMatch.team2.id).then((team2Purchases) => {
                  curMatch.team1_inducements_value = 0
                  curMatch.team2_inducements_value = 0
                  if (curMatch.team1_tv < curMatch.team2_tv) {
                    curMatch.team1_inducements_value = curMatch.team2_tv - curMatch.team1_tv + curMatch.team1_petty_cash
                  } else if (curMatch.team2_tv < curMatch.team1_tv) {
                    curMatch.team2_inducements_value = curMatch.team1_tv - curMatch.team2_tv + curMatch.team2_petty_cash
                  }
                  curMatch.team1_tv = util.formatNumberWithCommas(curMatch.team1_tv)
                  curMatch.team2_tv = util.formatNumberWithCommas(curMatch.team2_tv)
                  res.render("matches", { "matches": matches, "curMatch": curMatch, "team1MatchPlayers": team1MatchPlayers, "team2MatchPlayers": team2MatchPlayers, "team1Inducements": team1Inducements, "team2Inducements": team2Inducements, "team1Purchases": team1Purchases, "team2Purchases": team2Purchases })
                })
              })
            })
          })
        })
      })
    })
  })
})

module.exports = router;
