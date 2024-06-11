import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "components/form/Button";
import DropdownButton from "components/form/DropdownButton";
import Card from "components/Layout/Card";
import ChatProfile from "components/Layout/ChatProfile";
import Profile from "components/Layout/Profile";
import Loader from "components/Layout/Loader";
import DeletePopup from "components/Layout/DeletePopup";
import GroupDetails from "./GroupDetails";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import {
  deleteSIGGroup,
  fetchSIGGroup,
  getMyGroups,
  groupFollow,
} from "store/slices";
import OverlapProfile from "components/Layout/OverlapProfile";

const Groups = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { memberType, cType } = params;
  const { myGroupsList } = useSelector((state) => ({
    myGroupsList: state.global.myGroupsList,
  }));
  const [GroupID, setGroupID] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupPopup,setGroupPopup] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState("");
  const handelGroupFollow = async (id) => {
    setIsFollowLoading(id);
    const response = await dispatch(
      groupFollow(objectToFormData({ group_id: id }))
    );
    if (response?.status === 200) {
      await dispatch(getMyGroups());
    }
    setIsFollowLoading("");
  };
  useEffect(() => {
    localStorage.removeItem("groupName");
    localStorage.removeItem("tempData");
    localStorage.removeItem("groupDescription");
    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getGroups = async () => {
    const response = await dispatch(fetchSIGGroup());
    setGroupList(response?.data || []);
    setIsLoading(false);
  };
  const redirect = (optionType) => {
    navigate(`/${memberType}/network-management/network/groups/${optionType}`);
  };
  const redirectGroupDetails = (elem) => {
    localStorage.prevRoute = window.location.pathname;
    navigate(`/${memberType}/chapters-groups/sig-groups/${elem.id}/conference`);
  };
  const activeClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  const userType = getDataFromLocalStorage("user_type");
  const displayList = cType === "discover-groups" ? groupList : myGroupsList;
  const access = {
    isCreate: userType === "0",
    isMyGroup: userType !== "0",
    isFilter: userType !== "0",
    groupText: userType === "0" ? "All Groups" : "Discover Groups",
  };
  return (
    <div className="row cmt-26">
      {GroupID && (
        <DeletePopup
          title="Delete SIG Group"
          message="Are you sure you want to delete this Group?"
          id={GroupID}
          onHide={() => {
            setGroupID(null);
          }}
          handelSuccess={() => {
            setGroupID(null);
            // setIsLoading(true);
            getGroups();
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ id: GroupID });
            const response = await dispatch(deleteSIGGroup(forData));
            return response;
          }}
        />
      )}
      {
        groupPopup &&(
          <GroupDetails 
          groupData={groupData}
          onHide={()=> {setGroupPopup(false)}
          }/>
        )
      }
      <div className="col-md-8 col-12 mb-3">
        <Card className="d-flex align-items-center justify-content-between p-1 unset-br mb-4">
          <div className="d-flex align-items-center">
            <div
              className={
                cType === "discover-groups" ? activeClass : inActiveClass
              }
              onClick={() => {
                redirect("discover-groups");
              }}
            >
              {access.groupText}
            </div>
            {access.isMyGroup && (
              <div
                className={cType === "my-groups" ? activeClass : inActiveClass}
                onClick={() => {
                  redirect("my-groups");
                }}
              >
                My Groups
              </div>
            )}
          </div>
          {access.isCreate && (
            <Button
              text="+ Create Group"
              btnStyle="primary-light"
              className="h-35 text-14-500"
              onClick={() => {
                navigate(
                  `/${params.memberType}/network-management/network/group/create-group`
                );
              }}
              isSquare
            />
          )}
        </Card>
        {access.isFilter && (
          <div className="d-flex justify-content-between align-items-center cmb-24">
            <div className="text-15-500 color-raisin-black">
              Trending Groups
            </div>
            <div className="text-14-400 color-black-olive">
              Sort By -{" "}
              <span className="text-14-500 color-new-car">Trending</span>
            </div>
          </div>
        )}
        {isLoading ? (
          <Card className="cpt-80 cpb-80">
            <Loader size="md" />
          </Card>
        ) : displayList.length === 0 ? (
          <Card className="center-flex cpt-80 cpb-80">No Data Found</Card>
        ) : (
            <Card className="trending-groups-list-container">
            {displayList.map((elem, index) => {
              const memberCount = elem?.joined_members.length || 0;
              const isExist = myGroupsList.some((o) => o.id === elem.id);
              return (
                <div
                  className={`cps-16 cpe-16 cpt-20 cpb-20 ${
                    displayList.length - 1 === index ? "" : "border-bottom"
                  }`}
                  key={index}
                   onClick={() => {
                        redirectGroupDetails(elem);
                        }
                      }
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div
                      className="d-flex align-items-center groups-trending-profile-container pointer"
                      onClick={(e) => {
                         e.preventDefault();
                          e.stopPropagation();
                        setGroupPopup(true);
                      setGroupData(elem)}
                      }
                    >
                      <Profile isRounded text={elem.name} size="s-48" />
                      <div className="user-details-block ms-3">
                        <div className="text-15-600 color-raisin-black">
                          {elem.name}
                        </div>
                        {memberCount > 0 && (
                          <OverlapProfile
                            userList={elem?.joined_members || []}
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      {userType === "0" ? (
                        <DropdownButton
                          parentClass="post-options"
                          className="d-flex justify-content-end"
                          id="iconType"
                          icon={
                            <i className="bi bi-three-dots text-18-400 color-gray pointer" />
                          }
                        >
                          <div className="post-options-list">
                            <div
                              className="text-14-400 pointer color-black-olive"
                              onClick={() => {
                                localStorage.tempData = JSON.stringify(elem);
                                navigate(
                                  `/${params.memberType}/network-management/network/group/${elem.id}`
                                );
                              }}
                            >
                              Edit
                            </div>

                            <div
                              className="text-14-400 pointer color-black-olive"
                              onClick={() => {
                                setGroupID(elem.id);
                              }}
                            >
                              Delete
                            </div>
                          </div>
                        </DropdownButton>
                      ) : (
                        <Button
                          text={isExist ? "Remove" : "Join Now"}
                          btnStyle="primary-dark"
                          className="h-35 cps-20 cpe-20 text-nowrap"
                          btnLoading={isFollowLoading === elem.id}
                          onClick={() => {
                            handelGroupFollow(elem.id);
                          }}
                        />
                      )}
                    </div>
                    {/* {showJoinButton && (
                      <div>
                        {userType === "0" ? (
                          <DropdownButton
                            parentClass="post-options"
                            className="d-flex justify-content-end"
                            id="iconType"
                            icon={
                              <i className="bi bi-three-dots text-18-400 color-gray pointer" />
                            }
                          >
                            <div className="post-options-list">
                              <div
                                className="text-14-400 pointer color-black-olive"
                                onClick={() => {
                                  localStorage.tempData = JSON.stringify(elem);
                                  navigate(
                                    `/${params.memberType}/network-management/network/group/${elem.id}`
                                  );
                                }}
                              >
                                Edit
                              </div>

                              <div
                                className="text-14-400 pointer color-black-olive"
                                onClick={() => {
                                  setGroupID(elem.id);
                                }}
                              >
                                Delete
                              </div>
                            </div>
                          </DropdownButton>
                        ) : (
                          <Button
                            text={
                              cType === "discover-groups"
                                ? "Join Now"
                                : "Remove"
                            }
                            btnStyle="primary-dark"
                            className="h-35 cps-20 cpe-20 text-nowrap"
                            btnLoading={isFollowLoading === elem.id}
                            onClick={() => {
                              handelGroupFollow(elem.id);
                            }}
                          />
                        )}
                      </div>
                    )} */}
                  </div>
                  <div className="text-12-400 color-black-olive cmt-12">
                    {elem.description}
                  </div>
                </div>
              );
            })}
          </Card>
        )}
      </div>
      <div className="col-md-4 col-12 mb-3">
        <ChatProfile />
      </div>
    </div>
  );
};
export default Groups;
