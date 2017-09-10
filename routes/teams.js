var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getTeams().then((teams) => {
    calls.getPlayersForTeam(teams[0].id).then((players) => {
      calls.getSeasons().then((seasons) => {
        calls.getCurrentSeason().then((curSeason) => {
          res.render("teams", { "seasons": seasons, "teams": teams, "curSeason": curSeason, "curTeam": teams[0], "players": players })
        })
      })
    })
  }).catch(next)
})

router.get("/:teamid/seasons/:seasonid", function (req, res, next) {
  var teamID = req.params.teamid
  var seasonID = req.params.seasonid
  calls.getTeam(teamID).then((team) => {
    calls.getPlayersForTeam(team.id).then((players) => {
      calls.getSeason(seasonID).then((selectedSeason) => {
        calls.getTeamsForSeason(selectedSeason.id).then((teams) => {
          calls.getSeasons().then((seasons) => {
            calls.getCurrentSeason().then((curSeason) => {
              var renderJSON = {
                "seasons": seasons,
                "teams": teams,
                "curSeason": curSeason,
                "curTeam": team,
                "players": players,
                "selectedSeason": selectedSeason
              }
              res.render("teams", renderJSON)
            })
          })
        })
      })
    })
  }).catch(next)
})


router.get("/:id", function (req, res, next) {
  var id = req.params.id
  calls.getTeam(id).then((team) => {
    calls.getPlayersForTeam(team.id).then((players) => {
      calls.getTeams().then((teams) => {
        calls.getSeasonsForTeam(team.id).then((seasons) => {
          calls.getCurrentSeason().then((curSeason) => {
            res.render("teams", { "seasons": seasons, "teams": teams, "curSeason": curSeason, "curTeam": team, "players": players })
          })
        })
      })
    })
  }).catch(next)
})

module.exports = router
