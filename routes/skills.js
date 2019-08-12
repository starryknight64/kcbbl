var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getSkills().then((skills) => {
    calls.getSkillTypes().then((skillTypes) => {
      for (var i in skills) {
        var skill = skills[i]
        for (var j in skillTypes) {
          var skillType = skillTypes[j]
          if (skill.skill_type_id == skillType.id) {
            if (skillType.name == "Improvement") {
              skills.splice(i)
              break
            } else {
              skill["type"] = skillType
              delete skill.skill_type_id
            }
          }
        }
      }
      res.render("skills", { skills: skills })
    })
  })
})


module.exports = router
