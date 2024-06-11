import React, { useEffect, useState } from "react";
import { objectToFormData, titleCaseString } from "utils/helpers";
import { icons } from "utils/constants";
import Button from "components/form/Button";
import { useDispatch } from "react-redux";
import { getAllMySessions } from "store/slices";
import { omit } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "components/Layout/Loader";
import "./Sessions.scss";

const Sessions = ({
  setConnectModel,
  isLoginUser,
  loginUser,
  loginUserType,
}) => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [sessionsList, setSessionsList] = useState({
    mentor_id: params?.id,
    session_name: "",
    data: [],
    total: 0,
    limit: 5,
    offset: 0,
  });

  const fetchCardData = async (data) => {
    setIsLoading(true);
    const payload = omit(data, ["data", "total"]);
    const response = await dispatch(
      getAllMySessions(objectToFormData(payload))
    );
    if (response?.status === 200) {
      setSessionsList((prev) => {
        return {
          ...prev,
          data: response?.data?.result_data || [],
          total: response?.data?.result_count,
        };
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCardData(sessionsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="session-container">
      {isLoading ? (
        <div className="cpt-100 cpb-100">
          <Loader size="md" />
        </div>
      ) : sessionsList?.data?.length === 0 ? (
        <div className="cpt-100 cpb-100 center-flex">No Records Found.</div>
      ) : (
        <>
          <div className="text-18-500 color-5068 cmb-10">
            Sessions {`(${sessionsList?.total})`}
          </div>
          {sessionsList?.data?.map((elem, index) => {
            const {
              id,
              session_name,
              amount,
              meeting_link,
              meeting_duration,
              rating_reveiw,
              rating,
            } = elem;
            return (
              <div
                className="cmb-20 border rounded cps-10 cpt-10 cpe-10 cpb-10"
                key={index}
              >
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className="cmb-10">
                    <div className="cmb-10 text-15-500-26 color-4453 text-wrap">
                      {titleCaseString(session_name)}
                    </div>
                    <div className="d-flex align-items-center gap-4 cmb-10 flex-wrap">
                      {meeting_link && (
                        <div
                          className={`${
                            meeting_link && "pointer"
                          } d-flex gap-2 align-items-center}`}
                        >
                          <img src={icons.fillMeetIcon} alt="meet" />
                          <div className="text-14-400 color-dark-blue cpt-2">
                            1:1 Video Meet
                          </div>
                        </div>
                      )}
                      {meeting_duration && (
                        <div className="d-flex gap-2 align-items-center">
                          <img src={icons.fillClockIcon} alt="clock" />
                          <div className="text-14-400 color-dark-blue">
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
                  </div>
                  <div className="d-flex gap-4 align-items-center flex-wrap">
                    <div className="text-18-500-26 color-5068">
                      {amount && `₹ ${amount}`}
                    </div>
                    {(isLoginUser
                      ? +params?.id !== loginUser?.id
                      : !isLoginUser) && (
                      <>
                        <Button
                          text="Book Now"
                          btnStyle="primary-dark"
                          onClick={() => {
                            if (!isLoginUser) {
                              setConnectModel(true);
                              return;
                            }

                            navigate(
                              `/${loginUserType}/mentorship/mentee/book-session/${id}`
                            );
                          }}
                        />
                        <Button
                          text="View More"
                          btnStyle="orange-outline"
                          onClick={() => {
                            if (!isLoginUser) {
                              setConnectModel(true);
                              return;
                            }
                            navigate(
                              `/${loginUserType}/mentorship/mentee/book-session/${id}`
                            );
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {sessionsList?.data?.length > 5 && (
            <span
              className="text-15-500 color-105d bg-cd1f br-6 p-2 pointer"
              onClick={() => {
                if (!isLoginUser) {
                  setConnectModel(true);
                  return;
                }
                navigate(`/${loginUserType}/mentorship/mentee/all-mentors`);
              }}
            >
              View All Sessions
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default Sessions;
