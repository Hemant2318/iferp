import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { lowerCase, omit, replace } from "lodash";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "components/form/Button";
import RadioInput from "components/form/RadioInput";
import TextInput from "components/form/TextInput";
import Label from "components/form/Label";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import SuccessPopup from "components/Layout/SuccessPopup";
import ViewKeynoteSpeakers from "components/Layout/ViewKeynoteSpeakers";
import ViewPastConferenceGallery from "components/Layout/ViewPastConferenceGallery";
import ViewRegistration from "components/ReusableForms/Registration/ViewRegistration";
import ViewCommitteeMembers from "components/Layout/ViewCommitteeMembers/ViewCommitteeMembers";
import {
  fetchAttendedDetails,
  registerInstitutionalEvent,
  RegisterUserEvent,
  setApiError,
  setIsPremiumPopup,
  showSuccess,
  throwError,
} from "store/slices";
import {
  BrochurePath,
  conferencePath,
  icons,
  posterPath,
} from "utils/constants";
import {
  decrypt,
  downloadFile,
  encrypt,
  formatDate,
  generatePreSignedUrl,
  getDataFromLocalStorage,
  getEventDate,
  getFilenameFromUrl,
  objectToFormData,
} from "utils/helpers";
import EditCommitteeMemberAndSpeaker from "./EditCommitteeMemberAndSpeaker";
import EditImportantDates from "./EditImportantDates";
import EditRegistartion from "./EditRegistartion";
import EditConferenceDetails from "./EditConferenceDetails";
import EditPastConferencesGallery from "./EditPastConferencesGallery";
// import PayButton from "components/Layout/PayButton";
import CCAvenuePay from "components/Layout/CCAvenuePay";
import ShareButton from "components/Layout/ShareButton";

