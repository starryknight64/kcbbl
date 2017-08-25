var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getTeams().then((teams) => {
    calls.getSeasons().then((seasons) => {
      var curSeason = calls.getCurrentSeason(seasons)
      res.render("teams", { "seasons": seasons, "teams": teams, "curSeason": curSeason, "curTeam": teams[0] })
    })
  }).catch(next)
})

router.get("/:teamid/seasons/:seasonid", function (req, res, next) {
  var teamID = req.params.teamid
  var seasonID = req.params.seasonid
  calls.getTeam(teamID).then((team) => {
    calls.getSeason(seasonID).then((selectedSeason) => {
      calls.getTeamsForSeason(selectedSeason.id).then((teams) => {
        calls.getSeasons().then((seasons) => {
          var curSeason = calls.getCurrentSeason(seasons)
          var renderJSON = {
            "seasons": seasons,
            "teams": teams,
            "curSeason": curSeason,
            "curTeam": team,
            "selectedSeason": selectedSeason
          }
          res.render("teams", renderJSON)
        })
      })
    })
  }).catch(next)
})


router.get("/:id", function (req, res, next) {
  var id = req.params.id
  calls.getTeam(id).then((team) => {
    calls.getTeams().then((teams) => {
      calls.getSeasons().then((seasons) => {
        var curSeason = calls.getCurrentSeason(seasons)
        res.render("teams", { "seasons": seasons, "teams": teams, "curSeason": curSeason, "curTeam": team })
      })
    })
  }).catch(next)
})

module.exports = router
