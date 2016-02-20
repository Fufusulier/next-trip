var express = require('express');
var router = express.Router();
var _ = require('underscore');

var proposals = [{
  city: 'Porto',
  country: 'PT',
  rank: 2
}];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json(proposals);
});

router.get('/:city/increment', function(req, res, next) {
  var city = _.find(proposals, function(proposal) {
    return proposal.city === req.params.city;
  });
  city.rank++;
  res.status(200).json(city);
});


router.get('/:city/decrement', function(req, res, next) {
  var city = _.find(proposals, function(proposal) {
    return proposal.city === req.params.city;
  });
  city.rank--;
  res.status(200).json(city);
});

router.post('/', function(req, res, next) {
  var city = req.body.city;
  var country = req.body.country;

  proposals.push({
    city: city,
    country: country,
    rank: 1
  });

  res.status(200).json(proposals[proposals.length - 1]);
});

module.exports = router;
