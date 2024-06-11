import React, { useEffect, useState } from "react";
import "./MentorProfileDetail.scss";
import { useDispatch } from "react-redux";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import { getUserType, objectToFormData, titleCaseString } from "utils/helpers";
import Button from "components/form/Button";
import { getMentorDetails } from "store/slices";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";

const MentorProfileDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const memberType = getUserType();
  const [aboutText, setAboutText] = useState(50);
  const [reviewShowMore, setReviewShowMore] = useState(3);
  const [sessionViewCount, setSessionViewCount] = useState(3);
  const [mentorDetail, setMentorDetail] = useState({
    data: {},
    loading: false,
  });

  const fetchData = async () => {
    const response = await dispatch(
      getMentorDetails(objectToFormData({ mentor_id: params?.id }))
    );
    if (response?.status === 200) {
      setMentorDetail((prev) => {
        return {
          ...prev,
          data: response?.data || {},
          loading: false,
        };
      });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mediaData = [
    {
      id: 1,
      title: "Presentations",
      logo: icons.mediaVideo,
      count: mentorDetail?.data?.presentation || 0,
    },
    {
      id: 2,
      title: "All Posts",
      logo: icons.mediaGallery,
      count: mentorDetail?.data?.post || 0,
    },
    {
      id: 3,
      title: "Likes",
      logo: icons.pinkThumb,
      count: mentorDetail?.data?.like || 0,
    },
    {
      id: 4,
      title: "Views",
      logo: icons.blueEye,
      count: mentorDetail?.data?.views || 0,
    },
  ];

  const text =
    mentorDetail?.data?.about_introduction &&
    mentorDetail?.data?.about_introduction;

  const aboutMentorText = text?.slice(0, aboutText);
  if (mentorDetail?.data) {
  }
  const handleRedirect = (link) => {
    window.open(link, "_blank");
  };

  return (
    <div id="mentor-profile-detail-container">
      <div className="row">
        <div className="col-md-12">
          {mentorDetail?.loading ? (
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
                      url={mentorDetail?.data?.profile}
                      text={mentorDetail?.data?.name}
                      isRounded
                      size="s-100"
                    />
                    <div>
                      <div className="text-18-500 color-3146">
                        {titleCaseString(mentorDetail?.data?.name)}
                      </div>
                      <div className="text-15-400-25 color-3146">
                        {mentorDetail?.data?.designation}
                      </div>
                      <div className="text-15-400-25 color-3146 cmb-10">
                        {mentorDetail?.data?.institution}
                        {mentorDetail?.data?.institution && ","}{" "}
                        {mentorDetail?.data?.country}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3 align-items-center">
                  <Button
                    text="Connect"
                    btnStyle="primary-dark"
                    className="gap-2"
                    icon={<img src={icons.connectUser} alt="user" />}
                    onClick={() => {
                      navigate(
                        `/${memberType}/mentorship/mentor/profile/${mentorDetail?.data?.name}`
                      );
                    }}
                  />
                  <div className="d-flex gap-2">
                    <div>
                      <img src={icons.blackFollowers} alt="followers" />
                    </div>
                    <div className="text-15-500-26 color-3146">
                      {mentorDetail?.data?.followers}
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
              <Card className="cps-10 cpt-10 cpe-10 cpb-5 cmb-8">
                <div>
                  <div className="text-15-500-26 color-4453 cmb-5">
                    About Mentor
                  </div>
                  <div className="text-15-400-25 color-5068 text-justify cmb-10">
                    {aboutMentorText}
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
                              aboutText === 50 ? icons.downArrow : icons.upArrow
                            }
                            alt="down-arrow"
                          />
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              <Card className="cps-10 cpt-10 cpe-10 cpb-5 cmb-8">
                <div>
                  <div className="text-15-500-26 color-4453 cmb-10">
                    Skills & Expertise
                  </div>
                  <div className="d-flex gap-3 flex-wrap align-items-center cmb-10">
                    {mentorDetail?.data?.skills &&
                      mentorDetail?.data?.skills
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
                  {mentorDetail?.data?.skills?.length > 3 && (
                    <div className="d-flex">
                      <div
                        className="text-12-400 color-text-blue d-flex gap-2 pointer"
                        onClick={() => {
                          if (mentorDetail?.data?.skills?.length > 0) {
                            if (reviewShowMore === 3) {
                              setReviewShowMore(
                                mentorDetail?.data?.skills?.length
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
              Collapse
              <Card className="cps-10 cpt-10 cpe-10 cpb-5 cmb-8">
                <div>
                  <div className="text-15-500-26 color-4453 cmb-5">
                    Sessions
                  </div>

                  {mentorDetail?.data?.session &&
                    mentorDetail?.data?.session
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
                                      className={`${
                                        meeting_link && "pointer"
                                      } d-flex gap-2 align-items-center}`}
                                      onClick={() => {
                                        handleRedirect(meeting_link);
                                      }}
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
                                  {amount && `₹ ${amount}`}
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
                  {mentorDetail?.data?.session?.length > 3 && (
                    <div className="d-flex">
                      <div
                        className="d-flex gap-2 color-new-car pointer align-items-center"
                        onClick={() => {
                          if (sessionViewCount === 3) {
                            setSessionViewCount(
                              mentorDetail?.data?.session?.length
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
              <Card className="cps-10 cpt-10 cpe-10 cpb-5 cmb-8">
                <div>
                  <div className="text-15-500-26 color-4453 cmb-5">
                    Disciplines
                  </div>
                  <div className="d-flex gap-3 flex-wrap align-items-center cmb-10">
                    {mentorDetail?.data?.disciplines &&
                      mentorDetail?.data?.disciplines?.map((data, i) => {
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
              <Card className="cps-10 cpt-10 cpe-10 cpb-5 cmb-8">
                <div>
                  <div className="text-15-500-26 color-4453 cmb-5">
                    Languages
                  </div>
                  <div className="d-flex gap-3 flex-wrap align-items-center cmb-10">
                    {mentorDetail?.data?.languages &&
                      mentorDetail?.data?.languages?.map((data, i) => {
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
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorProfileDetail;
