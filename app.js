var express = require("express")
var path = require("path")
var favicon = require("serve-favicon")
var logger = require("morgan")
var cookieParser = require("cookie-parser")
var bodyParser = require("body-parser")

var routes = require("./routes/index")
var coaches = require("./routes/coaches")
var seasons = require("./routes/seasons")
var matches = require("./routes/matches")
var players = require("./routes/players")
var teams = require("./routes/teams")
var search = require("./routes/search")

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
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"))
app.use("/css", express.static(__dirname + "/css"))
app.use("/images", express.static(__dirname + "/images"))

app.use("/", routes)
app.use("/search", search)
app.use("/rest/coaches", coaches)
app.use("/rest/seasons", seasons)
app.use("/rest/matches", matches)
app.use("/rest/players", players)
app.use("/rest/teams", teams)

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
  res.status(err.status || 500)
  res.render("error", {
    message: err.message,
    error: {}
  })
})


module.exports = app
