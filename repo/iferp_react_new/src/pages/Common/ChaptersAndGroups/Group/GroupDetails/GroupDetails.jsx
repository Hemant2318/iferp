import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import {
  getGroupFollowers,
  groupFollow,
  setMyGroupsList,
  setRProfileID,
} from "store/slices";
import {
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import ConferencesAndEvents from "pages/Common/EventManagement/ConferencesAndEvents";
import { Tab, Tabs } from "react-bootstrap";
import Profile from "components/Layout/Profile";
import Loader from "components/Layout/Loader";

const GroupDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { groupId, eventType, memberType } = params;
  const userType = getDataFromLocalStorage("user_type");
  const access = {
    isFollow: userType !== "0" && userType !== "6",
  };
  const { myGroupsList } = useSelector((state) => ({
    myGroupsList: state.global.myGroupsList,
  }));
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [dataList, setDataLIst] = useState({});
  const [isPageLoading, setIsPageLoading] = useState(false);
  const handleRedirect = (type) => {
    navigate(
      `/${params.memberType}/chapters-groups/sig-groups/${groupId}/${type}`
    );
  };
  const handelGroupFollow = async (isFollowGroup) => {
    setIsFollowLoading(true);
    const response = await dispatch(
      groupFollow(objectToFormData({ group_id: groupId }))
    );
    if (response?.status === 200) {
      let oldList = myGroupsList;
      if (isFollowGroup) {
        oldList = oldList.filter((o) => `${o.id}` !== groupId);
        dispatch(setMyGroupsList(oldList));
      } else {
        oldList = [...oldList, response?.data];
        dispatch(setMyGroupsList(oldList));
      }
    }
    setIsFollowLoading(false);
  };
  const handelFollowers = async () => {
    setIsPageLoading(true);
    const payload = objectToFormData({ group_id: groupId });
    const response = await dispatch(getGroupFollowers(payload));
    setDataLIst(response?.data);
    setIsPageLoading(false);
  };
  useEffect(() => {
    handelFollowers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isFollowGroup = myGroupsList.find((o) => `${o.id}` === groupId);
  const { group_name, group_member, description } = dataList;
  return (
    <div>
      {["0", "6"].includes(userType) ? (
        <div className="cpt-12 cpb-12 d-flex align-items-center cmb-12 ">
          <span className="d-flex pb-3">
            <img
              src={icons.leftArrow}
              alt="back"
              className="h-21 me-3 pointer"
              onClick={() => {
                if (localStorage.prevRoute) {
                  navigate(localStorage.prevRoute);
                } else {
                  navigate(`/${memberType}/chapters-groups/sig-groups`);
                }
              }}
            />
          </span>
          <Tabs
            defaultActiveKey={group_name}
            id="uncontrolled-tab-example"
            className="mb-3 gap-4"
          >
            <Tab
              eventKey={group_name}
              title={<span id="chapters-id">{group_name}</span>}
              onEnter={() => {
                handleRedirect("conference");
              }}
            />
            <Tab
              eventKey="followers"
              title={
                <span id="SIG-groups-id">{`${
                  group_name || ""
                } Followers`}</span>
              }
              onEnter={() => {
                handleRedirect("followers");
              }}
            />
          </Tabs>
        </div>
      ) : (
        <div className="cpt-12 cpb-12 d-flex align-items-center cmb-12 ">
          <span className="d-flex">
            <img
              src={icons.leftArrow}
              alt="back"
              className="h-21 me-3 pointer"
              onClick={() => {
                if (localStorage.prevRoute) {
                  navigate(localStorage.prevRoute);
                } else {
                  navigate(`/${memberType}/chapters-groups/sig-groups`);
                }
              }}
            />
            <span className="text-20-500 color-black-olive font-poppins">
              {group_name}
            </span>
          </span>
        </div>
      )}
      {eventType === "followers" ? (
        <Card className="cps-20 cpe-20 cpt-20 cpb-20 unset-br">
          {isPageLoading ? (
            <div className="pt-5 pb-5">
              <Loader size="md" />
            </div>
          ) : (
            <div className="row">
              {group_member.map((elem, index) => {
                const { name, profile, country, city, user_type, user_id } =
                  elem;
                const isReasearchProfile = ["2", "5"].includes(user_type);
                return (
                  <div className="col-md-4 col-12 cmb-20" key={index}>
                    <div className="col-md-12 border cps-12 cpe-12 cpt-12 cpb-12">
                      <div className="d-flex align-items-center">
                        <Profile
                          isS3UserURL
                          isRounded
                          text={name}
                          size="s-68"
                          url={profile}
                        />
                        <div className="ms-3">
                          <div
                            className={`text-15-500 ${
                              isReasearchProfile
                                ? "color-title-navy pointer hover-effect"
                                : "color-raisin-black"
                            }`}
                            onClick={() => {
                              if (isReasearchProfile) {
                                dispatch(setRProfileID(user_id));
                              }
                            }}
                          >
                            {titleCaseString(name)}
                          </div>
                          <div className="text-13-400 color-black-olive mt-1">
                            {`${city}, ${country}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      ) : (
        <>
          <Card className="cps-40 cpe-40 cpt-40 cpb-40 mb-3">
            <div className="text-26-600 color-title-navy font-poppins cmb-22 text-center responsive-title">
              {`Special Interest Community in ${group_name || "SIGAI"}`}
            </div>
            <div className="text-15-400-25 color-subtitle-navy text-center">
              {description}
            </div>
            {access.isFollow && (
              <div className="cmt-30 d-flex justify-content-center">
                <Button
                  isSquare
                  btnStyle="primary-dark"
                  className="cps-12 cpe-12 h-35"
                  text={isFollowGroup ? "Unfollow" : "Follow"}
                  btnLoading={isFollowLoading}
                  onClick={() => {
                    handelGroupFollow(isFollowGroup);
                  }}
                />
              </div>
            )}
          </Card>
          <ConferencesAndEvents />
        </>
      )}
    </div>
  );
};
export default GroupDetails;
