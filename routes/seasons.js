var express = require("express")
var router = express.Router()
var util = require("../includes/util")
var seasonsREST = require("./rest/seasons")

/* GET home page. */
router.get("/", function (req, res, next) {
  //res.render("seasons", { seasons: [{ id: 1, name: "Season 1" }, { id: 2, name: "Season 2" }] })
  return seasonsREST.getSeasons().then((seasons) => {
    res.render("seasons", { seasons: seasons })
  })
})

function getPage(things, thing, restURLPrefix) {
  var maxID = 0
  for (var i in things) {
    var thisThing = things[i]
    if (thisThing.id > maxID) {
      maxID = thisThing.id
    }
  }

  var prev = "#"
  var nxt = "#"
  if (thing.id > 1) {
    prev = restURLPrefix + (thing.id - 1)
  }
  if (thing.id < maxID) {
    nxt = restURLPrefix + (thing.id + 1)
  }

  var maxPages = 5
  var pagePad = Math.floor(maxPages / 2)
  var thingsPaged = []
  for (var i in things) {
    var thingPaged = things[i]
    if (thingPaged.id < thing.id) {
      if (thingPaged.id >= thing.id - pagePad) {
        thingsPaged.push(thingPaged)
      }
    } else if (thingPaged.id > thing.id) {
      if (thingPaged.id <= thing.id + pagePad) {
        thingsPaged.push(thingPaged)
      }
    } else {
      thingsPaged.push(thingPaged)
    }
  }

  return { prev: prev, thingsPaged: thingsPaged, thing: thing, next: nxt }
}

router.get("/:id", function (req, res, next) {
  var id = req.params.id
  return seasonsREST.getSeason(id)
    .then(seasonsREST.getSeasons())
    .then((season, seasons) => {
      var curSeason = null
      for (var i in seasons) {
        var thisSeason = seasons[i]
        if (thisSeason.id == 2) {
          curSeason = thisSeason
        }
      }

      var page = getPage(seasons, season, "/seasons/")
      res.render("seasons", { prev: page.prev, seasonsPaged: page.thingsPaged, season: season, next: page.next })
    }).catch(next)
})

module.exports = router
