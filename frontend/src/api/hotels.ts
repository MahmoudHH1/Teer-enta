import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;



export const getHotels = async ({ city, checkInDate, checkOutDate, adults }) => {
  return await axios.get(`${API_BASE_URL}/hotels/getHotelOffers`, {
    params: { city, checkInDate, checkOutDate, adults },

    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
};

export const bookHotel = async ({ hotel, offer, guests, payments }) => {
  return await axios.post(
    `${API_BASE_URL}/hotels/bookHotel`,
    { hotel, offer, guests, payments },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const getBookedHotels = async () => {
  return await axios.get(`${API_BASE_URL}/getBookedHotels`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

