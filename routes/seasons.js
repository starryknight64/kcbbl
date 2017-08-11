var express = require("express")
var router = express.Router()
var util = require("../includes/util")
var seasonsREST = require("./rest/seasons")

/* GET home page. */
router.get("/", function (req, res, next) {
  //res.render("seasons", { seasons: [{ id: 1, name: "Season 1" }, { id: 2, name: "Season 2" }] })
  return seasonsREST.getSeasons().then((seasons) => {
    var curSeason = getCurrentSeason(seasons)
    var renderJSON = {
      seasons: seasons,
      currentSeasonID: curSeason.id,
      selectedSeasonID: curSeason.id,
      trophyImage: season.trophy.img
    }
    res.render("seasons", renderJSON)
  })
})

router.get("/:id", function (req, res, next) {
  var id = req.params.id
  return seasonsREST.getSeason(id).then((season) => {
    return seasonsREST.getSeasons().then((seasons) => {
      var curSeason = getCurrentSeason(seasons)
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

function getCurrentSeason(seasons) {
  var today = new Date()
  for (var i in seasons) {
    var startDate = new Date(seasons[i].start_date)
    var endDate = new Date(seasons[i].end_date)
    if (startDate <= today && today <= endDate) {
      return seasons[i]
    }
  }
  return null
}

module.exports = router
