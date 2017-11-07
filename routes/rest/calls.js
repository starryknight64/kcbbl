var db = require("../../includes/db")
var Type = require("type-of-is")

function search(query, filter) {
  var queries = {
    // "card": [null, ["name", "description", "timing", "effect"], null],
    "coach": [["id", "name"], ["name"], null],
    // "deck": [null, ["name"], null],
    "inducement": [null, ["name", "description"], "GROUP BY name"],
    "player": [null, ["name"], null],
    "player_type": [null, ["name", "description"], "GROUP BY CASE WHEN star_player=1 THEN name ELSE id END"],
    "purchase": [null, ["name", "description"], null],
    "race": [null, ["name", "description"], null],
    "season": [null, ["name"], null],
    "skill": [null, ["name", "description"], null],
    "skill_type": [null, ["name"], null],
    "team": [null, ["name"], null],
    "trophy": [null, ["name"], null]
  }
  var queryTables = Object.keys(queries)

  var queryPromiseParams = queries
  if (Type.is(filter, Array)) {
    var found = false
    for (var i in filter) {
      var tableName = filter[i]
      if (tableName in queries) {
        if (!found) {
          found = true
          queryPromiseParams = []
          queryTables = []
        }
        queryPromiseParams[tableName] = queries[tableName]
        queryTables.push(tableName)
      }
    }
  }

  var promises = []
  for (var table in queryPromiseParams) {
    var queryPromiseParam = queryPromiseParams[table]
    var cols = queryPromiseParam[0] ? queryPromiseParam[0] : ["*"]
    var wheres = queryPromiseParam[1]
    var tail = queryPromiseParam[2]
    var values = []
    for (var i = 0; i < wheres.length; i++) {
      values.push("%" + query + "%")
    }
    promises.push(db.getMany(table, cols, wheres, values, null, "SEARCH", tail))
  }

  return Promise.all(promises)
    .then((data) => {
      var results = {}
      for (var i in data) {
        if (data[i].length > 0) {
          results[queryTables[i]] = data[i]
        }
      }
      return Promise.resolve(results)
    })
}

function getCoach(id) {
  return db.get("coach", id, ["coach.id", "coach.name"])
}
function getCoaches(wheres, values, joins) {
  return db.getMany("coach", ["coach.id", "coach.name"], wheres, values, joins)
}
function getCoachesForSeason(seasonID) {
  return getSeason(seasonID)
    .then((season) => {
      return getCoaches(["team.season_id"], [season.id], ["INNER JOIN team ON team.coach_id = coach.id"])
    })
}

function getInducement(id) {
  return db.get("inducement", id)
}
function getInducements(wheres, values, joins) {
  return db.getMany("inducement", ["*"], wheres, values, joins)
}


