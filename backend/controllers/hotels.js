const Amadeus = require('amadeus');
const errorHandler = require("../Util/ErrorHandler/errorSender");
const Tourist = require("../models/Users/Tourist");
const { getCityCodes } = require("../Util/LocationCodes");
const BookedHotel = require("../models/Booking/BookedHotel");

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
});



exports.getHotelOffers = async (req, res) => {
    try{
        const {city, checkInDate, checkOutDate, adults} = req.query;
        const cityCode = await getCityCodes(city);
        if (!cityCode) {
            return res.status(400).json({ error: "Invalid city name or no city code found" });
        }
        const hotels = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: cityCode
        });
        if (!hotels.data || hotels.data.length === 0) {
            return res.status(404).json({ error: 'No hotels found in the city.' });
        }

        const uniqueHotels = [];
        const chainCodes = new Set();

        hotels.data.forEach(hotel => {
            if (!chainCodes.has(hotel.chainCode)) {
                chainCodes.add(hotel.chainCode);
                uniqueHotels.push(hotel); // Add the hotel if chainCode is unique
            }
        });
        let hotelIds = uniqueHotels.map(hotel => hotel.hotelId).slice(0,Math.min(50,uniqueHotels.length)).join(',');
        const hotelSearch = await amadeus.shopping.hotelOffersSearch.get({
            hotelIds: hotelIds,
            // cityCode: cityCode,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            adults: adults,
        });

        res.status(200).json(hotelSearch.data);
    } catch(err) {
        // console.log(err);
        errorHandler.SendError(res, err);
    }
}
exports.bookHotel = async (req, res) => {
    const { hotel, offer, guests, payments } = req.body;
    const paymentMethod = payments.paymentMethod || 'wallet'; // Default to wallet if not specified

    if (!hotel || !offer || !guests || !payments) {
        return res.status(400).json({ error: "Invalid request body: required fields missing (hotel, offer, guests, payments)" });
    }

    try {
        const totalPrice = offer.price.total; // Get total price for the booking
        const userId = req.user._id;

        // Retrieve the tourist's details (e.g., wallet balance)
        const tourist = await Tourist.findById(userId);
        if (!tourist) {
            return res.status(404).json({ message: "Tourist not found." });
        }

        // Check if the user has already booked the same hotel with the same dates
        const existingBooking = await BookedHotel.findOne({
            createdBy: userId,
            hotel: {
                hotelId: hotel.hotelId,
                name: hotel.name
            },
            checkInDate: offer.checkInDate,
            checkOutDate: offer.checkOutDate ,
            status: 'Pending'
        });

        if (existingBooking) {
            return res.status(400).json({ message: "You have already booked this hotel for the selected dates." });
        }

        // Payment handling based on the selected method
        if (paymentMethod === 'wallet') {
            // Wallet payment: Check if the tourist has enough balance
            if (tourist.wallet < totalPrice) {
                return res.status(400).json({ message: "Insufficient wallet balance." });
            }

            // should loyalty points be awarded here?
            // Deduct the amount from the wallet
            tourist.wallet -= totalPrice;
            await tourist.save();

        } else if (paymentMethod === 'credit_card') {
            // Credit card payment: Integrate with payment provider (e.g., Stripe)
            /*
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalPrice * 100, // Stripe expects amount in cents
                currency: 'usd',  // Replace with your desired currency
                payment_method: payments.paymentMethodId,  // Payment method ID from frontend
                confirm: true,
            });

            if (!paymentIntent) {
                return res.status(500).json({ message: "Payment failed." });
            }
            */
        } else if (paymentMethod === 'cash_on_delivery') {
            // Cash on delivery: No payment is processed immediately, just proceed with the booking
        } else {
            return res.status(400).json({ message: "Invalid payment method selected." });
        }

        // Proceed with hotel booking in the external system (Amadeus or similar)
        const hotelBooking = await amadeus.booking.hotelBookings.post(
            JSON.stringify({
                "data": {
                    "offerId": offer.id,
                    "guests": guests,
                    "payments": payments
                }
            })
        );

        console.log(hotelBooking.data);
        res.status(200).json(hotelBooking.data);
    } catch(err) {
        // console.log("error status code: ", err.response.statusCode);
        if(err.response.statusCode === 401) {
            try {
                await BookedHotel.create({
                    hotel: {
                        hotelId: hotel.hotelId,
                        name: hotel.name,
                        chainCode: hotel.chainCode,
                        cityCode: hotel.cityCode,
                        latitude: hotel.latitude,
                        longitude: hotel.longitude
                    },
                    checkInDate: offer.checkInDate,
                    checkOutDate: offer.checkOutDate,
                    guests: guests?.adults,
                    price: offer.price.total,
                    createdBy: req.user._id,
                    status: paymentMethod === 'cash_on_delivery' ? 'Pending' : 'Completed',
                });
                return res.status(200).json({message: "Successfully booked!"});
            } catch(e){
                console.log(e);
                return res.status(400).json(e);
            }
        }
        console.log(err);
        errorHandler.SendError(res, err);
    }
}
exports.getBookedHotels = async (req, res) => {
    try {
        const userId = req.user._id;
        const hotels = await BookedHotel.find({ createdBy: userId });
        if (hotels.length === 0) {
            return res.status(404).json({ message: 'No hotels found' });
        }
        res.status(200).json(hotels);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}



////// Amadeus API Reference
// // City Search API
// // finds cities that match a specific word or string of letters.
// // Return a list of cities matching a keyword 'Paris'
// amadeus.referenceData.locations.cities.get({
//     keyword: 'Paris'
// })
//
// //Hotel Name Autocomplete API
// //Autocomplete a hotel search field
// amadeus.referenceData.locations.hotel.get({
//     keyword: 'PARI',
//     subType: 'HOTEL_GDS'
// })
//
// //Hotel List API
// //Get list of hotels by city code
// amadeus.referenceData.locations.hotels.byCity.get({
//     cityCode: 'PAR'
// })
//
// //Get List of hotels by Geocode
// amadeus.referenceData.locations.hotels.byGeocode.get({
//     latitude: 48.83152,
//     longitude: 2.24691
// })
//
// //Get List of hotels by hotelIds
// amadeus.referenceData.locations.hotels.byHotels.get({
//     hotelIds: 'ACPAR245'
// })