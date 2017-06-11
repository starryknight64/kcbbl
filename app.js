var express = require("express")
var mysql = require("mysql")
var Type = require("type-of-is")
//var async = require("async-if-else")(require("async"))
//var bootstrap = require("express-bootstrap-service")

var path = __dirname + "/views/"
var app = express()
app.set("view engine", "pug")
//app.use(bootstrap.serve)
app.use("/js", express.static(__dirname + "/node_modules/tether/dist/js"))
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"))
app.use("/js", express.static(__dirname + "/views/js"))
app.use("/css", express.static(__dirname + "/node_modules/tether/dist/css"))
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"))
app.use("/css", express.static(__dirname + "/views/css"))
app.use("/images", express.static(__dirname + "/views/images"))
var router = express.Router()
router.use(function (req, res, next) {
    console.log(req.url)
    next()
})
// bootstrap.options = {
//     path: "./node_modules/bootstrap",
//     styleSheetEngine: "css",
//     minified: true,
//     resourcesPath: "./node_modules/bootstrap/dist/"//__dirname + "/bootstrap/dist/"
// }
// router.use(bootstrap.serve)
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bloodbowl"
})
db.connect()

function handleError(res, error) {
    err = {}
    if (Type.is(error, Error)) {
        err.error = error.message
        err.stacktrace = error.stack.split("\n")
    } else if (Type.is(error, String)) {
        err.error = error
    } else {
        err = error
    }
    res.status(400).send(err)
}

function getID(num) {
    if (!Type.is(num, Number)) {
        if (Type.is(num, String)) {
            if (num.includes(".") || num.toLowerCase().includes("x")) {
                return NaN
            }
            number = Number(num)
            if (isNaN(number) || number <= 0) {
                return NaN
            }
            return number
        } else {
            return NaN
        }
    } else if (num <= 0) {
        return NaN
    }
    return num
}

function get(table, id, cols) {
    if (!Type.is(table, String)) {
        return Promise.reject("Table name must be a string!")
    }
    id = getID(id)
    if (!id) {
        return Promise.reject(table + " ID must be a positive integer!")
    }
    if (!Type.is(cols, Array)) {
        cols = [table + ".*"]
    }

    var sql = "SELECT " + cols.join(",") + " FROM `" + table + "` WHERE id=?"
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (error, results, fields) => {
            if (error) {
                return reject(error)
            }
            if (Type.is(results, Array) && results.length == 0) {
                return reject(table + " '" + id + "' does not exist!")
            }
            return resolve(results[0])
        })
    })
}

function getMany(table, cols, wheres, values, joins) {
    if (!Type.is(table, String)) {
        return Promise.reject("Table name must be a string!")
    }
    if (!Type.is(cols, Array)) {
        cols = [table + ".*"]
    }
    if (!Type.is(wheres, Array)) {
        wheres = []
    }
    if (!Type.is(values, Array)) {
        values = []
    }
    if (wheres.length != values.length) {
        return Promise.reject("Wheres array length must match Values array length!")
    }
    if (!Type.is(joins, Array)) {
        joins = []
    }

    var sql = "SELECT DISTINCT " + cols.join(",") + " FROM `" + table + "`"
    if (joins.length > 0) {
        sql += joins.join(" ")
    }
    if (wheres.length > 0) {
        sql += " WHERE " + wheres.join("=? AND ") + "=?"
    }
    sql += " ORDER BY " + table + ".id ASC"
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, results, fields) => {
            if (error) {
                return reject(error)
            }
            resolve(results)
        })
    })
}

function getSeason(id) {
    return get("season", id)
}
function getSeasons(wheres, values, joins) {
    return getMany("season", undefined, wheres, values, joins)
}
function getSeasonsForCoach(coachID) {
    return getCoach(coachID)
        .then((coach) => {
            return getSeasons(["team.coach_id"], [coach.id], ["INNER JOIN team ON team.season_id = season.id"])
        })
}

function getCoach(id) {
    return get("coach", id, ["coach.id", "coach.name"])
}
function getCoaches(wheres, values, joins) {
    return getMany("coach", ["coach.id", "coach.name"], wheres, values, joins)
}
function getCoachesForSeason(seasonID) {
    return getSeason(seasonID)
        .then((season) => {
            return getCoaches(["team.season_id"], [season.id], ["INNER JOIN team ON team.coach_id = coach.id"])
        })
}

function getTeam(id) {
    return get("team", id)
}
function getTeams(wheres, values, joins) {
    return getMany("team", ["*"], wheres, values, joins)
}
function getTeamsForCoach(coachID, seasonID) {
    return getCoach(coachID).then((coach) => {
        wheres = ["coach_id"]
        values = [coach.id]

        return new Promise((resolve, reject) => {
            if (seasonID !== undefined) {
                return getSeason(seasonID).then((season) => {
                    wheres.push("season_id")
                    values.push(season.id)
                    return resolve(season)
                }).catch(reject)
            }
            return resolve(null)
        }).then((season) => {
            return getTeams(wheres, values)
        })
    })
}
function getTeamsForSeason(seasonID) {
    return getSeason(seasonID).then((season) => {
        return getTeams(["season_id"], [season.id])
    })
}

