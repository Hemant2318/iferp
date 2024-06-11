import Loader from "components/Layout/Loader";
import { useEffect, useState } from "react";
import { decrypt, getDataFromLocalStorage } from "utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { getCCAvenuePaymentURL } from "store/slices";
import { useNavigate } from "react-router-dom";
import "./CCAvenuePaymentPage.scss";

const testEmail = [
  "pritesh@sourcecubeindia.com",
  "rajdeep@sourcecubeindia.com",
];

const CCAvenuePaymentPage = () => {
  const { isSessionExpired } = useSelector((state) => ({
    isSessionExpired: state.global.isSessionExpired,
  }));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const paymentIntent = localStorage.paymentIntent
    ? decrypt(localStorage.paymentIntent)
    : {};
  const [isLoader, setIsLoader] = useState(true);
  const [payURL, setPayURL] = useState("");
  const userData = getDataFromLocalStorage();
  console.log(" userData:", userData);
  const {
    first_name,
    last_name,
    phone_number,
    email_id,
    personal_details,
    institution_details = {},
    company_details = {},
    user_type,
  } = userData;
  const { address, pincode, city_name, state_name, country_name } =
    personal_details || {};

  let billingName = `${first_name} ${last_name}`;
  let billingAddress = "";
  let billingCity = "";
  let billingState = "";
  let billingCountry = "";
  let billingTel = "";
  let billingEmail = "";
  let billingZip = "";

  switch (user_type) {
    case "2": // Professional
    case "5": // Student
      billingAddress = address || "NULL";
      billingCity = city_name || "NULL";
      billingState = state_name || "NULL";
      billingCountry = country_name || "NULL";
      billingTel = phone_number;
      billingEmail = email_id;
      billingZip = pincode;

      break;

    case "3": // Institute
      const {
        address: institutionAddress,
        pincode: institutionPincode,
        city_name: institutionCity,
        country_name: institutionCountry,
        state_name: institutionState,
        institution_contact_number,
        institution_email_id,
      } = institution_details;
      billingAddress = institutionAddress || "NULL";
      billingCity = institutionCity || "NULL";
      billingState = institutionState || "NULL";
      billingCountry = institutionCountry || "NULL";
      billingTel = institution_contact_number;
      billingEmail = institution_email_id;
      billingZip = institutionPincode;

      break;

    case "4": // Corporate
      const {
        address: company_address,
        pincode: company_pincode,
        company_email_id,
        company_contact_number,
        company_state_name,
        company_country_name,
        company_city_name,
      } = company_details;
      billingAddress = company_address || "NULL";
      billingCity = company_city_name || "NULL";
      billingState = company_state_name || "NULL";
      billingCountry = company_country_name || "NULL";
      billingTel = company_contact_number;
      billingEmail = company_email_id;
      billingZip = company_pincode;

      break;

    default:
      break;
  }
  console.log("billingData", {
    billingName,
    billingAddress,
    billingCity,
    billingState,
    billingCountry,
    billingTel,
    billingEmail,
    billingZip,
  });
  // const billingName = `${first_name} ${last_name}`;
  // const billingAddress = address;
  // const billingCity = city_name || "NULL";
  // const billingState = state_name;
  // const billingCountry = country_name;
  // const billingTel = phone_number;
  // const billingEmail = email_id;
  // const billingZip = "000000";
  const fetchCCAvenueURL = async () => {
    setIsLoader(true);
    const id = Math.random().toString(36).slice(2);
    const data = {
      type: paymentIntent?.type,
      // currency: "INR",
      // amount: 1.0,
      amount: testEmail.includes(email_id) ? 1.0 : paymentIntent?.amount,
      currency: paymentIntent?.currency || "INR",
      merchant_id: process.env.REACT_APP_MERCHANT_ID,
      order_id: id,
      redirect_url: "https://apidashboard.iferp.in/ccavResponseHandler.php",
      cancel_url: "https://apidashboard.iferp.in/ccavResponseHandler.php",
      language: "EN",
      integration_type: "iframe_normal",
      billing_zip: billingZip,
      billing_name: billingName,
      billing_address: billingAddress,
      billing_city: billingCity,
      billing_state: billingState,
      billing_country: billingCountry,
      billing_tel: billingTel,
      billing_email: billingEmail,
    };
    console.log("data payload", data);
    // const payload = toURLEncoded(data);
    const response = await dispatch(getCCAvenuePaymentURL(data));
    console.log("CC AVENUE URL=>", response?.data || "");
    setPayURL(response?.data || "");
    setIsLoader(false);
  };
  useEffect(() => {
    let resParams = window.location?.search?.split("?response=")?.pop();
    console.log(" resParams:", resParams);
    setPayURL("");
    if (isSessionExpired) {
      setPayURL("");
    } else {
      if (resParams) {
        localStorage.paymentResponse = resParams;
        navigate(paymentIntent?.toURL);
      } else if (paymentIntent?.type) {
        fetchCCAvenueURL();
      } else {
        // Nothing
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="cc-avenue-payment-page-container">
      {isLoader ? (
        <Loader size="lg" />
      ) : payURL ? (
        <iframe
          width="100%"
          height="100%"
          // scrolling="No"
          frameBorder="0"
          id="paymentFrame"
          src={payURL}
          title="ccavenue"
          style={{
            overflow: "auto",
          }}
        />
      ) : (
        "PAGE"
      )}
    </div>
  );
};

export default CCAvenuePaymentPage;
