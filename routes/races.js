var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getAllRaces().then((races) => {
    var promises = []
    for (var i in races) {
      promises.push(calls.getPlayerTypes(["race_id"], [races[i].id]))
    }
    Promise.all(promises).then((playerTypeData) => {
      promises = []
      var playerTypes = []
      for (var i in races) {
        if (playerTypeData[i]) {
          races[i]["positionals"] = playerTypeData[i]
          for (var j in races[i]["positionals"]) {
            promises.push(calls.getSkillsForPlayerTypeID(races[i]["positionals"][j].id))
            playerTypes.push(races[i]["positionals"][j])
          }
        } else {
          races[i]["positionals"] = []
        }
      }

      Promise.all(promises).then((playerTypeSkillsData) => {
        for (var i in playerTypes) {
          if (playerTypeSkillsData[i]) {
            playerTypes[i]["skills"] = playerTypeSkillsData[i]
          } else {
            playerTypes[i]["skills"] = []
          }
        }

        promises = []
        for (var i in races) {
          promises.push(calls.getPurchases(["race_id", "race_id"], [races[i].id, null], undefined, "OR", "GROUP BY name"))
        }
        Promise.all(promises).then((purchasesData) => {
          for (var i in races) {
            if (purchasesData[i]) {
              races[i]["purchases"] = purchasesData[i]
              if (races[i].name == "Goblin") {
                for (var j in races[i]["purchases"]) {
                  if (races[i]["purchases"][j].name == "Bribe" && races[i]["purchases"][j].race_id == null) {
                    races[i]["purchases"].splice(j)
                  }
                }
              } else if (races[i].name == "Halfling") {
                for (var j in races[i]["purchases"]) {
                  if (races[i]["purchases"][j].name == "Halfling Master Chef" && races[i]["purchases"][j].race_id == null) {
                    races[i]["purchases"].splice(j)
                  }
                }
              }
            } else {
              races[i]["purchases"] = []
            }
          }

          res.render("races", { races: races })
        })
      })
    })
  })
})


module.exports = router
