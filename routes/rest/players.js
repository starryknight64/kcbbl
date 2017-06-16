var express = require("express")
var router = express.Router()
var db = require("../../includes/db")
var seasonsREST = require("./seasons")

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

function getPlayer(id) {
  return db.get("player", id)
}
function getPlayers(wheres, values, joins) {
  return db.getMany("player", ["*"], wheres, values, joins)
}
function getPlayersForSeason(seasonID) {
  return seasonsREST.getSeason(seasonID).then((season) => {
    return getPlayers(["team.season_id"], [season.id], ["INNER JOIN team_player ON team_player.player_id=player.id", "INNER JOIN team ON team.id=team_player.team_id"])
  })
}

module.exports = router
module.exports = getPlayer
module.exports = getPlayers
module.exports = getPlayersForSeason
