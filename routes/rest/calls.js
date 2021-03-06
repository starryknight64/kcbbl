var db = require("../../includes/db")
var Type = require("type-of-is")

function search(query, filter) {
  var queries = {
    "card": [null, ["name", "description", "timing", "effect"], null],
    "coach": [["id", "name"], ["name"], null],
    "deck": [null, ["name"], null],
    "inducement": [null, ["name", "description"], "GROUP BY name"],
    "player": [null, ["name"], "GROUP BY name"],
    "player_type": [null, ["name", "description"], "GROUP BY CASE WHEN star_player=1 THEN name ELSE id END"],
    "purchase": [null, ["name", "description"], "GROUP BY name"],
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
function getCoachesAuth(wheres, values, joins) {
  return db.getMany("coach", undefined, wheres, values, joins)
}
function getCoachesForSeason(seasonID) {
  return getSeason(seasonID)
    .then((season) => {
      return getCoaches(["team.season_id"], [season.id], ["INNER JOIN team ON team.coach_id = coach.id"])
    })
}


function getCard(id) {
  return db.get("card", id)
}
function getCards(wheres, values, joins, cmp, tail, order) {
  return db.getMany("card", undefined, wheres, values, joins, cmp, tail, order)
}
function getCardsForDeck(deckID) {
  return getDeck(deckID)
    .then((deck) => {
      return getCards(["card.deck_id"], [deck.id], ["INNER JOIN deck ON deck.id = card.deck_id"])
    })
}

function getDeck(id) {
  return db.get("deck", id)
}
function getDecks(wheres, values, joins, cmp, tail, order) {
  return db.getMany("deck", undefined, wheres, values, joins, cmp, tail, order)
}

function getInducement(id) {
  return db.get("inducement", id)
}
function getInducements(wheres, values, joins, cmp, tail, order) {
  return db.getMany("inducement", undefined, wheres, values, joins, cmp, tail, order)
}
function getInducementsForMatchAndTeam(matchID, teamID) {
  return getMatch(matchID).then((match) => {
    return getTeam(teamID).then((team) => {
      var promises = []
      promises.push(db.getMany("match_inducement", ["match_inducement.amount","i.name","i.cost","i.description"], ["match_inducement.match_id", "match_inducement.team_id"], [match.id, team.id], ["INNER JOIN inducement i ON i.id = match_inducement.inducement_id"]))
      promises.push(db.getMany("match_inducement", ["match_inducement.amount","pt.name","pt.value AS cost","pt.star_player","pt.id","r.name AS raceName"], ["match_inducement.match_id", "match_inducement.team_id"], [match.id, team.id], ["INNER JOIN player_type pt ON pt.id = match_inducement.player_type_id", "INNER JOIN race r ON r.id = pt.race_id"]))
      //promises.push(db.getMany("match_inducement", ["*"], ["match_inducement.match_id", "match_inducement.team_id"], [match.id, team.id], ["INNER JOIN deck d ON d.id = match_inducement.deck_id"]))
      promises.push(db.getMany("match_inducement", ["match_inducement.amount","d.name","d.cost","c.name AS cardName","c.description"], ["match_inducement.match_id", "match_inducement.team_id"], [match.id, team.id], ["LEFT JOIN card c ON c.id = match_inducement.card_id", "INNER JOIN deck d ON d.id = match_inducement.deck_id"]))
      
      return Promise.all(promises).then((inducementData) => {
        return Promise.resolve({ "inducements": inducementData[0], "playerInducements": inducementData[1], "deckInducements": inducementData[2]/*, "cardInducements": inducementData[3]*/ })
      })
    })
  })
}

function formatMatch(match, seasons, matchTypes, teams) {
  for (var i in seasons) {
    if (seasons[i].id == match.season_id) {
      match["season"] = seasons[i]
      break
    }
  }

  for (var i in matchTypes) {
    if (matchTypes[i].id == match.team1_match_type_id) {
      match["team1_match_type"] = matchTypes[i]
    }

    for (var i in matchTypes) {
      if (matchTypes[i].id == match.team2_match_type_id) {
        match["team2_match_type"] = matchTypes[i]
      }
    }
  }

  for (var i in teams) {
    if (teams[i].id == match.team1_id) {
      t1Found = true
      match["team1"] = teams[i]
    }

    for (var i in teams) {
      if (teams[i].id == match.team2_id) {
        t2Found = true
        match["team2"] = teams[i]
      }
    }
  }
  return match
}
function getMatch(id) {
  return db.get("match", id).then((match) => {
    return getSeason(match.season_id).then((season) => {
      return getMatchTypes(["id", "id"], [match.team1_match_type_id, match.team2_match_type_id], undefined, "OR").then((matchTypes) => {
        return getTeams(["id", "id"], [match.team1_id, match.team2_id], undefined, "OR").then((teams) => {
          return Promise.resolve(formatMatch(match, [season], matchTypes, teams))
        })
      })
    })
  })
}
function getMatches(wheres, values, joins) {
  return db.getMany("match", undefined, wheres, values, joins).then((matches) => {
    return getSeasons().then((seasons) => {
      return getMatchTypes().then((matchTypes) => {
        return getTeams().then((teams) => {
          var formattedMatches = []
          for (var i in matches) {
            formattedMatches.push(formatMatch(matches[i], seasons, matchTypes, teams))
          }
          return Promise.resolve(formattedMatches)
        })
      })
    })
  })
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
      return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
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
    })
  })
}