function getPlayer(id) {
    return get("player", id)
}
function getPlayers(wheres, values, joins) {
    return getMany("player", ["*"], wheres, values, joins)
}
function getPlayersForSeason(seasonID) {
    return getSeason(seasonID).then((season) => {
        return getPlayers(["team.season_id"], [season.id], ["INNER JOIN team_player ON team_player.player_id=player.id", "INNER JOIN team ON team.id=team_player.team_id"])
    })
}

function getMatch(id) {
    return get("match", id)
}
function getMatches(wheres, values, joins) {
    return getMany("match", ["*"], wheres, values, joins)
}
function getMatchesForSeason(seasonID, matchTypeID) {
    return getSeason(seasonID).then((season) => {
        wheres = ["season_id"]
        values = [season.id]

        return new Promise((resolve, reject) => {
            if (matchTypeID !== undefined) {
                return getMatchType(matchTypeID)
                    .then((matchType) => {
                        wheres.push("match_type_id")
                        values.push(matchType.id)
                        return resolve(matchType)
                    }).catch(reject)
            }
            return resolve(null)
        }).then((matchType) => {
            return getMatches(wheres, values)
        })
    })
}
function getMatchesForCoach(coachID, seasonID, teamID, matchTypeID) {
    return getCoach(coachID).then((coach) => {
        wheres = ["team.coach_id"]
        values = [coach.id]
        joins = ["INNER JOIN team ON (team.id = match.team1_id OR team.id = match.team2_id)"]

        return new Promise((resolve, reject) => {
            if (seasonID !== undefined) {
                return getSeason(seasonID)
                    .then((season) => {
                        wheres.push("match.season_id")
                        values.push(season.id)
                        return resolve(season)
                    }).catch(reject)
            }
            return resolve(null)
        }).then((season) => {
            if (teamID !== undefined) {
                return getTeam(teamID)
                    .then((team) => {
                        wheres.push("team.id")
                        values.push(team.id)
                        return resolve(team)
                    }).catch(reject)
            }
            return resolve(null)
        }).then((team) => {
            if (matchTypeID !== undefined) {
                return getMatchType(matchTypeID)
                    .then((matchType) => {
                        wheres.push("match.match_type_id")
                        values.push(matchType.id)
                        return resolve(matchType)
                    }).catch(reject)
            }
            return resolve(null)
        }).then((matchType) => {
            return getMatches(wheres, values, joins)
        })
    })
}

function getMatchType(id) {
    return get("match_type", id)
}
function getMatchTypes(wheres, values, joins) {
    return getMany("match_type", ["*"], wheres, values, joins)
}

function getPurchase(id) {
    return get("purchase", id)
}
function getPurchases(wheres, values, joins) {
    return getMany("purchase", ["*"], wheres, values, joins)
}

function getInducement(id) {
    return get("inducement", id)
}
function getInducements(wheres, values, joins) {
    return getMany("inducement", ["*"], wheres, values, joins)
}

function getPlayerType(id) {
    return get("player_type", id)
}
function getPlayerTypes(wheres, values, joins) {
    return getMany("player_type", ["*"], wheres, values, joins)
}

function getSkill(id) {
    return get("skill", id)
}
function getSkills(wheres, values, joins) {
    return getMany("skill", ["*"], wheres, values, joins)
}

router.get("/", function (req, res) {
    res.render("index", { title: "Hey!", message: "Hello World!" })
})
router.get("/about", function (req, res) {
    res.sendFile(path + "about.html")
})
router.get("/contact", function (req, res) {
    res.sendFile(path + "contact.html")
})

router.get("/seasons", function (req, res) {
    getSeasons()
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

router.get("/season/:id", function (req, res) {
    var id = req.params.id
    getSeason(id)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

router.get("/season/:id/teams", function (req, res) {
    var id = req.params.id
    getTeamsForSeason(id)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

router.get("/season/:id/matches", function (req, res) {
    var id = req.params.id
    var matchTypeID = req.query.matchtype
    getMatchesForSeason(id, matchTypeID)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

router.get("/season/:id/coaches", function (req, res) {
    var id = req.params.id
    getCoachesForSeason(id)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

router.get("/season/:id/players", function (req, res) {
    var id = req.params.id
    getPlayersForSeason(id)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

router.get("/coaches", function (req, res) {
    getCoaches()
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

router.get("/coach/:id", function (req, res) {
    var id = req.params.id
    getCoach(id)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

router.get("/coach/:id/seasons", function (req, res) {
    var id = req.params.id
    getSeasonsForCoach(id)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

router.get("/coach/:id/teams", function (req, res) {
    var id = req.params.id
    var seasonID = req.query.season
    getTeamsForCoach(id, seasonID)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

router.get("/coach/:id/matches", function (req, res) {
    var id = req.params.id
    var seasonID = req.query.season
    var teamID = req.query.team
    var matchTypeID = req.query.matchType
    getMatchesForCoach(id, seasonID, teamID, matchTypeID)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

app.use("/", router)
app.use("*", function (req, res) {
    res.sendFile(path + "404.html");
});

var server = app.listen(8081, "localhost", function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Listening at http://%s:%s", host, port)
})
