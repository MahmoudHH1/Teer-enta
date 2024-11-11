const router = require('express').Router();
const  flightsController = require('../controllers/flights');
const isAuth = require('../middlewares/isAuth');

router.get('/getAirports', flightsController.getAirports);
router.get('/getFlightOffers', flightsController.getFlightOffers);
router.post('/bookFlight', isAuth, flightsController.bookFlight);
router.get('/getBookedFlights', isAuth, flightsController.getBookedFlights);

module.exports = router;