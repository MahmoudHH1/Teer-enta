import axios  from "axios";


const API_BASE_URL = process.env.REACT_APP_BACKEND_URL + "/flights";

export const getAirports = async (keyword: string, countryCode: string) => {
    return await axios.get(`${API_BASE_URL}/getAirports`,
        {
            params: {
                keyword: keyword,
                countryCode: countryCode
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            }
        }
    );
}
export const getFlightOffers = async (origin, destination, departureDate, adults) => {
    return await axios.get(`${API_BASE_URL}/getFlightOffers`, {
      params: {
        departureAirport: origin,
        destinationAirport: destination,
        departureDate: departureDate,
        // returnDate: returnDate,
        adults: adults,
        // children: children,
        // infants: infants
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
}
export const bookFlight = async (flightOffer, travelers) => {
    return await axios.post(
      `${API_BASE_URL}/bookFlight`,
      {
        offer: flightOffer,
        travelers: travelers,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
}
export const getBookedFlights = async () => {
    return await axios.get(`${API_BASE_URL}/getBookedFlights`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}