var META_SEASON_CURRENT = "season.current"
function getMeta(key) {
  return db.getMany("meta", undefined, ["mkey"], [key]).then((values) => {
    if (values.length > 0) {
      return Promise.resolve(values[0])
    }
    return Promise.reject("No meta data for key '" + key + "'")
  })
}


function getMatchType(id) {
  return db.get("match_type", id)
}
function getMatchTypes(wheres, values, joins, cmp) {
  return db.getMany("match_type", undefined, wheres, values, joins, cmp)
}


function getPlayersForMatchAndTeam(matchID, teamID) {
  var wheres = ["match_player.match_id", "player.team_id"]
  var values = [matchID, teamID]
  var joins = ["INNER JOIN player ON player.id=match_player.player_id"]
  return db.getMany("match_player", undefined, wheres, values, joins).then((matchPlayers) => {
    return getPlayersForTeam(teamID).then((players) => {
      for (var i in matchPlayers) {
        var matchPlayer = matchPlayers[i]

        matchPlayer.interceptions = matchPlayer.interceptions ? matchPlayer.interceptions : 0
        matchPlayer.completions = matchPlayer.completions ? matchPlayer.completions : 0
        matchPlayer.touchdowns = matchPlayer.touchdowns ? matchPlayer.touchdowns : 0
        matchPlayer.casualties = matchPlayer.casualties ? matchPlayer.casualties : 0
        matchPlayer.kills = matchPlayer.kills ? matchPlayer.kills : 0
        matchPlayer.mvp = matchPlayer.mvp ? matchPlayer.mvp : 0

        for (var j in players) {
          if (matchPlayer.player_id == players[j].id) {
            matchPlayer["player"] = players[j]
            delete matchPlayer.player_id
          }
        }
      }

      var skillsPromises = []
      for (var i in matchPlayers) {
        var matchPlayer = matchPlayers[i]
        if (matchPlayer) {
          skillsPromises.push(getSkillsForPlayerAndMatch(matchPlayer.player.id, matchID))
        }
      }

      return Promise.all(skillsPromises).then((skillData) => {
        for (var i in matchPlayers) {
          if (skillData[i]) {
            matchPlayers[i]["skills"] = skillData[i]
          } else {
            matchPlayers[i]["skills"] = []
          }
        }

        var numberedPlayers = {}
        var found = false
        for (var i in [...Array(16)]) {
          var num = Number(i) + 1
          found = false
          for (var j in matchPlayers) {
            var matchPlayer = matchPlayers[j]
            if (matchPlayer.player.number == num) {
              found = true
              numberedPlayers[num] = matchPlayer
              break
            }
          }
          if (!found) {
            numberedPlayers[num] = null
          }
        }

        return Promise.resolve(numberedPlayers)
      })
    })
  })
}


