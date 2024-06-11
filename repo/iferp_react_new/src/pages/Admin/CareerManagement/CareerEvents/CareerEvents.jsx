import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { cloneDeep, forEach, unionBy } from "lodash";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Dropdown from "components/form/Dropdown";
import DeletePopup from "components/Layout/DeletePopup";
import SuccessPopup from "components/Layout/SuccessPopup";
import { icons } from "utils/constants";
import {
  getDataFromLocalStorage,
  getUserType,
  objectToFormData,
} from "utils/helpers";
import {
  careerApply,
  deleteCareerEvents,
  fetchAllCareerEvents,
  setIsPremiumPopup,
} from "store/slices";
import CareerEventsForm from "./CareerEventsForm";
import "../CareerManagement.scss";

const CareerEvents = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [eventList, setEventList] = useState({
    type: 1,
    title: "",
    list: [],
  });
  const [city, setCity] = useState("");
  const [cityList, setCityList] = useState("");
  const [eventLoading, setEventLoading] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [careerEventId, setCareerEventId] = useState(null);
  const [isForm, setIsForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [payload, setPayload] = useState({
    career_id: params.careerId,
    city: "",
  });
  const getCareerEvents = async (payloadData, isInit) => {
    let forData = objectToFormData(payloadData);
    const response = await dispatch(fetchAllCareerEvents(forData));
    let resList = [];
    let resType = 0;
    let resTitle = 0;
    if (response?.data) {
      resTitle = response?.data?.career_category;
      resType = response?.data?.type;
      resList = response?.data?.career_event;
    }
    if (isInit) {
      let cityList = [];
      forEach(cloneDeep(resList), (el) => {
        cityList.push({ id: el.city, label: el.city_name });
      });
      setCityList(unionBy(cityList, "id"));
    }
    setEventList({ title: resTitle, type: resType, list: resList });
    setIsLoading(false);
  };
  const handelSaveCareer = async (eventId) => {
    if (getDataFromLocalStorage("membership_plan_id") === 11) {
      dispatch(setIsPremiumPopup(true));
      return;
    }
    setEventLoading(eventId);
    let forData = objectToFormData({
      career_event_id: eventId,
      id: params.careerId,
      user_id: getDataFromLocalStorage("id"),
    });
    const response = await dispatch(careerApply(forData));
    if (response?.status === 200) {
      setIsSuccess(true);
      getCareerEvents(payload, true);
    }
    setEventLoading("");
  };
  useEffect(() => {
    getCareerEvents(payload, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userType = getDataFromLocalStorage("user_type");

  const access = {
    isViewEvent: ["0", "6"].includes(userType) ? true : false,
    isEdit: ["0", "6"].includes(userType) ? true : false,
    isDelete: ["0", "6"].includes(userType) ? true : false,
    isAdd: ["0", "6"].includes(userType) ? true : false,
    isRegister: !["0", "6"].includes(userType),
    isInstitution: userType === "3",
  };
  return (
    <div id="industrial-visit-container">
      {isSuccess && (
        <SuccessPopup
          title="Registration Successful"
          onHide={() => {
            setIsSuccess(false);
          }}
          onClose={() => {
            setIsSuccess(false);
          }}
        >
          <div className="text-16-400 color-black-olive">
            <div className="mb-2">
              Congratulations you have saved{" "}
              <span className="test-16-500 color-new-car">$50</span>
            </div>
            <div>Looking forward to meet you at the Webinar</div>
          </div>
        </SuccessPopup>
      )}
      {careerEventId && (
        <DeletePopup
          id={careerEventId}
          onHide={() => {
            setCareerEventId(null);
          }}
          handelSuccess={() => {
            setCareerEventId(null);
            getCareerEvents(payload);
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ career_event_id: careerEventId });
            const response = await dispatch(deleteCareerEvents(forData));
            return response;
          }}
        />
      )}
      {isForm && (
        <CareerEventsForm
          editData={editData}
          careerId={params.careerId}
          type={eventList.type}
          onHide={() => {
            setEditData(null);
            setIsForm(false);
          }}
          handelSuccess={() => {
            getCareerEvents(payload);
          }}
        />
      )}

      <>
        <div className="cpt-12 cpb-12 cmb-12">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
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
              {!isLoading && (
                <span className="text-18-500 color-black-olive">
                  {eventList.title} ({eventList?.list.length})
                </span>
              )}
            </div>
            {access.isAdd && (
              <Button
                onClick={() => {
                  setIsForm(true);
                }}
                text={`+ Add ${eventList.title}`}
                btnStyle="primary-outline"
                className="h-35 text-14-500"
                isSquare
              />
            )}
          </div>
        </div>
        {isLoading ? (
          <Card className="cpt-50 cpb-50">
            <Loader size="md" />
          </Card>
        ) : eventList?.list.length > 0 ? (
          <Card className="cps-24 cpe-24 cpt-12 cpb-20">
            <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
              <div className="text-18-500 color-black-olive">
                Upcoming {eventList.title}
              </div>
              <div className="d-flex">
                <div className="dropdown-filter-block">
                  <Dropdown
                    isClearable
                    options={cityList}
                    placeholder="Select city"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      let newVal = payload;
                      newVal = { ...newVal, city: e.target.value };
                      setPayload(newVal);
                      getCareerEvents(newVal);
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              {eventList?.list.map((elem, index) => {
                const dateElem = moment(elem.date).format("DD MMM");
                const dateYear = moment(elem.date).format("YYYY");
                return (
                  <div className="industry-card-block row cmb-20" key={index}>
                    <div className="col-md-2 date-time-block">
                      <div>{dateElem}</div>
                      <div className="mt-2">{dateYear}</div>
                    </div>
                    <div className="col-md-10 right-block">
                      <div className="text-18-500 color-raisin-black">
                        {elem.event_name || elem.organization_name}
                      </div>
                      <div className="location-button-block">
                        <div className="text-15-500 color-davys-gray">
                          <i className="bi bi-geo-alt me-2" />
                          {`${elem?.city_name ? `${elem?.city_name},` : ""} ${
                            elem.country_name
                          }`}
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          {access.isRegister && (
                            <Button
                              onClick={() => {
                                if (access.isInstitution) {
                                  navigate(
                                    `/${params?.memberType}/career-support/${params.careerId}/events/${elem.id}`
                                  );
                                } else {
                                  if (params.careerId === "3") {
                                    localStorage.eventId = elem.id;
                                    navigate(
                                      `/${params?.memberType}/career-support/${params.careerId}/${params.careerId}`
                                    );
                                  } else {
                                    handelSaveCareer(elem.id);
                                  }
                                }
                              }}
                              text={
                                access.isInstitution
                                  ? "View Details"
                                  : elem?.is_register
                                  ? "Registered"
                                  : "Register"
                              }
                              btnStyle="primary-dark"
                              className="text-14-500 cps-30 cpe-30"
                              btnLoading={eventLoading === elem.id}
                              disabled={
                                access.isInstitution ? false : elem?.is_register
                              }
                              isRounded
                            />
                          )}
                          {access.isViewEvent && (
                            <Button
                              onClick={() => {
                                const userTypeStr = getUserType();
                                navigate(
                                  `/${userTypeStr}/career-management/${params.careerId}/events/${elem.id}`
                                );
                              }}
                              text="View Details"
                              btnStyle="primary-dark"
                              className="text-14-500 ps-3 pe-3"
                              isRounded
                            />
                          )}
                          {access.isEdit && (
                            <Button
                              isSquare
                              btnStyle="light-outline"
                              icon={<img src={icons.edit} alt="edit" />}
                              onClick={() => {
                                setEditData(elem);
                                setIsForm(true);
                              }}
                            />
                          )}
                          {access.isDelete && (
                            <Button
                              btnStyle="light-outline"
                              icon={<img src={icons.deleteIcon} alt="delete" />}
                              onClick={() => {
                                setCareerEventId(elem.id);
                              }}
                              isSquare
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ) : (
          <Card className="cps-24 cpe-24 cpt-12 cpb-20 cpt-80 cpb-80">
            <div className="center-flex text-20-400">No Data Found</div>
          </Card>
        )}
      </>
    </div>
  );
};
export default CareerEvents;
