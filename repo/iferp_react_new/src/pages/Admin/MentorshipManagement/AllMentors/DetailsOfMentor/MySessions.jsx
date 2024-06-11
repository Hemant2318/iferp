import React, { useEffect, useRef, useState } from "react";
import { icons } from "utils/constants";
import { useParams } from "react-router-dom";
import { omit } from "lodash";
import { useDispatch } from "react-redux";
import { getAllMySessions, setMentorSessionID, throwError } from "store/slices";
import { objectToFormData, titleCaseString } from "utils/helpers";
import SeachInput from "components/form/SeachInput";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import "./MySessions.scss";
const MySessions = ({ setFormType }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const customScrolLRef = useRef();
  const offSetRef = useRef(0);
  const totalDocRef = useRef(0);
  const offsetRef = useRef(0);
  const [searchText, setSearchText] = useState("");
  const [timer, setTimer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrollLoader, setScrollLoader] = useState(false);

  const [mySessionList, setMySessionList] = useState({
    mentor_id: params?.mId,
    session_name: "",
    data: [],
    loading: true,
    total: 0,
    offset: 0,
    limit: 10,
  });
  const fetchMySessionList = async (data, isReset) => {
    setScrollLoader(true);
    setIsLoading(true);
    let payload = {};
    payload = omit({ ...data, offset: isReset ? 0 : offSetRef.current }, [
      "data",
      "loading",
      "total",
    ]);
    const response = await dispatch(
      getAllMySessions(objectToFormData(payload))
    );
    if (response?.status === 200) {
      offsetRef.current = offsetRef.current + mySessionList.limit;
      totalDocRef.current = response?.data?.result_count;
      setMySessionList((prev) => {
        let resData = response?.data?.result_data || [];
        let listData = isReset ? resData : [...prev.data, ...resData];
        return {
          ...prev,
          // data: [...prev.data, ...response?.data?.result_data] || [],
          data: listData,
          total: response?.data?.result_count || 0,
          offset: prev.offset + prev.limit,
          loading: false,
        };
      });
      offSetRef.current = isReset
        ? 0
        : offSetRef?.current + mySessionList?.limit;
    } else {
      dispatch(throwError(response?.message));
    }
    setIsLoading(false);
    setScrollLoader(false);
  };

  const handleSearch = (e) => {
    let value = e?.target?.value;
    setSearchText(value);
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      let oldData = { ...mySessionList, session_name: value, loading: true };
      setMySessionList(oldData);
      fetchMySessionList(oldData, true);
      offsetRef.current = 0;
      totalDocRef.current = 0;
    }, 800);
    setTimer(time);
  };

  const handleRedirect = (link) => {
    window.open(link, "_blank");
  };

  useEffect(() => {
    fetchMySessionList(mySessionList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const customScrolL = document.querySelector(".my-sessions-card-container");
  const handleScroll = () => {
    const scrollTop = customScrolLRef?.current.scrollTop;
    const clientHeight = customScrolLRef?.current.clientHeight;
    const scrollHeight = customScrolLRef?.current.scrollHeight;

    if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
      // console.log("mySessionList.total", mySessionList.total);
      // let minOffset = offSetRef.current >= 10 ? offSetRef.current : 10;

      if (offSetRef?.current <= totalDocRef.current) {
        fetchMySessionList(mySessionList);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const customScrolL = customScrolLRef?.current;
    if (customScrolL) {
      customScrolL.addEventListener("scroll", handleScroll);
      return () => {
        customScrolL.removeEventListener("scroll", handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customScrolLRef?.current]);

  return (
    <>
      <div id="all-my-sessions-container">
        <div className="d-flex justify-content-between align-items-center cmb-10">
          <div className="text-16-500 color-text-navy">
            My Sessions ({mySessionList?.total})
          </div>
          <div>
            <SeachInput
              placeholder="Search session"
              value={searchText}
              onChange={handleSearch}
              isRounded
            />
          </div>
        </div>

        <div
          className="row g-0 my-sessions-card-container"
          ref={customScrolLRef}
        >
          {isLoading && (
            <Card className="cpt-50 cpb-50 cmb-20 ">
              <Loader size="sm" />
            </Card>
          )}
          {!isLoading && mySessionList?.data?.length === 0 ? (
            <Card className="cpt-50 cpb-50 text-center">No Records Found.</Card>
          ) : (
            mySessionList?.data?.map((elem, index) => {
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
              return (
                <div className="col-md-6 cmb-10" key={index}>
                  <div className="session-card cme-5 h-100">
                    <div className="p-2">
                      <div
                        className="cmb-10 session-title-hover"
                        onClick={() => {
                          dispatch(setMentorSessionID(id));
                          setFormType("sessionDetail");
                        }}
                      >
                        {`${titleCaseString(session_name)} - ₹ ${amount}`}
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
                              dispatch(setMentorSessionID(id));
                              setFormType("sessionDetail");
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
                  </div>
                </div>
              );
            })
          )}
          {!isLoading && scrollLoader && (
            <div className="cpt-30 cpb-30">
              <Loader size="sm" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MySessions;
