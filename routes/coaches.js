var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getCoaches().then((coaches) => {
    calls.getSeasonsForCoach(coaches[0].id).then((seasons) => {
      calls.getTeamsForCoach(coaches[0].id).then((teams) => {
        res.render("coaches", { "coaches": coaches, "curCoach": coaches[0], "teams": teams, "seasons": seasons })
      })
    })
  })
})


router.get("/:id", function (req, res, next) {
  var id = req.params.id
  calls.getCoach(id).then((coach) => {
    calls.getTeamsForCoach(coach.id).then((teams) => {
      calls.getSeasonsForCoach(coach.id).then((seasons) => {
        calls.getCoaches().then((coaches) => {
          res.render("coaches", { "coaches": coaches, "curCoach": coach, "teams": teams, "seasons": seasons })
        })
      })
    })
  })
})

module.exports = router