function getMatch(id) {
  return db.get("match", id)
}
function getMatches(wheres, values, joins) {
  return db.getMany("match", ["*"], wheres, values, joins)
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

var META_SEASON_CURRENT = "season.current"
function getMeta(key) {
  return db.getMany("meta", ["value"], ["mkey"], [key]).then((values) => {
    if (values.length > 0) {
      return Promise.resolve(values[0])
    }
    return Promise.reject("No meta data for key '" + key + "'")
  })
}


function getMatchType(id) {
  return db.get("match_type", id)
}
function getMatchTypes(wheres, values, joins) {
  return db.getMany("match_type", ["*"], wheres, values, joins)
}


function getPlayer(id) {
  return db.get("player", id).then((player) => {
    return getTeam(player.team_id).then((team) => {
      return getPlayerTypes(["id"], [player.type_id]).then((playerTypes) => {
        delete player.team_id
        player["spp"] = player.completions + ((player.interceptions + player.casualties) * 2) + (player.touchdowns * 3) + (player.mvps * 5)
        player["team"] = team
        delete player.type_id
        player["type"] = playerTypes[0]
        player.miss_next_game = player.miss_next_game ? true : false
        player.niggling_injury = player.niggling_injury ? true : false
        player.dead = player.dead ? true : false
        return Promise.resolve(player)
      })
    })
  })
}
function getPlayers(wheres, values, joins) {
  return db.getMany("player", ["*"], wheres, values, joins).then((players) => {
    return getTeams().then((teams) => {
      return getPlayerTypes(["star_player"], [0]).then((playerTypes) => {
        for (var i in players) {
          players[i]["spp"] = players[i].completions + ((players[i].interceptions + players[i].casualties) * 2) + (players[i].touchdowns * 3) + (players[i].mvps * 5)
          for (var j in teams) {
            if (players[i].team_id == teams[j].id) {
              delete players[i].team_id
              players[i]["team"] = teams[j]
              break
            }
          }
        }
        for (var i in players) {
          for (var j in playerTypes) {
            if (players[i].type_id == playerTypes[j].id) {
              delete players[i].type_id
              players[i]["type"] = playerTypes[j]
              break
            }
          }
        }
        for (var i in players) {
          players[i].miss_next_game = players[i].miss_next_game ? true : false
          players[i].niggling_injury = players[i].niggling_injury ? true : false
          players[i].dead = players[i].dead ? true : false
        }
        return Promise.resolve(players)
      })
    })
  })
}
function getPlayersForSeason(seasonID) {
  return getSeason(seasonID).then((season) => {
    return getPlayers(["team.season_id"], [season.id], ["INNER JOIN team ON team.id=player.team_id"])
  })
}
function getPlayersForTeam(teamID) {
  return getTeam(teamID).then((team) => {
    return getPlayers(["team_id"], [team.id])
  })
}



function getPlayerType(id) {
  return db.get("player_type", id).then((playerType) => {
    return getRace(playerType.race_id).then((race) => {
      if (playerType.star_player == 1) {
        playerType.star_player = true
      } else {
        playerType.star_player = false
      }
      delete playerType.race_id
      playerType["race"] = race
      return Promise.resolve(playerType)
    })
  })
}
function getPlayerTypes(wheres, values, joins) {
  return db.getMany("player_type", ["*"], wheres, values, joins).then((playerTypes) => {
    return getRaces().then((races) => {
      for (var i in playerTypes) {
        if (playerTypes[i].star_player == 1) {
          playerTypes[i].star_player = true
        } else {
          playerTypes[i].star_player = false
        }
      }
      for (var i in playerTypes) {
        for (var j in races) {
          if (playerTypes[i].race_id == races[j].id) {
            delete playerTypes[i].race_id
            playerTypes[i]["race"] = races[j]
            break
          }
        }
      }
      return Promise.resolve(playerTypes)
    })
  })
}


function getPurchase(id) {
  return db.get("purchase", id)
}
function getPurchases(wheres, values, joins) {
  return db.getMany("purchase", ["*"], wheres, values, joins)
}


function getRace(id) {
  return db.get("race", id)
}
function getRaces(wheres, values, joins) {
  return db.getMany("race", undefined, wheres, values, joins)
}


function getCurrentSeason() {
  return getMeta(META_SEASON_CURRENT).then((meta) => {
    return getSeason(meta.value)
  })
}
function getSeason(id) {
  return db.get("season", id).then((season) => {
    return getTrophy(season.trophy_id).then((trophy) => {
      delete season.trophy_id
      season["trophy"] = trophy
      return Promise.resolve(season)
    })
  })
}
function getWinningTeamForSeason(seasonID) {
  return getSeason(seasonID).then((season) => {
    return new Promise((resolve, reject) => {
      if (season.winner_team_id !== null) {
        return getTeam(season.winner_team_id).then((team) => resolve(team)).catch(reject)
      }
      return resolve(null)
    })
  })
}

function getSeasons(wheres, values, joins) {
  // console.log("getSeasons")
  return db.getMany("season", undefined, wheres, values, joins)
    .then((seasons) => {
      return getTrophies().then((trophies) => {
        for (var i in seasons) {
          var trophyID = seasons[i].trophy_id
          for (var j in trophies) {
            if (trophies[j].id == trophyID) {
              delete seasons[i].trophy_id
              seasons[i]["trophy"] = trophies[j]
              break
            }
          }
        }
        return Promise.resolve(seasons)
      })
    })
}

function getSeasonsForCoach(coachID) {
  return getCoach(coachID)
    .then((coach) => {
      return getSeasons(["team.coach_id"], [coach.id], ["INNER JOIN team ON team.season_id = season.id"])
    })
}
function getSeasonsForTeam(teamID) {
  return getTeam(teamID).then((team) => {
    return getSeasons(["team.id"], [team.id], ["INNER JOIN team ON team.season_id=season.id"])
  })
}

function getSkill(id) {
  return db.get("skill", id)
}
function getSkills(wheres, values, joins) {
  return db.getMany("skill", ["*"], wheres, values, joins)
}
function getSkillsForPlayer(playerID) {
  return getPlayer(playerID).then((player) => {
    return getSkills(["player_type_skill.player_type_id"], [player.type.id], ["INNER JOIN player_type_skill ON player_type_skill.skill_id=skill.id"]).then((playerTypeSkills) => {
      return getSkills(["player_skill.player_id"], [player.id], ["INNER JOIN player_skill ON player_skill.skill_id=skill.id"]).then((playerSkills) => {
        return Promise.resolve(playerTypeSkills.concat(playerSkills))
      })
    })
  })
}

function getTeam(id) {
  return db.get("team", id).then((team) => {
    return getCoach(team.coach_id).then((coach) => {
      return getRace(team.race_id).then((race) => {
        return getSeason(team.season_id).then((season) => {
          delete team.coach_id
          delete team.race_id
          delete team.season_id
          team["coach"] = coach
          team["race"] = race
          team["season"] = season
          return Promise.resolve(team)
        })
      })
    })
  })
}
function getTeams(wheres, values, joins, unique) {
  if (!Type.is(unique, Boolean)) {
    unique = false
  }      
  if (unique) {
    wheres.push("prev_team_id")
    values.push(null)
  }
  return db.getMany("team", ["*"], wheres, values, joins).then((teams) => {
    return getCoaches().then((coaches) => {
      return getRaces().then((races) => {
        return getSeasons().then((seasons) => {
          for (var i in teams) {
            for (var j in coaches) {
              if (teams[i].coach_id == coaches[j].id) {
                delete teams[i].coach_id
                teams[i]["coach"] = coaches[j]
                break
              }
            }
            for (var j in races) {
              if (teams[i].race_id == races[j].id) {
                delete teams[i].race_id
                teams[i]["race"] = races[j]
                break
              }
            }
            for (var j in seasons) {
              if (teams[i].season_id == seasons[j].id) {
                delete teams[i].season_id
                teams[i]["season"] = seasons[j]
                break
              }
            }
          }
          return Promise.resolve(teams)
        })
      })
    })
  })
}
function getTeamsForCoach(coachID, seasonID, unique) {
  if (!Type.is(unique, Boolean)) {
    unique = false
  }
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
      if (unique) {
        wheres.push("prev_team_id")
        values.push(null)
      }
      return getTeams(wheres, values)
    })
  })
}
function getTeamsForSeason(seasonID) {
  return getSeason(seasonID).then((season) => {
    return getTeams(["season_id"], [season.id])
  })
}

