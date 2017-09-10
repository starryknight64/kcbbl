var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")
var util = require("../includes/util")

/* GET users listing. */
router.get("/", function (req, res, next) {
  var query = req.query.q
  calls.search(query).then((results) => {
    var data = null
    if (results) {
      data = {}
      for (var tableName in results) {
        var tableProper = util.toPlural(util.toTitleCase(tableName.replace("_", " ")))
        data[tableProper] = results[tableName]
      }
    }
    res.render("search", { q: query, results: data })
  })
})

module.exports = router
