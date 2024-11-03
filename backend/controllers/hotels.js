const Amadeus = require('amadeus');
const errorHandler = require("../Util/ErrorHandler/errorSender");
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
        // console.log("number of unique hotels: ", uniqueHotels.length);
        // console.log(uniqueHotels);


        // hotelIds.data = hotelIds.data.slice(0, 5);
        // console.log(hotelIds.data);
        // console.log(hotelIds.data.map(hotel => hotel.hotelId));
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
        console.log(err);
        errorHandler.SendError(res, err);
    }
}
exports.bookHotel = async (req, res) => {
    const {hotel, offer, guests, payments} = req.body;
    if(!hotel || !offer || !guests || !payments) {
        return res.status(400).json({error: "Invalid request body: required fields missing (hotel, offer, guests, payments)"});
    }
    try {
        // const hotelOfferDetails = await amadeus.shopping.hotelOfferSearch('VRWK38MO20').get();
        // console.log(hotelOfferDetails.data);

        const hotelBooking = await amadeus.booking.hotelBookings.post(
            JSON.stringify({
                "data": {
                    "offerId": offer.id, // The ID of the selected hotel offer
                    "guests": guests,
                    "payments": payments
                }
            })
        )
        console.log(hotelBooking.data);
        res.status(200).json(hotelBooking.data);
    } catch(err) {
        if(err.statusCode === 401) {
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
                    guests: guests,
                    price: offer.price.total,
                    // createdBy: req.user._id
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