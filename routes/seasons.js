var express = require("express")
var router = express.Router()
var seasonsREST = require("./rest/seasons")

/* GET home page. */
router.get("/", function (req, res, next) {
  //res.render("seasons", { seasons: [{ id: 1, name: "Season 1" }, { id: 2, name: "Season 2" }] })
  return seasonsREST.getSeasons().then((seasons) => {
    res.render("seasons", { seasons: seasons })
  })
})

router.get("/:id", function (req, res) {
  var id = req.params.id
  return seasonsREST.getSeasons().then((seasons) => {
    var season = null
    var curSeason = null
    var maxID = 0
    for (var i in seasons) {
      var thisSeason = seasons[i]
      if (thisSeason.id == id) {
        season = thisSeason
      } else if (thisSeason.id == 2) {
        curSeason = thisSeason
      }

      if (thisSeason.id > maxID) {
        maxID = thisSeason.id
      }
    }

    if (season == null) {
      season = curSeason
    }

    var prev = "#"
    var nxt = "#"
    if (season.id > 1) {
      prev = "/seasons/" + (season.id - 1)
    }
    if (season.id < maxID) {
      nxt = "/seasons/" + (season.id + 1)
    }

    var maxPages = 5
    var pagePad = Math.floor(maxPages / 2)
    var seasonsPaged = []
    for (var i in seasons) {
      var seasonPaged = seasons[i]
      if (seasonPaged.id < season.id) {
        if (seasonPaged.id >= season.id - pagePad) {
          seasonsPaged.push(seasonPaged)
        }
      } else if (seasonPaged.id > season.id) {
        if (seasonPaged.id <= season.id + pagePad) {
          seasonsPaged.push(seasonPaged)
        }
      } else {
        seasonsPaged.push(seasonPaged)
      }
    }

    res.render("seasons", { prev: prev, seasonsPaged: seasonsPaged, season: season, next: nxt })
  })
})

module.exports = router
