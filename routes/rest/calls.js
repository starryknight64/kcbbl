var db = require("../../includes/db")

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


function getMatchType(id) {
  return db.get("match_type", id)
}
function getMatchTypes(wheres, values, joins) {
  return db.getMany("match_type", ["*"], wheres, values, joins)
}


function getPlayer(id) {
  return db.get("player", id)
}
function getPlayers(wheres, values, joins) {
  return db.getMany("player", ["*"], wheres, values, joins)
}
function getPlayersForSeason(seasonID) {
  return getSeason(seasonID).then((season) => {
    return getPlayers(["team.season_id"], [season.id], ["INNER JOIN team_player ON team_player.player_id=player.id", "INNER JOIN team ON team.id=team_player.team_id"])
  })
}



function getPlayerType(id) {
  return db.get("player_type", id)
}
function getPlayerTypes(wheres, values, joins) {
  return db.getMany("player_type", ["*"], wheres, values, joins)
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


function getCurrentSeason(seasons) {
  var today = new Date()
  for (var i in seasons) {
    var startDate = new Date(seasons[i].start_date)
    var endDate = new Date(seasons[i].end_date)
    if (startDate <= today && today <= endDate) {
      return seasons[i]
    }
  }
  return null
}
function getSeason(id) {
  return db.get("season", id)
    .then((season) => {
      return getTrophy(season.trophy_id).then((trophy) => {
        delete season.trophy_id
        season["trophy"] = trophy
        return Promise.resolve(season)
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

function getSkill(id) {
  return db.get("skill", id)
}
function getSkills(wheres, values, joins) {
  return db.getMany("skill", ["*"], wheres, values, joins)
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
function getTeams(wheres, values, joins) {
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
              }
            }
          }
          return Promise.resolve(teams)
        })
      })
    })
  })
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

function getTrophy(id) {
  return db.get("trophy", id)
}
function getTrophies(wheres, values, joins) {
  return db.getMany("trophy", undefined, wheres, values, joins)
}

module.exports = {
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
  getPlayer: getPlayer,
  getPlayers: getPlayers,
  getPlayersForSeason: getPlayersForSeason,
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
  getSkill: getSkill,
  getSkills: getSkills,
  getTeam: getTeam,
  getTeams: getTeams,
  getTeamsForCoach: getTeamsForCoach,
  getTeamsForSeason: getTeamsForSeason,
  getTrophy: getTrophy,
  getTrophies: getTrophies
}
