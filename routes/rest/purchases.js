var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

function getPurchase(id) {
  return get("purchase", id)
}
function getPurchases(wheres, values, joins) {
  return getMany("purchase", ["*"], wheres, values, joins)
}

module.exports = router;
module.exports = getPurchase
module.exports = getPurchases
