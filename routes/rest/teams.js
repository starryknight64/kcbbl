var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

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

module.exports = router;
module.exports = getTeam
module.exports = getTeams
module.exports = getTeamsForCoach
module.exports = getTeamsForSeason
