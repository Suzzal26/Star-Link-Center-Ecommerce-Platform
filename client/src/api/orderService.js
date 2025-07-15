import axios from "axios";
import { BASE_URL } from "../constants"; // ensure this points to your server

export const placeOrder = async (orderData, token) => {
  const res = await axios.post(`${BASE_URL}/api/v1/orders`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