const ConferenceDetails = ({ fetchEventDetails, eventId }) => {
  const htmlElRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { memberType, moduleType } = params;
  const userData = getDataFromLocalStorage();

  const {
    id,
    first_name,
    last_name,
    email_id,
    phone_number,
    user_type: userType,
    membership_plan_id: planID,
    personal_details = {},
    institution_details = {},
    attendedDetails = {},
    user_type,
  } = userData;
  let { country: userCountry, country_name: countryName } = personal_details;
  let { country_name: iCountryName } = institution_details;
  const isNational =
    countryName === "India" ||
    iCountryName === "India" ||
    ["0", "6"].includes(user_type);
  const { eventData } = useSelector((state) => ({
    eventData: state.global.eventData,
  }));
  const {
    event_name,
    start_date,
    end_date,
    city_name,
    country,
    country_name,
    dates,
    role,
    is_registered,
    event_mode,
    event_type,
    event_type_id,
    event_pricing = [],
    dashboard_pricing_selection = [],
    pricing_categories = [],
    proceeding_book,
  } = eventData;
  const findCategory =
    userData.user_type === "0"
      ? pricing_categories
      : dashboard_pricing_selection.find(
          (o) => `${o.id}` === `${userData?.membership_plan_id}`
        )?.data || [];
  const showEventPricing =
    findCategory.some((o) => o.is_checked) || userData.user_type === "0";
  const organizingCommitteeMembersRef = useRef(null);
  const keynoteSpeakersRef = useRef(null);
  const registrationRef = useRef(null);
  const galleryRef = useRef(null);
  const [isLoading, setLoading] = useState(true);
  const [isGallery, setIsGallery] = useState(false);
  const [isConfrenceDetails, setIsConfrenceDetails] = useState(false);
  const [editDates, setEditDates] = useState(false);
  const [type, setType] = useState(null);
  const [isRegistration, setIsRegistration] = useState(false);
  const [tabId, setTabId] = useState("organizing-committee-members");
  const [btnLoading, setBtnLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // const [usdPrice, setUSDPrice] = useState("");
  const [inrPrice, setINRPrice] = useState("");

  const handelScroll = (id) => {
    setTabId(id);
    switch (id) {
      case "organizing-committee-members":
        organizingCommitteeMembersRef?.current?.scrollIntoView();
        break;
      case "keynote-speakers":
        keynoteSpeakersRef?.current?.scrollIntoView();
        break;
      case "registration":
        registrationRef?.current?.scrollIntoView();
        break;
      case "gallery":
        galleryRef?.current?.scrollIntoView();
        break;
      default:
        organizingCommitteeMembersRef?.current?.scrollIntoView();
        break;
    }
  };
  const handelRegister = async (values) => {
    if (userType === "3") {
      const formData = objectToFormData(
        omit({ ...values }, ["join_as", "how_you_know", "userType"])
      );
      const response = await dispatch(registerInstitutionalEvent(formData));
      if (response?.status === 200) {
        fetchEventDetails();
      }
    } else {
      const formData = objectToFormData({
        ...values,
      });
      const response = await dispatch(RegisterUserEvent(formData));
      if (response?.status === 200) {
        setIsSuccess(true);
        fetchEventDetails();
        dispatch(fetchAttendedDetails());
      }
    }
    setBtnLoading(false);
  };
  const fetchUSDPrice = () => {
    fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // setUSDPrice(data?.rates["USD"]);
        setINRPrice(1 / data?.rates["INR"]);
      });
  };
  useEffect(() => {
    fetchUSDPrice();
    if (localStorage.isRedirectToRegister) {
      localStorage.removeItem("isRedirectToRegister");
      setTimeout(() => {
        handelScroll("registration");
      }, 100);
    }
    if (localStorage.isRedirectToOCM) {
      localStorage.removeItem("isRedirectToOCM");
      setTimeout(() => {
        handelScroll("registration");
      }, 100);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (localStorage.paymentIntent) {
      let localInitValue = {};
      let localResponse = {};
      if (localStorage.paymentIntent) {
        localInitValue = decrypt(localStorage.paymentIntent);
      }
      if (localStorage.paymentResponse) {
        localResponse = decrypt(localStorage.paymentResponse);
      }
      if (localInitValue?.formInitialValue) {
        setInitialValues(localInitValue?.formInitialValue);
      }
      // console.log(localInitValue);
      // console.log(localResponse);
      const { order_status, status_message } = localResponse;
      if (order_status === "Success") {
        setBtnLoading(true);
        dispatch(showSuccess(status_message));
        setTimeout(() => {
          handelRegister({
            event_id: eventId,
            user_id: id,
            payment_method: localInitValue.currency,
            discount: localInitValue.discount,
            discount_in_percentage: localInitValue.discount_in_percentage,
            order_id: localResponse?.order_id || "",
            payment_id: localResponse?.tracking_id || "",
            ...localInitValue?.formInitialValue,
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
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object().shape({
    join_as: Yup.string().when("userType", {
      is: () => userType !== "3",
      then: Yup.string().required("Select any one."),
    }),
    how_you_know: Yup.string().when("userType", {
      is: () => userType !== "3",
      then: Yup.string().required("This field is required."),
    }),
    strength_of_students: Yup.string().when("userType", {
      is: () => userType === "3",
      then: Yup.string()
        .required("Strength of students is required.")
        .matches(/^[0-9\s]+$/, "Valid number only.")
        .matches(/^\S*$/, "Whitespace is not allowed."),
    }),
    strength_of_faculties: Yup.string().when("userType", {
      is: () => userType === "3",
      then: Yup.string()
        .required("Strength of faculties is required.")
        .matches(/^[0-9\s]+$/, "Valid number only.")
        .matches(/^\S*$/, "Whitespace is not allowed."),
    }),
  });
  const [initialValues, setInitialValues] = useState({
    userType: userType,
    join_as: replace(role, "Applied as ", "") || "",
    how_you_know: "",
    amount: "0",
    strength_of_students: "",
    strength_of_faculties: "",
  });

  const activeClass = "p-2 color-new-car text-16-500 me-4 primary-underline";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  const isEventRegister = event_pricing.length > 0;
  const access = {
    isEdit: userType === "0",
    isAdmin: userType === "0",
    isProceedingBook: userType === "0" && proceeding_book,
    isShare: userType !== "0",
    // isRegister:
    //   userType !== "0"
    //     ? userType === "3"
    //       ? !eventData?.created_id
    //       : true
    //     : false,
    isRegister: !["0", "3"].includes(userType),
    isPoster: userType !== "0" && eventData?.created_id,
    isTab: !eventData?.created_id,
    isOCM: !eventData?.created_id,
    isRegistration:
      userType !== "0"
        ? userType === "3"
          ? !eventData?.created_id
          : true
        : true,
    isGallary: !eventData?.created_id,
    isInstituionalEvent: eventData?.created_id,
    isEditInstituionalEvent: userType === "3",
    isSubmitAbstract: ["2", "5"].includes(userType),
    isCollaboration: ["3"].includes(userType),
  };
  // console.log(attendedDetails);
  let isShowUpgradePopup = false;
  let applyDiscount = "";

  // Proffetional Free
  if (planID === 2) {
    let totalWebinar = 0;
    totalWebinar = totalWebinar + attendedDetails[2].Hybrid;
    totalWebinar = totalWebinar + attendedDetails[2].Physical;
    totalWebinar = totalWebinar + attendedDetails[2].Virtual;
    let totalGuestLecture = 0;
    totalGuestLecture = totalGuestLecture + attendedDetails[4].Hybrid;
    totalGuestLecture = totalGuestLecture + attendedDetails[4].Physical;
    totalGuestLecture = totalGuestLecture + attendedDetails[4].Virtual;
    let totalFacultyDev = 0;
    totalFacultyDev = totalFacultyDev + attendedDetails[5].Hybrid;
    totalFacultyDev = totalFacultyDev + attendedDetails[5].Physical;
    totalFacultyDev = totalFacultyDev + attendedDetails[5].Virtual;
    isShowUpgradePopup =
      (totalWebinar >= 1 && event_type_id === 2) ||
      (totalGuestLecture >= 2 && event_type_id === 4) ||
      (totalFacultyDev >= 4 && event_type_id === 5);
  }
  // Proffetional Premium
  if (planID === 3) {
    applyDiscount =
      event_mode === "Hybrid" && event_type_id === 3
        ? "50"
        : event_type_id === 1
        ? "10"
        : "";
    isShowUpgradePopup = false;
  }
  // Student Premium
  if (planID === 11) {
    let totalWebinar = 0;
    totalWebinar = totalWebinar + attendedDetails[2].Hybrid;
    totalWebinar = totalWebinar + attendedDetails[2].Physical;
    totalWebinar = totalWebinar + attendedDetails[2].Virtual;
    let totalGuestLecture = 0;
    totalGuestLecture = totalGuestLecture + attendedDetails[4].Hybrid;
    totalGuestLecture = totalGuestLecture + attendedDetails[4].Physical;
    totalGuestLecture = totalGuestLecture + attendedDetails[4].Virtual;
    isShowUpgradePopup =
      event_type_id === 6 ||
      event_type_id === 7 ||
      userCountry !== country ||
      (event_mode === "Virtual" && event_type_id === 3) ||
      (totalGuestLecture >= 2 && event_type_id === 4) ||
      (totalWebinar >= 1 && event_type_id === 2);
  }
  // Student Premium
  if (planID === 12) {
    applyDiscount =
      event_mode === "Hybrid" && event_type_id === 3
        ? "50"
        : event_type_id === 1
        ? "10"
        : "";
    isShowUpgradePopup = false;
  }
  const isNonPremium = [2, 11].includes(planID);
  return (
    <>
      {isLoading ? (
        <Card className="cpt-80 cpb-80 h-50">
          <Loader size="md" />
        </Card>
      ) : (
        <div
          className={`cmt-20 ${
            localStorage.isRedirectToRegister ? "" : "fadeInUp"
          }`}
        >
          {isSuccess && (
            <SuccessPopup
              title="Registration Successful"
              onHide={() => {
                setIsSuccess(false);
              }}
              onClose={() => {
                setIsSuccess(false);
                fetchEventDetails();
              }}
            >
              <div className="text-16-400 color-black-olive">
                <div className="mb-2">
                  Congratulations you have saved{" "}
                  <span className="test-16-500 color-new-car">
                    {applyDiscount}%
                  </span>
                </div>
                <div>Looking forward to meet you at the Webinar</div>
              </div>
            </SuccessPopup>
          )}

          <>
            {access.isInstituionalEvent && (
              <Card className="d-flex justify-content-between align-items-center unset-br cps-20 cpe-20 cpt-10 cpb-10 mb-3">
                <div className="d-flex gap-3">
                  <div
                    onClick={() => {
                      if (localStorage.prevRoute) {
                        navigate(localStorage.prevRoute);
                        localStorage.removeItem("prevRoute");
                      } else {
                        navigate(-1);
                      }
                    }}
                  >
                    <img
                      src={icons.leftArrow}
                      alt="back"
                      className="h-21 me-3 pointer"
                    />
                  </div>
                  <div>Event Details</div>
                </div>

                {access.isEditInstituionalEvent && (
                  <div
                    className="text-14-400 color-silver-gray pointer"
                    onClick={() => {
                      navigate(
                        `/institutional/activity-plan/institutional-plan/edit-event/${eventId}`
                      );
                    }}
                  >
                    <i className="bi bi-pencil me-2" />
                    Edit
                  </div>
                )}
              </Card>
            )}
            {access.isTab && (
              <div className="d-flex flex-wrap mb-3">
                <div
                  className={`${
                    tabId === "organizing-committee-members"
                      ? activeClass
                      : inActiveClass
                  }`}
                  onClick={() => {
                    if (tabId !== "organizing-committee-members") {
                      handelScroll("organizing-committee-members");
                    }
                  }}
                >
                  Organizing Committee Members
                </div>
                <div
                  className={`${
                    tabId === "keynote-speakers" ? activeClass : inActiveClass
                  }`}
                  onClick={() => {
                    if (tabId !== "keynote-speakers") {
                      handelScroll("keynote-speakers");
                    }
                  }}
                >
                  Keynote Speakers
                </div>
                {access.isRegistration && !is_registered && (
                  <div
                    className={`${
                      tabId === "registration" ? activeClass : inActiveClass
                    }`}
                    onClick={() => {
                      if (tabId !== "registration") {
                        handelScroll("registration");
                      }
                    }}
                  >
                    Registration
                  </div>
                )}
                <div
                  className={`${
                    tabId === "gallery" ? activeClass : inActiveClass
                  }`}
                  onClick={() => {
                    if (tabId !== "gallery") {
                      handelScroll("gallery");
                    }
                  }}
                >
                  Gallery
                </div>
              </div>
            )}
            <div
              id="organizing-committee-members-container"
              className="iferp-scroll pe-2"
            >
              {isConfrenceDetails && (
                <EditConferenceDetails
                  eventId={eventId}
                  fetchEventDetails={() => {
                    fetchEventDetails();
                    setIsConfrenceDetails(false);
                  }}
                  onHide={() => {
                    setIsConfrenceDetails(false);
                  }}
                />
              )}
              {editDates && (
                <EditImportantDates
                  eventId={eventId}
                  fetchEventDetails={() => {
                    fetchEventDetails();
                    setEditDates(false);
                  }}
                  onHide={() => {
                    setEditDates(false);
                  }}
                />
              )}
              {type !== null && (
                <EditCommitteeMemberAndSpeaker
                  onHide={() => {
                    setType(null);
                  }}
                  eventId={eventId}
                  fetchEventDetails={() => {
                    fetchEventDetails();
                    setType(null);
                  }}
                  type={type}
                />
              )}
              {isRegistration && (
                <EditRegistartion
                  eventId={eventId}
                  fetchEventDetails={() => {
                    fetchEventDetails();
                    setIsRegistration(false);
                  }}
                  onHide={() => {
                    setIsRegistration(false);
                  }}
                />
              )}
              {isGallery && (
                <EditPastConferencesGallery
                  eventId={eventId}
                  onHide={() => {
                    setIsGallery(false);
                  }}
                  fetchEventDetails={() => {
                    fetchEventDetails();
                    setIsGallery(false);
                  }}
                />
              )}
              <div
                className="row"
                id="organizing-committee-members"
                ref={organizingCommitteeMembersRef}
              >
                <div className="col-md-7 col-12 cmb-24">
                  <Card className="unset-br d-flex flex-column h-100">
                    <div className="d-flex align-items-center justify-content-between cps-18 cpe-18 cpt-14 cpb-14">
                      <div className="text-15-500 color-title-navy font-poppins">
                        Conference Details
                      </div>

                      {access.isShare && (
                        <ShareButton type="EVENT" url={window.location.href} />
                      )}

                      {access.isEdit && (
                        <div
                          className="text-14-400 color-silver-gray pointer"
                          onClick={() => {
                            setIsConfrenceDetails(true);
                          }}
                        >
                          <i className="bi bi-pencil me-2" />
                          Edit
                        </div>
                      )}
                    </div>
                    <hr className="unset-m unset-p" />
                    <div className="cps-18 cpe-18 cpt-20 cpb-20 d-flex flex-column h-100">
                      <div className="text-16-500 color-raisin-black cpb-22">
                        {event_name}
                      </div>
                      <div className="d-flex align-items-center flex-wrap gap-3">
                        <div className="text-15-500 color-subtitle-navy text-nowrap">
                          <i className="bi bi-calendar4-week me-2" />
                          {getEventDate(start_date, end_date)}
                        </div>
                        {country_name && (
                          <div className="text-15-500 color-subtitle-navy text-nowrap">
                            <i className="bi bi-geo-alt me-2" />
                            {`${
                              city_name ? `${city_name},` : ""
                            } ${country_name}`}
                          </div>
                        )}
                      </div>
                      <div className="d-flex align-items-end flex-wrap flex-grow-1 gap-4 cmt-40 cpb-12">
                        {access.isProceedingBook && (
                          <Button
                            isRounded
                            text="Proceeding Book"
                            btnStyle="primary-outline"
                            className="cps-30 cpe-30"
                            icon={<i className="bi bi-download me-2" />}
                            onClick={async () => {
                              const response = await generatePreSignedUrl(
                                proceeding_book,
                                conferencePath
                              );
                              dispatch(downloadFile(response));
                            }}
                          />
                        )}
                        <Button
                          isRounded
                          text="Brochure"
                          btnStyle={
                            eventData?.brochure_path
                              ? "primary-outline"
                              : "primary-gray"
                          }
                          className="cps-30 cpe-30"
                          icon={<i className="bi bi-download me-2" />}
                          onClick={async () => {
                            const response = await generatePreSignedUrl(
                              eventData?.brochure_path,
                              BrochurePath
                            );
                            if (response) {
                              dispatch(
                                downloadFile(
                                  response,
                                  getFilenameFromUrl(eventData?.brochure_path)
                                )
                              );
                            }
                          }}
                        />
                        {access.isPoster && (
                          <Button
                            isRounded
                            text="Poster"
                            btnStyle={
                              eventData?.poster_path
                                ? "primary-outline"
                                : "primary-gray"
                            }
                            className="cps-30 cpe-30"
                            icon={<i className="bi bi-download me-2" />}
                            onClick={async () => {
                              const response = await generatePreSignedUrl(
                                eventData?.poster_path,
                                posterPath
                              );
                              dispatch(downloadFile(response));
                            }}
                          />
                        )}
                        {access.isRegister && (
                          <Button
                            isRounded
                            btnStyle="primary-dark"
                            className="cps-50 cpe-50"
                            onClick={() => {
                              handelScroll("registration");
                            }}
                            text={is_registered ? "Registered" : "Register"}
                            disabled={is_registered}
                          />
                        )}
                        {access.isSubmitAbstract && (
                          <Button
                            isRounded
                            btnStyle="primary-dark"
                            className="text-14-500 cps-12 cpe-12 text-nowrap"
                            text="Submit Abstract/Paper"
                            onClick={() => {
                              navigate(
                                `/${memberType}/${moduleType}/${lowerCase(
                                  event_type
                                ).replace(
                                  /\s/g,
                                  "-"
                                )}/${eventId}/abstract-submission/add-abstract-submission`
                              );
                            }}
                          />
                        )}
                        {access.isCollaboration && (
                          <Button
                            onClick={() => {
                              navigate(
                                `/${memberType}/help/collaboration/${event_type_id}/${eventId}`
                              );
                            }}
                            text="Apply as an academic partner"
                            btnStyle="primary-dark"
                            className="text-14-500"
                            isRounded
                          />
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="col-md-5 col-12 cmb-24">
                  <Card className="unset-br h-100">
                    <div className="d-flex align-items-center justify-content-between cps-18 cpe-18 cpt-14 cpb-14">
                      <div className="text-15-500 color-title-navy font-poppins">
                        Important Dates
                      </div>
                      {access.isEdit && (
                        <div
                          className="text-14-400 color-silver-gray pointer"
                          onClick={() => {
                            setEditDates(true);
                          }}
                        >
                          <i className="bi bi-pencil me-2" />
                          Edit
                        </div>
                      )}
                    </div>
                    <hr className="unset-m unset-p" />
                    {!dates?.early_bird_registration ? (
                      <div className="d-flex justify-content-center text-14-400 cpb-20 cmt-24">
                        No Data Found
                      </div>
                    ) : (
                      <div className="cps-18 cpe-18 cpt-20 cpb-20">
                        <div className="row">
                          <div className="col-md-6 cmb-18">
                            <div className="important-dates-block">
                              <div className="text-14-500 color-raisin-black">
                                Early Bird Registration
                              </div>
                              <div className="text-14-500 color-new-car mt-1">
                                <i className="bi bi-calendar4-week me-2" />
                                {formatDate(
                                  dates?.early_bird_registration,
                                  "Do MMM YYYY"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 cmb-18">
                            <div className="important-dates-block">
                              <div className="text-14-500 color-raisin-black">
                                Abstract Submission
                              </div>
                              <div className="text-14-500 color-new-car mt-1">
                                <i className="bi bi-calendar4-week me-2" />
                                {formatDate(
                                  dates?.abstract_submission,
                                  "Do MMM YYYY"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 cmb-18">
                            <div className="important-dates-block">
                              <div className="text-14-500 color-raisin-black">
                                Full Paper Submission
                              </div>
                              <div className="text-14-500 color-new-car mt-1">
                                <i className="bi bi-calendar4-week me-2" />
                                {formatDate(
                                  dates?.full_paper_submission,
                                  "Do MMM YYYY"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="important-dates-block">
                              <div className="text-14-500 color-raisin-black">
                                Registration Deadline
                              </div>
                              <div className="text-14-500 color-new-car mt-1">
                                <i className="bi bi-calendar4-week me-2" />
                                {formatDate(
                                  dates?.registration_deadline,
                                  "Do MMM YYYY"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
              {access.isOCM && (
                <Card className="cmt-24 unset-br">
                  <div className="d-flex align-items-center justify-content-between cps-18 cpe-18 cpt-14 cpb-14">
                    <div className="text-15-500 color-title-navy font-poppins">
                      Organizing Committee Members (OCM)
                    </div>
                    {access.isEdit && (
                      <div
                        className="text-14-400 color-silver-gray pointer text-nowrap"
                        onClick={() => {
                          setType(0);
                        }}
                      >
                        <i className="bi bi-pencil me-2" />
                        Edit
                      </div>
                    )}
                  </div>
                  <hr className="unset-m unset-p" />

                  <ViewCommitteeMembers />
                </Card>
              )}
              <Card className="unset-br">
                <div
                  id="keynote-speakers"
                  ref={keynoteSpeakersRef}
                  className="d-flex align-items-center justify-content-between cps-18 cpe-18 cpt-14 cpb-14"
                >
                  <div className="text-15-500 color-title-navy font-poppins">
                    Keynote Speakers
                  </div>
                  {access.isEdit && (
                    <div
                      className="text-14-400 color-silver-gray pointer"
                      onClick={() => {
                        setType(1);
                      }}
                    >
                      <i className="bi bi-pencil me-2" />
                      Edit
                    </div>
                  )}
                </div>
                <hr className="unset-m unset-p" />
                <div className="cmt-24 cpb-20 cps-18 cpe-18">
                  <ViewKeynoteSpeakers />
                </div>
              </Card>

              {access.isRegistration && !is_registered && (
                <Card className="cmt-24">
                  <div
                    className="d-flex align-items-center justify-content-between cps-18 cpe-18 cpt-14 cpb-14"
                    ref={registrationRef}
                  >
                    <div className="text-15-500 color-title-navy font-poppins">
                      Registration
                    </div>
                    {access.isEdit && (
                      <div
                        className="text-14-400 color-silver-gray pointer"
                        onClick={() => {
                          setIsRegistration(true);
                        }}
                      >
                        <i className="bi bi-pencil me-2" />
                        Edit
                      </div>
                    )}
                  </div>
                  <hr className="unset-m unset-p" />
                  <div className="registration-container cps-18 cpe-18 cmt-24 cpb-24">
                    {access.isRegister && showEventPricing ? (
                      <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        onSubmit={handelRegister}
                        validationSchema={validationSchema}
                      >
                        {(props) => {
                          const {
                            values,
                            errors,
                            handleSubmit,
                            handleChange,
                            setFieldValue,
                          } = props;
                          let anyError = Object.keys(errors).length > 0;
                          let discount_in_percentage = applyDiscount || "";
                          let discount = 0;
                          if (discount_in_percentage && values?.amount) {
                            discount =
                              (values?.amount * discount_in_percentage) / 100;
                          }
                          let finalAmount = values?.amount - discount;
                          let charges = (finalAmount * 2.5) / 100;
                          finalAmount = Math.ceil(finalAmount + charges);
                          if (!isNational) {
                            finalAmount = (finalAmount * inrPrice).toFixed(2);
                          }

                          return (
                            <>
                              <ViewRegistration
                                inrPrice={inrPrice}
                                isEdit={true}
                                isNational={isNational}
                                handelPriceSelection={(price) => {
                                  setFieldValue("amount", price);
                                }}
                              />

                              <form className="row cmt-40 cmb-20">
                                <div className="col-md-6 cmb-22">
                                  <TextInput
                                    value={`${first_name} ${last_name}`}
                                    disabled
                                  />
                                </div>
                                <div className="col-md-6 cmb-22">
                                  <TextInput value={email_id} disabled />
                                </div>
                                <div className="col-md-6 cmb-22">
                                  <TextInput value={phone_number} disabled />
                                </div>
                                <div className="col-md-6 cmb-22">
                                  <TextInput
                                    value={`${
                                      isNational ? "₹" : "$"
                                    } ${finalAmount}`}
                                    disabled
                                  />
                                  <div className="d-flex gap-2">
                                    {discount > 0 && (
                                      <div className="text-12-400 mt-1 text-success">
                                        {`${discount_in_percentage}% Discount Applied`}
                                      </div>
                                    )}
                                    {finalAmount > 0 && (
                                      <div className="text-12-400 mt-1 text-warning">
                                        +2.5% charges applied
                                      </div>
                                    )}
                                    {finalAmount > 0 && isNonPremium && (
                                      <div
                                        className="text-12-400 mt-1 text-primary ms-2 pointer"
                                        onClick={() => {
                                          dispatch(setIsPremiumPopup(true));
                                        }}
                                      >
                                        Upgrade to Premium to get a 10% discount
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {userType === "3" ? (
                                  <>
                                    <div className="col-md-6 cmb-22">
                                      <TextInput
                                        type="number"
                                        placeholder="Strength Of Students*"
                                        id="strength_of_students"
                                        value={values.strength_of_students}
                                        error={errors.strength_of_students}
                                        onChange={handleChange}
                                      />
                                    </div>
                                    <div className="col-md-6 cmb-22">
                                      <TextInput
                                        type="number"
                                        placeholder="Strength Of Faculties*"
                                        id="strength_of_faculties"
                                        value={values.strength_of_faculties}
                                        error={errors.strength_of_faculties}
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className={`d-flex align-items-center ${
                                        is_registered ? "disabled-block" : ""
                                      }`}
                                    >
                                      <div className="me-5">
                                        <Label
                                          label="Register As"
                                          className="text-16-600 color-raisin-black"
                                        />
                                      </div>
                                      <div className="flex-grow-1 d-flex">
                                        <RadioInput
                                          label="Presenter"
                                          className="pe-4"
                                          onChange={() => {
                                            setFieldValue(
                                              "join_as",
                                              "presenter"
                                            );
                                          }}
                                          checked={
                                            values.join_as === "presenter"
                                          }
                                        />
                                        <RadioInput
                                          label="Listener"
                                          onChange={() => {
                                            setFieldValue(
                                              "join_as",
                                              "listener"
                                            );
                                          }}
                                          checked={
                                            values.join_as === "listener"
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className="text-13-400 cmb-22"
                                      style={{ color: "red" }}
                                    >
                                      {errors?.join_as}
                                    </div>
                                    <div>
                                      <TextInput
                                        placeholder="How did you get to know about the Conference?"
                                        value={values.how_you_know}
                                        id="how_you_know"
                                        onChange={(e) => {
                                          setFieldValue(
                                            "how_you_know",
                                            e.target.value
                                          );
                                        }}
                                        error={errors?.how_you_know}
                                        disabled={is_registered}
                                      />
                                    </div>
                                  </>
                                )}
                              </form>
                              <div className="d-flex justify-content-center cmt-20 cpb-10">
                                <div ref={htmlElRef} />
                                {isEventRegister ? (
                                  <>
                                    <CCAvenuePay
                                      btnLoading={btnLoading}
                                      disabled={finalAmount === "0.00"}
                                      onClick={() => {
                                        if (anyError || !values.join_as) {
                                          handleSubmit();
                                        } else if (isShowUpgradePopup) {
                                          dispatch(setIsPremiumPopup(true));
                                        } else {
                                          let paymentIntentData = {
                                            page_type: "REQUEST",
                                            type: "EVENT_REGISTER",
                                            currency: isNational
                                              ? "INR"
                                              : "USD",
                                            amount: isNational
                                              ? finalAmount
                                              : finalAmount,
                                            price: finalAmount,
                                            discount: discount,
                                            discount_in_percentage:
                                              discount_in_percentage,
                                            formInitialValue: values,
                                            toURL: window.location.pathname,
                                          };
                                          localStorage.paymentIntent =
                                            encrypt(paymentIntentData);

                                          navigate("/member/cc-avenue-payment");
                                        }
                                      }}
                                    />
                                    {/* <PayButton
                                    isPayment={
                                      !isEqual(values, initialValues) &&
                                      !anyError &&
                                      !isShowUpgradePopup
                                    }
                                    currency={isNational ? "INR" : "USD"}
                                    amount={
                                      isNational
                                        ? finalAmount
                                        : finalAmount * 100
                                    }
                                    onClick={() => {
                                      if (anyError) {
                                        handleSubmit();
                                      } else if (isShowUpgradePopup) {
                                        dispatch(setIsPremiumPopup(true));
                                      } else {
                                        // Nothing
                                      }
                                    }}
                                    handelSuccess={(e) => {
                                      let newPayData = e;
                                      if (discount) {
                                        newPayData = {
                                          ...newPayData,
                                          amount: finalAmount,
                                          discount: discount,
                                          discount_in_percentage:
                                            discount_in_percentage,
                                        };
                                      }
                                      setPaymentData(newPayData);
                                      setTimeout(() => {
                                        handleSubmit();
                                      }, 100);
                                    }}
                                  >
                                    <Button
                                      isRounded
                                      text="Pay Now"
                                      btnStyle="primary-dark"
                                      className="cps-40 cpe-40"
                                      btnLoading={btnLoading}
                                      disabled={isEqual(values, initialValues)}
                                    />
                                  </PayButton> */}
                                  </>
                                ) : (
                                  <Button
                                    isRounded
                                    text="Pay Now"
                                    btnStyle="primary-dark"
                                    className="cps-40 cpe-40"
                                    onClick={() => {
                                      dispatch(
                                        setApiError({
                                          show: true,
                                          message:
                                            "Registartion prices are not available.",
                                          type: "danger",
                                        })
                                      );
                                    }}
                                  />
                                )}
                              </div>
                            </>
                          );
                        }}
                      </Formik>
                    ) : (
                      <ViewRegistration
                        inrPrice={inrPrice}
                        isNational={isNational}
                      />
                    )}
                  </div>
                </Card>
              )}

              {access.isGallary && (
                <Card className="cmt-24">
                  <div
                    className="d-flex align-items-center justify-content-between cps-18 cpe-18 cpt-14 cpb-14"
                    ref={galleryRef}
                  >
                    <div className="text-15-500 color-title-navy font-poppins">
                      Past Conferences Gallery
                    </div>
                    {access.isEdit && (
                      <div
                        className="text-14-400 color-silver-gray pointer"
                        onClick={() => {
                          setIsGallery(true);
                        }}
                      >
                        <i className="bi bi-pencil me-2" />
                        Edit
                      </div>
                    )}
                  </div>
                  <hr className="unset-m unset-p" />
                  <div className="row cps-18 cpe-18 cmt-24 cpb-24">
                    <ViewPastConferenceGallery />
                  </div>
                </Card>
              )}
            </div>
          </>
        </div>
      )}
    </>
  );
};
export default ConferenceDetails;
