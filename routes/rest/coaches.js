var express = require("express")
var router = express.Router()
var calls = require("./calls")
var util = require("../../includes/util")

router.get("/", function (req, res) {
  calls.getCoaches()
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id", function (req, res) {
  var id = req.params.id
  calls.getCoach(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id/teams", function (req, res) {
  var id = req.params.id
  var seasonID = req.query.season
  calls.getTeamsForCoach(id, seasonID)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id/matches", function (req, res) {
  var id = req.params.id
  var seasonID = req.query.season
  var teamID = req.query.team
  var matchTypeID = req.query.matchtype
  calls.getMatchesForCoach(id, seasonID, teamID, matchTypeID)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

module.exports = {
  router: router
}
