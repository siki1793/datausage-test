var express = require('express')
  , router = express.Router()
  , bikeRoutes = router.route('/')

bikeRoutes.get(function (req, res) {
    res.send('api GET request received');
    console.log("bike routes was called");
});

module.exports = bikeRoutes
module.exports = router
