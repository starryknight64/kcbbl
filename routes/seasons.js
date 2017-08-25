var express = require("express")
var router = express.Router()
var util = require("../includes/util")
var calls = require("./rest/calls")

/* GET home page. */
router.get("/", function (req, res, next) {
  return calls.getSeasons().then((seasons) => {
    var curSeason = calls.getCurrentSeason(seasons)
    var renderJSON = {
      seasons: seasons,
      currentSeasonID: curSeason.id,
      selectedSeasonID: curSeason.id,
      trophyImage: curSeason.trophy.img
    }
    res.render("seasons", renderJSON)
  }).catch(next)
})

router.get("/:id", function (req, res, next) {
  var id = req.params.id
  return calls.getSeason(id).then((season) => {
    return calls.getSeasons().then((seasons) => {
      var curSeason = calls.getCurrentSeason(seasons)
      var renderJSON = {
        seasons: seasons,
        currentSeasonID: curSeason.id,
        selectedSeasonID: season.id,
        trophyImage: season.trophy.img
      }
      res.render("seasons", renderJSON)
    })
  }).catch(next)
})

module.exports = router
