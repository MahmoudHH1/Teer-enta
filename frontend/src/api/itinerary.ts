// Teer-Enta/frontend/api/itineraryApi.ts
import axios from 'axios';
import {TItinerary} from '../types/Itinerary/Itinerary';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const user = JSON.parse(localStorage.getItem('user') || '{}');
const token = localStorage.getItem('accessToken');

export const getItineraries = async (): Promise<TItinerary[]> => {
    // console.log('API_BASE_URL', API_BASE_URL);
    const response = await axios.get(`${API_BASE_URL}/itinerary`);

    console.log('response', response.data);
    return response.data;
};
export const getMyItineraries = async (): Promise<TItinerary[]> => {
    const response = await axios.get(`${API_BASE_URL}/itinerary/my`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    // console.log('response', response.data);
    return response.data;
}

export const getBookedItineraries = async (): Promise<TItinerary[]> => {
    const response = await axios.get(`${API_BASE_URL}/itinerary/booked`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    return response.data;
}

export const createItinerary = async (itinerary: Partial<TItinerary>): Promise<TItinerary> => {
    const response = await axios.post(`${API_BASE_URL}/itinerary/create`, itinerary, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    return response.data;
};

export const updateItinerary = async (id: string, itinerary: Partial<TItinerary>): Promise<TItinerary> => {
    // console.log("Itinerary", itinerary);
    const response = await axios.put(`${API_BASE_URL}/itinerary/update/${id}`, itinerary, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    return response.data;
};

export const deleteItinerary = async (id: string): Promise<void> => {
    return await axios.delete(`${API_BASE_URL}/itinerary/delete/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });

};


export const getIternary = async (id: string | number) =>
    await axios.get<TItinerary>(`${API_BASE_URL}/itinerary/one/${id}`)

// // example date "date":"2024-10-24T00:00:00.000Z"
// export const bookItinerary = async (itineraryId: string, date: string) => {
//     return await axios.post(`${API_BASE_URL}/itinerary/book/${itineraryId}`, {date: date}, {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//     });
// }

export const bookItinerary = async (itineraryId, date, paymentMethod ,promoCode) => {
    return await axios.post(`${API_BASE_URL}/itinerary/book/${itineraryId}`, {
        date: date,
        paymentMethod: paymentMethod,
        promoCode: promoCode
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });

};

export const cancleItineraryBooking = async (itineraryId: string) => {
    return await axios.patch(`${API_BASE_URL}/itinerary/cancel/book/${itineraryId}`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}


export const getItineraryRatings = async (itineraryId) => {
    const response = await axios.get(`${API_BASE_URL}/itinerary/${itineraryId}/ratings`);
    return response.data;
};

export const addRatingToItinerary = async (itineraryId, rating) => {
    const response = await axios.post(`${API_BASE_URL}/itinerary/${itineraryId}/rating`,
        {rating},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
    return response.data;
};

export const getItineraryComments = async (itineraryId) => {
    const response = await axios.get(`${API_BASE_URL}/itinerary/${itineraryId}/comments`);
    return response.data;
};

export const addCommentToItinerary = async (itineraryId, comment) => {
    const response = await axios.post(`${API_BASE_URL}/itinerary/${itineraryId}/comment`,
        {comment},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
    return response.data;
};


export const flagIternaary = async (itineraryId: String | Number) => {
    const response = await axios.patch(
        `${API_BASE_URL}/itinerary/flagInappropriate/${itineraryId}/`,
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
    );
    return response.data;
};

export const getFlaggedItineraries = async () => {
    const response = await axios.get(`${API_BASE_URL}/itinerary/flagged`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    return response.data;
};

export const unflagIternaary = async (itineraryId: String | Number) => {
    const response = await axios.patch(
        `${API_BASE_URL}/itinerary/unflagInappropriate/${itineraryId}/`,
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
    );
};


export const getUnActiveItineraries = async () => {
    const response = await axios.get(`${API_BASE_URL}/itinerary/unactive`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    return response.data;
}

export const activateItinerary = async (itineraryId) => {
    const response = await axios.post(
        `${API_BASE_URL}/itinerary/activate/${itineraryId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
    );
    return response.data;
}


