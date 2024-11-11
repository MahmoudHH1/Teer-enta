const router = require('express').Router();
const hotelsController = require('../controllers/hotels');
const isAuth = require('../middlewares/isAuth');

router.get('/getHotelOffers', hotelsController.getHotelOffers);
router.post('/bookHotel', isAuth,hotelsController.bookHotel);
router.get('/getBookedHotels', isAuth, hotelsController.getBookedHotels);

module.exports = router;