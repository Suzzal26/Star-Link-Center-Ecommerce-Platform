import axios from "axios";

export const placeOrder = async (orderData, token) => {
  const res = await axios.post(`/api/v1/orders`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
