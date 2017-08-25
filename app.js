var express = require("express")
var path = require("path")
var favicon = require("serve-favicon")
var logger = require("morgan")
var cookieParser = require("cookie-parser")
var bodyParser = require("body-parser")
var Type = require("type-of-is")

var index = require("./routes/index")
var seasons = require("./routes/seasons")
var matches = require("./routes/matches")
var coaches = require("./routes/coaches")
var players = require("./routes/players")
var teams = require("./routes/teams")
var search = require("./routes/search")
var coachesREST = require("./routes/rest/coaches")
var seasonsREST = require("./routes/rest/seasons")
var matchesREST = require("./routes/rest/matches")
var playersREST = require("./routes/rest/players")
var teamsREST = require("./routes/rest/teams")
var trophiesREST = require("./routes/rest/trophies")
var racesREST = require("./routes/rest/races")

var app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + "/public/favicon.ico"))
app.use(logger("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/js", express.static(__dirname + "/node_modules/jquery/dist"))
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"))
app.use("/js", express.static(__dirname + "/public/js"))
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"))
app.use("/css", express.static(__dirname + "/public/css"))
app.use("/images", express.static(__dirname + "/public/images"))

app.use("/", index)
app.use("/seasons", seasons)
app.use("/matches", matches)
app.use("/coaches", coaches)
app.use("/players", players)
app.use("/teams", teams)
app.use("/search", search)
app.use("/rest/coaches", coachesREST.router)
app.use("/rest/seasons", seasonsREST.router)
app.use("/rest/matches", matchesREST.router)
app.use("/rest/players", playersREST.router)
app.use("/rest/teams", teamsREST.router)
app.use("/rest/trophies", trophiesREST.router)
app.use("/rest/races", racesREST.router)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found")
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render("error", {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  if (Type.is(err, String)) {
    err = new Error(err)
  }

  res.status(err.status || 500)
  res.render("error", {
    message: err.message,
    error: err
  })
})


module.exports = app
