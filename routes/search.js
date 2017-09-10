var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")
var util = require("../includes/util")

router.get("/", function (req, res, next) {
  var query = req.query.q
  var filter = Object.keys(req.query).filter((param) => { return param !== "q" })
  calls.search(query, filter).then((results) => {
    var data = {}
    var hasData = false
    for (var tableName in results) {
      hasData = true
      var tableProper = util.toPlural(util.toTitleCase(tableName.replace("_", " ")))
      data[tableProper] = results[tableName]
    }
    if (!hasData) {
      data = null
    }
    res.render("search", { q: query, results: data })
  })
})

module.exports = router
