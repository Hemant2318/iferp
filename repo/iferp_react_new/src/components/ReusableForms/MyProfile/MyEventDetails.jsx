import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import ViewCommitteeMembers from "components/Layout/ViewCommitteeMembers";
import ViewPastConferenceGallery from "components/Layout/ViewPastConferenceGallery";
import ViewKeynoteSpeakers from "components/Layout/ViewKeynoteSpeakers";
// import ViewPaper from "components/ReusableForms/Paper/ViewPaper";
import {
  certificatePath,
  eventAcceptanceLetterPath,
  icons,
} from "utils/constants";
import {
  downloadFile,
  generatePreSignedUrl,
  getDataFromLocalStorage,
  getEventDate,
} from "utils/helpers";
import {
  fetchUserEventDetails,
  fetchUserEventDocument,
  storeEventData,
} from "store/slices";
import Community from "pages/Common/EventManagement/Events/EventDetails/Community";
import { replace } from "lodash";
import SubmittedAbstracts from "../SubmittedAbstracts";

const MyEventDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = getDataFromLocalStorage();
  const { id } = userData;
  const { eventData } = useSelector((state) => ({
    eventData: state.global.eventData,
  }));
  const getMyDocument = async () => {
    const response = await dispatch(
      fetchUserEventDocument(`event_id=${params?.eventId}&user_id=${id}`)
    );

    let acceptanceLetter = response?.data?.acceptance_letter || [];
    let certificate = response?.data?.certificate || [];
    const newList = [];
    certificate?.forEach((el) => {
      if (el?.event_certificate) {
        newList.push({
          fileURL: el.event_certificate,
        });
      }
    });
    acceptanceLetter?.forEach((el) => {
      if (el?.registration_acceptance_letter) {
        newList.push({
          fileURL: el.registration_acceptance_letter,
          isLetter: true,
        });
      }
    });
    const promises = newList.map(async (elm) => {
      let newRes = await generatePreSignedUrl(
        elm.fileURL,
        elm.isLetter ? eventAcceptanceLetterPath : certificatePath
      );
      return { ...elm, nFile: newRes };
    });
    const results = await Promise.all(promises);
    setMyDoc(results);
  };
  const fetchEventDetails = async () => {
    await dispatch(
      fetchUserEventDetails({
        event_id: params?.eventId,
        user_id: id,
      })
    );
  };
  const eventDetailsRef = useRef(null);
  const organizingCommitteeMembersRef = useRef(null);
  const keynoteSpeakersRef = useRef(null);
  const myDocumentRef = useRef(null);
  const pastConferencesGalleryRef = useRef(null);
  const submittedAbstractRef = useRef(null);

  const [myDoc, setMyDoc] = useState([]);
  const [type, setType] = useState("event-details");
  const [tabId, setTabId] = useState("events-details");
  const handelScroll = (id) => {
    setTabId(id);
    switch (id) {
      case "events-details":
        eventDetailsRef.current.scrollIntoView();
        break;
      case "organizing-committee-members":
        organizingCommitteeMembersRef.current.scrollIntoView();
        break;
      case "keynote-speakers":
        keynoteSpeakersRef.current.scrollIntoView();
        break;
      case "past-conferences-gallery":
        pastConferencesGalleryRef.current.scrollIntoView();
        break;
      case "my-document":
        myDocumentRef.current.scrollIntoView();
        break;
      case "submitted-abstract":
        submittedAbstractRef.current.scrollIntoView();
        break;
      default:
        eventDetailsRef.current.scrollIntoView();
        break;
    }
  };
  useEffect(() => {
    if (eventData?.event_name && localStorage.abstractID) {
      setTabId("submitted-abstract");
      handelScroll("submitted-abstract");
    }
  }, [eventData]);

  useEffect(() => {
    getMyDocument();
    fetchEventDetails();
    return () => {
      dispatch(storeEventData({}));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    event_name,
    start_date,
    end_date,
    city_name: city,
    country_name: country,
    virtual_platform_link,
    created_id,
    // event_certificates = [],
    // abstract_details = {},
    role,
  } = eventData;
  const activeClass = "p-2 color-new-car text-16-500 me-4 primary-underline";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";

  const pActiveClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const pInActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  const access = {
    isParentTab: !created_id,
    isTab: !created_id,
    isOCM: !created_id,
    isGallery: !created_id,
    isDoc: !created_id,
  };
  let roleValue = role;
  roleValue = replace(roleValue, ",", ", ");
  roleValue = replace(roleValue, "listener", "Listener");
  roleValue = replace(roleValue, "presenter", "Presenter");
  const userType = getDataFromLocalStorage("user_type");
  return (
    <div>
      {access.isParentTab && (
        <Card className="d-flex align-items-center p-1 unset-br mb-4">
          <span
            className="d-flex ps-2"
            onClick={() => {
              navigate(-1);
            }}
          >
            <img
              src={icons.leftArrow}
              alt="back"
              className="h-21 me-3 pointer"
            />
          </span>
          <div
            className={type === "event-details" ? pActiveClass : pInActiveClass}
            onClick={() => {
              setType("event-details");
            }}
          >
            Events Details
          </div>
          <div
            className={type === "community" ? pActiveClass : pInActiveClass}
            onClick={() => {
              setType("community");
            }}
          >
            Community
          </div>
        </Card>
      )}

      {type === "event-details" && (
        <>
          {access.isTab && (
            <div className="d-flex align-items-center flex-wrap mb-3">
              <div
                className={`${
                  tabId === "events-details" ? activeClass : inActiveClass
                }`}
                onClick={() => {
                  if (tabId !== "events-details") {
                    handelScroll("events-details");
                  }
                }}
              >
                Events Details
              </div>
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

              <div
                className={`${
                  tabId === "my-document" ? activeClass : inActiveClass
                }`}
                onClick={() => {
                  if (tabId !== "my-document") {
                    handelScroll("my-document");
                  }
                }}
              >
                My Documents
              </div>
              <div
                className={`${
                  tabId === "past-conferences-gallery"
                    ? activeClass
                    : inActiveClass
                }`}
                onClick={() => {
                  if (tabId !== "past-conferences-gallery") {
                    handelScroll("past-conferences-gallery");
                  }
                }}
              >
                Gallery
              </div>
              <div
                className={`${
                  tabId === "submitted-abstract" ? activeClass : inActiveClass
                }`}
                onClick={() => {
                  if (tabId !== "submitted-abstract") {
                    handelScroll("submitted-abstract");
                  }
                }}
              >
                Submitted Abstract/Paper
              </div>
            </div>
          )}

          <div
            id="user-organizing-committee-members-container"
            className="iferp-scroll pe-2"
          >
            <div className="row" id="organizing-committee-members">
              <Card className="unset-br">
                <div
                  className="d-flex align-items-center cps-18 cpe-18 cpt-14 cpb-14"
                  ref={eventDetailsRef}
                >
                  {created_id && (
                    <span
                      className="d-flex"
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      <img
                        src={icons.leftArrow}
                        alt="back"
                        className="h-21 me-3 pointer"
                      />
                    </span>
                  )}
                  <div className="text-15-500 color-black-olive">
                    Event Details
                  </div>
                </div>
                <hr className="unset-m unset-p" />
                <div className="cps-18 cpe-18 cpt-20 cpb-20">
                  <div className="text-16-500 color-raisin-black cpb-22">
                    {event_name}
                  </div>
                  <div className="d-flex align-items-center flex-wrap gap-3">
                    <div className="text-15-500 color-black-olive text-nowrap">
                      <i className="bi bi-calendar4-week me-2" />
                      {getEventDate(start_date, end_date)}
                    </div>
                    {country && (
                      <div className="text-15-500 color-black-olive text-nowrap">
                        <i className="bi bi-geo-alt me-2" />
                        {`${city ? `${city},` : ""} ${country}`}
                      </div>
                    )}
                    <div className="text-15-500 color-silver-gray text-nowrap">
                      <i className="bi bi-person me-2 text-18-400" />
                      {userType === "3" || userType === "4"
                        ? `${0} Members Registered`
                        : `Applied as ${roleValue}`}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {access.isOCM && (
              <Card className="cmt-24 unset-br">
                <div
                  className="d-flex align-items-center justify-content-between cps-18 cpe-18 cpt-14 cpb-14"
                  ref={organizingCommitteeMembersRef}
                >
                  <div className="text-15-500 color-black-olive">
                    Organizing Committee Members (OCM)
                  </div>
                </div>
                <hr className="unset-m unset-p" />
                <ViewCommitteeMembers />
              </Card>
            )}

            <Card className="cmt-24 unset-br">
              <div
                id="keynote-speakers"
                className="d-flex align-items-center justify-content-between cps-18 cpe-18 cpt-14 cpb-14"
                ref={keynoteSpeakersRef}
              >
                <div className="text-15-500 color-black-olive">
                  Keynote Speakers
                </div>
              </div>
              <hr className="unset-m unset-p" />
              <div className="cmt-24 cpb-20 cps-18 cpe-18">
                <ViewKeynoteSpeakers />
              </div>
            </Card>

            {access.isDoc && (
              <Card className="cmt-24 unset-br">
                <div
                  className="d-flex align-items-center justify-content-between cps-18 cpe-18 cpt-14 cpb-14"
                  ref={myDocumentRef}
                >
                  <div className="text-15-500 color-black-olive">
                    My Documents
                  </div>
                </div>
                <hr className="unset-m unset-p" />
                <div className="row cps-18 cpe-18 cmt-24 cpb-24">
                  {myDoc?.length === 0 ? (
                    <div className="d-flex justify-content-center text-14-400">
                      No Data Found
                    </div>
                  ) : (
                    <div>
                      {myDoc?.map((el, index) => {
                        let cUrl = el?.fileURL;
                        const newType = cUrl ? cUrl?.split(".")?.pop() : "";
                        if (["pdf", "doc", "csv", "html"].includes(newType)) {
                          if (
                            (newType === "doc" || newType === "csv") &&
                            cUrl
                          ) {
                            cUrl = `https://docs.google.com/gview?url=${cUrl}&embedded=true`;
                          }
                        }
                        return (
                          <div
                            key={index}
                            className="d-flex gap-3 align-items-center flex-wrap mb-2"
                          >
                            <div
                              style={{
                                height: "200px",
                                width: "200px",
                              }}
                            >
                              {["pdf", "doc", "docx", "csv", "html"].includes(
                                newType
                              ) ? (
                                <iframe
                                  className="w-100"
                                  src={el.nFile}
                                  title="description"
                                  style={{
                                    height: "200px",
                                  }}
                                />
                              ) : (
                                <img
                                  src={el.nFile}
                                  alt="registration_acceptance_letter"
                                  className="fit-image fill"
                                />
                              )}
                            </div>
                            <div className="d-flex">
                              <Button
                                isRounded
                                icon={
                                  el?.isLetter ? (
                                    <i className="bi bi-download me-2" />
                                  ) : (
                                    ""
                                  )
                                }
                                text={
                                  el?.isLetter
                                    ? "Acceptance Letter"
                                    : "Download Certificate"
                                }
                                btnStyle="primary-dark"
                                className="cps-30 cpe-30 text-nowrap"
                                onClick={() => {
                                  dispatch(downloadFile(el?.nFile));
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {access.isGallery && (
              <Card className="cmt-24 unset-br">
                <div
                  className="d-flex align-items-center justify-content-between cps-18 cpe-18 cpt-14 cpb-14"
                  ref={pastConferencesGalleryRef}
                >
                  <div className="text-15-500 color-black-olive">
                    Past Conferences Gallery
                  </div>
                </div>
                <hr className="unset-m unset-p" />
                <div className="row cps-18 cpe-18 cmt-24 cpb-24">
                  <ViewPastConferenceGallery />
                  {virtual_platform_link && (
                    <>
                      <div className="text-16-500 color-black-olive mt-3">
                        Presentation Link
                      </div>
                      <div className="color-new-car text-16-500 mt-3">
                        {virtual_platform_link}
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}

            <Card className="cmt-24 unset-br">
              <div
                className="d-flex align-items-center justify-content-between cps-18 cpe-18 cpt-14 cpb-14"
                ref={submittedAbstractRef}
              >
                <div className="text-15-500 color-black-olive">
                  Submitted Abstract/Paper
                </div>
              </div>
              <hr className="unset-m unset-p" />
              <div className="row cps-20 cpe-20 cmt-24 cpb-24">
                <SubmittedAbstracts />
              </div>
            </Card>
          </div>
        </>
      )}
      {type === "community" && <Community />}
    </div>
  );
};
export default MyEventDetails;
