import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import FilterDropdown from "components/Layout/FilterDropdown";
import Loader from "components/Layout/Loader";
import SaveDate from "components/Layout/SaveDate";
import { fetchQuartelyDetails } from "store/slices";
import { icons } from "utils/constants";
import {
  getDataFromLocalStorage,
  getEventDateData,
  objectToFormData,
} from "utils/helpers";
import "./IFERPActivityPlan.scss";
import { forEach } from "lodash";

const ActivityPlan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { memberType, moduleType, planType, planId } = params;
  const { eventTypeList } = useSelector((state) => ({
    eventTypeList: state.global.eventTypeList,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [oldData, setOldData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [pageTitle, setPageTitle] = useState("");
  const handelFilter = (types) => {
    let newList = [];
    if (types) {
      forEach(oldData, (elm) => {
        if (types.split(",").includes(`${elm.event_type_id}`)) {
          newList.push(elm);
        }
      });
    } else {
      newList = oldData;
    }
    setPageData(newList);
  };
  const getQatrlyEvents = async () => {
    const formData = objectToFormData({
      quarter: planId.charAt(planId.length - 1),
      iferp_or_my_plan: planType === "iferp-plan" ? "IFERP" : "MY",
    });
    const response = await dispatch(fetchQuartelyDetails(formData));

    setPageTitle(response?.data?.title || "Quater Plan");
    setPageData(response?.data?.events || []);
    setOldData(response?.data?.events || []);
    setIsLoading(false);
  };
  useEffect(() => {
    getQatrlyEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userType = getDataFromLocalStorage("user_type");
  const access = {
    isEdit:
      userType === "0" ||
      (userType === "3" && planType === "institutional-plan"),
    isRegister: !["0", "3", "6"].includes(userType),
    isViewMore: userType !== "0" ? true : false,
    isSaveEvent: userType !== "0" ? true : false,
    isAddEvent: userType === "3" && planType === "institutional-plan",
    isCollaboration: ["3"].includes(userType) && planType === "iferp-plan",
  };
  return (
    <div id="activity-plan-container">
      {isLoading ? (
        <Card className="cps-24 cpe-24 cpt-12 cpb-20">
          <div className="d-flex align-items-center justify-content-center cpt-50 cpb-50">
            <Loader size="md" />
          </div>
        </Card>
      ) : (
        <Card className="cps-24 cpe-24 cpt-12 cpb-20 fadeInUp">
          <div className="cpt-12 cpb-12 cmb-12">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span
                  className="d-flex"
                  onClick={() => {
                    const newType =
                      memberType === "admin" ? "activity-plan" : planType;
                    navigate(`/${memberType}/${moduleType}/${newType}`);
                  }}
                >
                  <img
                    src={icons.leftArrow}
                    alt="back"
                    className="h-21 me-3 pointer"
                  />
                </span>
                <span className="text-18-500 color-black-olive">
                  {pageTitle}
                </span>
              </div>
              <div className="d-flex gap-3">
                {access.isAddEvent && (
                  <Button
                    onClick={() => {
                      navigate(
                        "/institutional/activity-plan/institutional-plan/add-event"
                      );
                    }}
                    text="+ Add Event"
                    btnStyle="primary-outline"
                    className="h-35 text-14-500 text-nowrap"
                    isSquare
                  />
                )}
                <FilterDropdown
                  isHideAll
                  list={eventTypeList}
                  handelChangeFilter={handelFilter}
                />
              </div>
            </div>
          </div>

          <div>
            {pageData.length === 0 ? (
              <div className="d-flex justify-content-center text-14-400 cpb-30 cmt-30">
                No Data Found
              </div>
            ) : (
              pageData.map((elem, index) => {
                const formatedDate = getEventDateData(
                  elem?.start_date,
                  elem?.end_date
                );
                return (
                  <div className="industry-card-block row cmb-20" key={index}>
                    <div className="col-md-2 date-time-block">
                      <div className="d-inline-block text-truncate text-center">
                        {formatedDate?.display}
                      </div>
                      <div className="mt-3">{formatedDate?.year}</div>
                    </div>
                    <div className="col-md-10 right-block">
                      <div className="text-18-500 color-raisin-black lh-28">
                        {elem.event_name}
                        {access.isViewMore && (
                          <u
                            className="ms-2 color-new-car text-14-400 pointer"
                            onClick={() => {
                              localStorage.prevRoute = window.location.pathname;
                              navigate(
                                `/${memberType}/${moduleType}/event-details/${elem.id}/conference-details`
                              );
                            }}
                          >
                            View More
                          </u>
                        )}
                      </div>
                      <div className="location-button-block flex-wrap gap-2">
                        <div className="d-flex gap-5">
                          <span className="text-15-500 color-davys-gray text-nowrap">
                            <i className="bi bi-geo-alt me-2" />
                            {`${elem?.city_name ? `${elem.city_name},` : ""} ${
                              elem.country_name
                            }`}
                          </span>

                          {access.isSaveEvent && <SaveDate eventID={elem.id} />}
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          {access.isRegister ? (
                            <Button
                              onClick={() => {
                                localStorage.isRedirectToRegister = 1;
                                localStorage.prevRoute =
                                  window.location.pathname;
                                navigate(
                                  `/${memberType}/${moduleType}/event-details/${elem.id}/conference-details`
                                );
                              }}
                              text={
                                elem?.is_registered ? "Registered" : "Register"
                              }
                              btnStyle="primary-dark"
                              className={`text-14-500 ${
                                elem?.is_registered
                                  ? "cps-24 cpe-24"
                                  : "cps-32 cpe-32"
                              }`}
                              disabled={elem?.is_registered}
                              isRounded
                            />
                          ) : (
                            <Button
                              onClick={() => {
                                localStorage.prevRoute =
                                  window.location.pathname;
                                navigate(
                                  `/${memberType}/${moduleType}/event-details/${elem.id}/conference-details`
                                );
                              }}
                              text="View Details"
                              btnStyle="primary-dark"
                              className="text-14-500 ps-3 pe-3 text-nowrap"
                              isRounded
                            />
                          )}
                          {access.isEdit && (
                            <Button
                              isSquare
                              btnStyle="primary-gray"
                              icon={
                                <img
                                  src={icons.edit}
                                  alt="edit"
                                  className="me-3"
                                />
                              }
                              className="text-14-500 cps-30 cpe-30"
                              text="Edit"
                              onClick={() => {
                                if (planType === "iferp-plan") {
                                  localStorage.prevRoute =
                                    window.location.pathname;
                                  navigate(
                                    `/${memberType}/${moduleType}/events/${elem.id}`
                                  );
                                } else {
                                  navigate(
                                    `/institutional/activity-plan/institutional-plan/edit-event/${elem.id}`
                                  );
                                }
                              }}
                              isRounded
                            />
                          )}
                          {access.isCollaboration && (
                            <Button
                              onClick={() => {
                                navigate(
                                  `/${memberType}/help/collaboration/${elem.event_type_id}/${elem.id}`
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
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
export default ActivityPlan;
