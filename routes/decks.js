var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getDecks().then((decks) => {
    calls.getCards().then((cards) => {
      for (var i in decks) {
        decks[i].cards = []
      }

      for (var i in cards) {
        var card = cards[i]
        for (var j in decks) {
          var deck = decks[j]
          if (deck.id == card.deck_id) {
            deck.cards.push(card)
            break
          }
        }
      }
      res.render("decks", { decks: decks })
    })
  })
})


module.exports = router
