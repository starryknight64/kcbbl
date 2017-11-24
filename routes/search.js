var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")
var util = require("../includes/util")

router.get("/", function (req, res, next) {
  var query = req.query.q
  var filter = Object.keys(req.query).filter((param) => { return param !== "q" })
  calls.getPlayerTypes().then((playerTypes) => {
    calls.getTeams().then((teams) => {
      calls.getRaces().then((races) => {
        calls.search(query, filter).then((results) => {
          var data = {}
          var hasData = false
          for (var tableName in results) {
            hasData = true

            if (tableName == "player_type") {
              for (var i in results[tableName]) {
                for (var j in races) {
                  if (races[j].id == results[tableName][i]["race_id"]) {
                    results[tableName][i]["race"] = races[j]
                    delete results[tableName][i].race_id
                  }
                }
              }
            } else if (tableName == "player") {
              for (var i in results[tableName]) {
                for (var j in teams) {
                  if (teams[j].id == results[tableName][i]["team_id"]) {
                    results[tableName][i]["team"] = teams[j]
                    delete results[tableName][i].team_id
                  }
                }
                for (var j in races) {
                  if (races[j].id == results[tableName][i]["team"]["race_id"]) {
                    results[tableName][i]["team"]["race"] = races[j]
                    delete results[tableName][i]["team"].race_id
                  }
                }
                for (var j in playerTypes) {
                  if (playerTypes[j].id == results[tableName][i]["type_id"]) {
                    results[tableName][i]["type"] = playerTypes[j]
                    delete results[tableName][i].type_id
                  }
                }
              }
            }

            var tableProper = util.toPlural(util.toTitleCase(tableName.replace("_", " ")))
            data[tableProper] = results[tableName]
          }
          if (!hasData) {
            data = null
          }
          res.render("search", { q: query, results: data })
        })
      })
    })
  })
})

module.exports = router
