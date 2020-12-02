var express = require("express")
var router = express.Router()
var calls = require("./calls")
var util = require("../../includes/util")

router.get("/", function (req, res) {
  calls.getDecks()
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id", function (req, res) {
  var id = req.params.id
  calls.getDeck(id)
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

router.get("/:id/cards", function (req, res) {
  var id = req.params.id
  calls.getDeck(id)
    .then((deck) => calls.getCardsForDeck(deck.id))
    .then((obj) => res.send(obj))
    .catch((error) => util.handleRESTError(res, error))
})

module.exports = {
  router: router
}
