var bcrypt = require("bcrypt")
var express = require("express")
var router = express.Router()
var calls = require("./calls")
var Type = require("type-of-is")
var util = require("../../includes/util")

router.post("/", function (req, res) {
  // bcrypt.hash("sportsball", 10)
  //   .then((hash) => res.send(hash))
  //   .catch((error) => util.handleRESTError(res, error))\

  if (!("email" in req.body) || !("password" in req.body)) {
    return util.handleRESTError(res, "Email or password were not provided!")
  }
  if (!Type.is(req.body.email, String)) {
    return util.handleRESTError(res, "Email was not in string format!")
  }
  if (!Type.is(req.body.password, String)) {
    return util.handleRESTError(res, "Password was not in string format!")
  }
  calls.getCoachesAuth(["email"], [req.body.email]).then((coaches) => {
    if (coaches.length != 1) {
      return util.handleRESTError(res, "User not found!")
    } else {
      var coach = coaches[0]
      bcrypt.compare(req.body.password, coach.password)
        .then((result) => {
          if (result == true) {
            req.session.userId = coach.id
            res.send("You are now authenticated.")
          } else {
            return util.handleRESTError(res, "Invalid password!")
          }
        })
        .catch((error) => util.handleRESTError(res, error))
    }
  })
})


module.exports = {
  router: router
}