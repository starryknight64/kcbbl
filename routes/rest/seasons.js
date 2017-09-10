var express = require("express")
var router = express.Router()
var calls = require("./calls")

router.get("/", function (req, res) {
  calls.getSeasons()
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id", function (req, res) {
  var id = req.params.id
  if (id == "current") {
    calls.getCurrentSeason()
      .then((obj) => res.send(obj))
      .catch((error) => util.handleRESTError(res, error))
  } else {
    calls.getSeason(id)
      .then((obj) => res.send(obj))
      .catch((error) => util.handleRESTError(res, error))
  }
})

router.get("/:id/winner", function (req, res) {
  var id = req.params.id
  calls.getWinningTeamForSeason(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})
router.get("/:id/teams", function (req, res) {
  var id = req.params.id
  calls.getTeamsForSeason(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id/matches", function (req, res) {
  var id = req.params.id
  var matchTypeID = req.query.matchtype
  calls.getMatchesForSeason(id, matchTypeID)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id/coaches", function (req, res) {
  var id = req.params.id
  calls.getCoachesForSeason(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id/players", function (req, res) {
  var id = req.params.id
  calls.getPlayersForSeason(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

module.exports = {
  router: router
}
