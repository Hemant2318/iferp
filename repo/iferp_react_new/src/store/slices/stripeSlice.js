import axios from "axios";
import { toURLEncoded } from "utils/helpers";
import { throwError } from "./globalSlice";

const publicKey = process.env.REACT_APP_PUBLIC_KEY;
const secretKey = process.env.REACT_APP_SECRET_KEY;

export const createCardToken = (cardData) => async (dispatch) => {
  const headers = { Authorization: `Bearer ${publicKey}` };
  try {
    const response = await axios.post(
      "https://api.stripe.com/v1/tokens",
      toURLEncoded({
        "card[number]": cardData?.card_number,
        "card[exp_month]": cardData?.month,
        "card[exp_year]": cardData?.year,
        "card[cvc]": cardData?.cvv,
      }),
      { headers: headers }
    );
    if (response?.data?.id) {
      return response?.data?.id;
    } else {
      dispatch(throwError({ message: "Secure token not generated!" }));
      return null;
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.error?.message;
    dispatch(throwError({ message: errorMessage }));
    return null;
  }
};
export const createPaymentIntent = (payload) => async (dispatch) => {
  const headers = { Authorization: `Bearer ${secretKey}` };
  try {
    const response = await axios.post(
      "https://api.stripe.com/v1/payment_intents",
      toURLEncoded(payload),
      { headers: headers }
    );
    if (response?.data?.id) {
      return response?.data?.id;
    } else {
      dispatch(throwError({ message: "Secure token not generated!" }));
      return null;
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.error?.message;
    dispatch(throwError({ message: errorMessage }));
    return null;
  }
};
export const confirmStripePayment = (payload) => async (dispatch) => {
  const headers = { Authorization: `Bearer ${secretKey}` };
  try {
    const response = await axios.post(
      `https://api.stripe.com/v1/payment_intents/${payload?.paymentIntent}/confirm`,
      toURLEncoded({
        return_url: `${window.location.href}`,
        payment_method_data: {
          type: "card",
          card: {
            token: payload?.cardType,
          },
        },
      }),
      { headers: headers }
    );
    if (response?.data?.id) {
      return response;
    } else {
      dispatch(throwError({ message: "Secure token not generated!" }));
      return null;
    }
    // return null;
  } catch (error) {
    const errorMessage = error?.response?.data?.error?.message;
    dispatch(throwError({ message: errorMessage }));
    return null;
  }
};
export const checkStripePaymentStatus = (paymentIntent) => async (dispatch) => {
  const headers = { Authorization: `Bearer ${secretKey}` };
  try {
    const response = await axios.get(
      `https://api.stripe.com/v1/payment_intents/${paymentIntent}`,
      { headers: headers }
    );
    if (response) {
      return response?.data;
    } else {
      return null;
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.error?.message;
    dispatch(throwError({ message: errorMessage }));
    return null;
  }
};
