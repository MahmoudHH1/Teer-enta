import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;


export const getCartDetails = async () => {
    return await axios.get(`${API_BASE_URL}/order/cartDetails`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });

}

export const checkout = async ({deliveryAddress,paymentMethod,promoCode}) => {
    return await axios.post(
        `${API_BASE_URL}/order/checkOut`,
        { deliveryAddress,paymentMethod,promoCode},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
    );
}

export const getOrders = async () => {
    return await axios.get(`${API_BASE_URL}/order`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}

export const getOrder = async (orderId) => {
    return await axios.get(`${API_BASE_URL}/order/one/${orderId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}

export const cancelOrder = async (orderId) => {
    return await axios.patch(`${API_BASE_URL}/order/cancel/${orderId}`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}