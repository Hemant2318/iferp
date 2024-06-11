import Card from "../../../Layout/Card";
import { icons } from "utils/constants";
import { useDispatch } from "react-redux";
import {
  editMembership,
  fetchProfile,
  getMembership,
  handelUserRegisterDetails,
  setIsRegisterPopup,
  // setIsTour,
  throwError,
} from "store/slices";
import React, { useEffect, useState } from "react";
import Loader from "components/Layout/Loader";
import Button from "components/form/Button";
import {
  decrypt,
  encrypt,
  getUserType,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import { useNavigate } from "react-router-dom";
import { forEach } from "lodash";
import "./MembershipDetails.scss";
import CCAvenuePay from "components/Layout/CCAvenuePay";

const MembershipDetails = ({ userDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    // id,
    user_type: userType,
    personal_details = {},
    professional_details = {},
    institution_details = {},
    company_details = {},
  } = userDetails;
  const userTypeName = titleCaseString(getUserType());
  const { country_name } = personal_details;
  const { company_country_name } = company_details;
  const { country_name: institutionCountry } = institution_details;
  const { country_name: professionalCountry } = professional_details;
  const isNational =
    country_name === "India" ||
    company_country_name === "India" ||
    institutionCountry === "India" ||
    professionalCountry === "India";

  const [startLoading, setStartLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [benefitData, setBenefitData] = useState({});
  const [premiumBenefitData, setPremiumBenefitData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [benefitsCount, setBenefitsCount] = useState(5);
  const [freeBenefitsCount, setFreeBenefitsCount] = useState(5);
  const [premiumBenefitsCount, setPremiumBenefitsCount] = useState(5);
  const fetchMembershipBenefit = async (obj) => {
    const payload = { user_type: obj };
    const response = await dispatch(getMembership(payload));
    setBenefitData(response?.data?.[`${userTypeName}-Free`]);
    setPremiumBenefitData(response?.data?.[`${userTypeName}-Premium`]);
    setIsLoading(false);
  };

  const handleSelectMembership = async (values) => {
    let formData = objectToFormData({
      type: "3",
      id: values?.id,
      membership_plan_id: values?.membership_plan_id,
    });
    const response = await dispatch(handelUserRegisterDetails(formData));
    if (response?.status === 200) {
      handelPay(values);
    } else {
      setStartLoading(false);
    }
  };

  const handelPay = async (paymentValue) => {
    let formData = objectToFormData(paymentValue);
    const response = await dispatch(editMembership(formData));
    if (response?.status === 200) {
      // fetchUserData();
      dispatch(fetchProfile());
      window.location.reload();
      // dispatch(setIsRegisterPopup(false));
      // dispatch(setIsTour(true));
    }
    setStartLoading(false);
    setBuyLoading(false);
  };

  const handleGetStarted = () => {
    setStartLoading(true);
    handleSelectMembership({
      order_id: "",
      payment_id: "",
      payment_method: isNational ? "INR" : "USD",
      amount: 0,
      membership_plan_id: benefitData?.membership_id,
      id: userDetails?.id,
    });
  };

  const handleBuyNow = () => {
    const { amount, usd_amount, membership_id } = premiumBenefitData;

    let paymentIntentData = {
      page_type: "REQUEST",
      type: "SIGNUP",
      currency: isNational ? "INR" : "USD",
      amount: isNational ? amount : usd_amount,
      price: isNational ? amount : usd_amount,
      toURL: window.location.pathname,
      isPopupRegister: true,
      membership_plan_id: membership_id,
    };
    localStorage.paymentIntent = encrypt(paymentIntentData);
    navigate("/member/cc-avenue-payment");
    dispatch(setIsRegisterPopup(false));
  };

  useEffect(() => {
    if (userDetails?.id) {
      if (localStorage.paymentIntent) {
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
          setBuyLoading(true);
          setTimeout(() => {
            handleSelectMembership({
              order_id: localResponse?.order_id || "",
              payment_id: localResponse?.payment_id || "",
              payment_method: localInitValue?.currency,
              amount: localInitValue?.amount,
              membership_plan_id: localInitValue?.membership_plan_id,
              id: userDetails?.id,
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
      } else {
        // Nothing
      }
      setTimeout(() => {
        localStorage.removeItem("paymentIntent");
      }, 500);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  useEffect(() => {
    if (userType) {
      fetchMembershipBenefit(userType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const { benefit_detail } = benefitData || {};
  const {
    benefit_detail: premiumBenefitDetails,
    amount: premiumBenefitAmount,
    usd_amount: usdAmount,
  } = premiumBenefitData || {};
  const length_benefit_detail = benefit_detail?.length;
  let newBenefits = {};
  forEach(benefit_detail, (elem) => {
    let title_key = elem?.benefit_related_module;
    if (newBenefits[title_key]) {
      newBenefits[title_key] = [...newBenefits[title_key], elem];
    } else {
      newBenefits[title_key] = [elem];
    }
  });

  return (
    <div id="member-container">
      {isLoading ? (
        <div className="center-flex pt-5 pb-5">
          <Loader size="md" />
        </div>
      ) : (
        <>
          <div className="row cpt-10 cpb-10 cps-20 cpe-20 h-hide g-0">
            <div className="col-md-6">
              <div className="start-flex text-20-500-25 color-black-olive h-69">
                Membership Plan Details
              </div>
            </div>
            <div className="col-md-3 cps-15 cpe-15">
              <div className="text-24-500-25 color-white bg-skyblue h-69 center-flex div-redius-top free-premium-font">
                <div>Free</div>
              </div>
            </div>
            <div className="col-md-3 cps-15 cpe-15">
              <div className="center-flex color-white text-24-500-25 bg-purple div-redius-top h-69">
                <img src={icons.Crown} alt="crown" className="cpe-10" />{" "}
                <span className="">Premium</span>
              </div>
            </div>
            <Card className="card-box-shadow card-redius">
              <div className="row cps-5 cpe-5 cpb-5 ">
                <div className="col-md-6 ">
                  <div className="text-18-600-25 color-text-navy h-66 display-start-flex ">
                    {" "}
                    Featured Benefits
                  </div>
                </div>
                <div className="col-md-3 cpb-10 ">
                  <div className="box-1 color-text-navy h-66 center-flex text-20-700-25">
                    {isNational ? "₹ 0" : "$ 0"}
                    {/* {amount
                      ? amount
                        ? amount
                        : " ₹ 0"
                      : usd_amount
                      ? usd_amount
                      : "$ 0"} */}
                  </div>
                </div>
                <div className="col-md-3 cpb-10 ">
                  <div className=" box-1  text-20-700-25  color-text-navy h-66 center-flex text-center">
                    {/* {premiumBenefitAmount
                      ? `₹ ${premiumBenefitAmount} + GST`
                      : "₹ 999 + GST"} */}
                    {isNational
                      ? `₹ ${premiumBenefitAmount} (Incl of Tax)`
                      : `$ ${usdAmount} (Incl of Tax)`}
                  </div>
                </div>
              </div>
              <div className="row cmb-5 cps-10 cpe-10">
                {benefitsCount === 5
                  ? benefit_detail?.map((elem, index) => {
                      const { benefit, free } = elem;
                      const { premium } = premiumBenefitDetails?.[index];
                      const premiumData = premium.replace(/ *\([^)]*\) */g, "");
                      return (
                        index < benefitsCount && (
                          <React.Fragment key={index}>
                            <div className="col-md-6 cps-10">
                              <div
                                key={index}
                                className="box-1 text text-16-400-22 display-start-flex color-text-navy "
                              >
                                <div className=" cpt-5 cpb-5 ">{benefit}</div>
                              </div>
                            </div>
                            <div className="col-md-3 ">
                              <div className=" box-2 center-flex cmb-5 color-text-navy">
                                <div className="cpt-5 cpb-5 ">
                                  {free === "NA" ? (
                                    <img
                                      src={icons.FalseIcon}
                                      alt="memberfalse"
                                    />
                                  ) : (
                                    free
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="box-3 center-flex color-text-navy ">
                                <div className="cpt-5 cpb-5 ">
                                  {premiumData === "Yes" ? (
                                    <img
                                      src={icons.TrueIcon}
                                      alt="memberTrue"
                                    />
                                  ) : (
                                    premiumData
                                  )}
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        )
                      );
                    })
                  : Object.entries(newBenefits).map((key, index) => {
                      const [title, list] = key;
                      return (
                        <React.Fragment key={index}>
                          <div className="text-16-500 color-raisin-black mb-3 mt-3">
                            {titleCaseString(title.replace(/_/g, " "))}
                          </div>
                          {list?.map((elem, ind) => {
                            const { benefit, free, premium } = elem;

                            /* const { premium } = premiumBenefitDetails?.[index]; */

                            const premiumData = premium.replace(
                              / *\([^)]*\) */g,
                              ""
                            );
                            return (
                              <React.Fragment key={ind}>
                                <div className="col-md-6 cps-10">
                                  <div
                                    key={index}
                                    className="box-1 text text-16-400-22 display-start-flex color-text-navy"
                                  >
                                    <div className="cpt-5 cpb-5">{benefit}</div>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className=" box-2 center-flex cmb-5 color-text-navy">
                                    <div className="cpt-5 cpb-5">
                                      {free === "NA" ? (
                                        <img
                                          src={icons.FalseIcon}
                                          alt="memberfalse"
                                        />
                                      ) : (
                                        free
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="box-3 center-flex color-text-navy">
                                    <div className="cpt-5 cpb-5">
                                      {premiumData === "Yes" ? (
                                        <img
                                          src={icons.TrueIcon}
                                          alt="memberTrue"
                                        />
                                      ) : (
                                        premiumData
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                <div
                  className="col-md-6 text-15-400-25 color-text-blue d-flex align-items-center pointer"
                  onClick={() => {
                    if (benefitsCount === 5) {
                      setBenefitsCount(length_benefit_detail);
                    } else {
                      setBenefitsCount(5);
                    }
                  }}
                >
                  {benefitsCount === 5
                    ? "View All Benefits"
                    : "Hide All Benefits"}
                  <img
                    src={icons.arrowRight}
                    alt="viewAll"
                    className={benefitsCount === 5 ? "ps-1" : "ps-1 rotate-180"}
                  />
                </div>
                <div className="col-md-3">
                  <div className="center-flex bg-light-sky cpt-10 cpb-10 free-button-container">
                    <div>
                      <Button
                        text="Get Started"
                        isRounded
                        btnStyle="sky-blue-outline"
                        className="text-16-500-25 text-nowrap h-50"
                        onClick={handleGetStarted}
                        btnLoading={startLoading}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="center-flex bg-light-sky cpt-10 cpb-10 premium-button-container">
                    <div>
                      <CCAvenuePay
                        text="Buy Now"
                        btnLoading={buyLoading}
                        onClick={handleBuyNow}
                        btnStyle="purple-bg"
                        className="text-16-500-25 h-50"
                      />
                      {/* <Button
                        text="Buy Now"
                        isRounded
                        btnStyle="purple-bg"
                        className="text-16-500-25 h-50"
                        onClick={handleBuyNow}
                        btnLoading={buyLoading}
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="row s-hide d-none">
            <div className="col-md-12">
              <div className="text-16-500-25 color-text-black">
                Membership Plan Details
              </div>
              <div className="col-md-12 cpt-10">
                <div className="h-54 div-redius-top color-white bg-skyblue space-between-flex ">
                  <span className="cms-20 text-20-500-25">Free</span>
                  <span className="cme-20 text-24-500-25 ">
                    {isNational ? "₹ 0" : "$ 0"}
                  </span>
                </div>
              </div>
              <Card className="card-box-shadow">
                {freeBenefitsCount === 5
                  ? benefit_detail?.map((elem, index) => {
                      const { benefit, free } = elem;
                      return (
                        index < freeBenefitsCount && (
                          <div
                            className="col-md-12 mb-2 cps-5 cpe-5 cpt-5"
                            key={index}
                          >
                            <div className="box-1 text-15-400-25 color-text-navy align-center  d-flex cmb-5 row">
                              <span className="col-3 d-flex justify-content-center text-16-400-22 color-text-navy">
                                {free === "NA" ? (
                                  <img
                                    src={icons.FalseIcon}
                                    alt="memberfalse"
                                    className="img-h-w-18"
                                  />
                                ) : (
                                  free
                                )}
                              </span>
                              <span className="col-9 text-16-400-22 color-text-navy pt-2 pb-2">
                                {benefit}
                              </span>
                            </div>
                          </div>
                        )
                      );
                    })
                  : Object.entries(newBenefits).map((elem, index) => {
                      const [title, list] = elem;

                      return (
                        <div
                          className="col-md-12 mb-2 cps-5 cpe-5 cpt-5"
                          key={index}
                        >
                          <div className="text-16-500 color-raisin-black mb-3 mt-3">
                            {titleCaseString(title.replace(/_/g, " "))}
                          </div>
                          {list?.map((benefits, ind) => {
                            const { benefit, free } = benefits;
                            return (
                              <div
                                className="box-1 text-15-400-25 color-text-navy align-center  d-flex cmb-5 row"
                                key={ind}
                              >
                                <span className="col-3 d-flex justify-content-center text-16-400-22 color-text-navy">
                                  {free === "NA" ? (
                                    <img
                                      src={icons.FalseIcon}
                                      alt="memberfalse"
                                      className="img-h-w-18"
                                    />
                                  ) : (
                                    free
                                  )}
                                </span>
                                <span className="col-9 text-16-400-22 color-text-navy pt-2 pb-2">
                                  {benefit}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                <div
                  className="col-md-12 mb-2 text-18-500 color-text-blue d-flex align-items-center justify-content-center pointer p-3"
                  onClick={() => {
                    if (freeBenefitsCount === 5) {
                      setFreeBenefitsCount(length_benefit_detail);
                    } else {
                      setFreeBenefitsCount(5);
                    }
                  }}
                >
                  {freeBenefitsCount === 5
                    ? "View All Benefits"
                    : "Hide All Benefits"}
                  <img
                    src={icons.arrowRight}
                    alt="viewAll"
                    className={
                      freeBenefitsCount === 5 ? "ps-1" : "ps-1 rotate-180"
                    }
                  />
                </div>
                <div className="cps-5 cpe-5 cpb-5">
                  <div className="center-flex bg-light-sky cpt-15 cpb-15 free-button-container">
                    <Button
                      text="Get Started"
                      isRounded
                      btnStyle="sky-blue-outline"
                      className="text-18-500 text-nowrap h-100 cps-40 cpe-40 cpt-20 cpb-20"
                      onClick={handleGetStarted}
                      btnLoading={startLoading}
                    />
                  </div>
                </div>
              </Card>
              <div className="col-md-12 cpt-10">
                <div className="h-54 div-redius-top color-white bg-purple space-between-flex ">
                  <span className="cms-20 text-20-500-25"></span>
                  <span className="cme-20 text-20-700-25">
                    {isNational
                      ? `₹ ${premiumBenefitAmount} (Incl of Tax)`
                      : `$ ${usdAmount} (Incl of Tax)`}
                  </span>
                </div>
              </div>
              <Card className="card-box-shadow">
                {premiumBenefitsCount === 5
                  ? premiumBenefitDetails?.map((elem, index) => {
                      const { benefit, premium } = elem;

                      const premiumData = premium.replace(/ *\([^)]*\) */g, "");

                      return (
                        index < premiumBenefitsCount && (
                          <div
                            className="col-md-12 mb-2 cps-5 cpe-5 cpt-5"
                            key={index}
                          >
                            <div className="box-1 text-15-400-25 color-text-navy align-center  d-flex cmb-5 row">
                              <span className="col-3 d-flex justify-content-center text-16-400-22 color-text-navy">
                                {premiumData === "Yes" ? (
                                  <img src={icons.TrueIcon} alt="memberTrue" />
                                ) : (
                                  premiumData
                                )}
                              </span>
                              <span className="col-9 text-16-400-22 color-text-navy pt-2 pb-2">
                                {benefit}
                              </span>
                            </div>
                          </div>
                        )
                      );
                    })
                  : Object.entries(newBenefits).map((elem, index) => {
                      const [title, list] = elem;

                      return (
                        <div
                          className="col-md-12 mb-2 cps-5 cpe-5 cpt-5"
                          key={index}
                        >
                          <div className="text-16-500 color-raisin-black mb-3 mt-3">
                            {titleCaseString(title.replace(/_/g, " "))}
                          </div>
                          {list?.map((benefits, ind) => {
                            const { benefit, premium } = benefits;
                            const premiumSign = premium.replace(
                              / *\([^)]*\) */g,
                              ""
                            );
                            return (
                              <div
                                className="box-1 text-15-400-25 color-text-navy align-center  d-flex cmb-5 row"
                                key={ind}
                              >
                                <span className="col-3 d-flex justify-content-center text-16-400-22 color-text-navy text-nowrap">
                                  {premiumSign === "Yes" ? (
                                    <img
                                      src={icons.TrueIcon}
                                      alt="memberTrue"
                                    />
                                  ) : (
                                    premiumSign
                                  )}
                                </span>
                                <span className="col-9 text-16-400-22 color-text-navy pt-2 pb-2">
                                  {benefit}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                <div
                  className="col-md-12 mb-2 text-18-500 color-text-blue d-flex align-items-center justify-content-center pointer p-3"
                  onClick={() => {
                    if (premiumBenefitsCount === 5) {
                      setPremiumBenefitsCount(length_benefit_detail);
                    } else {
                      setPremiumBenefitsCount(5);
                    }
                  }}
                >
                  {premiumBenefitsCount === 5
                    ? "View All Benefits"
                    : "Hide All Benefits"}
                  <img
                    src={icons.arrowRight}
                    alt="viewAll"
                    className={
                      premiumBenefitsCount === 5 ? "ps-1" : "ps-1 rotate-180"
                    }
                  />
                </div>
                <div className="cps-5 cpe-5 cpb-5">
                  <div className="center-flex bg-light-sky cpt-15 cpb-15 free-button-container">
                    <CCAvenuePay
                      btnStyle="purple-bg"
                      text="Buy Now"
                      btnLoading={buyLoading}
                      onClick={handleBuyNow}
                      className="text-18-500 h-100 cps-40 cpe-40 cpt-20 cpb-20"
                    />
                    {/* <Button
                      text="Buy Now"
                      isRounded
                      btnStyle="purple-bg"
                      className="text-18-500 h-100 cps-40 cpe-40 cpt-20 cpb-20"
                      onClick={handleBuyNow}
                      btnLoading={buyLoading}
                    /> */}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MembershipDetails;
