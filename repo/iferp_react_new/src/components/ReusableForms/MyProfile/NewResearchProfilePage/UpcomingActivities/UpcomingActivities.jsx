import React, { useEffect, useState } from "react";
import { icons, BrochurePath } from "utils/constants";
import Button from "components/form/Button";
import { titleCaseString, combineArrayS3 } from "utils/helpers";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserUpComingEvent } from "store/slices";
import Loader from "components/Layout/Loader";
import moment from "moment";
import "./UpcomingActivities.scss";

const UpcomingActivities = ({
  setConnectModel,
  isLoginUser,
  loginUserType,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [activitiesData, setActivitiesData] = useState([]);

  const getData = async () => {
    setIsLoading(true);
    const response = await dispatch(fetchUserUpComingEvent());

    const responseData = response?.data?.event_details;
    const newResponseData = await combineArrayS3(
      responseData,
      "brochure_path",
      BrochurePath
    );
    if (response?.status === 200) {
      setActivitiesData(newResponseData || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="upcoming-activities-container">
      <div className="cps-20 cpe-20 cpt-20 cpb-20">
        <div className="text-18-600 color-4b4b cmb-20">Upcoming Activities</div>
        {isLoading ? (
          <div className="cmt-50 cmb-50">
            <Loader size="md" />
          </div>
        ) : activitiesData?.length === 0 ? (
          <div className="cpt-300 cpb-300 text-center">No Records Found.</div>
        ) : (
          activitiesData?.slice(0, 3)?.map((elem, index) => {
            const {
              id,
              event_name,
              event_type,
              event_start_date,
              event_end_date,
              country_name,
              city_name,
            } = elem;
            /* const newEventType = event_type?.toLowerCase(); */
            return (
              <React.Fragment key={index}>
                <div
                  className={`${
                    activitiesData?.length - 1 !== index && "cpb-15"
                  } row g-0`}
                >
                  <div className="col-md-3 col-sm-5 cmb-20 bg-2796 br-4 p-2 text-center">
                    <div className="date-border-bottom color-white text-18-600 cpb-5">
                      {moment(event_start_date).format("DD")}{" "}
                      <span className="color-white text-14-400">&</span>{" "}
                      {moment(event_end_date).format("DD")}
                    </div>
                    <span className="color-white text-12-400">
                      {" "}
                      {moment(event_start_date).format("MMM YYYY")}
                    </span>
                  </div>
                  <div className="col-md-9 col-sm-7 cps-15 cmb-20">
                    <div className="color-374e text-14-400">
                      {titleCaseString(event_name)}
                    </div>
                  </div>
                  <div className="col-md-3 cmb-20">
                    <div
                      className={`${
                        event_type === "Webinar"
                          ? "bg-224f color-4c00"
                          : "bg-e4ff color-4a50"
                      } p-1 br-2 text-13-400 text-center`}
                    >
                      {titleCaseString(event_type)}
                    </div>
                  </div>
                  <div className="col-md-9 cps-15">
                    <div className="d-flex gap-2 align-items-center color-374e text-14-500 p-1">
                      <img src={icons.locationIcon} alt="location" />
                      {`${city_name ? `${city_name}, ` : ""}${
                        country_name || ""
                      }`}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex">
                      <Button
                        text="Register"
                        btnStyle="dark-primary-outline"
                        className="text-14-400 br-4"
                        onClick={() => {
                          if (!isLoginUser) {
                            setConnectModel(true);
                            return;
                          }
                          navigate(
                            `/${loginUserType}/conferences-and-events/event-details/${id}/conference-details`
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-8 cps-15">
                    <div className="d-flex">
                      <span
                        className="color-4c00 text-13-400 view-more-decoration p-2 pointer"
                        onClick={() => {
                          if (!isLoginUser) {
                            setConnectModel(true);
                            localStorage.setItem(
                              "IsGlobalProfileRoute",
                              `/conferences-and-events/event-details/${id}/conference-details`
                            );

                            return;
                          }
                          navigate(
                            `/${loginUserType}/conferences-and-events/event-details/${id}/conference-details`
                          );
                        }}
                      >
                        View more
                      </span>
                    </div>
                  </div>
                </div>
                {activitiesData?.slice(0, 3)?.length - 1 !== index && (
                  <div className="card-border-bottom cmb-20"></div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
      {activitiesData?.length > 3 && (
        <div
          className="text-14-500 color-374e bg-f0f2 p-2 br-bs-be text-center pointer"
          onClick={() => {
            if (!isLoginUser) {
              setConnectModel(true);
              return;
            }
            navigate(
              `/${loginUserType}/conferences-and-events/iferp-events/event-list/conference`
            );
          }}
        >
          View All Conferences
        </div>
      )}
    </div>
  );
};

export default UpcomingActivities;