function getPlayer(id) {
  return db.get("player", id).then((player) => {
    return getTeam(player.team_id).then((team) => {
      return getPlayerTypes(["id"], [player.type_id]).then((playerTypes) => {
        player["spp"] = player.completions + ((player.interceptions + player.casualties) * 2) + (player.touchdowns * 3) + (player.mvps * 5)
        player["team"] = team
        player["type"] = playerTypes[0]
        // player.miss_next_game = player.miss_next_game ? true : false
        // player.niggling_injury = player.niggling_injury ? true : false
        player.dead = player.dead ? true : false
        return Promise.resolve(player)
      })
    })
  })
}
function getPlayers(wheres, values, joins) {
  return db.getMany("player", undefined, wheres, values, joins).then((players) => {
    return getTeams().then((teams) => {
      return getPlayerTypes(["star_player"], [0]).then((playerTypes) => {
        for (var i in players) {
          players[i]["spp"] = players[i].completions + ((players[i].interceptions + players[i].casualties) * 2) + (players[i].touchdowns * 3) + (players[i].mvps * 5)
          for (var j in teams) {
            if (players[i].team_id == teams[j].id) {
              players[i]["team"] = teams[j]
              break
            }
          }
        }
        for (var i in players) {
          for (var j in playerTypes) {
            if (players[i].type_id == playerTypes[j].id) {
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
      playerType["race"] = race
      return Promise.resolve(playerType)
    })
  })
}
function getPlayerTypes(wheres, values, joins) {
  return db.getMany("player_type", undefined, wheres, values, joins).then((playerTypes) => {
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
            playerTypes[i]["race"] = races[j]
            break
          }
        }
      }
      return Promise.resolve(playerTypes)
    })
  })
}
function getStarPlayers() {
  return db.getMany("player_type", undefined, ["star_player"], ["1"]).then((playerTypes) => {
    return getAllRaces().then((races) => {
      for (var i in playerTypes) {
        playerTypes[i].star_player = true
      }
      
      var playerTypesUnique = []
      for (var i in playerTypes) {
        var found = false
        for (var j in playerTypesUnique) {
          if (playerTypesUnique[j].name == playerTypes[i].name) {
            found = true
            break
          }
        }
        
        if (!found) {
          playerTypes[i].races = []
          playerTypesUnique.push(playerTypes[i])
        }
      }

      for (var i in playerTypes) {
        for (var j in races) {
          if (playerTypes[i].race_id == races[j].id) {
            for (var k in playerTypesUnique) {
              if (playerTypesUnique[k].name == playerTypes[i].name) {
                playerTypesUnique[k].races.push(races[j])
                break
              }
            }
            break
          }
        }
      }
      
      for (var i in playerTypesUnique) {
        playerTypesUnique[i].races.sort((a, b) => (a.name > b.name) ? 1 : -1)
        delete playerTypesUnique[i].race
      }
    
      var promises = []
      for (var i in playerTypesUnique) {
        promises.push(getSkillsForPlayerTypeID(playerTypesUnique[i].id))
      }

      return Promise.all(promises).then((playerTypeSkillsData) => {
        for (var i in playerTypesUnique) {
          playerTypesUnique[i].skills = playerTypeSkillsData[i]
        }
        return Promise.resolve(playerTypesUnique)
      })
    })
  })
}


function getPurchase(id) {
  return db.get("purchase", id)
}
function getPurchases(wheres, values, joins, cmp, tail, order) {
  return db.getMany("purchase", undefined, wheres, values, joins, cmp, tail, order)
}
function getPurchasesForMatchAndTeam(matchID, teamID) {
  return getMatch(matchID).then((match) => {
    return getTeam(teamID).then((team) => {
      var promises = []
      promises.push(db.getMany("match_purchase", ["match_purchase.amount","p.name","p.cost","p.description"], ["match_purchase.match_id", "match_purchase.team_id"], [match.id, team.id], ["INNER JOIN purchase p ON p.id = match_purchase.purchase_id"]))
      promises.push(db.getMany("match_purchase", ["match_purchase.amount","pt.name","pt.value AS cost","r.name AS raceName"], ["match_purchase.match_id", "match_purchase.team_id"], [match.id, team.id], ["INNER JOIN player_type pt ON pt.id = match_purchase.player_type_id", "INNER JOIN race r ON r.id = pt.race_id"]))
      
      return Promise.all(promises).then((purchaseData) => {
        return Promise.resolve({ "purchases": purchaseData[0], "playerPurchases": purchaseData[1] })
      })
    })
  })
}


function getRace(id) {
  return db.get("race", id)
}
function getRaces(wheres, values, joins) {
  return db.getMany("race", undefined, wheres, values, joins)
}
function getAllRaces() {
  return db.getMany("race", undefined, undefined, undefined, undefined, undefined, undefined, "ORDER BY name ASC")
}


