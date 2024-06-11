import SeachInput from "components/form/SeachInput";
import Loader from "components/Layout/Loader";
import Modal from "components/Layout/Modal";
import Profile from "components/Layout/Profile";
import { unionBy } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createGroup,
  fetchFollowerOrFollowing,
  notifyCreateGroup,
  throwError,
  // fetchNetworkUsers,
} from "store/slices";
import ListGroup from "react-bootstrap/ListGroup";
import {
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
// import { limit } from "utils/constants";

const CreateChat = ({ onHide, handelSuccess, groupList }) => {
  const dispatch = useDispatch();
  const listref = useRef();
  // const [timer, setTimer] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isAddLoading, setIsAddLoading] = useState("");
  const [searchText, setSearchText] = useState("");
  const [oldList, setOldList] = useState([]);
  const [userList, setUserList] = useState([]);
  // const [userDetails, setUserDetails] = useState({
  //   userList: [],
  //   offset: 0,
  //   limit: limit,
  //   name: "",
  //   total: 0,
  // });
  const userData = getDataFromLocalStorage();
  let { id: myID } = userData;
  // let existingList = groupList?.map((elm) => {
  //   let findData = elm?.group_detail.find((o) => o?.user_id !== myID);
  //   return findData?.user_id;
  // });

  // const handelScroll = (e) => {
  //   const bottom =
  //     e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
  //   if (bottom) {
  //     let oldData = cloneDeep({
  //       ...userDetails,
  //       offset: userDetails.offset + limit,
  //     });
  //     setUserDetails(oldData);
  //     getUsers(oldData);
  //   }
  // };
  const handelCreateGroup = async (id) => {
    if (id === getDataFromLocalStorage("id")) {
      dispatch(throwError({ message: "You can't select self as opponenet!" }));
      return;
    }
    setIsAddLoading(id);
    let existingGroupID = "";
    groupList?.forEach((elm) => {
      elm?.group_detail.forEach((cElem) => {
        if (cElem?.user_id === id) {
          existingGroupID = cElem?.groupID;
        }
      });
    });
    if (existingGroupID) {
      localStorage.redirectChat = existingGroupID;
      handelSuccess();
    } else {
      const response = await dispatch(
        createGroup({
          userID: myID,
          recieverID: id,
        })
      );
      if (response?.status === 200) {
        await dispatch(
          notifyCreateGroup(
            objectToFormData({
              receiver_id: id,
              group_id: response?.data[0]?.groupID,
            })
          )
        );
        localStorage.redirectChat = response?.data[0]?.groupID;
        handelSuccess();
      }
    }
    setIsAddLoading("");
  };
  const handelSearch = (e) => {
    e.preventDefault();
    const val = titleCaseString(e.target.value);
    setSearchText(val);
    // let time = timer;
    // clearTimeout(time);
    // time = setTimeout(() => {
    //   let oldData = cloneDeep({
    //     ...userDetails,
    //     offset: 0,
    //     name: lowerCase(val),
    //   });
    //   listref?.current.scrollTo(0, 0);
    //   setUserDetails(oldData);
    //   getUsers(oldData, true);
    // }, 800);
    // setTimer(time);
  };
  // const getUsers = async (obj, isReset) => {
  //   const fromData = objectToFormData(omit(obj, ["userList"]));
  //   const response = await dispatch(fetchNetworkUsers(fromData));
  //   if (response?.status === 200) {
  //     setUserDetails((prev) => {
  //       let newData = isReset
  //         ? response?.data?.user_details
  //         : [...prev.userList, ...response?.data?.user_details];
  //       let filterList = newData?.filter((o) => !existingList.includes(o.id));
  //       return {
  //         ...prev,
  //         total: response?.data?.result_count,
  //         userList: filterList,
  //       };
  //     });
  //   }
  //   setIsPageLoading(false);
  // };
  const getFollowers = async () => {
    const response1 = await dispatch(
      fetchFollowerOrFollowing(objectToFormData({ type: "follower" }))
    );
    let res1 = response1?.data?.result || [];
    const response2 = await dispatch(
      fetchFollowerOrFollowing(objectToFormData({ type: "following" }))
    );
    let res2 = response2?.data?.result || [];
    let newArray = unionBy([...res1, ...res2], "id");
    setUserList(newArray);
    setOldList(newArray);
    setIsPageLoading(false);
  };

  useEffect(() => {
    getFollowers();
    // getUsers(userDetails, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const { total } = userDetails;

  let displayList = [];
  if (searchText) {
    let newArray = [];
    oldList.forEach((o) => {
      if (o?.name.toLowerCase().includes(searchText.toLowerCase())) {
        newArray.push(o);
      }
    });
    displayList = newArray;
  } else {
    displayList = userList;
  }
  displayList = displayList?.filter(
    (o) => o.id !== getDataFromLocalStorage("id")
  );
  return (
    <Modal onHide={onHide} size="md" width="100%">
      {isPageLoading ? (
        <div className="pt-5 pb-5">
          <Loader size="md" />
        </div>
      ) : (
        <>
          <SeachInput
            placeholder="Search user"
            onChange={handelSearch}
            value={searchText}
          />

          <div
            className="request-list-container max-430 overflow-y-auto iferp-scroll mt-3"
            ref={listref}
            // onScroll={(e) => {
            //   if (userList?.length < total) {
            //     handelScroll(e);
            //   }
            // }}
          >
            {displayList?.length === 0 ? (
              <div className="center-flex text-16-400 pt-5 pb-5">
                No Data Found
              </div>
            ) : (
              <ListGroup>
                {displayList?.map((elem, index) => {
                  const { id, name, country, state, profile_photo_path } = elem;
                  return (
                    <ListGroup.Item
                      action
                      key={index}
                      disabled={isAddLoading}
                      onClick={() => {
                        handelCreateGroup(id);
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div className="d-flex align-items-center left-block flex-grow-1">
                          <Profile
                            isRounded
                            text={name}
                            size="s-34"
                            url={profile_photo_path}
                          />
                          <div className="user-details-block ms-3 w-100">
                            <div className="text-15-600 color-raisin-black text-truncate d-inline-block w-75 text-break">
                              {titleCaseString(name)}
                            </div>
                            <div className="text-13-400 color-black-olive">
                              {state && country ? `${state}, ${country}` : ""}
                            </div>
                          </div>
                        </div>
                        {isAddLoading === id && (
                          <div>
                            <Loader size="sm" />
                          </div>
                        )}
                      </div>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};
export default CreateChat;
