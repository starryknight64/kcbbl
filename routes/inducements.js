var express = require("express")
var router = express.Router()
var calls = require("./rest/calls")

router.get("/", function (req, res, next) {
  calls.getInducements(["race_id"], [null], undefined, undefined, undefined, "ORDER BY name ASC").then((inducements) => {
    res.render("inducements", { inducements: inducements })
  })
})


module.exports = router
