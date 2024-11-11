const errorHandler = require("../Util/ErrorHandler/errorSender");
const BookedFlight = require("../models/Booking/BookedFlight");
const Tourist = require("../models/Users/Tourist");
const { getCountryCode } = require("../Util/LocationCodes");
const Amadeus = require('amadeus');

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

exports.getAirports = async (req, res) => {
  // keyword: city name:
  // countryName: country name
  const { keyword, countryName } = req.query;
  try {
    const countryCode = await getCountryCode(countryName);
    const params = {
      keyword: keyword,
      subType: "AIRPORT,CITY",
      "page[offset]": 0,
    };
    if (countryCode) {
      params["countryCode"] = countryCode;
    }
    const response = await amadeus.client.get(
      "/v1/reference-data/locations",
      params
    );

    return res.status(200).json(JSON.parse(response.body));
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

// TODO: add other parameters to the request (return Date, etc.)
// children: children,
// infants: infants
// returnDate: returnDate,
exports.getFlightOffers = async (req, res) => {
  // departureDate:Y-M-D
  //   adults:Integer
  const { departureAirport, destinationAirport, departureDate, adults } =
    req.query;

  try {
    const offers = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: departureAirport,
      destinationLocationCode: destinationAirport,
      departureDate: departureDate,
      adults: adults,
    });
    if (!offers.data || offers.data.length === 0) {
      return res.status(200).json([]);
    }
    // offers.data is an array of flight offers
    res.status(200).json(offers.data);
  } catch (err) {
    console.log(err);
    errorHandler.SendError(res, err);
  }
}

exports.bookFlight = async (req, res) => {
    const offer = req.body.offer;
    const travelers = req.body.travelers;
    const paymentMethod = req.body.paymentMethod || 'wallet'; // Default payment method

    try {
        // Get the pricing for the flight offer
        const pricingResponse = await amadeus.shopping.flightOffers.pricing.post(
            JSON.stringify({
                data: {
                    type: "flight-offers-pricing",
                    flightOffers: [offer],
                },
            })
        );

        if (!pricingResponse.data || pricingResponse.data.length === 0) {
            return res.status(400).json({ error: "Flight offer pricing failed." });
        }

        // Check if the user has already booked the same flight (same offer, same dates)
        const userId = req.user._id;
        const existingBooking = await BookedFlight.findOne({
            createdBy: userId,
            departureDate: offer.itineraries[0].segments[0].departure.at,
            arrivalDate: offer.itineraries[0].segments[0].arrival.at,
            departureAirport: offer.itineraries[0].segments[0].departure.iataCode,
            arrivalAirport: offer.itineraries[0].segments[0].arrival.iataCode ,
            status: 'Pending'
        });

        if (existingBooking) {
            return res.status(400).json({ message: "You have already booked this flight." });
        }

        // Create the flight booking in the Amadeus system
        const booking = await amadeus.booking.flightOrders.post(
            JSON.stringify({
                data: {
                    type: "flight-order",
                    flightOffers: pricingResponse.data.flightOffers,
                    travelers: travelers,
                },
            })
        );

        // Calculate the total price for the flight
        const totalPrice = offer.price.total;

        // Handle payment method
        const tourist = await Tourist.findById(userId);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found.' });
        }

        // Payment via wallet
        if (paymentMethod === 'wallet') {
            if (tourist.wallet < totalPrice) {
                return res.status(400).json({ message: 'Insufficient wallet balance.' });
            }
            tourist.wallet -= totalPrice;  // Deduct from wallet
            await tourist.save();

        } else if (paymentMethod === 'credit_card') {
            // Example for Stripe (uncomment and configure the actual integration):
            /*
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalPrice * 100,  // Stripe expects amount in cents
                currency: 'usd',  // Use your actual currency
                payment_method: req.body.paymentMethodId,  // Payment method ID from frontend
                confirm: true,
            });

            if (!paymentIntent) {
                return res.status(500).json({ message: 'Payment failed.' });
            }
            */
        } else if (paymentMethod === 'cash_on_delivery') {
            // No immediate payment action needed
        } else {
            return res.status(400).json({ message: 'Invalid payment method selected.' });
        }

        // Save the flight booking in your database
        await BookedFlight.create({
            departureDate: booking.data.flightOffers[0].itineraries[0].segments[0].departure.at,
            arrivalDate: offer.itineraries[0].segments[0].arrival.at,
            departureAirport: offer.itineraries[0].segments[0].departure.iataCode,
            arrivalAirport: offer.itineraries[0].segments[0].arrival.iataCode,
            noOfPassengers: travelers.length,
            price: totalPrice,
            createdBy: userId,
            status: paymentMethod === 'cash_on_delivery' ? 'Pending' : 'Completed',
        });

        // Send success response
        res.status(200).json({
            message: "Successfully booked a Flight",
            booking: booking.data,
            updatedWallet: paymentMethod === 'wallet' ? tourist.wallet : undefined,  // Show updated wallet balance if used
        });
    } catch (err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
};

exports.getBookedFlights = async (req, res) => {
    try {
        const userId = req.user._id;
        const flights = await BookedFlight.find({ createdBy: userId });
        if (flights.length === 0) {
            return res.status(404).json({ message: 'No flights found' });
        }
        res.status(200).json(flights);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}
