import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Profile from "components/Layout/Profile";
import { fetchUserEvents } from "store/slices";
import { getEventDate } from "utils/helpers";
import EditButton from "components/Layout/EditButton";
import { icons } from "utils/constants";
import "./MyCalendar.scss";
import EditMyInterests from "./EditMyInterests";
import AddSpecialInterestGroups from "./AddSpecialInterestGroups";
import Follow from "./Follow";

const MyCalendar = () => {
  const dispatch = useDispatch();
  const { myGroupsList } = useSelector((state) => ({
    myGroupsList: state.global.myGroupsList,
  }));
  const [type, setType] = useState(0);
  const [formType, setFormType] = useState(null);
  const [eventList, setEventList] = useState([]);
  const getMyEvents = async () => {
    const response = await dispatch(fetchUserEvents());
    setEventList(response?.data?.event_details || []);
  };
  useEffect(() => {
    getMyEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="row" id="MyCalendar-container">
      {formType === "1" && (
        <EditMyInterests
          onHide={() => {
            setFormType(null);
          }}
        />
      )}
      {formType === "2" && (
        <AddSpecialInterestGroups
          onHide={() => {
            setFormType(null);
          }}
        />
      )}
      {formType === "3" && (
        <Follow
          onHide={() => {
            setFormType(null);
          }}
        />
      )}
      <div className="col-md-8">
        <Card className="p-unset unset-br mb-3">
          <div className="cps-18 cpt-26 cpb-26 text-18-600 color-black-olive border-bottom">
            My Event Calendar
          </div>
          <div>
            {eventList.map((elem, index) => {
              return (
                <div
                  className={`cps-18 cpe-18 cpt-26 cpb-26 ${
                    eventList.length - 1 === index ? "" : "border-bottom"
                  }`}
                  key={index}
                >
                  <div className="text-15-500 color-raisin-black">
                    {elem.event_name}
                  </div>
                  <div className="d-flex gap-4 mt-3">
                    <div className="text-14-400 color-silver-gray">
                      <i className="bi bi-calendar3-event me-2" />
                      {getEventDate(elem.event_start_date, elem.event_end_date)}
                    </div>
                    <div className="text-14-400 color-silver-gray">
                      <i className="bi bi-geo-alt me-2" />
                      {`${elem?.city_name ? `${elem?.city_name},` : ""} ${
                        elem.country_name
                      }`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-unset unset-br mb-3">
          <div className="cps-18 cpe-18 cpt-26 cpb-26 d-flex align-items-center justify-content-between border-bottom">
            <div className="text-18-600 color-black-olive">My Interests</div>
            <EditButton
              onClick={() => {
                setFormType("1");
              }}
            />
          </div>
          <div className="cps-18 cpe-18 cpt-20 cpb-20">
            <div className="text-16-500 mb-3">
              <i className="bi bi-caret-down-fill color-new-car me-3" />
              Topics
            </div>
            <div className="mb-3 d-flex flex-wrap gap-3">
              <span className="text-nowrap bg-new-car-light pt-1 pb-1 ps-2 pe-2">
                Business Services
              </span>
              <span className="text-nowrap bg-new-car-light pt-1 pb-1 ps-2 pe-2">
                Education & Training
              </span>
              <span className="text-nowrap bg-new-car-light pt-1 pb-1 ps-2 pe-2">
                Agriculture & Forestry
              </span>
            </div>
            <div className="text-16-500 mb-3">
              <i className="bi bi-caret-down-fill color-new-car me-3" />
              Regions
            </div>
            <div className="d-flex">
              <Profile text="U" size="s-18" isRounded />
              <div className="text-14-500 color-black-olive ms-2">
                USA <span className="text-12-400">(3 Events)</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-unset unset-br mb-3">
          <div className="cps-18 cpe-18 cpt-26 cpb-26 d-flex align-items-center justify-content-between border-bottom">
            <div className="text-18-600 color-black-olive">
              My Special Interest Groups
            </div>
            <Button
              isSquare
              text="+ Add Group"
              btnStyle="primary-outline"
              className="h-35 text-14-500"
              onClick={() => {
                setFormType("2");
              }}
            />
          </div>
          <div>
            {myGroupsList.map((elem, index) => {
              const memberCount = elem?.joined_members.length || 0;
              return (
                <div
                  key={index}
                  className={`cps-18 cpe-18 cpt-26 cpb-26 d-flex align-items-center justify-content-between ${
                    myGroupsList.length - 1 === index ? "" : "border-bottom"
                  }`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <Profile isRounded text={elem.name} size="s-100" />
                    <div>
                      <div className="text-18-500 color-black-olive">
                        {elem.name}
                      </div>
                      <div className="text-13-400 color-black-olive mt-1">
                        {elem.interest_category}
                      </div>
                      <div className="text-13-400 color-black-olive mt-1">
                        {memberCount} Members
                      </div>
                    </div>
                  </div>
                  <Button
                    isSquare
                    text="Leave Group"
                    btnStyle="primary-gray"
                    className="h-35 text-14-500 text-nowrap"
                  />
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-unset unset-br mb-3">
          <div className="cps-18 cpe-18 cpt-26 cpb-26 d-flex align-items-center justify-content-between border-bottom">
            <div className="text-18-600 color-black-olive">Following (2)</div>
            <Button
              isSquare
              text="Follow People"
              btnStyle="primary-outline"
              className="h-35 text-14-500"
              onClick={() => {
                setFormType("3");
              }}
            />
          </div>
          <div>
            <div className="cps-18 cpe-18 cpt-26 cpb-26 d-flex align-items-center justify-content-between border-bottom">
              <div className="d-flex align-items-center gap-3">
                <Profile isRounded text="H" size="s-100" />
                <div>
                  <div className="text-18-500 color-black-olive">Hania M</div>
                  <div className="text-13-400 color-black-olive mt-1">
                    Professor, Canada
                  </div>
                  <div className="text-13-400 color-black-olive mt-1">
                    268 Followers
                  </div>
                </div>
              </div>
              <Button
                isSquare
                text="Remove"
                btnStyle="primary-gray"
                className="h-35 text-14-500"
              />
            </div>
            <div className="cps-18 cpe-18 cpt-26 cpb-26 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <Profile isRounded text="A" size="s-100" />
                <div>
                  <div className="text-18-500 color-black-olive">Anaya K</div>
                  <div className="text-13-400 color-black-olive mt-1">
                    Professor, Canada
                  </div>
                  <div className="text-13-400 color-black-olive mt-1">
                    268 Followers
                  </div>
                </div>
              </div>
              <Button
                isSquare
                text="Remove"
                btnStyle="primary-gray"
                className="h-35 text-14-500"
              />
            </div>
          </div>
        </Card>
      </div>
      <div className="col-md-4">
        <Card className="cps-18 cpe-20 cpt-20 cpb-20 unset-br">
          <div
            className={`my-calender-nav-block d-flex align-items-center gap-3 ${
              type === 0 ? "my-calender-active" : ""
            }`}
            onClick={() => {
              setType(0);
            }}
          >
            <div className="my-calender-img-block">
              <img src={icons.myCalender} alt="calender" />
            </div>
            <div className="text-16-400 my-calender-text-block">
              Abcde‘s Calendar
            </div>
          </div>
          <div className="my-calender-saprator" />
          <div
            className={`my-calender-nav-block d-flex align-items-center gap-3 ${
              type === 1 ? "my-calender-active" : ""
            }`}
            onClick={() => {
              setType(1);
            }}
          >
            <div className="my-calender-img-block">
              <img src={icons.myInterest} alt="calender" />
            </div>
            <div className="text-16-400 my-calender-text-block">Interests</div>
          </div>
          <div className="my-calender-saprator" />
          <div
            className={`my-calender-nav-block d-flex align-items-center gap-3 ${
              type === 2 ? "my-calender-active" : ""
            }`}
            onClick={() => {
              setType(2);
            }}
          >
            <div className="my-calender-img-block">
              <img src={icons.myCommunities} alt="calender" />
            </div>
            <div className="text-16-400 my-calender-text-block">
              Communities
            </div>
          </div>
          <div className="my-calender-saprator" />
          <div
            className={`my-calender-nav-block d-flex align-items-center gap-3 ${
              type === 3 ? "my-calender-active" : ""
            }`}
            onClick={() => {
              setType(3);
            }}
          >
            <div className="my-calender-img-block">
              <img src={icons.myFollowers} alt="calender" />
            </div>
            <div className="text-16-400 my-calender-text-block">Followers</div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default MyCalendar;
