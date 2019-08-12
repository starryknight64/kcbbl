var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getAllRaces().then((races) => {
    calls.getSkillupNormals().then((skillUpNormals) => {
      calls.getSkillupDoubles().then((skillUpDoubles) => {
        calls.getSkillTypes().then((skillTypes) => {
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
                var playerType = playerTypes[i]
                if (playerTypeSkillsData[i]) {
                  playerType["skills"] = playerTypeSkillsData[i]
                } else {
                  playerType["skills"] = []
                }

                playerType["normals"] = ""
                for (var j in skillUpNormals) {
                  var skillUp = skillUpNormals[j]
                  if (skillUp.player_type_id == playerType.id) {
                    for (var k in skillTypes) {
                      var skillType = skillTypes[k]
                      if (skillType.id == skillUp.skill_type_id) {
                        playerType["normals"] += skillType.name[0]
                      }
                    }
                  }
                }
                playerType["doubles"] = ""
                for (var j in skillUpDoubles) {
                  var skillUp = skillUpDoubles[j]
                  if (skillUp.player_type_id == playerType.id) {
                    for (var k in skillTypes) {
                      var skillType = skillTypes[k]
                      if (skillType.id == skillUp.skill_type_id) {
                        playerType["doubles"] += skillType.name[0]
                      }
                    }
                  }
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
    })
  })
})


module.exports = router
