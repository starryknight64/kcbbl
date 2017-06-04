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
    if (Type.is(error, Object)) {
        error["stacktrace"] = error.stack.split("\n")
    }
    res.status(400).send(error)
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
    }
    return num
}

function get(table, cols, id, res, callback) {
    if (!Type.is(table, String)) {
        res.status(400).send("Table name must be a string!")
        return
    }
    if (!Type.is(cols, Array)) {
        res.status(400).send("Columns must be an array!")
        return
    }
    id = getID(id)
    if (!id) {
        res.status(400).send("ID must be a positive integer!")
        return
    }

    var sql = "SELECT " + cols.join() + " FROM `" + table + "` WHERE id=?"
    db.query(sql, [id], function (error, results, fields) {
        if (error) {
            handleError(res, error)
            return
        }
        if (Type.is(results, Array) && results.length == 0) {
            res.status(404).send(table + " '" + id + "' does not exist!")
            return
        }
        callback(results[0])
    })
}

function getMany(table, cols, wheres, values, res, callback) {
    if (!Type.is(table, String)) {
        res.status(400).send("Table name must be a string!")
        return
    }
    if (!Type.is(cols, Array)) {
        res.status(400).send("Columns must be an array!")
        return
    }
    if (!Type.is(wheres, Array)) {
        res.status(400).send("Wheres must be an array!")
        return
    }
    if (!Type.is(values, Array)) {
        res.status(400).send("Values must be an array!")
        return
    }
    if (wheres.length != values.length) {
        res.status(400).send("Wheres array length must match Values array length!")
        return
    }

    var sql = "SELECT " + cols.join(",") + " FROM `" + table + "`"
    if (wheres.length > 0) {
        sql += " WHERE " + wheres.join("=? AND ") + "=?"
    }
    db.query(sql, values, function (error, results, fields) {
        if (error) {
            handleError(res, error)
            return
        }
        callback(results)
    })
}

function getSeason(id, res, callback) {
    get("season", ["*"], id, res, callback)
}
function getSeasons(res, callback) {
    getMany("season", ["*"], [], [], res, callback)
}
function getSeasonsForCoach(coachID, res, callback) {
    getCoach(coachID, res, function (coach) {
        var sql = "SELECT season.* FROM season " +
            "INNER JOIN team ON team.season_id = season.id " +
            "WHERE team.coach_id=?"
        db.query(sql, [coach.id], function (error, results, fields) {
            if (error) {
                handleError(res, error)
                return
            }
            callback(results)
        })
    })
}

function getCoach(id, res, callback) {
    get("coach", ["id", "name"], id, res, callback)
}
function getCoaches(res, callback) {
    getMany("coach", ["id", "name"], [], [], res, callback)
}
function getCoachesForSeason(seasonID, res, callback) {
    getSeason(seasonID, res, function (season) {
        var sql = "SELECT coach.id,coach.name FROM team " +
            "INNER JOIN coach ON coach.id = team.coach_id " +
            "WHERE team.season_id=?"
        db.query(sql, [season.id], function (error, results, fields) {
            if (error) {
                handleError(res, error)
                return
            }
            callback(results)
        })
    })
}

function getTeam(id, res, callback) {
    get("team", ["*"], id, res, callback)
}
function getTeams(res, callback) {
    getMany("team", ["*"], [], [], res, callback)
}
function getTeamsForCoach(coachID, seasonID, res, callback) {
    getCoach(coachID, res, function (coach) {
        wheres = ["coach_id"]
        values = [coach.id]

        seasonID = getID(seasonID)
        if (seasonID) {
            getSeason(seasonID, res, function (season) {
                wheres.push("season_id")
                values.push(season.id)
                getMany("team", ["*"], wheres, values, res, callback)
            })
        } else {
            getMany("team", ["*"], wheres, values, res, callback)
        }
    })
}
function getTeamsForSeason(seasonID, res, callback) {
    getSeason(seasonID, res, function (season) {
        getMany("team", ["*"], ["season_id"], [season.id], res, callback)
    })
}

function getPlayer(id, res, callback) {
    get("player", ["*"], id, res, callback)
}
function getPlayers(res, callback) {
    getMany("player", ["*"], [], [], res, callback)
}
function getPlayersForSeason(seasonID, res, callback) {
    getSeason(seasonID, res, function (season) {
        var sql = "SELECT player.* FROM team " +
            "INNER JOIN team_player ON team_player.team_id=team.id " +
            "INNER JOIN player ON player.id=team_player.player_id " +
            "WHERE team.season_id=?"
        db.query(sql, [season.id], function (error, results, fields) {
            if (error) {
                handleError(res, error)
                return
            }
            callback(results)
        })
    })
}

