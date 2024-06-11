import React, { useEffect, useState } from "react";
import Button from "components/form/Button";
import { icons } from "utils/constants";
import {
  getDataFromLocalStorage,
  objectToQueryParams,
  titleCaseString,
} from "utils/helpers";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRecommendedSession } from "store/slices";
import Loader from "components/Layout/Loader";
import "./RecommendedSessions.scss";

const RecommendedSessions = ({
  setConnectModel,
  isLoginUser,
  loginUserType,
  loginUser,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const data = getDataFromLocalStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState([]);

  const getSessionData = async () => {
    setIsLoading(true);
    const queryParams = objectToQueryParams({ id: params?.id });
    const response = await dispatch(fetchRecommendedSession(queryParams));
    if (response?.status === 200) {
      setCardData(response?.data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getSessionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="recommended-sessions-container">
      <div className="cps-20 cpe-20 cpt-20 cpb-20">
        <div className="text-18-600 color-4b4b cmb-10">
          {data?.mentor_status === "Accept" && data?.spekaer_id
            ? "Top Trending Sessions"
            : "Top Recommended Sessions"}
        </div>

        {isLoading ? (
          <div className="cmt-50 cmb-50">
            <Loader size="md" />
          </div>
        ) : cardData?.length === 0 ? (
          <div className="cpt-50 cpb-50">No Records Found.</div>
        ) : (
          cardData?.slice(0, 3)?.map((elem, index) => {
            const {
              id,
              session_name,
              meeting_link,
              meeting_duration,
              duration_unit,
            } = elem;
            return (
              <React.Fragment key={index}>
                <div className="cmb-5 cps-10 cpt-10 cpe-10">
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
                              {`${meeting_duration} ${duration_unit}`}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d-flex gap-4 align-items-center flex-wrap">
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
                {cardData?.slice(0, 3)?.length - 1 !== index && (
                  <div className="card-border-bottom"></div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
      {cardData?.length > 3 && (
        <div
          className="text-14-500 color-374e bg-f0f2 p-2 br-bs-be text-center pointer"
          onClick={() => {
            if (!isLoginUser) {
              setConnectModel(true);
              return;
            }
            navigate(`/${loginUserType}/mentorship/mentee/all-mentors`);
          }}
        >
          View All Sessions
        </div>
      )}
    </div>
  );
};

export default RecommendedSessions;
