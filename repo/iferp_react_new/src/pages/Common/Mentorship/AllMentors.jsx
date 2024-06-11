import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import PriceRangePopup from "components/Layout/PriceRangePopup";
import Profile from "components/Layout/Profile";
import SelectSkillPopup from "components/Layout/SelectSkillPopup";
import ShareButton from "components/Layout/ShareButton";
import Button from "components/form/Button";
import SeachInput from "components/form/SeachInput";
import { omit } from "lodash";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  applyBecomeMentor,
  fetchAllMentors,
  getMentorDetails,
  throwSuccess,
  fetchProfile,
  sendRequests,
  throwError,
  fetchFollowerOrFollowing,
  fetchRequests,
  setRProfileID,
  setIsDiscountPopup,
} from "store/slices";
import { icons, limit } from "utils/constants";
import {
  INRtoUSD,
  getDataFromLocalStorage,
  getUserType,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import { cloneDeep } from "lodash";
import GuideLinePopup from "components/Layout/GuideLinePopup";
import DiscountPopup from "components/Layout/DiscountPopup";
import "./AllMentors.scss";

const AllMentors = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userType = params?.memberType;
  const memberType = getUserType();
  const { isDiscountPopup } = useSelector((state) => ({
    isDiscountPopup: state.global.isDiscountPopup,
  }));

  const authUserDetails = getDataFromLocalStorage();
  const { personal_details, exchange_rate } = authUserDetails;
  const { id: login_user_id, mentor_status } = authUserDetails;
  const [reviewShowMore, setReviewShowMore] = useState(3);
  const [isPriceRange, setIsPriceRange] = useState(false);
  const [isSelectSkill, setIsSelectSkill] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [iD, setID] = useState("");
  const [aboutText, setAboutText] = useState(50);
  const [sessionViewCount, setSessionViewCount] = useState(3);
  const [isConnectLoader, setIsConnectLoader] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [mentorDetailsData, setMentorDetailsData] = useState({
    data: {},
    loading: true,
  });
  const [profileData, setProfileData] = useState({});
  const offSetRef = useRef(0);
  const totalDocRef = useRef(0);
  const listRef = useRef();
  const [list, setList] = useState([]);
  const [isSelfUser, setIsSelfUser] = useState(false);
  const [isExist, setIsExist] = useState(false);
  const [isAlreadyExist, setIsAlreadyExist] = useState(false);
  const [scrollLoader, setScrollLoader] = useState(false);
  const [isGuidLinePopup, setIsGuidLinePopup] = useState(false);
  const [isLoadAPI, setIsLoadAPI] = useState(true);

  const [allMentorsList, setAllMentorsList] = useState({
    search: "",
    key: "",
    min_price: "",
    max_price: "",
    data: [],
    loading: true,
    total: 0,
    offset: 0,
    limit: 10,
  });
  const ApplyMentor = async () => {
    setIsLoading(true);
    const formData = objectToFormData({ mentor_id: login_user_id });
    const response = await dispatch(applyBecomeMentor(formData));
    if (response?.status === 200) {
      await dispatch(fetchProfile());
      dispatch(throwSuccess("Applied to become mentor successfully !"));
    }
    setIsLoading(false);
  };
  const getAllMentors = async (
    obj,
    isReset,
    isPrice = false,
    isSkill = false
  ) => {
    setScrollLoader(true);
    setIsLoading(true);
    if (isPrice) {
      offSetRef.current = 0;
    }
    if (isSkill) {
      offSetRef.current = 0;
    }
    const payload = omit(
      {
        ...obj,
        offset: offSetRef.current,
      },
      ["data", "loading", "total"]
    );
    const response = await dispatch(fetchAllMentors(objectToFormData(payload)));
    if (response?.status === 200) {
      offSetRef.current = offSetRef.current + obj?.limit;
      totalDocRef.current = response?.data?.result_count;
      setID(response?.data?.result_data?.[0]?.id);
      setAllMentorsList((prev) => {
        let resData = response?.data?.result_data || [];
        let listData = isReset ? resData : [...prev?.data, ...resData];
        return {
          ...prev,
          data: listData,
          total: response?.data?.result_count,
          loading: false,
        };
      });
    } else {
      dispatch(throwError(response?.message));
    }
    setIsLoading(false);
    setScrollLoader(false);
  };

  const fetchMentorDetails = async (mId) => {
    const response = await dispatch(
      getMentorDetails(objectToFormData({ mentor_id: mId }))
    );
    if (response?.status === 200) {
      setMentorDetailsData((prev) => {
        return {
          ...prev,
          data: response?.data || {},
          loading: false,
        };
      });
    }
    setTimeout(() => {
      setIsLoadAPI(false);
    }, 1000);
  };

  const handelSearch = (e) => {
    let value = e?.target?.value;
    setSearchText(value);
    let oldData = {
      ...allMentorsList,
      search: value,
      key: "mentor_name",
      loading: true,
    };
    offSetRef.current = 0;
    listRef?.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    totalDocRef.current = 0;
    setAllMentorsList(oldData);
    getAllMentors(oldData, true);
  };

  const getProfileData = async () => {
    const response = await dispatch(fetchProfile());
    if (response?.status === 200) {
      setProfileData(response?.data);
    }
  };

  useEffect(() => {
    if (iD) {
      setIsLoadAPI(true);
      fetchMentorDetails(iD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iD]);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - Math.ceil(e.target.scrollTop) ===
      e.target.clientHeight;
    if (bottom) {
      let oldData = cloneDeep({
        ...allMentorsList,
        offset: allMentorsList.offset + limit,
      });
      setAllMentorsList(oldData);
      getAllMentors(oldData);
    }
  };

  useEffect(() => {
    getAllMentors(allMentorsList, true);
    getProfileData();
    getRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const mediaData = [
    {
      id: 1,
      title: "Presentations",
      logo: icons.mediaVideo,
      count: mentorDetailsData?.data?.presentation || 0,
    },
    {
      id: 2,
      title: "All Posts",
      logo: icons.mediaGallery,
      count: mentorDetailsData?.data?.post || 0,
    },
    {
      id: 3,
      title: "Likes",
      logo: icons.pinkThumb,
      count: mentorDetailsData?.data?.like || 0,
    },
    {
      id: 4,
      title: "Views",
      logo: icons.blueEye,
      count: mentorDetailsData?.data?.views || 0,
    },
  ];

  const text =
    mentorDetailsData?.data?.about_introduction &&
    mentorDetailsData?.data?.about_introduction;

  const aboutMentorText = text?.slice(0, aboutText);
  if (mentorDetailsData?.data) {
  }

  const handleConnect = async () => {
    setIsConnectLoader(true);
    let id = mentorDetailsData?.data?.id;
    const response = await dispatch(
      sendRequests(objectToFormData({ receiver_id: id }))
    );
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      let oldList = cloneDeep(requestList);
      if (oldList?.find((o) => `${o.id}` === `${id}`)) {
        oldList = oldList?.filter((o) => `${o.id}` !== `${id}`);
      } else {
        oldList = [...oldList, response?.data];
      }
      setRequestList(oldList);
      setIsConnectLoader(false);
    } else {
      dispatch(throwError(response?.message));
    }
  };

  const getRequest = async () => {
    const response = await dispatch(fetchRequests({ type: "following" }));
    setRequestList(response?.data?.result);
  };

  const getFollowing = async () => {
    const response = await dispatch(
      fetchFollowerOrFollowing(objectToFormData({ type: "following" }))
    );
    setList(response?.data?.result || []);
  };

  useEffect(() => {
    getFollowing();
    setIsSelfUser(mentorDetailsData?.data?.id === profileData?.id);
    const selfId = mentorDetailsData?.data?.id;
    setIsExist(
      requestList?.find((o) => `${o.id}` === `${selfId}`) ? true : false
    );

    setIsAlreadyExist(
      list?.find((o) => `${o.id}` === `${selfId}`) ? true : false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorDetailsData, requestList]);

  useEffect(() => {
    getRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorDetailsData]);

  const { data, total } = allMentorsList;

  // const shareUrl = `${window.location.origin}/professional/mentorship/mentor/profile/${mentorDetailsData?.data?.id}`;
  const shareUrl = `${window.location.origin}/member/global-research-profile/${mentorDetailsData?.data?.id}`;

  useEffect(() => {
    if (localStorage.paymentIntent) {
      dispatch(setIsDiscountPopup(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isNational = personal_details?.country_name === "India";
  // console.log(isNational);

  return (
    <div id="mentee-all-mentor-container">
      {isGuidLinePopup && (
        <GuideLinePopup
          title="Guidelines"
          subTitle="Let's get you started as a mentor!"
          onHide={() => {
            setIsGuidLinePopup(false);
          }}
          applyMentor={ApplyMentor}
        />
      )}

      {isDiscountPopup && <DiscountPopup applyMentor={ApplyMentor} />}

      <div className="d-flex justify-content-between align-items-center flex-wrap cmb-20">
        <div className="text-16-500-25 color-subtitle-navy">
          All Mentors {`(${allMentorsList?.total})`}
        </div>
        <div className="d-flex gap-3 flex-wrap">
          <div className="position-relatives">
            <Button
              isRounded
              text="Filter Price Range"
              btnStyle="primary-outline"
              className="text-nowrap gap-3"
              rightIcon={
                <img
                  src={isPriceRange ? icons.upArrow : icons.downArrow}
                  alt="arrow"
                />
              }
              onClick={() => {
                setIsPriceRange(true);
              }}
            />
            {isPriceRange && (
              <PriceRangePopup
                isPriceRange={isPriceRange}
                setIsPriceRange={setIsPriceRange}
                onHide={() => {
                  setIsPriceRange(false);
                }}
                allMentorsList={allMentorsList}
                setAllMentorsList={setAllMentorsList}
                getAllMentors={getAllMentors}
              />
            )}
          </div>
          <div className="">
            <Button
              isRounded
              text="Skills"
              btnStyle="primary-outline"
              className="text-nowrap gap-3"
              rightIcon={
                <img
                  src={isSelectSkill ? icons.upArrow : icons.downArrow}
                  alt="arrow"
                />
              }
              onClick={() => {
                setIsSelectSkill(true);
              }}
            />
            {isSelectSkill && (
              <SelectSkillPopup
                isSelectSkill={isSelectSkill}
                setIsSelectSkill={setIsSelectSkill}
                onHide={() => {
                  setIsSelectSkill(false);
                }}
                allMentorsList={allMentorsList}
                setAllMentorsList={setAllMentorsList}
                getAllMentors={getAllMentors}
              />
            )}
          </div>

          {/* <Dropdown
            placeholder="Select for search"
            options={searchOptions}
            optionValue="value"
            optionKey="value"
            value={searchOptionsValue}
            onChange={(e) => {
              setSearchOptionsValue(e?.target?.value);
              setSearchOptionsId(e?.target?.data?.id);
            }}
          /> */}

          <div className="d-flex">
            <SeachInput
              placeholder={
                "Mentor Name" ? "Search mentors" : "Search sessions or topics"
              }
              value={searchText}
              onChange={handelSearch}
              isRounded
            />
          </div>
          {userType !== "student" &&
            mentor_status !== "Accept" &&
            (mentor_status === "" || mentor_status === "Reject" ? (
              <Button
                text="Become Mentor"
                btnStyle="primary-outline"
                className="text-nowrap"
                btnLoading={isLoading}
                onClick={() => {
                  setIsGuidLinePopup(true);
                }}
                // onClick={ApplyMentor}
              />
            ) : (
              <Button
                text="Pending Approval"
                btnStyle="primary-outline"
                className="text-nowrap"
                disabled
              />
            ))}
          {/* <Button
            text="Add Payment"
            btnStyle="primary-outline"
            className="text-nowrap"
            // onClick={() => navigate(`/professional/mentorship/mentor`); dispatch(getPaymentType("payment-account-details"))}
            onClick={() => {
              navigate(`/professional/mentorship/mentor`);
              dispatch(getPaymentType("payment-account-details"));
            }}
          /> */}
        </div>
      </div>

      <div className="row">
        {/* All Mentor's list */}
        <div className="col-md-4 g-0 cps-10 h-100">
          <div
            className="all-mentor-card-container"
            ref={listRef}
            onScroll={(e) => {
              if (data?.length < total) {
                handleScroll(e);
              }
            }}
          >
            {allMentorsList?.loading && (
              <Card className="cpt-30 cpb-50">
                <Loader size="md" />
              </Card>
            )}
            {!allMentorsList?.loading && allMentorsList?.data?.length === 0 ? (
              <Card className="cpt-30 cpb-50 text-center">
                No Records Found.
              </Card>
            ) : (
              allMentorsList?.data?.length > 0 &&
              allMentorsList?.data?.map((elem, index) => {
                const {
                  id,
                  profile,
                  name,
                  institution,
                  designation,
                  country,
                  skills,
                  user_type,
                } = elem;
                const isReasearchProfile = ["2", "5"].includes(user_type);
                return (
                  <Card
                    key={index}
                    className={`${
                      iD === id && "selected-border"
                    } cps-10 cpt-10 cpe-10 cpb-10 cmb-8 pointer`}
                    onClick={() => {
                      if (!isLoadAPI) {
                        setID(id);
                      }
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 cmb-10 flex-wrap">
                      <Profile
                        url={profile}
                        isRounded
                        isS3UserURL
                        text={name}
                      />
                      <div>
                        <div
                          className={`text-16-500-25 ${
                            isReasearchProfile
                              ? "color-new-car pointer"
                              : "color-3146"
                          }`}
                          onClick={(e) => {
                            if (isReasearchProfile) {
                              e.stopPropagation();
                              dispatch(setRProfileID(id));
                            }
                          }}
                        >
                          {titleCaseString(name)}
                        </div>
                        <div className="text-14-400-26 color-3146">
                          {designation}
                        </div>
                      </div>
                    </div>
                    <div className="text-14-400-26 color-3146 cmb-10">
                      {institution}
                      {institution && ","} {country}
                    </div>
                    <div className="d-flex gap-3 flex-wrap align-items-center">
                      {skills &&
                        skills?.slice(0, 3)?.map((data, i) => {
                          return (
                            <div
                              className="text-14-400 key-points color-dark-blue bg-f6fc text-nowrap cps-5 cpt-6 cpe-5 cpb-6 rounded"
                              key={i}
                            >
                              {data}
                            </div>
                          );
                        })}
                      {skills?.length > 3 && `+${skills?.length - 3}`}
                    </div>
                  </Card>
                );
              })
            )}
            {!allMentorsList?.loading && scrollLoader && (
              <div className="cpt-30 cpb-30">
                <Loader size="sm" />
              </div>
            )}
          </div>
        </div>

        {/* Single Mentor's details */}
        <div className="col-md-8">
          {!allMentorsList?.loading &&
          allMentorsList?.data?.length === 0 &&
          !isLoadAPI ? (
            <Card className="cpt-30 cpb-50 text-center">No Records Found.</Card>
          ) : mentorDetailsData?.loading || isLoadAPI ? (
            <Card className="cpt-30 cpb-50">
              <Loader size="md" />
            </Card>
          ) : (
            <React.Fragment>
              <Card className="cps-10 cpt-20 cpe-10 cpb-20 cmb-8">
                <div className="d-flex justify-content-between flex-wrap cmb-10">
                  <div className="d-flex align-items-center gap-2 cmb-20">
                    <Profile
                      isS3UserURL
                      url={mentorDetailsData?.data?.profile}
                      text={mentorDetailsData?.data?.name}
                      isRounded
                      size="s-100"
                    />
                    <div>
                      <div className="text-18-500 color-3146">
                        {titleCaseString(mentorDetailsData?.data?.name)}
                      </div>
                      <div className="text-15-400-25 color-3146">
                        {mentorDetailsData?.data?.designation}
                      </div>
                      <div className="text-15-400-25 color-3146 cmb-10">
                        {mentorDetailsData?.data?.institution}
                        {mentorDetailsData?.data?.institution && ","}{" "}
                        {mentorDetailsData?.data?.country}
                      </div>
                    </div>
                  </div>
                  <div>
                    <ShareButton
                      className="color-new-car text-16-400 pointer d-flex align-items-center share"
                      url={mentorDetailsData?.data?.name && shareUrl}
                    />
                  </div>
                </div>

                <div className="d-flex gap-3 align-items-center">
                  {isSelfUser ? (
                    ""
                  ) : isAlreadyExist || isExist ? (
                    <Button
                      onClick={() => {}}
                      text={
                        isAlreadyExist
                          ? "Connected"
                          : isExist
                          ? "Request Sent"
                          : "Try To Connect"
                      }
                      btnStyle="primary-light"
                      className="gap-2"
                      btnLoading={isConnectLoader}
                      disabled
                    />
                  ) : (
                    <Button
                      text="Connect"
                      btnStyle="primary-dark"
                      className="gap-2"
                      icon={<img src={icons.connectUser} alt="user" />}
                      onClick={() => handleConnect()}
                      btnLoading={isConnectLoader}
                    />
                  )}
                  <div className="d-flex gap-2">
                    <div>
                      <img src={icons.blackFollowers} alt="followers" />
                    </div>
                    <div className="text-15-500-26 color-3146">
                      {mentorDetailsData?.data?.followers}
                    </div>
                    <div className="text-15-400-26 color-3146">Followers</div>
                  </div>
                </div>
              </Card>
              <div className="d-flex flex-wrap gap-2">
                {mediaData?.map((elem, index) => {
                  const { title, logo, count } = elem;
                  return (
                    <Card
                      className="cps-10 cpt-10 cpe-10 cpb-5 cmb-8 flex-grow-1"
                      key={index}
                    >
                      <div className="d-flex aligns-items-center gap-3">
                        <div>
                          <img src={logo} alt="media" />
                        </div>
                        <div>
                          <div className="text-20-700-23 color-4453">
                            {count}
                          </div>
                          <div className="text-14-400-26 color-3146">
                            {title}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              {aboutMentorText && (
                <Card className="cps-10 cpt-10 cpe-10 cpb-5 cmb-8">
                  <div>
                    <div className="text-15-500-26 color-4453 cmb-5">
                      About Mentor
                    </div>
                    <div className="text-15-400-25 color-5068 text-justify cmb-10">
                      {titleCaseString(aboutMentorText)}
                    </div>
                    {text?.length > 50 && (
                      <div className="d-flex">
                        <div
                          className="d-flex align-items-center gap-2 color-new-car pointer"
                          onClick={() => {
                            if (aboutText === 50) {
                              setAboutText(text?.length);
                            } else {
                              setAboutText(50);
                            }
                          }}
                        >
                          <span className="text-13-400">
                            {aboutText === 50 ? "View more" : "View less"}
                          </span>
                          <span>
                            <img
                              src={
                                aboutText === 50
                                  ? icons.downArrow
                                  : icons.upArrow
                              }
                              alt="down-arrow"
                            />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}
              {mentorDetailsData?.data?.skills?.length > 0 && (
                <Card className="cps-10 cpt-10 cpe-10 cpb-5 cmb-8">
                  <div>
                    <div className="text-15-500-26 color-4453 cmb-10">
                      Skills & Expertise
                    </div>
                    <div className="d-flex gap-3 flex-wrap align-items-center cmb-10">
                      {mentorDetailsData?.data?.skills &&
                        mentorDetailsData?.data?.skills
                          ?.slice(0, reviewShowMore)
                          ?.map((data, i) => {
                            return (
                              <div
                                className="text-14-400 key-points color-dark-blue bg-f6fc text-nowrap cps-5 cpt-6 cpe-5 cpb-6 rounded"
                                key={i}
                              >
                                {data}
                              </div>
                            );
                          })}
                    </div>
                    {mentorDetailsData?.data?.skills?.length > 3 && (
                      <div className="d-flex">
                        <div
                          className="text-12-400 color-text-blue d-flex gap-2 pointer"
                          onClick={() => {
                            if (mentorDetailsData?.data?.skills?.length > 0) {
                              if (reviewShowMore === 3) {
                                setReviewShowMore(
                                  mentorDetailsData?.data?.skills?.length
                                );
                              } else {
                                setReviewShowMore(3);
                              }
                            }
                          }}
                        >
                          {reviewShowMore === 3 ? "View more" : "View less"}
                          <div className="text-12-400 color-text-blue">
                            <img
                              src={
                                reviewShowMore === 3
                                  ? icons.downArrow
                                  : icons.upArrow
                              }
                              alt="arrow"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}
              {mentorDetailsData?.data?.session?.length > 0 && (
                <Card className="cps-10 cpt-10 cpe-10 cpb-5 cmb-8">
                  <div>
                    <div className="text-15-500-26 color-4453 cmb-5">
                      Sessions
                    </div>
                    {mentorDetailsData?.data?.session
                      ?.slice(0, sessionViewCount)
                      ?.map((elem, index) => {
                        const {
                          id,
                          session_name,
                          rating_reveiw,
                          rating_star,
                          amount,
                          meeting_duration,
                          meeting_link,
                        } = elem;

                        /* const exchangeRate = 83.52;
                        const price = convertCurrency(
                          amount,
                          exchangeRate,
                          isNational
                        );
                        console.log("price", price); */

                        const price = INRtoUSD(amount, exchange_rate);
                        const newPrice = parseFloat(price?.toFixed(2));

                        return (
                          <div
                            className="cmb-10 border rounded cps-10 cpt-10 cpe-10"
                            key={index}
                          >
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                              <div className="cmb-10">
                                <div className="cmb-10 text-15-500-26 color-4453">
                                  {titleCaseString(session_name)}
                                </div>
                                <div className="d-flex align-items-center gap-4 cmb-10">
                                  {meeting_link && (
                                    <div
                                      className={`d-flex gap-2 align-items-center`}
                                    >
                                      <img src={icons.videoMeet} alt="meet" />
                                      <div className="text-14-400 color-dark-blue cpt-2">
                                        1:1 Video Meet
                                      </div>
                                    </div>
                                  )}
                                  {meeting_duration && (
                                    <div className="d-flex gap-2 align-items-center">
                                      <img src={icons.clockTime} alt="clock" />
                                      <div className="text-14-400 color-dark-blue">
                                        {meeting_duration}
                                      </div>
                                    </div>
                                  )}

                                  {rating_star && (
                                    <div className="d-flex gap-2 align-items-center">
                                      <img src={icons.star} alt="star" />
                                      <div className="text-14-500 color-dark-blue">
                                        <span>{rating_star}</span> (
                                        <span className="text-14-400 underline">
                                          {`${rating_reveiw} Reviews`}
                                        </span>
                                        )
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="d-flex gap-4 align-items-center">
                                <div className="text-18-500-26 color-5068">
                                  {isNational ? `₹ ${amount}` : `$ ${newPrice}`}
                                  {/* {`₹ ${amount}`} */}
                                </div>
                                <Button
                                  text="Book Now"
                                  btnStyle="primary-dark"
                                  onClick={() => {
                                    navigate(
                                      `/${memberType}/mentorship/mentee/book-session/${id}`
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {mentorDetailsData?.data?.session?.length > 3 && (
                      <div className="d-flex">
                        <div
                          className="d-flex gap-2 color-new-car pointer align-items-center"
                          onClick={() => {
                            if (sessionViewCount === 3) {
                              setSessionViewCount(
                                mentorDetailsData?.data?.session?.length
                              );
                            } else {
                              setSessionViewCount(3);
                            }
                          }}
                        >
                          <span className="text-13-400">
                            {sessionViewCount === 3 ? "View more" : "View less"}
                          </span>
                          <span>
                            <img
                              src={
                                sessionViewCount === 3
                                  ? icons.downArrow
                                  : icons.upArrow
                              }
                              alt="down-arrow"
                            />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}
              {mentorDetailsData?.data?.disciplines?.length > 0 && (
                <Card className="cps-10 cpt-10 cpe-10 cpb-5 cmb-8">
                  <div>
                    <div className="text-15-500-26 color-4453 cmb-5">
                      Disciplines
                    </div>
                    <div className="d-flex gap-3 flex-wrap align-items-center cmb-10">
                      {mentorDetailsData?.data?.disciplines?.map((data, i) => {
                        return (
                          <div
                            className="text-14-400 key-points color-dark-blue bg-f6fc text-nowrap cps-5 cpt-6 cpe-5 cpb-6 rounded"
                            key={i}
                          >
                            {data}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              )}
              {mentorDetailsData?.data?.languages?.length > 0 && (
                <Card className="cps-10 cpt-10 cpe-10 cpb-5 cmb-8">
                  <div>
                    <div className="text-15-500-26 color-4453 cmb-5">
                      Languages
                    </div>
                    <div className="d-flex gap-3 flex-wrap align-items-center cmb-10">
                      {mentorDetailsData?.data?.languages?.map((data, i) => {
                        return (
                          <div
                            className="text-14-400 key-points color-dark-blue bg-f6fc text-nowrap cps-5 cpt-6 cpe-5 cpb-6 rounded"
                            key={i}
                          >
                            {data}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllMentors;
