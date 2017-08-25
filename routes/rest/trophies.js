var express = require("express")
var router = express.Router()
var calls = require("./calls")

router.get("/", function (req, res) {
  calls.getTrophies()
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id", function (req, res) {
  var id = req.params.id
  calls.getTrophy(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

module.exports = {
  router: router
}
