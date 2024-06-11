import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Button from "components/form/Button";
import SeachInput from "components/form/SeachInput";
import { omit } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllMySessions,
  setMySessionID,
  setMySessionData,
  fetchProfile,
  throwError,
  setTabTypeAddedBankAccount,
} from "store/slices";
import { icons, limit } from "utils/constants";
import {
  INRtoUSD,
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import "./MySession.scss";

const MySession = () => {
  const authUser = getDataFromLocalStorage();
  const { personal_details = {}, exchange_rate } = authUser;
  const isNational = personal_details?.country_name === "India";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardRef = useRef();
  const searchRef = useRef("");
  const [timer, setTimer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [scrollLoader, setScrollLoader] = useState(false);

  const [mySessionsList, setMySessionsList] = useState({
    mentor_id: authUser?.id,
    session_name: "",
    data: [],
    loading: true,
    total: 0,
    limit: limit,
    offset: 0,
  });
  const offsetRef = useRef(0);
  const totalDocRef = useRef(0);
  const fetchCardData = async (data, isReset) => {
    setScrollLoader(true);
    setIsLoading(true);
    const payload = omit(
      { ...data, offset: offsetRef.current, session_name: searchRef.current },
      ["data", "total"]
    );
    const response = await dispatch(
      getAllMySessions(objectToFormData(payload))
    );

    if (response?.status === 200) {
      offsetRef.current = offsetRef.current + mySessionsList.limit;
      totalDocRef.current = response?.data?.result_count;
      setMySessionsList((prev) => {
        let resData = response?.data?.result_data || [];
        let listData = isReset ? resData : [...prev.data, ...resData];
        return {
          ...prev,
          // data: [...prev.data, ...response?.data?.result_data] || [],
          data: listData,
          total: response?.data?.result_count,
          offset: mySessionsList?.offset + mySessionsList?.limit,
          loading: false,
        };
      });
    }
    setIsLoading(false);
    setScrollLoader(false);
  };

  const handleScroll = () => {
    const scrollTop = customScrollContainer?.scrollTop;
    const clientHeight = customScrollContainer?.clientHeight;
    const scrollHeight = customScrollContainer?.scrollHeight;
    if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
      if (totalDocRef.current >= offsetRef.current) {
        fetchCardData(mySessionsList);
      }
      setIsLoading(false);
    }
  };
  const customScrollContainer = document.querySelector(
    ".my-session-card-container"
  );
  const handleSearch = (e) => {
    let value = e?.target?.value;
    searchRef.current = e?.target?.value;
    // setSearchText(value);
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      let oldData = {
        ...mySessionsList,
        session_name: value,
        loading: true,
        limit: limit,
        offset: 0,
      };
      setMySessionsList(oldData);
      offsetRef.current = 0;
      totalDocRef.current = 0;
      // fetchCardData(oldData);
      fetchCardData(oldData, true);
    }, 800);
    setTimer(time);
  };

  const getProfileData = async () => {
    const response = await dispatch(fetchProfile());
    if (response?.status === 200) {
      setProfileData(response?.data);
    }
  };

  useEffect(() => {
    getProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (customScrollContainer) {
      customScrollContainer?.addEventListener("scroll", handleScroll);
      return () => {
        customScrollContainer?.removeEventListener("scroll", handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customScrollContainer]);

  useEffect(() => {
    offsetRef.current = 0;
    totalDocRef.current = 0;
    fetchCardData(mySessionsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRedirect = (link) => {
    window.open(link, "_blank");
  };

  return (
    <div id="mentor-session-container">
      <div className="d-flex justify-content-between align-items-center cmb-20 flex-wrap">
        <div className="color-text-navy text-16-500-25">
          My Sessions ({mySessionsList?.total})
        </div>
        <div className="d-flex gap-2 align-items-center">
          <SeachInput
            placeholder="Search session"
            value={searchRef.current}
            onChange={handleSearch}
            isRounded
          />
          <Button
            text="Add Session"
            btnStyle="primary-outline"
            icon={<img src={icons.addRound} alt="add" />}
            className="d-flex gap-2 text-nowrap"
            // onClick={() => {
            //   dispatch(setMySessionData(null));
            //   navigate("/professional/mentorship/mentor/add-new-session");
            // }}
            onClick={() => {
              profileData?.stripe_connect_status === "1" ||
              profileData?.account_number ||
              profileData?.beneficiary_bank_account ||
              profileData?.mentor_status === "1"
                ? navigate("/professional/mentorship/mentor/add-new-session")
                : profileData?.mentor_status !== "1"
                ? dispatch(
                    throwError({
                      message:
                        "After becoming mentor and add payment account details, You can add the session.",
                    })
                  )
                : dispatch(
                    throwError({ message: "Add Payment Account Details" })
                  );
            }}
            // disabled={
            //   profileData?.stripe_connect_status === "1" ||
            //   profileData?.account_number ||
            //   profileData?.beneficiary_bank_account
            //     ? false
            //     : true
            // }
          />
        </div>
      </div>
      <div className="row g-0 my-session-card-container" ref={cardRef}>
        {isLoading && (
          <Card className="cpt-50 cpb-50 cmb-20">
            <Loader size="sm" />
          </Card>
        )}
        {!isLoading &&
          (mySessionsList?.data?.length === 0 ? (
            <Card className="cpt-50 cpb-50 text-center">No Records Found.</Card>
          ) : (
            mySessionsList?.data?.map((elem, index) => {
              const {
                id,
                session_name,
                amount,
                meeting_link,
                meeting_duration,
                rating_reveiw,
                rating,
                skill,
                session_overview,
              } = elem;
              const price = INRtoUSD(amount, exchange_rate);
              const newPrice = parseFloat(price?.toFixed(2));
              return (
                <div className="col-md-6 cmb-10" key={index}>
                  <Card className="cme-5 h-100">
                    <div className="cpt-15 cpb-15 cps-15 cpe-15">
                      <div className="d-flex justify-content-between align-items-center cmb-10">
                        <div
                          className="title-hover"
                          onClick={() => {
                            dispatch(setMySessionID(elem));
                            navigate(
                              `/professional/mentorship/mentor/session/details/${id}`
                            );
                          }}
                        >
                          {`${titleCaseString(session_name)} - ${
                            isNational ? `₹ ${amount}` : `$ ${newPrice}`
                          }`}
                        </div>
                        <Button
                          text="Edit"
                          icon={<img src={icons.primaryEditPen} alt="edit" />}
                          className="d-flex gap-2 color-text-blue"
                          onClick={() => {
                            dispatch(setMySessionData(elem));
                            navigate(
                              `/professional/mentorship/mentor/edit-new-session`
                            );
                            dispatch(setTabTypeAddedBankAccount(""));
                          }}
                        />
                      </div>
                      <div className="d-flex align-items-center gap-4 cmb-10">
                        <div
                          className={`${
                            meeting_link && "pointer"
                          } d-flex gap-2 align-items-center`}
                          onClick={() => {
                            handleRedirect(meeting_link);
                          }}
                        >
                          <img src={icons.videoMeet} alt="meet" />
                          <div className="text-14-400-26 color-dark-blue cpt-2">
                            1:1 Video Meet
                          </div>
                        </div>
                        {meeting_duration && (
                          <div className="d-flex gap-2 align-items-center">
                            <img src={icons.clockTime} alt="clock" />
                            <div className="text-14-400-26 color-dark-blue">
                              {meeting_duration}
                            </div>
                          </div>
                        )}

                        {rating_reveiw && rating && (
                          <div className="d-flex gap-2 align-items-center">
                            <img src={icons.star} alt="star" />

                            <div className="text-14-500 color-dark-blue">
                              <span>{rating}</span> (
                              <span className="text-14-400 underline">
                                {`${rating_reveiw} Reviews`}
                              </span>
                              )
                            </div>
                          </div>
                        )}
                      </div>

                      {skill?.length > 0 && (
                        <>
                          <div className="text-14-500 color-dark-navy-blue cmb-5">
                            Skills They will Learn
                          </div>
                          <div className="d-flex gap-3 flex-wrap cmb-10">
                            {skill?.map((data, i) => {
                              return (
                                <div
                                  className="text-14-400 key-points color-dark-blue"
                                  key={i}
                                >
                                  {titleCaseString(data)}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}

                      <div>
                        <div className="text-14-500 color-dark-navy-blue">
                          Session Overview
                        </div>
                        <p className="text-14-400 color-dark-blue text-justify">
                          {session_overview}
                        </p>
                        <div className="d-flex">
                          <div
                            className="d-flex gap-2 align-items-center pointer"
                            onClick={() => {
                              dispatch(setMySessionID(elem));
                              navigate(
                                `/professional/mentorship/mentor/session/details/${id}`
                              );
                              dispatch(setTabTypeAddedBankAccount(""));
                            }}
                          >
                            <div className="text-13-400 color-text-blue">
                              View More
                            </div>
                            <div>
                              <img src={icons.rightArrow} alt="right" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })
          ))}
        {!isLoading && scrollLoader && (
          <div className="cpt-30 cpb-30">
            <Loader size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MySession;
