var express = require("express")
var router = express.Router()
var util = require("../includes/util")
var calls = require("./rest/calls")

/* GET home page. */
router.get("/", function (req, res, next) {
  return calls.getSeasons().then((seasons) => {
    return calls.getCurrentSeason().then((curSeason) => {
      return calls.getWinningTeamForSeason(curSeason.id).then((winningTeam) => {
        return calls.getCoachesForSeason(curSeason.id).then((coaches) => {
          return calls.getTeamsForSeason(curSeason.id).then((teams) => {
            var renderJSON = {
              seasons: seasons,
              currentSeason: curSeason,
              selectedSeason: curSeason,
              selectedSeasonWinningTeam: winningTeam,
              selectedSeasonCoaches: coaches,
              selectedSeasonTeams: teams,
              trophyImage: curSeason.trophy.img
            }
            res.render("seasons", renderJSON)
          })
        })
      })
    })
  }).catch(next)
})

router.get("/:id", function (req, res, next) {
  var id = req.params.id
  return calls.getSeason(id).then((season) => {
    return calls.getSeasons().then((seasons) => {
      return calls.getCurrentSeason().then((curSeason) => {
        return calls.getWinningTeamForSeason(season.id).then((winningTeam) => {
          return calls.getCoachesForSeason(season.id).then((coaches) => {
            return calls.getTeamsForSeason(season.id).then((teams) => {
              var renderJSON = {
                seasons: seasons,
                currentSeason: curSeason,
                selectedSeason: season,
                selectedSeasonWinningTeam: winningTeam,
                selectedSeasonCoaches: coaches,
                selectedSeasonTeams: teams,
                trophyImage: season.trophy.img
              }
              res.render("seasons", renderJSON)
            })
          })
        })
      })
    })
  }).catch(next)
})

module.exports = router
