var express = require("express")
var router = express.Router()
var db = require("../../includes/db")
var util = require("../../includes/util")

router.get("/", function (req, res) {
  getTrophies()
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id", function (req, res) {
  var id = req.params.id
  getTrophy(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

function getTrophy(id) {
  return db.get("trophy", id)
}
function getTrophies(wheres, values, joins) {
  return db.getMany("trophy", undefined, wheres, values, joins)
}

module.exports = {
  router: router,
  getTrophy: getTrophy,
  getTrophies: getTrophies
}
