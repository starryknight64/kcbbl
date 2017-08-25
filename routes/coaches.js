var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getCoaches().then((coaches) => {

    res.render("coaches", { "coaches": coaches, "curCoach": coaches[0] })
  })
})


router.get("/:id", function (req, res, next) {
  var id = req.params.id
  calls.getCoach(id).then((coach) => {
    return calls.getCoaches().then((coaches) => {

      res.render("coaches", { "coaches": coaches, "curCoach": coach })
    })
  })
})

module.exports = router
