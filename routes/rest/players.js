var express = require("express")
var router = express.Router()
var calls = require("./calls")
var util = require("../../includes/util")

router.get("/", function (req, res) {
  calls.getPlayers()
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id", function (req, res) {
  var id = req.params.id
  calls.getPlayer(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id/skills", function (req, res) {
  var id = req.params.id
  calls.getSkillsForPlayer(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

module.exports = {
  router: router
}
