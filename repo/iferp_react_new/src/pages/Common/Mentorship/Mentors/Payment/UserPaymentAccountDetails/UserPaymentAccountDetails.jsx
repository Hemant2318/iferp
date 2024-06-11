import Card from "components/Layout/Card";
import Button from "components/form/Button";
import React from "react";
import { useState, useEffect } from "react";
import {
  bankAccountType,
  icons,
  userAlertPaymentMessage,
} from "utils/constants";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import TextInput from "components/form/TextInput";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  updateUrlDetails,
  checkIfUrlExist,
  updateBankTransferData,
  connectStripe,
  throwSuccess,
  throwError,
} from "store/slices";
import { objectToFormData, toURLEncoded } from "utils/helpers";
import axios from "axios";
import Loader from "components/Layout/Loader";
import { useNavigate } from "react-router-dom";
import Dropdown from "components/form/Dropdown";
import { isEqual } from "lodash";
import "./UserPaymentAccountDetails.scss";

const UserPaymentAccountDetails = () => {
  const { userDetails } = useSelector((state) => ({
    userDetails: state.student.userDetails,
  }));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const [type, setType] = useState("create");
  const [show, setShow] = useState(false);
  const [paymentSuccessfullyshow, setPaymentSuccessfullyshow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [availStatus, setAvailStatus] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const searchParams = urlParams?.get("code");
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [showMore, setShowMore] = useState(false);

  const guideLineDetails = [
    {
      id: 1,
      question:
        "Are you ready to take your mentorship program to the next level?",
      isDescription: true,
      description: "Well, we've got something exciting to share with you",
      isPoints: true,
      points: [
        "Selling mentorship programs can be incredibly rewarding, but it can also come with its fair share of challenges, especially when it comes to platform fees",
        "So IFERP has made an incredible mentoring process to help mentors across the globe",
      ],
    },
    {
      id: 2,
      question: "What is the process to get started as a Mentor?",
      isPoints: true,
      points: [
        "Login / Sign up to IFERP Dashboard",
        `Under mentorship, click on “Become Mentor" button`,
        "A pop up opens displaying all the mentor guidelines",
        `On accepting the guidelines you ll be redirected to the premium benefits incase of a free member`,
      ],
    },
    {
      id: 3,
      question: "What are the premium mentor benefits?",
      isPoints: true,
      points: [
        "Our Premium Membership program, designed specifically to empower mentors like you.",
        `One of the biggest perks - A reduced platform fee of just 25% (For premium members) compared to the standard 40% (For non-premium members) for every mentorship session you sell.`,
        `Our Premium Membership opens the door to a world of exclusive benefits tailored to help you succeed. From priority support to advanced marketing tools, we've got everything you need to thrive in the competitive world of online education`,
        `With our Premium Membership, you're not just getting access to a platform, you're joining a community of like-minded mentors who are passionate about sharing their knowledge and making a difference in the world`,
      ],
    },
    {
      id: 4,
      question: "What are the next steps once I have applied as a Mentor?",
      isDescription: true,
      description: `Once you have completed your profile, the admin team will review it and you will receive a notification within 72 hours about the status of your mentor profile. Please note that only after adding the session your profile will be live on the platform.`,
    },
    {
      id: 5,
      question: "How can I create a new session?",
      isPoints: true,
      points: [
        "Once the admin approves your profile as a mentor you can add your payment bank account details. You will get paid for all your sessions to the respective account.",
        `After adding the payment details you can proceed to add your new mentoring session.`,
        `To add a session you need to fill in all the mandatory details like Its overview, skills mentees will learn, Duration of the session, Your availability based on date and time. Mentors can customize their availability for particular days as well.`,
      ],
    },
    {
      id: 6,
      question: "How can I edit a session?",
      isPoints: true,
      points: [
        "You can click on my sessions and edit whichever session you wish",
        `Availability can also be edited for that particular session`,
        `You can customize date and time according to your convenience`,
      ],
    },
    {
      id: 7,
      question: "What are the steps to set availability?",
      isPoints: true,
      points: [
        "You can pick the days or periods for when you are free or which work best for you and we will allow the mentee to make bookings only when you are available.",
        `You can set your availability manually for different time slots for each day of the week.`,
        `You can also set the Booking Period i.e. the period for which your calendar will be visible to the mentees.`,
        `Custom slots for your availability can be edited from the session availability dashboard itself.`,
      ],
    },
    {
      id: 8,
      question: "How will I share my mentor profile?",
      isPoints: true,
      points: [
        `Along with a 9 Million + IFERP community, you can share your profile with quick links across your social media handles like facebook, linkedIn, whatsapp and twitter. It will help you get bookings organically`,
        `We recommend you to share your business page link as it displays all your skills, qualifications, research items, sessions and many more.`,
      ],
    },
    {
      id: 9,
      question: "I’m unavailable for a while, what should I do?",
      isPoints: true,
      points: [
        `You can edit and set availability for whichever session you wish to from the availability section of your dashboard. The availability can be set for custom dates and you can also add custom slots for reservations on a particular reserved date.`,
        `If you are unavailable for some time, you can pause the services by editing your available days of the week by setting it as unavailable.`,
      ],
    },
    {
      id: 10,
      question: "How do I reschedule a session?",
      isPoints: true,
      points: [
        `For a particular booking, you can request a reschedule from the ‘Upcoming Meeting’ section. Once approved by the mentee, you will receive a confirmation email with the invite for the new slot.`,
        `You can reschedule or reject a session`,
      ],
    },
    {
      id: 11,
      question: "How do reviews work?",
      isDescription: true,
      description: `After every session mentees can rate and give feedback for the session and share their experience with the mentor. All the ratings and review given by the mentees will be displayed under each session`,
    },
    {
      id: 12,
      question: "What are the terms for payouts?",
      isPoints: true,
      points: [
        `Once your profile gets approved by the admin, you need to fill all your payment account details. All your payments will be settled every month.`,
        `Premium members get a very minimal platform fee of 25%`,
        `Whereas the non-premium members get a platform fee of 40% for every mentoring session`,
      ],
    },
  ];

  const connectWithStripe = async () => {
    if (searchParams !== null && userDetails?.stripe_connect_status !== "1") {
      const headers = { Authorization: `Bearer ${secretKey}` };
      try {
        setLoading(true);
        return new Promise((resolve, reject) => {
          axios
            .post(
              `https://api.stripe.com/v1/oauth/token`,
              toURLEncoded({
                code: searchParams,
                grant_type: "authorization_code",
              }),
              { headers: headers }
            )
            .then(async (res) => {
              resolve(res?.data);
              const payload = objectToFormData({
                code: res?.data?.stripe_user_id,
              });
              const response = await dispatch(connectStripe(payload));
              if (response?.status === 200) {
                dispatch(throwSuccess(response?.message));
                await dispatch(fetchProfile());
                setLoading(false);
              } else {
                dispatch(throwError(response?.message));
                await dispatch(fetchProfile());
                setLoading(false);
              }
            })
            .catch((err) => {
              dispatch(throwError(err));
              reject(err);
            });
        });
      } catch (error) {
        console.log("Error", error);
      }
    }
  };

  useEffect(() => {
    connectWithStripe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkForUrlExist = async (value) => {
    const payload = objectToFormData({ url: value });
    const response = await dispatch(checkIfUrlExist(payload));
    if (response?.message === "Avalible") {
      setAvailStatus(true);
    } else if (response?.message === "Not Avalible") {
      setAvailStatus(false);
    }
  };

  const initialValues = {
    account_holder_name: userDetails?.account_holder_name || "",
    account_type: userDetails?.account_type || "",
    account_number: userDetails?.account_number || "",
    ifsc_code: userDetails?.ifsc_code || "",
    pan_card_no: userDetails?.pan_card_no || "",
    gst_no: userDetails?.gst_no || "",
  };

  const initialValuesForOtherCountries = {
    beneficiary_bank_account: userDetails?.beneficiary_bank_account,
    beneficiary_bank_name: userDetails?.beneficiary_bank_name,
    beneficiary_bank_swift_code: userDetails?.beneficiary_bank_swift_code,
    beneficiary_bank_address: userDetails?.beneficiary_bank_address,
    routing_number: userDetails?.routing_number || "",
  };

  const initialValuesForEmail = {
    business_link: `${userDetails?.business_page_link}`,
  };

  const handleSave = async (values) => {
    let object = {
      account_holder_name: values?.account_holder_name,
      account_type: values?.account_type,
      account_number: values?.account_number,
      ifsc_code: values?.ifsc_code,
      pan_card_no: values?.pan_card_no,
      gst_no: values?.gst_no,
      user_id: userDetails?.id,
    };

    const payload = objectToFormData(object);
    const response = await dispatch(updateBankTransferData(payload));
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      await dispatch(fetchProfile());
      setShow(false);
      if (initialValues?.account_number === "") {
        setPaymentSuccessfullyshow(true);
      }
    } else {
      dispatch(throwError(response?.message));
    }
  };

  const handleSaveForOtherCountries = async (values) => {
    let object = {
      beneficiary_bank_account: values?.beneficiary_bank_account,
      beneficiary_bank_name: values?.beneficiary_bank_name,
      beneficiary_bank_swift_code: values?.beneficiary_bank_swift_code,
      beneficiary_bank_address: values?.beneficiary_bank_address,
      routing_number: values?.routing_number,
      user_id: userDetails?.id,
    };

    const payload = objectToFormData(object);
    const response = await dispatch(updateBankTransferData(payload));
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      await dispatch(fetchProfile());
      setShow(false);

      if (initialValuesForOtherCountries?.beneficiary_bank_account === "") {
        setPaymentSuccessfullyshow(true);
      }
    } else {
      dispatch(throwError(response?.message));
    }
  };

  const handleSaveForEmail = async (values) => {
    const payload = objectToFormData({ business_link: values?.business_link });
    const response = await dispatch(updateUrlDetails(payload));
    if (response?.status === 200) {
      await dispatch(fetchProfile());
      setEditMode(false);
      dispatch(throwSuccess(response?.message));
    } else {
      dispatch(throwError(response?.message));
    }
  };

  const validationSchema = Yup.object().shape({
    account_holder_name: Yup.string().required(
      "Account Holder Name is required."
    ),
    account_type: Yup.string().required("Account Type is required."),
    account_number: Yup.number()
      .required("Account Number is required.")
      .transform((originalValue, originalObject) => {
        if (originalValue) {
          return parseInt(originalValue.toString().replace(/\D/g, ""), 10);
        }
        return originalValue;
      })
      .test(
        "is-valid-length",
        "Account Number must be between 8 and 16 digits",
        (value) => {
          const accountNumber = value && value.toString();
          return (
            accountNumber &&
            accountNumber.length >= 8 &&
            accountNumber.length <= 16
          );
        }
      ),
    // ifsc_code: Yup.string().required("IFSC Code is required."),
    ifsc_code: Yup.string()
      .required("IFSC Code is required.")
      .max(11, "IFSC Code must not exceed 11 characters.")
      .matches(
        /^[A-Z]{4}0[A-Za-z0-9]{6}$/,
        "Invalid IFSC code format. It should start with 4 capital alphabets followed by 0 and then 6 alphanumeric characters."
      ),
    pan_card_no: Yup.string()
      // .required("PAN Card Number is required.")
      .max(10, "PAN Card Number must be at most 10 characters long")
      .matches(/^[A-Z]{5}\d{4}[A-Z]$/, {
        message: "Invalid PAN Card Number format",
        excludeEmptyString: true, // Exclude empty string for custom message
      })
      .test(
        "no-white-space",
        "PAN Card Number must not contain any white spaces",
        (value) => {
          return /^\S+$/.test(value);
        }
      ),
    gst_no: Yup.string()
      // .required("GST Number is required.")
      .max(15, "GST Number must be exactly 15 characters long")
      .matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GST Number format"
      ),
  });

  const validationSchemaForEmail = Yup.object().shape({
    business_link: Yup.string().required("Business Link is required."),
    // .test(
    //   "no-numbers",
    //   "Numbers are not allowed in Business Link",
    //   function (value) {
    //     if (/\d/.test(value)) {
    //       return false;
    //     }
    //     return true;
    //   }
    // ),
  });
  const validationSchemaForOtherCountries = Yup.object().shape({
    beneficiary_bank_account: Yup.number()
      .required("Account Number is required.")
      .transform((originalValue, originalObject) => {
        if (originalValue) {
          return parseInt(originalValue.toString().replace(/\D/g, ""), 10);
        }
        return originalValue;
      })
      .test(
        "is-valid-length",
        "Account Number must be between 8 and 16 digits",
        (value) => {
          const accountNumber = value && value.toString();
          return (
            accountNumber &&
            accountNumber.length >= 8 &&
            accountNumber.length <= 16
          );
        }
      ),
    beneficiary_bank_name: Yup.string().required("Bank Name is required."),
    beneficiary_bank_swift_code: Yup.string()
      .min(8, "minimum 8 character required")
      .max(11, "maximum 11 character required")
      .required("Bank SWIFT code is required."),
    beneficiary_bank_address: Yup.string().required(
      "Bank Address is required."
    ),
  });

  const copyToClipboard = async () => {
    var textInput = document.getElementById("link-value");
    try {
      await navigator.clipboard.writeText(textInput.textContent);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  const url = `${window.location.origin}/member/global-research-profile/${userDetails?.id}`;

  return (
    <>
      {isLoading ? (
        <div className="mt-3">
          <Loader size="md" />
        </div>
      ) : (
        <div className="mt-3" id="user-payment-account-details-container">
          <div className="row g-0 unset-border flex-wrap">
            <div className="col-md-8 cmb-24">
              {userDetails?.business_page_link && (
                <Card className="cme-10 cps-15 cpt-20 cpe-15 cpb-20 cmb-20">
                  <div className="text-18-500 color-5068">
                    Business Page Link
                  </div>
                  {!editMode ? (
                    <div className=" row cmt-10 g-0 url-section justify-space-between">
                      <div className="col-md-11 ">
                        <div className="cpt-10 cpb-10 cpe-10 cps-10 cme-10 cmb-10 bg-f2f2 b-a9b1 rounded show-url  d-flex align-items-center justify-content-between">
                          <div
                            id="link-value"
                            className="pointer"
                            onClick={() =>
                              window.open(
                                initialValuesForEmail?.business_link,
                                "_blank"
                              )
                            }
                          >
                            {/* {initialValuesForEmail?.business_link} */}
                            {url}
                          </div>
                          <div
                            className="copy-button"
                            onClick={() => {
                              !isCopied && copyToClipboard();
                            }}
                          >
                            {isCopied ? "Copied!" : "Copy"}
                          </div>
                        </div>
                      </div>
                      {/* <div
                        className="col-md-1 b-a9b1 cpb-10 cpt-12 cpe-10 cps-10 edit-url-btn color-5068 rounded cmb-10"
                        onClick={() => setEditMode(true)}
                      >
                        <span className="text-15-400">Edit</span>
                        <span className="cps-5">
                          <img
                            src={icons.edit}
                            alt="edit"
                            className="edit-url-icon"
                          />
                        </span>
                      </div> */}
                    </div>
                  ) : (
                    <div className="col-md-10 position-relative">
                      <Formik
                        enableReinitialize
                        initialValues={initialValuesForEmail}
                        validationSchema={validationSchemaForEmail}
                        onSubmit={handleSaveForEmail}
                      >
                        {(props) => {
                          const { values, errors, handleChange, handleSubmit } =
                            props;
                          return (
                            <form className="cmt-10">
                              <div>
                                <TextInput
                                  label=""
                                  placeholder=""
                                  className="text-input cpe-125"
                                  id="email_id"
                                  value={`https://www.iferp.in/mentor/${
                                    values?.business_link.split("/")[4]
                                      ? values?.business_link.split("/")[4]
                                      : ""
                                  }`}
                                  // value={`${values?.business_link}`}
                                  error={errors?.business_link}
                                  onChange={(e) => {
                                    // if (e?.target?.value?.length > 20) {
                                    checkForUrlExist(e?.target?.value);
                                    handleChange({
                                      target: {
                                        id: "business_link",
                                        value: e.target.value,
                                      },
                                    });
                                    // }
                                  }}
                                />
                              </div>
                              <div className="d-flex gap-2 mt-4">
                                <Button
                                  text="Update Changes"
                                  btnStyle="primary-dark"
                                  className={`cps-10 cpe-10 ${
                                    !availStatus ? "disabled" : ""
                                  }`}
                                  onClick={handleSubmit}
                                />
                                <Button
                                  text="Cancel"
                                  btnStyle=""
                                  className="cps-10 cpe-10"
                                  onClick={() => setEditMode(false)}
                                />
                              </div>
                            </form>
                          );
                        }}
                      </Formik>
                      <div className="position-absolute position-relative d-flex available-section">
                        {availStatus ? (
                          <>
                            <div className="text-14-400 color-9959 position-absolute available-text">
                              Available
                            </div>
                            <div className="cps-5">
                              <img
                                src={icons.rightIconWithRound}
                                alt="edit"
                                className="right-icon-with-round"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-14-400 color-4336 position-absolute available-text">
                              Unavailable
                            </div>
                            <div className="cps-5">
                              <img
                                src={icons.iconRedCross}
                                alt="edit"
                                className="right-icon-with-round"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              )}
              {userDetails?.personal_details?.country_name !== "India" &&
                !userDetails?.account_holder_name &&
                !userDetails?.beneficiary_bank_account && (
                  <>
                    <div className="text-18-500 m-3">
                      Choose your way to get paid
                    </div>
                    <Card className="cme-10 cps-15 cpt-20 cpe-15 cpb-20">
                      {type === "create" ? (
                        <div className="">
                          <div>
                            <div className="text-18-500">
                              Stripe (Recommended)
                            </div>
                            <div className="text-14-400 cmt-10 text-justify">
                              Stripe is our go-to payout option. Please check
                              whether Stripe is available in your country to
                              benefit from our quickest and cheapest payout
                              option.To receive payouts you need to create and
                              verify Stripe Connect Account
                            </div>
                          </div>
                          <div className="cmt-10 col-md-10 d-flex justify-content-between flex-wrap">
                            <div className="text-15-400 cpt-15 cpb-15">
                              <div className="cmb-15 d-flex">
                                <div>
                                  <img src={icons.rightIcon} alt="payment" />
                                </div>
                                <div className="cms-10">
                                  Payouts to Bank Account
                                </div>
                              </div>
                              <div className="cmb-15 d-flex">
                                <div>
                                  <img src={icons.rightIcon} alt="payment" />
                                </div>
                                <div className="cms-10">Instant Payouts</div>
                              </div>
                              <div className="cmb-15 d-flex">
                                <div>
                                  <img src={icons.rightIcon} alt="payment" />
                                </div>
                                <div className="cms-10">Lowest Fees</div>
                              </div>
                              <div className="cmb-15 d-flex">
                                <div>
                                  <img src={icons.rightIcon} alt="payment" />
                                </div>
                                <div className="cms-10">Full Control</div>
                              </div>
                              <div className="cmb-15 d-flex">
                                <div>
                                  <img src={icons.rightIcon} alt="payment" />
                                </div>
                                <div className="cms-10">
                                  Management Dashboard
                                </div>
                              </div>
                            </div>
                            <div className="flex-end">
                              <img src={icons.PaymentAccount} alt="payment" />
                            </div>
                          </div>
                          <div className="d-flex justify-content-center align-items-center cmt-20 cmb-20 flex-row">
                            {userDetails?.mentor_status !== "Accept" ? (
                              <div className="text-15-600 color-danger-light">
                                You are not allowed to create stripe account
                                untill you become a mentor.
                              </div>
                            ) : userDetails?.stripe_connect_status === "1" ? (
                              <div className="text-15-600 color-a32d">
                                You are Already a Stripe account holder.
                              </div>
                            ) : (
                              <Button
                                text="Create Strip Account"
                                btnStyle="primary-dark"
                                onClick={() =>
                                  window.open(
                                    userDetails?.stripe_link,
                                    "_self",
                                    "noopener,noreferrer"
                                  )
                                }
                              />
                            )}
                          </div>

                          {/* <div className="text-15-400 color-7285 cmt-20 d-flex justify-content-center align-items-center cmt-20 cmb-20 flex-row">
                      Already a Stripe account holder? Verify and Add bank account
                      details{" "}
                      <span
                        className="color-new-car underline pointer ps-2"
                        onClick={() => {
                          setType("account");
                        }}
                      >
                        click here
                      </span>
                    </div> */}

                          <div className="d-flex align-items-center gap-2">
                            <img src={icons.warning} alt="warning-message" />
                            <div className="text-13-400 color-3700">
                              <div>Note: {userAlertPaymentMessage}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="text-18-500 color-text-navy">
                              Payment Account Details
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <Button
                                text="Edit"
                                btnStyle=""
                                className="text-15-500 h-35 bg-edff color-new-car"
                                rightIcon={
                                  <i className="bi bi-pen text-15-500 ms-2" />
                                }
                                onClick={() => {
                                  setType("create");
                                }}
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="cmb-20">
                              <div className="text-14-400 color-black-olive mb-1">
                                Account Holder Name
                              </div>
                              <div className="text-16-500 color-dark-blue">
                                Abcde Fghi
                              </div>
                            </div>
                            <div className="cmb-20">
                              <div className="text-14-400 color-black-olive mb-1">
                                Account Type
                              </div>
                              <div className="text-16-500 color-dark-blue">
                                Savings Account
                              </div>
                            </div>
                            <div className="cmb-20">
                              <div className="text-14-400 color-black-olive mb-1">
                                Account Number
                              </div>
                              <div className="text-16-500 color-dark-blue">
                                34535342454524
                              </div>
                            </div>
                            <div className="cmb-20">
                              <div className="text-14-400 color-black-olive mb-1">
                                IFSC Code
                              </div>
                              <div className="text-16-500 color-dark-blue">
                                SBI0393
                              </div>
                            </div>
                            <div className="cmb-20">
                              <div className="text-15-500 color-black-olive mb-1">
                                Tax Info
                              </div>
                              <div className="text-14-400 color-black-olive mb-1">
                                PAN Card Number
                              </div>
                              <div className="text-16-500 color-dark-blue">
                                GHLPS3949P
                              </div>
                            </div>
                            <div className="cmb-20">
                              <div className="text-14-400 color-black-olive mb-1">
                                GST No
                              </div>
                              <div className="text-16-500 color-dark-blue">
                                2324242
                              </div>
                            </div>
                            <div />
                          </div>
                        </>
                      )}
                    </Card>

                    {userDetails?.stripe_connect_status !== "1" && (
                      <div className="col-12 d-flex flex-wrap mt-3 mb-3 cpe-10">
                        <div className="col-5 left-line bg-d9d9 color-d9d9"></div>
                        <div className="col-2 text-14-400 or-top-margin d-flex justify-content-center">
                          OR
                        </div>
                        <div className="col-5 right-line bg-d9d9 color-d9d9"></div>
                      </div>
                    )}
                  </>
                )}

              {userDetails?.stripe_connect_status !== "1" && (
                <Card className="cme-10 cps-15 cpt-20 cpe-15 cpb-20">
                  <div>
                    <div className="text-18-500">Bank Transfer</div>
                    <div className="text-14-400 cmt-10 text-justify">
                      Bank Transfers that are sent over a traditional wire
                      transfers. Payouts are sent to your bank account once per
                      month.
                    </div>
                  </div>
                  <div className="cmt-10 col-md-10 d-flex justify-content-between flex-wrap">
                    <div className="text-15-400 cpt-15 cpb-15">
                      <div className="cmb-15 d-flex">
                        <div>
                          <img src={icons.rightIcon} alt="payment" />
                        </div>
                        <div className="cms-10">Payouts to Bank Account</div>
                      </div>
                      <div className="cmb-15 d-flex">
                        <div>
                          <img src={icons.rightIcon} alt="payment" />
                        </div>
                        <div className="cms-10">Payouts once per month</div>
                      </div>
                    </div>
                  </div>
                  {userDetails?.mentor_status === "Accept" && (
                    <div className="d-flex justify-content-left align-items-center cmt-20 cmb-20 flex-row">
                      <Button
                        text={
                          userDetails?.account_holder_name ||
                          userDetails?.beneficiary_bank_account
                            ? `Edit Bank Transfer Mode`
                            : `Choose Bank Transfer Mode`
                        }
                        btnStyle="primary-dark"
                        onClick={() => setShow(true)}
                      />
                    </div>
                  )}

                  <div className="d-flex align-items-center gap-2">
                    <img src={icons.warning} alt="warning-message" />
                    <div className="text-13-400 color-3700">
                      <div>Note: {userAlertPaymentMessage}</div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
            <div className="col-md-4">
              <Card className="cme-5 cps-15 cpt-20 cpe-15 cpb-20">
                <h4 className="text-20-400 color-5068 cmb-15">Guidelines</h4>
                <div className="text-14-400 color-5068 text-justify cmb-15">
                  You can add your account details here. Please note that the
                  payments won’t be processed if this section is not completed.
                </div>
                {/* <li className="text-14-400 color-5068 text-justify cmb-20">
                  {userDetails?.premium_member_percentage}% platform fee will be
                  charged for Premium Account holders and{" "}
                  {userDetails?.free_member_percentage}% platform fee will
                  charged for free members.
                </li> */}
                {showMore && (
                  <>
                    {guideLineDetails?.map((data, index) => {
                      return (
                        <div
                          className="text-15-600 text-justify cmb-20 color-5068"
                          key={index}
                        >
                          {data?.question}
                          {data?.isDescription && (
                            <div className="text-14-400 color-5068 text-justify cmt-10">
                              {data?.description}
                            </div>
                          )}
                          {data?.isPoints && (
                            <ul className="cmt-10 left-padding">
                              {data?.points?.map((point) => {
                                return (
                                  <li className="text-14-400 color-5068 text-justify cmb-15 ">
                                    {point}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                    <div className="text-15-500 text-justify cmb-10 color-5068">
                      Have doubts?{" "}
                      <span className="color-text-blue text-15-500">
                        Watch User Guide Video
                      </span>
                    </div>
                    <div className="text-15-500 text-justify cmb-20 color-5068">
                      Still need help? Contact Us:{" "}
                      <span className="color-text-blue text-15-500">
                        helpdesk@iferp.in
                      </span>
                    </div>
                  </>
                )}
                <div
                  className="d-flex gap-2 align-items-center text-14-400 color-new-car"
                  onClick={() => setShowMore(!showMore)}
                >
                  <span>{showMore ? "View less" : "View more"}</span>
                  <span>
                    <img
                      src={showMore ? icons.upArrow : icons.downArrow}
                      alt="arrow"
                    />
                  </span>
                </div>
              </Card>
            </div>
          </div>

          {paymentSuccessfullyshow && (
            <Modal
              show={paymentSuccessfullyshow}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Body>
                <div className="justify-content-end d-flex">
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setPaymentSuccessfullyshow(false)}
                  ></button>
                </div>
                <div className="text-center">
                  <img src={icons.approved} className="mb-3" alt="type" />
                  <p className="fs-4 fw-bold">
                    Payment Account Added Successfully
                  </p>
                  <p>
                    Your payment account has been added successfully mentor
                    account has been verified. Start mentoring now!
                  </p>
                  <div className="w-25 m-auto">
                    <Button
                      text="Add Session"
                      btnStyle="primary-dark"
                      className="rounded-pill"
                      onClick={() => {
                        navigate(
                          "/professional/mentorship/mentor/add-new-session"
                        );
                      }}
                    />
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          )}

          <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body closeButton>
              <div className="justify-content-end d-flex">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShow(false)}
                ></button>
              </div>
              <div className="d-flex justify-content-center color-title-navy font-poppins text-26-500">
                Bank Transfer
              </div>
              {userDetails?.personal_details?.country_name !== "India" && (
                <div className="d-flex justify-content-center flex-wrap text-16-400 color-5261 mt-3">
                  For International Mentors (whom Stripe is not supported in
                  their country)
                </div>
              )}
              {userDetails?.personal_details?.country_name === "India" ? (
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSave}
                >
                  {(props) => {
                    const {
                      values,
                      errors,
                      handleChange,
                      handleSubmit,
                      resetForm,
                    } = props;
                    return (
                      <form className="mt-5">
                        <div className="d-flex flex-row flex-wrap gap-4 m-3">
                          <div className="text-design">
                            <TextInput
                              label="Account Holder Name*"
                              placeholder="Holder Name"
                              id="account_holder_name"
                              value={values?.account_holder_name}
                              error={errors?.account_holder_name}
                              onChange={(e) => {
                                handleChange({
                                  target: {
                                    id: "account_holder_name",
                                    value: e.target.value,
                                  },
                                });
                              }}
                            />
                          </div>

                          <div className="text-design">
                            {/* <TextInput
                              label="Account Type*"
                              placeholder="Account Type"
                              id="account_type"
                              value={values?.account_type}
                              error={errors?.account_type}
                              onChange={(e) => {
                                handleChange({
                                  target: {
                                    id: "account_type",
                                    value: e.target.value,
                                  },
                                });
                              }}
                            /> */}
                            <Dropdown
                              label="Account Type*"
                              value={values?.account_type}
                              id="account_type"
                              placeholder="Select Account Type"
                              options={bankAccountType}
                              optionKey="id"
                              optionValue="value"
                              onChange={handleChange}
                              error={errors?.account_type}
                            />
                          </div>

                          <div className="text-design">
                            <TextInput
                              label="Account Number*"
                              placeholder="Account Number"
                              id="account_number"
                              value={values?.account_number}
                              error={errors?.account_number}
                              onChange={(e) => {
                                handleChange({
                                  target: {
                                    id: "account_number",
                                    value: e.target.value,
                                  },
                                });
                              }}
                            />
                          </div>

                          <div className="text-design">
                            <TextInput
                              label="IFSC Code*"
                              placeholder="IFSC Code"
                              id="ifsc_code"
                              value={values?.ifsc_code}
                              error={errors?.ifsc_code}
                              onChange={(e) => {
                                handleChange({
                                  target: {
                                    id: "ifsc_code",
                                    value: e.target.value,
                                  },
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-15-500 color-title-navy font-poppins mt-4 mb-3 ms-3">
                          Tax Info
                        </div>
                        <div className="d-flex flex-row flex-wrap gap-4 m-3">
                          <div className="text-design">
                            <TextInput
                              label="PAN Card Number"
                              placeholder="Pan Card Number Ex-BNZAA2318J"
                              id="pan_card_no"
                              value={values?.pan_card_no}
                              error={errors?.pan_card_no}
                              onChange={(e) => {
                                handleChange({
                                  target: {
                                    id: "pan_card_no",
                                    value: e.target.value,
                                  },
                                });
                              }}
                            />
                          </div>

                          <div className="text-design">
                            <TextInput
                              label="GST No.(Optional)"
                              placeholder="GST No.Ex-06BZAHM6385P6Z2"
                              id="gst_no"
                              value={values?.gst_no}
                              error={errors?.gst_no}
                              onChange={(e) => {
                                handleChange({
                                  target: {
                                    id: "gst_no",
                                    value: e.target.value,
                                  },
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="d-flex justify-content-center gap-1 mt-5 pb-3">
                          <Button
                            isRounded
                            text="Submit"
                            btnStyle="primary-dark"
                            className="cps-40 cpe-40"
                            onClick={handleSubmit}
                            disabled={isEqual(values, initialValues)}
                          />
                          <Button
                            isRounded
                            text="Cancel"
                            btnStyle=""
                            className="cps-40 cpe-40"
                            onClick={() => {
                              resetForm();
                              setShow(false);
                            }}
                          />
                        </div>
                      </form>
                    );
                  }}
                </Formik>
              ) : (
                <Formik
                  enableReinitialize
                  initialValues={initialValuesForOtherCountries}
                  validationSchema={validationSchemaForOtherCountries}
                  onSubmit={handleSaveForOtherCountries}
                >
                  {(props) => {
                    const {
                      values,
                      errors,
                      handleChange,
                      handleSubmit,
                      resetForm,
                    } = props;
                    return (
                      <form className="mt-5">
                        <div className="d-flex flex-row flex-wrap gap-4 m-3">
                          <div className="text-design">
                            <TextInput
                              label="Beneficiary Bank Account Number*"
                              placeholder="Bank Account Number"
                              id="beneficiary_bank_account"
                              value={values?.beneficiary_bank_account}
                              error={errors?.beneficiary_bank_account}
                              onChange={(e) => {
                                handleChange({
                                  target: {
                                    id: "beneficiary_bank_account",
                                    value: e.target.value,
                                  },
                                });
                              }}
                            />
                          </div>

                          <div className="text-design">
                            <TextInput
                              label="Beneficiary Bank Name*"
                              placeholder="Bank Name"
                              id="beneficiary_bank_name"
                              value={values?.beneficiary_bank_name}
                              error={errors?.beneficiary_bank_name}
                              onChange={(e) => {
                                handleChange({
                                  target: {
                                    id: "beneficiary_bank_name",
                                    value: e.target.value,
                                  },
                                });
                              }}
                            />
                          </div>

                          <div className="text-design">
                            <TextInput
                              label="Beneficiary bank SWIFT code"
                              placeholder="Bank SWIFT code"
                              id="beneficiary_bank_swift_code"
                              value={values?.beneficiary_bank_swift_code}
                              error={errors?.beneficiary_bank_swift_code}
                              onChange={(e) => {
                                handleChange({
                                  target: {
                                    id: "beneficiary_bank_swift_code",
                                    value: e.target.value,
                                  },
                                });
                              }}
                            />
                          </div>

                          <div className="text-design">
                            <TextInput
                              label="Beneficiary Bank Address*"
                              placeholder="Bank Address"
                              id="beneficiary_bank_address"
                              value={values?.beneficiary_bank_address}
                              error={errors?.beneficiary_bank_address}
                              onChange={(e) => {
                                handleChange({
                                  target: {
                                    id: "beneficiary_bank_address",
                                    value: e.target.value,
                                  },
                                });
                              }}
                            />
                          </div>
                          <div className="text-design">
                            <TextInput
                              label="Routing Number (optional)"
                              placeholder="Routing Number"
                              id="routing_number"
                              value={values?.routing_number}
                              onChange={(e) => {
                                handleChange({
                                  target: {
                                    id: "routing_number",
                                    value: e.target.value,
                                  },
                                });
                              }}
                            />
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <img src={icons.warning} alt="warning-message" />
                            <div className="text-13-400 color-3700">
                              <div>Note: {userAlertPaymentMessage}</div>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-center gap-1 mt-5 pb-3">
                          <Button
                            isRounded
                            text="Submit"
                            btnStyle="primary-dark"
                            className="cps-40 cpe-40"
                            onClick={handleSubmit}
                            disabled={isEqual(
                              values,
                              initialValuesForOtherCountries
                            )}
                          />
                          <Button
                            isRounded
                            text="Cancel"
                            btnStyle=""
                            className="cps-40 cpe-40"
                            onClick={() => {
                              resetForm();
                              setShow(false);
                            }}
                          />
                        </div>
                      </form>
                    );
                  }}
                </Formik>
              )}
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  );
};

export default UserPaymentAccountDetails;
