var Express = require("express")
var MySQL = require("mysql")
var Type = require("type-of-is")
var async = require("async-if-else")(require("async"))

var app = Express()
var db = MySQL.createConnection({
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

app.get("/", function (req, res) {
    console.log(req.url)
    res.send("Hello World!")
})

app.get("/seasons", function (req, res) {
    console.log(req.url)
    getSeasons()
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

app.get("/season/:id", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    getSeason(id)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

app.get("/season/:id/teams", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    getTeamsForSeason(id)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

app.get("/season/:id/matches", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    var matchTypeID = req.query.matchtype
    getMatchesForSeason(id, matchTypeID)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

app.get("/season/:id/coaches", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    getCoachesForSeason(id)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

app.get("/season/:id/players", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    getPlayersForSeason(id)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

app.get("/coaches", function (req, res) {
    console.log(req.url)
    getCoaches()
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

app.get("/coach/:id", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    getCoach(id)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

app.get("/coach/:id/seasons", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    getSeasonsForCoach(id)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

app.get("/coach/:id/teams", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    var seasonID = req.query.season
    getTeamsForCoach(id, seasonID)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

app.get("/coach/:id/matches", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    var seasonID = req.query.season
    var teamID = req.query.team
    var matchTypeID = req.query.matchType
    getMatchesForCoach(id, seasonID, teamID, matchTypeID)
        .then((obj) => res.send(obj))
        .catch((error) => handleError(res, error))
})

var server = app.listen(8081, "localhost", function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Listening at http://%s:%s", host, port)
})
