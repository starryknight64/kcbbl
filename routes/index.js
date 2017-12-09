var express = require("express")
var router = express.Router()
var fb = require("fb")
var settings = require("../includes/settings")

/* GET home page. */
router.get("/", function (req, res, next) {
  fb.options({ version: settings.facebook.version, appId: settings.facebook.appID, appSecret: settings.facebook.appSecret })
  fb.setAccessToken(settings.facebook.accessToken)

  fb.api("/" + settings.facebook.groupID + "/feed", (response) => {
    var messages = []
    if (!response || response.error) {
      console.log(!response ? 'error occurred' : response.error)
    } else {
      for (var i in response.data) {
        var entry = response.data[i]
        if ("message" in entry) {
          entry.id = entry.id.split("_")[1]
          messages.push(entry)
        }
        if (messages.length >= 4) {
          break
        }
      }
    }
    // console.log(messages)
    res.render("index", { title: "KCBBL", messages: messages, fbGroupID: settings.facebook.groupID, fbAPIVersion: settings.facebook.version })
  })
})

module.exports = router