function getMatch(id, res, callback) {
    get("match", ["*"], id, res, callback)
}
function getMatches(res, callback) {
    getMany("match", ["*"], [], [], res, callback)
}
function getMatchesForSeason(seasonID, matchTypeID, res, callback) {
    getSeason(seasonID, res, function (season) {
        wheres = ["season_id"]
        values = [season.id]

        matchTypeID = getID(matchTypeID)
        if (matchTypeID) {
            getMatchType(matchTypeID, res, function (matchType) {
                wheres.push("match_type_id")
                values.push(matchType.id)
                getMany("match", ["*"], wheres, values, res, callback)
            })
        } else {
            getMany("match", ["*"], wheres, values, res, callback)
        }
    })
}
function getMatchesForCoach(coachID, seasonID, teamID, matchTypeID, res, callback) {
    getCoach(coachID, res, function (coach) {
        wheres = ["coach_id"]
        values = [coach.id]

        seasonID = getID(seasonID)
        teamID = getID(teamID)
        matchTypeID = getID(matchTypeID)
        async.series([
            async.if(function (callback) { return callback(null, seasonID) },
                function (callback) {
                    getSeason(seasonID, res, function (season) {
                        wheres.push("season_id")
                        values.push(season.id)
                        callback(null, season)
                    }
            }),
            async.if(function (callback) { return callback(null, teamID) },
                function (callback) {
                    getTeam(teamID, res, function (team) {
                        wheres.push("team_id")
                        values.push(team.id)
                        callback(null, team)
                    }
                }),
            async.if(function (callback) { return callback(null, matchTypeID) },
                function (callback) {
                    getMatchType(matchTypeID, res, function (matchType) {
                        wheres.push("match_type_id")
                        values.push(matchType.id)
                        callback(null, matchType)
                    }
            }),
            function (callback) {
                getMany("match", ["*"], wheres, values, res, callback)
            }
        ])
    })
}

function getMatchType(id, res, callback) {
    get("match_type", ["*"], id, res, callback)
}
function getMatchTypes(res, callback) {
    getMany("match_type", ["*"], [], [], res, callback)
}

function getPurchase(id, res, callback) {
    get("purchase", ["*"], id, res, callback)
}
function getPurchases(res, callback) {
    getMany("purchase", ["*"], [], [], res, callback)
}

function getInducement(id, res, callback) {
    get("inducement", ["*"], id, res, callback)
}
function getInducements(res, callback) {
    getMany("inducement", ["*"], [], [], res, callback)
}

function getPlayerType(id, res, callback) {
    get("player_type", ["*"], id, res, callback)
}
function getPlayerTypes(res, callback) {
    getMany("player_type", ["*"], [], [], res, callback)
}

function getSkill(id, res, callback) {
    get("skill", ["*"], id, res, callback)
}
function getSkills(res, callback) {
    getMany("skill", ["*"], [], [], res, callback)
}

app.get("/", function (req, res) {
    console.log(req.url)
    res.send("Hello World!")
})

app.get("/seasons", function (req, res) {
    console.log(req.url)
    getSeasons(res, function (results) {
        res.send(results)
    })
})

app.get("/season/:id", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    getSeason(id, res, function (season) {
        res.send(season)
    })
})

app.get("/season/:id/teams", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    getTeamsForSeason(id, res, function (results) {
        res.send(results)
    })
})

app.get("/season/:id/matches", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    var matchTypeID = req.query.matchtype
    getMatchesForSeason(id, matchTypeID, res, function (results) {
        res.send(results)
    })
})

app.get("/season/:id/coaches", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    getCoachesForSeason(id, res, function (results) {
        res.send(results)
    })
})

app.get("/season/:id/players", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    getPlayersForSeason(id, res, function (results) {
        res.send(results)
    })
})

app.get("/coaches", function (req, res) {
    console.log(req.url)
    getCoaches(res, function (results) {
        res.send(results)
    })
})

app.get("/coach/:id", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    getCoach(id, res, function (results) {
        res.send(results)
    })
})

app.get("/coach/:id/seasons", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    getSeasonsForCoach(id, res, function (results) {
        res.send(results)
    })
})

app.get("/coach/:id/teams", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    var seasonID = req.query.season
    getTeamsForCoach(id, seasonID, res, function (results) {
        res.send(results)
    })
})

app.get("/coach/:id/matches", function (req, res) {
    console.log(req.url)
    var id = req.params.id
    var seasonID = req.query.season
    var team = req.query.team
    var matchTypeID = req.query.matchType
    getMatchesForCoach(id, seasonID, teamID, matchTypeID, res, function (results) {
        res.send(results)
    })
})

var server = app.listen(8081, "localhost", function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Listening at http://%s:%s", host, port)
})
