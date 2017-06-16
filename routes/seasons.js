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

module.exports = router
