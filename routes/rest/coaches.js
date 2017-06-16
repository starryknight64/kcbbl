var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

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

module.exports = router;
module.exports = getCoach
module.exports = getCoaches
module.exports = getCoachesForSeason