function getCurrentSeason() {
  return getMeta(META_SEASON_CURRENT).then((meta) => {
    return getSeason(meta.value)
  })
}
function getPreviousSeason(seasonID) {
  return db.getMany("season", undefined, ["id"], [seasonID], undefined, ["<"], undefined, "ORDER BY id DESC").then((seasons) => {
    if (seasons.length > 0) {
      return Promise.resolve(seasons[0])
    }
    return Promise.resolve(null)
  })
}
function getNextSeason(seasonID) {
  return db.getMany("season", undefined, ["id"], [seasonID], undefined, [">"], undefined, "ORDER BY id ASC").then((seasons) => {
    if (seasons.length > 0) {
      return Promise.resolve(seasons[0])
    }
    return Promise.resolve(null)
  })
}
function getSeason(id) {
  return db.get("season", id).then((season) => {
    return getTrophy(season.trophy_id).then((trophy) => {
			return db.getMany("match", undefined, ["season_id"], [season.id], undefined, undefined, "GROUP BY season_id").then((firstMatches) => {
				return db.getMany("team", undefined, ["season_id"], [season.id], undefined, undefined, "GROUP BY season_id").then((firstTeams) => {
					return db.getMany("player", ["player.id","player.name","player.team_id","team.season_id"], undefined, undefined, ["INNER JOIN team ON team.id = player.team_id"], undefined, "GROUP BY season_id").then((firstPlayers) => {
						season.trophy = trophy
						season.firstMatch = null
						if (firstMatches.length > 0) {
							season.firstMatch = firstMatches[0]
						}
						season.firstTeam = null
						if (firstTeams.length > 0) {
							season.firstTeam = firstTeams[0]
						}
						season.firstPlayer = null
						if (firstPlayers.length > 0) {
							season.firstPlayer = firstPlayers[0]
						}
						return Promise.resolve(season)
					})
				})
			})
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
  return db.getMany("season", undefined, wheres, values, joins).then((seasons) => {
		return getTrophies().then((trophies) => {
			return db.getMany("match", undefined, undefined, undefined, undefined, undefined, "GROUP BY season_id").then((firstMatches) => {
				return db.getMany("team", undefined, undefined, undefined, undefined, undefined, "GROUP BY season_id").then((firstTeams) => {
					              //table, cols, wheres, values, joins, cmp, tail, order
					return db.getMany("player", ["player.id","player.name","player.team_id","team.season_id"], undefined, undefined, ["INNER JOIN team ON team.id = player.team_id"], undefined, "GROUP BY season_id").then((firstPlayers) => {
						for (var i in seasons) {
							var trophyID = seasons[i].trophy_id
							for (var j in trophies) {
								if (trophies[j].id == trophyID) {
									seasons[i]["trophy"] = trophies[j]
									break
								}
							}
							
							var hasMatches = false
							for (var j in firstMatches) {
								if (firstMatches[j].season_id == seasons[i].id) {
									seasons[i].firstMatch = firstMatches[j]
									hasMatches = true
									break
								}
							}
							if (!hasMatches) {
								seasons[i].firstMatch = null
							}
							
							var hasTeams = false
							for (var j in firstTeams) {
								if (firstTeams[j].season_id == seasons[i].id) {
									seasons[i].firstTeam = firstTeams[j]
									hasTeams = true
									break
								}
							}
							if (!hasTeams) {
								seasons[i].firstTeam = null
							}
							
							var hasPlayers = false
							for (var j in firstPlayers) {
								if (firstPlayers[j].season_id == seasons[i].id) {
									seasons[i].firstPlayer = firstPlayers[j]
									hasPlayers = true
									break
								}
							}
							if (!hasPlayers) {
								seasons[i].firstPlayer = null
							}
						}
						return Promise.resolve(seasons)
					})
				})
			})
		})
	})
}

function getSeasonsForCoach(coachID) {
  return getCoach(coachID).then((coach) => {
    return getSeasons(["team.coach_id"], [coach.id], ["INNER JOIN team ON team.season_id = season.id"])
  })
}
function getSeasonsForTeam(teamID) {
  return getTeam(teamID).then((team) => {
    return getSeasons(["team.id"], [team.id], ["INNER JOIN team ON team.season_id=season.id"])
  })
}
function getSeasonsForPlayer(playerID) {
  return getTeamsForPlayer(playerID).then((teams) => {
    var seasons = []
    for (var i in teams) {
      seasons.push(teams[i].season)
    }
    return Promise.resolve(seasons)
  })
}

function getSkill(id) {
  return db.get("skill", id)
}
function getSkills(wheres, values, joins) {
  return db.getMany("skill", undefined, wheres, values, joins)
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
function getSkillsForPlayerIDAndPlayerTypeID(playerID, playerTypeID) {
  return getSkills(["player_type_skill.player_type_id"], [playerTypeID], ["INNER JOIN player_type_skill ON player_type_skill.skill_id=skill.id"]).then((playerTypeSkills) => {
    return getSkills(["player_skill.player_id"], [playerID], ["INNER JOIN player_skill ON player_skill.skill_id=skill.id"]).then((playerSkills) => {
      return Promise.resolve(playerTypeSkills.concat(playerSkills))
    })
  })
}
function getSkillsForPlayerTypeID(playerTypeID) {
  return getSkills(["player_type_skill.player_type_id"], [playerTypeID], ["INNER JOIN player_type_skill ON player_type_skill.skill_id=skill.id"])
}
function getSkillsForPlayerAndMatch(playerID, matchID) {
  return getPlayer(playerID).then((player) => {
    return getMatch(matchID).then((match) => {
      return getSkills(["match_player_skill.player_id", "match_player_skill.match_id"], [player.id, match.id], ["INNER JOIN match_player_skill ON match_player_skill.skill_id=skill.id"])
    })
  })
}

function getSkillType(id) {
  return db.get("skill_type", id)
}
function getSkillTypes(wheres, values, joins) {
  return db.getMany("skill_type", undefined, wheres, values, joins)
}

function getSkillupNormals() {
  return db.getMany("player_type_skill_type_normal", undefined, undefined, undefined, undefined, undefined, undefined, "ORDER BY player_type_id ASC")
}
function getSkillupDoubles() {
  return db.getMany("player_type_skill_type_double", undefined, undefined, undefined, undefined, undefined, undefined, "ORDER BY player_type_id ASC")
}

function getTeam(id) {
  return db.get("team", id).then((team) => {
    return getCoach(team.coach_id).then((coach) => {
      return getRace(team.race_id).then((race) => {
        return getSeason(team.season_id).then((season) => {
          team["coach"] = coach
          team["race"] = race
          team["season"] = season
          return Promise.resolve(team)
        })
      })
    })
  })
}
function getTeams(wheres, values, joins, cmp) {
  return db.getMany("team", undefined, wheres, values, joins, cmp).then((teams) => {
    return getCoaches().then((coaches) => {
      return getRaces().then((races) => {
        return getSeasons().then((seasons) => {
					return db.getMany("player", undefined, undefined, undefined, undefined, undefined, "GROUP BY team_id").then((teamPlayers) => {
						for (var i in teams) {
							teams[i].coach = null
							for (var j in coaches) {
								if (teams[i].coach_id == coaches[j].id) {
									teams[i].coach = coaches[j]
									break
								}
							}
							
							teams[i].race = null
							for (var j in races) {
								if (teams[i].race_id == races[j].id) {
									teams[i].race = races[j]
									break
								}
							}
							
							teams[i].season = null
							for (var j in seasons) {
								if (teams[i].season_id == seasons[j].id) {
									teams[i].season = seasons[j]
									break
								}
							}
							
							teams[i].firstPlayer = null
							for (var j in teamPlayers) {
								if (teamPlayers[j].team_id == teams[i].id) {
									teams[i].firstPlayer = teamPlayers[j]
									break
								}
							}
						}
						return Promise.resolve(teams)
					})
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
function getTeamsForPlayer(playerID) {
  return getPlayer(playerID).then((player) => {
    return getPrevTeamsForPlayer(player).then((prevTeams) => {
      if (prevTeams == null) {
        prevTeams = []
      }
      return getNextTeamsForPlayer(player).then((nextTeams) => {
        if (nextTeams == null) {
          nextTeams = []
        }
        return Promise.resolve(prevTeams.concat(nextTeams))
      })
    })
  })
}
function getPrevTeamsForPlayer(player) {
  return getTeams(["player.id"], [player.id], ["INNER JOIN player ON player.team_id=team.id"]).then((teams) => {
    var playerTeams = [teams[0]]
    return new Promise((resolve, reject) => {
      if (player.prev_player_id !== null) {
        return getPlayer(player.prev_player_id).then((prevPlayer) => {
          return getPrevTeamsForPlayer(prevPlayer).then((prevPlayerTeams) => {
            return resolve(prevPlayerTeams)
          })
        })
      }
      return resolve(null)
    }).then((prevPlayerTeams) => {
      if (prevPlayerTeams !== null) {
        return Promise.resolve(prevPlayerTeams.concat(playerTeams))
      }
      return Promise.resolve(playerTeams)
    })
  })
}
function getNextTeamsForPlayer(prevPlayer) {
  return getPlayers(["prev_player_id"], [prevPlayer.id]).then((players) => {
    var playerTeams = []
    var player = null
    return new Promise((resolve, reject) => {
      if (players && players.length > 0) {
        player = players[0]
        return getTeams(["player.id"], [player.id], ["INNER JOIN player ON player.team_id=team.id"]).then((teams) => {
          return resolve(teams)
        })
      }
      return resolve(null)
    }).then((nextPlayerTeams) => {
      if (nextPlayerTeams !== null) {
        playerTeams.push(nextPlayerTeams[0])
        return getNextTeamsForPlayer(player).then((nextPlayerTeams) => {
          return Promise.resolve(playerTeams.concat(nextPlayerTeams))
        })
      }
      return Promise.resolve(playerTeams)
    })
  })
}
function getTeamsUnique(wheres, values, joins, cmp) {
  if (!Type.is(wheres, Array)) {
    wheres = []
  }
  if (!Type.is(values, Array)) {
    values = []
  }
  wheres.push("prev_team_id")
  values.push(null)
  return getTeams(wheres, values, joins, cmp)
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
  getCoachesAuth: getCoachesAuth,
  getCoachesForSeason: getCoachesForSeason,
  getCard: getCard,
  getCards: getCards,
  getCardsForDeck: getCardsForDeck,
  getDeck: getDeck,
  getDecks: getDecks,
  getInducement: getInducement,
  getInducements: getInducements,
  getInducementsForMatchAndTeam: getInducementsForMatchAndTeam,
  getMatch: getMatch,
  getMatches: getMatches,
  getMatchesForCoach: getMatchesForCoach,
  getMatchesForSeason: getMatchesForSeason,
  getMatchType: getMatchType,
  getMatchTypes: getMatchTypes,
  getMeta: getMeta,
  getPlayersForMatchAndTeam: getPlayersForMatchAndTeam,
  getPlayer: getPlayer,
  getPlayers: getPlayers,
  getPlayersForSeason: getPlayersForSeason,
  getPlayersForTeam: getPlayersForTeam,
  getPlayerType: getPlayerType,
  getPlayerTypes: getPlayerTypes,
  getStarPlayers: getStarPlayers,
  getPurchase: getPurchase,
  getPurchases: getPurchases,
  getPurchasesForMatchAndTeam: getPurchasesForMatchAndTeam,
  getRace: getRace,
  getRaces: getRaces,
  getAllRaces: getAllRaces,
  getCurrentSeason: getCurrentSeason,
  getPreviousSeason: getPreviousSeason,
  getNextSeason: getNextSeason,
  getSeason: getSeason,
  getSeasons: getSeasons,
  getSeasonsForCoach: getSeasonsForCoach,
  getSeasonsForPlayer: getSeasonsForPlayer,
  getSeasonsForTeam: getSeasonsForTeam,
  getWinningTeamForSeason: getWinningTeamForSeason,
  getSkill: getSkill,
  getSkills: getSkills,
  getSkillsForPlayer: getSkillsForPlayer,
  getSkillsForPlayerIDAndPlayerTypeID: getSkillsForPlayerIDAndPlayerTypeID,
  getSkillsForPlayerTypeID: getSkillsForPlayerTypeID,
  getSkillsForPlayerAndMatch: getSkillsForPlayerAndMatch,
  getSkillType: getSkillType,
  getSkillTypes: getSkillTypes,
  getSkillupNormals: getSkillupNormals,
  getSkillupDoubles: getSkillupDoubles,
  getTeam: getTeam,
  getTeams: getTeams,
  getTeamsForCoach: getTeamsForCoach,
  getTeamsForSeason: getTeamsForSeason,
  getTeamsForPlayer: getTeamsForPlayer,
  getTeamsUnique: getTeamsUnique,
  getTrophy: getTrophy,
  getTrophies: getTrophies
}
