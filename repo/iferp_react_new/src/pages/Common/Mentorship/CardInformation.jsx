import { useEffect, useState } from "react";
import creditCardType from "credit-card-type";
import { icons, userAlertPaymentMessage } from "utils/constants";
import {
  INRtoUSD,
  decrypt,
  encrypt,
  getDataFromLocalStorage,
  trimLeftSpace,
} from "utils/helpers";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import { useDispatch } from "react-redux";
import { objectToFormData } from "utils/helpers";
import {
  scheduleMeeting,
  paymentStatus,
  throwSuccess,
  createCardToken,
  confirmStripePayment,
  throwError,
  checkStripePaymentStatus,
  fetchProfile,
} from "store/slices";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { omit } from "lodash";
// import Dropdown from "components/form/Dropdown";
import BillingInfoCommonPopup from "components/Layout/BillingInfoCommonPopup";
import "./CardInformation.scss";

const CardInformation = () => {
  const authUserDetails = getDataFromLocalStorage();
  const [isAddressCommonPopup, setIsAddressCommonPopup] = useState(false);
  const { personal_details = {}, exchange_rate } = authUserDetails;
  const { address, pincode } = personal_details;
  const isNational = personal_details?.country_name === "India";
  const location = useLocation();
  // const [chooseCountry, setChooseCountry] = useState(
  //   localStorage.getItem("chooseCountry") || (isNational ? "" : "International")
  // );
  const [cardData, setCardData] = useState({
    name: "",
    card_number: "",
    card_type: "",
    card_type_image: "",
    isValidNumber: false,
    keyCode: "",
    date: "",
    cvv: "",
    month: "",
    year: "",
  });
  const [cardError, setCardError] = useState(null);

  const [isLoader, setIsLoader] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const sessionData = JSON.parse(localStorage.getItem("session_data"));

  const getCardType = (number) => {
    let card_type_data = creditCardType(number);
    let card_type = card_type_data[0] ? card_type_data[0].type : "";
    return card_type;
  };
  const getCardTypeImage = (cardType) => {
    switch (cardType) {
      case "visa":
        return icons.visa_icon;
      case "american-express":
        return icons.american_express;
      case "mastercard":
        return icons.mastercard;
      case "discover":
        return icons.discover_icon;
      case "diners-club":
        return icons.diners_club;
      case "maestro":
        return icons.maestro;
      case "jcb":
        return icons.jcb_payment_icon;
      case "unionpay":
        return icons.unionpay;
      default:
        return icons.stp_card_error_C;
    }
  };
  const validateCardnumber = (inputNum) => {
    var digit, digits, flag, sum, _i, _len;
    flag = true;
    sum = 0;
    digits = (inputNum + "").split("").reverse();
    for (_i = 0, _len = digits.length; _i < _len; _i++) {
      digit = digits[_i];
      digit = parseInt(digit, 10);
      if ((flag = !flag)) {
        digit *= 2;
      }
      if (digit > 9) {
        digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };
  const handelCardChange = (e) => {
    let value = e.target.value;
    let keyCode = cardData.keyCode;
    let cardType = "";
    let isValidNumber = false;
    let length = value.length;
    if (keyCode === 46 || length > 19) {
      return false;
    }
    cardType = getCardType(value.replace(/\s/g, ""));
    let cardTypeImage = getCardTypeImage(cardType);
    isValidNumber = validateCardnumber(value.replace(/\s/g, ""));
    setCardData((prev) => {
      return {
        ...prev,
        card_type: cardType,
        card_type_image: cardTypeImage,
        isValidNumber: isValidNumber,
      };
    });
    if (keyCode !== 8) {
      let re = /^\d+$/;
      let space = /\s/g;

      if (!value.charAt(value.length - 1).match(re)) {
        return false;
      }
      if (keyCode === 86) {
        value =
          value.slice(0, 4) +
          " " +
          value.slice(4, 8) +
          " " +
          value.slice(8, 12) +
          " " +
          value.slice(12);
      } else {
        if (value.length >= 15) {
          if (!value.charAt(14).match(space)) {
            value = value.slice(0, 14) + " " + value.slice(14);
          }
          cardData.card_number = value;
        }
        if (value.length >= 10) {
          if (!value.charAt(9).match(space)) {
            value = value.slice(0, 9) + " " + value.slice(9);
          }
          cardData.card_number = value;
        }
        if (value.length >= 5) {
          if (!value.charAt(4).match(space)) {
            value = value.slice(0, 4) + " " + value.slice(4);
          }
          cardData.card_number = value;
        }
      }
    }
    if (value?.replace(/\s/g, "")?.length < 16) {
      setCardError("Card number must be at least 16 digits");
    } else {
      setCardError(null);
    }
    setCardData((prev) => {
      return {
        ...prev,
        card_number: value,
      };
    });
  };
  const onKeyDown = (e) => {
    setCardData((prev) => {
      return { ...prev, keyCode: e.keyCode };
    });
  };
  const handelBlur = () => {
    let newData = cardData;
    const { card_number, date } = newData;
    let month = "";
    let year = "";
    if (date && date.includes("/")) {
      month = date?.split("/")[0];
      year = `20${date?.split("/")[1]}`;
    }
    let idValidDate = date.length < 5 ? false : true;
    if (card_number?.replace(/\s/g, "")?.length < 16) {
      setCardError("Card number must be at least 16 digits");
    } else {
      setCardError(null);
    }
    setCardData((prev) => {
      return {
        ...prev,
        month: month,
        year: year,
        idValidDate: idValidDate,
        card_number: card_number.replace(/\s/g, ""),
      };
    });
  };
  const handlePay = async () => {
    setIsLoader(true);
    const cardToken = await dispatch(createCardToken(cardData));
    if (!cardToken) {
      setIsLoader(false);
      return;
    }
    const price =
      sessionData?.session_price &&
      INRtoUSD(sessionData?.session_price, exchange_rate);
    const newPrice = parseFloat(price?.toFixed(2));
    // const isInternationalCard = chooseCountry === "International";

    let payload = {
      session_id: sessionData?.session_id,
      mentor_id: sessionData?.mentor_id,
      mentee_id: sessionData?.mentee_id,
      // session_price: isNational
      //   ? isInternationalCard
      //     ? newPrice
      //     : parseFloat(sessionData?.session_price)
      //   : newPrice,
      // currency: isNational ? (isInternationalCard ? "USD" : "INR") : "USD",
      session_price: isNational
        ? parseFloat(sessionData?.session_price)
        : newPrice,
      currency: isNational ? "INR" : "USD",
      start_time: sessionData?.start_time,
      token: cardToken,
    };
    const formData = objectToFormData(payload);
    const res = await dispatch(scheduleMeeting(formData));

    if (res?.data?.payment_id) {
      confirmPayment(res?.data);
    } else {
      setIsLoader(false);
    }
  };
  const confirmPayment = async (paymentIntentData) => {
    const cardToken = await dispatch(createCardToken(cardData));
    if (cardToken) {
      const cpResponse = await dispatch(
        confirmStripePayment({
          paymentIntent: paymentIntentData?.payment_id,
          cardType: cardToken,
        })
      );

      if (cpResponse?.data?.id) {
        const stLocalData = omit(
          {
            status: "succeeded",
            session_id: sessionData?.session_id,
            mentor_id: sessionData?.mentor_id,
            mentee_id: sessionData?.mentee_id,
            session_price: parseFloat(sessionData?.session_price),
            currency: isNational ? "INR" : "USD",
            start_time: sessionData?.start_time,
            session_date: moment(
              sessionData?.session_date,
              "DD-MMM-YYYY"
            ).format("YYYY-MM-DD"),
            lear_by_mentee: sessionData?.lear_by_mentee,
            todayDate: moment().format("YYYY-MM-DD"),
            ...paymentIntentData,
          },
          ["id", "client_secret", "payment_id"]
        );

        if (cpResponse?.data?.status === "requires_action") {
          localStorage.stripeData = encrypt(stLocalData);
          window.location.href =
            cpResponse?.data?.next_action?.redirect_to_url?.url;
          setIsLoader(false);
        } else if (cpResponse?.data?.status === "succeeded") {
          sendPaymentStatus(stLocalData);
        } else {
          dispatch(throwError({ message: "Payment not accepted" }));
          setIsLoader(false);
        }
      } else {
        setIsLoader(false);
      }
    } else {
      setIsLoader(false);
    }
  };
  const sendPaymentStatus = async (payloadData) => {
    localStorage.removeItem("stripeData");
    const formData = objectToFormData(payloadData);
    const res = await dispatch(paymentStatus(formData));
    if (res?.status === 200) {
      setIsLoader(false);
      dispatch(throwSuccess(res?.message));
      navigate("/professional/mentorship/mentee/my-submissions");
      localStorage.removeItem("session_data");
      localStorage.removeItem("chooseCountry");
    }
    setIsLoader(false);
  };
  const checkPaymentSatatus = async (paymentIntent) => {
    const response = await dispatch(checkStripePaymentStatus(paymentIntent));
    if (response) {
      if (response?.status === "succeeded") {
        let decData = decrypt(localStorage.stripeData);
        if (decData) {
          setIsLoader(true);
          sendPaymentStatus(decData);
        } else {
          failPaymentWithRedirect();
        }
      } else if (response?.status === "requires_payment_method") {
        failPaymentWithRedirect(response?.last_payment_error?.message);
      } else {
        failPaymentWithRedirect();
      }
    } else {
      failPaymentWithRedirect();
    }
  };
  const failPaymentWithRedirect = (errMsg) => {
    dispatch(
      throwError({
        message: errMsg || "Something went wrong on payment redirection!",
      })
    );
    setTimeout(() => {
      localStorage.removeItem("stripeData");
      navigate(window.location.pathname);
    }, 2000);
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentIntent = searchParams.get("payment_intent");
    if (paymentIntent) {
      checkPaymentSatatus(paymentIntent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const fetchUSerProfile = async () => {
    const response = await dispatch(fetchProfile());
    if (response?.status === 200) {
      setTimeout(() => {
        setIsAddressCommonPopup(false);
        handlePay();
      }, 500);
    }
  };

  const price = INRtoUSD(sessionData?.session_price, exchange_rate);
  const newPrice = parseFloat(price?.toFixed(2));

  // const cardTypePayOptions = [
  //   { value: "Domestic", id: "Domestic" },
  //   { value: "International", id: "International" },
  // ];
  return (
    <div id="card-information-container">
      {isAddressCommonPopup && (
        <BillingInfoCommonPopup
          onHide={() => {
            setIsAddressCommonPopup(false);
          }}
          onSuccess={() => {
            fetchUSerProfile();
          }}
        />
      )}
      {/* <div className="d-flex cmb-25">
        <Dropdown
          id="chooseCountry"
          label="Choose Country For Card Payment"
          placeholder="Please Select Your Country For Card Payment"
          options={cardTypePayOptions}
          optionKey="id"
          optionValue="value"
          value={chooseCountry}
          onChange={(e) => {
            const newValue = e?.target?.value;
            setChooseCountry(newValue);
            localStorage.setItem("chooseCountry", newValue);
          }}
          disabled={!isNational}
        />
      </div> */}

      {/* {chooseCountry && ( */}
      <>
        <div className="cmb-25">
          <TextInput
            required
            placeholder="Name On Card"
            label="NAME ON CARD"
            value={cardData.name}
            id="name"
            onBlur={handelBlur}
            onChange={(e) => {
              setCardData((prev) => {
                return {
                  ...prev,
                  name: trimLeftSpace(e.target.value.toUpperCase()),
                };
              });
            }}
          />
        </div>

        <div className="card-input-block">
          <div className="card-number-block">
            <input
              type="text"
              placeholder="xxxx xxxx xxxx xxxx"
              onChange={handelCardChange}
              onKeyDown={onKeyDown}
              value={cardData.card_number}
              onBlur={handelBlur}
            />
            {cardData.card_type_image && (
              <div className="card-type-block">
                <img
                  src={cardData.card_type_image}
                  alt={cardData.card_type || "card"}
                  style={{
                    height:
                      cardData.card_type === "american-express"
                        ? "40px"
                        : cardData.card_type === ""
                        ? "27px"
                        : "45px",
                    weight: cardData.card_type === "" ? "38px" : "",
                  }}
                />
              </div>
            )}
          </div>
          <div className="d-flex w-100">
            <div className="card-date-block">
              <input
                type="text"
                maxLength="5"
                placeholder="MM/YY"
                value={cardData?.date}
                onBlur={handelBlur}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val.length === 2 && !val.includes("/")) {
                    val += "/";
                  }
                  setCardData((prev) => {
                    return { ...prev, date: val };
                  });

                  if (val === "") {
                    setCardData((prev) => {
                      return { ...prev, month: "", year: "" };
                    });
                  }
                }}
              />
            </div>
            <div className="cvv-block">
              <input
                type="password"
                placeholder="CVV"
                maxLength="3"
                value={cardData?.cvv}
                onBlur={handelBlur}
                autoComplete="new-password"
                onChange={(e) => {
                  let val = e.target.value;
                  setCardData((prev) => {
                    return { ...prev, cvv: val };
                  });
                }}
              />

              <div
                className="cvv-type-block"
                style={{
                  height: "24px",
                  width: "35px",
                }}
              >
                <img src={icons.cvv} alt="cvv" className="fill-image" />
              </div>
            </div>
          </div>
        </div>

        {cardData?.card_number && cardError && (
          <div className="error-block text-13-400" style={{ color: "red" }}>
            {cardError}
          </div>
        )}
        <div className="payment-block d-flex justify-content-between flex-wrap mt-3">
          <div className="d-flex align-items-center gap-2">
            <img src={icons.warning} alt="warning-message" />
            <div className="text-13-400 color-3700">
              <div>Note: {userAlertPaymentMessage}</div>
            </div>
          </div>
          <Button
            text={`Pay ${
              isNational ? `₹ ${sessionData?.session_price}` : `$ ${newPrice}`
            }`}
            btnStyle="primary-dark"
            className="cps-30 cpe-30"
            onClick={() => {
              if (!address || !pincode) {
                setIsAddressCommonPopup(true);
                return;
              }
              handlePay();
            }}
            btnLoading={isLoader}
            disabled={
              cardData?.name === "" ||
              cardData?.card_number?.length < 16 ||
              cardData?.month?.length < 2 ||
              cardData?.year?.length < 2 ||
              cardData?.cvv?.length < 3 ||
              isLoader
            }
          />
        </div>
      </>
      {/* )} */}
    </div>
  );
};
export default CardInformation;
