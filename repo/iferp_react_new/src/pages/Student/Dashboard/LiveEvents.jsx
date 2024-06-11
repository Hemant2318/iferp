import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import { fetchLiveEvents, fetchUserUpComingEvent } from "store/slices";
import { BrochurePath, icons } from "utils/constants";
import { combineArrayS3, getEventDate, getUserType } from "utils/helpers";

const LiveEvents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState([]);
  const [upComingData, setUpComingData] = useState([]);
  const getEvents = async () => {
    const response = await dispatch(fetchLiveEvents());
    const resData = response?.data?.event_details || [];
    const newResponse = await combineArrayS3(
      resData,
      "brochure_path",
      BrochurePath
    );
    setPageData(newResponse);
    setIsLoading(false);
  };
  const getUpcomingEvent = async () => {
    const response = await dispatch(fetchUserUpComingEvent());
    const responseData = response?.data?.event_details;
    const newResponseData = await combineArrayS3(
      responseData,
      "brochure_path",
      BrochurePath
    );
    setUpComingData(newResponseData);
    setIsLoading(false);
  };
  useEffect(() => {
    getEvents();
    getUpcomingEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="unset-br cpe-26 cps-26 pt-4 cpb-30">
      <div className="d-flex align-items-center">
        <span
          className="d-flex"
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <div className="text-20-500 title-text">
          {pageData?.length === 0
            ? "Upcoming Event "
            : `Live Event - ${moment().format("DD MMM YYYY")}`}
        </div>
      </div>
      {isLoading ? (
        <div className="d-flex align-items-center justify-content-center cpt-50 cpb-50">
          <Loader size="md" />
        </div>
      ) : pageData?.length === 0 ? (
        <div className="event-list mt-3 pt-3 fadeInUp">
          {upComingData?.map((elem, index) => {
            const {
              id,
              brochure_path,
              event_name,
              event_start_date,
              event_end_date,
              city_name,
              country_name,
              s3File,
            } = elem;
            const imageType = brochure_path
              ? brochure_path?.split(".")?.pop()
              : "";
            let pathUrl = s3File;
            if (["pdf", "doc", "csv", "html"].includes(imageType)) {
              if (
                (imageType === "doc" || imageType === "csv") &&
                brochure_path
              ) {
                pathUrl = `https://docs.google.com/gview?url=${s3File}&embedded=true`;
              }
            }
            return (
              <div
                className="event-list-block border ps-4 pt-4 pb-4 pe-4 mb-3 row"
                key={index}
              >
                <div className="col-md-4">
                  {["pdf", "doc", "csv", "html"].includes(imageType) ? (
                    <div>
                      <iframe
                        className="w-100"
                        src={pathUrl}
                        title="description"
                        style={{
                          width: "100%",
                          height: "150px",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="mb-3 img-block">
                      <img
                        src={pathUrl}
                        className="fill fit-image"
                        alt="brochure"
                        style={{
                          maxHeight: "150px",
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="col-md-8">
                  <div
                    className="ps-3 text-18-500 color-raisin-black hover-effect"
                    onClick={() => {
                      const userType = getUserType();
                      localStorage.prevRoute = window.location.pathname;
                      navigate(
                        `/${userType}/conferences-and-events/event-details/${id}/conference-details`
                      );
                    }}
                  >
                    {event_name}
                  </div>
                  <div className="ps-3 text-15-500 color-black-olive mt-3 mb-3">
                    <i className="bi bi-calendar4-week me-2 color-subtitle-navy" />
                    {getEventDate(event_start_date, event_end_date)}
                  </div>
                  <div className="ps-3 text-15-500 color-black-olive">
                    <i className="bi bi-geo-alt me-2" />
                    {`${city_name ? `${city_name},` : ""} ${country_name}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="event-list mt-3 pt-3 fadeInUp">
          {pageData?.map((elem, index) => {
            const {
              brochure_path,
              event_name,
              event_start_date,
              event_end_date,
              city_name,
              country_name,
              event_mode,
              virtual_platform_link,
              s3File,
            } = elem;
            const imageType = brochure_path
              ? brochure_path?.split(".")?.pop()
              : "";
            let pathUrl = s3File;
            if (["pdf", "doc", "csv", "html"].includes(imageType)) {
              if (
                (imageType === "doc" || imageType === "csv") &&
                brochure_path
              ) {
                pathUrl = `https://docs.google.com/gview?url=${s3File}&embedded=true`;
              }
            }
            return (
              <div
                className="event-list-block border ps-4 pt-4 pb-4 pe-4 mb-3 row"
                key={index}
              >
                <div className="col-md-4">
                  {["pdf", "doc", "csv", "html"].includes(imageType) ? (
                    <div>
                      <iframe
                        className="w-100"
                        src={pathUrl}
                        title="description"
                        style={{
                          width: "100%",
                          height: "150px",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="mb-3 img-block">
                      <img
                        src={pathUrl}
                        className="fill fit-image"
                        alt="brochure"
                        style={{
                          maxHeight: "150px",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="col-md-8">
                  <div className="ps-3 text-18-500 color-raisin-black hover-effect">
                    {event_name}
                  </div>
                  <div className="ps-3 text-15-500 color-black-olive mt-3 mb-3">
                    <i className="bi bi-calendar4-week me-2 color-subtitle-navy" />
                    {getEventDate(event_start_date, event_end_date)}
                  </div>
                  <div className="ps-3 text-15-500 color-black-olive">
                    <i className="bi bi-geo-alt me-2" />
                    {`${city_name ? `${city_name},` : ""} ${country_name}`}
                  </div>
                  {["Hybrid", "Virtual"].includes(event_mode) && (
                    <div className="ps-3 d-flex mt-4">
                      <Button
                        isRounded
                        icon={
                          <div className="live-event-block me-2">
                            <div className="live-event-dot" />
                          </div>
                        }
                        text="View Live"
                        btnStyle="primary-outline"
                        className="cps-30 cpe-30"
                        onClick={() => {
                          if (virtual_platform_link) {
                            window.open(virtual_platform_link, "_blank");
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
export default LiveEvents;