function getTrophy(id) {
  return db.get("trophy", id)
}
function getTrophies(wheres, values, joins) {
  return db.getMany("trophy", undefined, wheres, values, joins)
}

module.exports = {
  META_SEASON_CURRENT: META_SEASON_CURRENT,
  search: search,
  getCoach: getCoach,
  getCoaches: getCoaches,
  getCoachesForSeason: getCoachesForSeason,
  getInducement: getInducement,
  getInducements: getInducements,
  getMatch: getMatch,
  getMatches: getMatches,
  getMatchesForCoach: getMatchesForCoach,
  getMatchesForSeason: getMatchesForSeason,
  getMatchType: getMatchType,
  getMatchTypes: getMatchTypes,
  getMeta: getMeta,
  getPlayer: getPlayer,
  getPlayers: getPlayers,
  getPlayersForSeason: getPlayersForSeason,
  getPlayersForTeam: getPlayersForTeam,
  getPlayerType: getPlayerType,
  getPlayerTypes: getPlayerTypes,
  getPurchase: getPurchase,
  getPurchases: getPurchases,
  getRace: getRace,
  getRaces: getRaces,
  getCurrentSeason: getCurrentSeason,
  getSeason: getSeason,
  getSeasons: getSeasons,
  getSeasonsForCoach: getSeasonsForCoach,
  getSeasonsForTeam: getSeasonsForTeam,
  getWinningTeamForSeason: getWinningTeamForSeason,
  getSkill: getSkill,
  getSkills: getSkills,
  getSkillsForPlayer: getSkillsForPlayer,
  getTeam: getTeam,
  getTeams: getTeams,
  getTeamsForCoach: getTeamsForCoach,
  getTeamsForSeason: getTeamsForSeason,
  getTrophy: getTrophy,
  getTrophies: getTrophies
}
