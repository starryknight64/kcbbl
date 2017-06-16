var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

function getSkill(id) {
  return get("skill", id)
}
function getSkills(wheres, values, joins) {
  return getMany("skill", ["*"], wheres, values, joins)
}

module.exports = router;
module.exports = getSkill
module.exports = getSkills
