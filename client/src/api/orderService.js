import axios from "axios";
import { API_URL } from "../constants";

export const placeOrder = async (orderData, token) => {
  const res = await axios.post(`${API_URL}/orders`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
