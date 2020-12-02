var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getPurchases(["race_id"], [null], undefined, undefined, undefined, "ORDER BY name ASC").then((purchases) => {
    res.render("purchases", { purchases: purchases })
  })
})


module.exports = router
