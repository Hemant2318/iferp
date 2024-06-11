import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  getMembershipDetails,
  setIsDiscountPopup,
  showSuccess,
  throwError,
  upgradePremium,
} from "store/slices";
import Button from "components/form/Button";
import { icons } from "utils/constants";
import {
  decrypt,
  encrypt,
  getDataFromLocalStorage,
  objectToFormData,
} from "utils/helpers";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import "./DiscountPopup.scss";

const DiscountPopup = ({ applyMentor }) => {
  const htmlElRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDiscountPopup } = useSelector((state) => ({
    isDiscountPopup: state.global.isDiscountPopup,
  }));

  const userData = getDataFromLocalStorage();
  const { id, user_type, membership_plan_id, personal_details = {} } = userData;
  const { country_name } = personal_details;

  const [isBtnLoading, setBtnIsLoading] = useState(false);
  const [planID, setPlanID] = useState("");
  const [planDetails, setPlanDetails] = useState({});
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const resetTimer = () => {
    setMinutes(10);
    setSeconds(0);
  };

  const handelMembershipDetails = async (id) => {
    setIsLoading(true);
    if (id) {
      const response = await dispatch(
        getMembershipDetails(objectToFormData({ id: id }))
      );
      let data = {};
      if (response.status === 200) {
        data = response?.data;
      }
      setPlanDetails(data);
    }
    setIsLoading(false);
  };
  const handelSave = async (values) => {
    const response = await dispatch(upgradePremium(objectToFormData(values)));
    if (response?.status === 200) {
      navigate("/");
      window.location.reload();
    }
    setBtnIsLoading(false);
    dispatch(setIsDiscountPopup(false));
    resetTimer();
  };

  useEffect(() => {
    if (localStorage.paymentIntent) {
      dispatch(setIsDiscountPopup(true));
      let localInitValue = {};
      let localResponse = {};
      if (localStorage.paymentIntent) {
        localInitValue = decrypt(localStorage.paymentIntent);
      }
      if (localStorage.paymentResponse) {
        localResponse = decrypt(localStorage.paymentResponse);
      }

      const { order_status, status_message } = localResponse;
      if (order_status === "Success") {
        setBtnIsLoading(true);
        dispatch(showSuccess(status_message));
        setTimeout(() => {
          handelSave({
            id: id,
            type: "0",
            membership_plan_id: localInitValue.planID,
            payment_method: localInitValue.currency,
            amount: localInitValue?.amount || 0,
            discount: localInitValue?.discount || 0,
            order_id: localResponse?.order_id || "",
            payment_id: localResponse?.tracking_id || "",
          });
        }, 1500);
      } else if (status_message) {
        dispatch(
          throwError({
            message: status_message,
          })
        );
      } else {
        // Nothing
      }
      setTimeout(() => {
        htmlElRef?.current?.scrollIntoView({ behavior: "smooth" });
        localStorage.removeItem("paymentResponse");
        localStorage.removeItem("paymentIntent");
        dispatch(setIsDiscountPopup(false));
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let membershipPlanID = "";
    if (user_type === "5") {
      membershipPlanID = membership_plan_id === 11 ? 12 : membership_plan_id;
    } else if (user_type === "2") {
      membershipPlanID = membership_plan_id === 2 ? 3 : membership_plan_id;
    } else {
    }
    setPlanID(membershipPlanID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (planID) {
      handelMembershipDetails(planID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planID]);

  useEffect(() => {
    let totalSeconds = minutes * 60 + seconds;

    const timer = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(timer);
      } else {
        totalSeconds -= 1;
        const newMinutes = Math.floor(totalSeconds / 60);
        const newSeconds = totalSeconds % 60;
        setMinutes(newMinutes);
        setSeconds(newSeconds);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isDiscountPopup, minutes, seconds]);

  const { amount, usd_amount } = planDetails || {};
  const discountIndiaAmount = 699;
  const discountUSDAmount = 8.38;

  const isNational = country_name === "India";
  const isAvailDiscount = (minutes > 0 || seconds > 0) && minutes < 10;
  let finalAmount = isNational
    ? isAvailDiscount
      ? discountIndiaAmount
      : amount
    : isAvailDiscount
    ? discountUSDAmount
    : usd_amount;
  const actualPrice = isNational ? amount : usd_amount;
  const discountAmount = actualPrice - finalAmount;

  const discountBenefits = [
    {
      id: 1,
      benefitsName:
        "Professional Premium mentors get very minimal platform fee",
      benefitValue: "25% Platform Fee",
    },
    {
      id: 2,
      benefitsName: "Premium mentors get their payment settlement every month",
      benefitValue: "75% Payment",
      isSubBenefitValue: true,
      subBenefitValue: "For every session",
    },
    {
      id: 3,
      benefitsName: "Conduct unlimited 1 on 1 mentorship sessions effortlessly",
      isIcon: true,
    },
  ];

  const getRowClassName = (index) => {
    return index % 2 === 0 ? "even-row" : "odd-row";
  };

  return (
    <>
      {isDiscountPopup && (
        <Modal
          onHide={() => {
            dispatch(setIsDiscountPopup(false));
            resetTimer();
          }}
          title=""
          isImage
        >
          <div
            id="discount-popup-container"
            className="cps-20 cpe-20 cpt-20 cpb-26 d-flex flex-column gap-3"
          >
            <div className="d-flex align-items-center justify-content-center flex-column gap-4">
              <div className="text-20-600 color-1f40">
                Here is a Limited Discount Just For You!
              </div>
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div className="d-flex flex-column align-items-center">
                  <span className="digit-block color-white text-38-600 d-flex align-items-center justify-content-center">
                    {minutes === 0 && seconds === 0
                      ? "00"
                      : minutes.toString().length === 1
                      ? `0${minutes}`
                      : minutes}
                  </span>
                  <span className="text-14-400 color-5b55">Minutes</span>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <span className="digit-block color-white text-38-600 d-flex align-items-center justify-content-center">
                    {minutes === 0 && seconds === 0
                      ? "00"
                      : seconds.toString().length === 1
                      ? `0${seconds}`
                      : seconds}
                  </span>
                  <span className="text-14-400 color-5b55">Seconds</span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span className="text-20-500-54 color-67a6">Avail Now</span>
                {isLoading ? (
                  <Loader />
                ) : (
                  <>
                    <span className="text-32-600-25 color-a21a">
                      {minutes === 0 && seconds === 0
                        ? `₹${planDetails?.amount}`
                        : "₹699"}
                    </span>

                    {planDetails?.amount &&
                      (minutes !== 0 || seconds !== 0) && (
                        <span className="text-28-500-22 color-platinum text-decoration-line-through">
                          {`₹${planDetails?.amount}`}
                        </span>
                      )}
                  </>
                )}
              </div>

              <div className="d-flex" ref={htmlElRef}>
                {finalAmount === 0 ? (
                  <Button
                    text="Pay Now"
                    isRounded
                    btnStyle="primary-dark"
                    className="cps-40 cpe-40"
                    onClick={() => {
                      dispatch(
                        throwError({
                          message: "Invalid membership selected.",
                        })
                      );
                      dispatch(setIsDiscountPopup(false));
                      resetTimer();
                    }}
                  />
                ) : (
                  <Button
                    text="Upgrade Before Offer Ends"
                    className="text-16-600 color-105d bg-cd1f discount-offer-button-shadow"
                    onClick={() => {
                      let paymentIntentData = {
                        page_type: "REQUEST",
                        type: "RENEW",
                        currency: isNational ? "INR" : "USD",
                        price: isNational ? amount : usd_amount,
                        amount: finalAmount,
                        discount: discountAmount,
                        toURL: window.location.pathname,
                        planID: planID,
                      };
                      localStorage.paymentIntent = encrypt(paymentIntentData);
                      navigate("/member/cc-avenue-payment");
                    }}
                    btnLoading={isBtnLoading}
                  />
                )}
              </div>
            </div>
            <div className="text-14-600-25 color-3765">
              Don’t Miss Out the Premium Benefits
            </div>
            <div className="row cmb-10 benefit-block">
              {discountBenefits.map((elem, index) => {
                const {
                  benefitsName,
                  benefitValue,
                  isSubBenefitValue,
                  subBenefitValue,
                  isIcon,
                } = elem;
                return (
                  <React.Fragment key={index}>
                    <div className="col-md-9 cmb-30">
                      <div
                        className={`cpt-6 cpb-6 cps-16 cpe-16 text-14-400-20 color-3765 h-100 align-items-center d-flex ${getRowClassName(
                          index
                        )}`}
                      >
                        {benefitsName}
                      </div>
                    </div>
                    <div className="col-md-3 cmb-30">
                      <div
                        className={`cpt-6 cpb-6 text-center text-14-400 color-3765 ${getRowClassName(
                          index
                        )}`}
                      >
                        {benefitValue && (
                          <div className="text-15-500-22">{benefitValue}</div>
                        )}
                        {isSubBenefitValue && (
                          <div className="text-13-400-22">
                            {subBenefitValue}
                          </div>
                        )}
                        {isIcon && <img src={icons.TrueIcon} alt="right" />}{" "}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            <div className="d-flex align-items-center justify-content-center color-67a6 text-15-500-26">
              <span
                className="pointer"
                onClick={() => {
                  applyMentor();
                  dispatch(setIsDiscountPopup(false));
                  resetTimer();
                }}
              >
                Continue As Free Mentor
              </span>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DiscountPopup;
