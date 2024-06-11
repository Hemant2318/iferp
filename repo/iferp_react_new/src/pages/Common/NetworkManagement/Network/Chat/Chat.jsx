import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import {
  decrypt,
  encrypt,
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import {
  getChatGroups,
  getChatMessages,
  updateSocket,
  resetBadge,
  mentessSessionDetails,
} from "store/slices";
import Sidebar from "./Sidebar";
import CreateChat from "./CreateChat";
import MessageContainer from "./MessageContainer";
import Loader from "components/Layout/Loader/Loader";
import { orderBy } from "lodash";
import "./Chat.scss";

const socket = io.connect(process.env.REACT_APP_NODE_SOCKET_URL, {
  reconnection: false,
});

const Chat = ({ mentorGroupID, sessionId }) => {
  const dispatch = useDispatch();
  const chatRef = useRef();
  const msgRef = useRef();
  const deviceWidth = window.innerWidth;
  const [isSidebar, setIsSidebar] = useState(true);
  const [isChat, setIsChat] = useState(true);
  const [isLoader, setIsLoader] = useState(true);
  const [isAdd, setIsAdd] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [groupID, setGroupID] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const userData = getDataFromLocalStorage();
  const [sessionData, setSessionData] = useState({});
  let { id: myID } = userData;
  let groupData = groupList?.find((o) => `${o.id}` === `${groupID}`) || {};

  const triggerEvent = (event, data) => {
    socket.emit(event, encrypt(data));
  };
  const handelResetBadge = async () => {
    const response = await dispatch(
      resetBadge({
        userID: myID,
        groupID: groupID,
      })
    );
    if (response?.status === 200) {
      triggerEvent("SIDEBAR", {
        type: "SIDEBAR",
        userID: myID,
        socketID: socket.id,
      });
      // socket.emit("SIDEBAR", {
      //   type: "SIDEBAR",
      //   userID: myID,
      //   socketID: socket.id,
      // });
    }
  };

  const handelUpdateSocket = async (socket_id) => {
    await dispatch(updateSocket({ userID: myID, socketID: socket_id }));
  };

  const handelRecieveMessage = (msgObject) => {
    const { group_id, message } = msgObject;
    setMessageList((prev) => [...prev, msgObject]);
    setGroupList((prev) =>
      prev.map((e) => {
        let elmObject = e;
        if (group_id === e.id) {
          elmObject.last_message = message;
        }
        return elmObject;
      })
    );
    msgRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getGroupList = async () => {
    let response = await dispatch(getChatGroups(myID));
    handelGroupWithSort(response?.data);
  };

  const getMessageList = async () => {
    let response = await dispatch(getChatMessages(groupID));
    setMessageList(response?.data || []);
  };

  const handelGroupWithSort = (data) => {
    let sortData = orderBy(data || [], "updated_at", "desc");

    setGroupList(sortData);
  };

  const handleDeleteMessage = (data) => {
    const { messageID, status } = data;
    setMessageList((prev) => {
      let result = prev.map((item) =>
        item.id === messageID ? { ...item, is_delete: status } : item
      );
      return result;
    });
  };

  const getSessionDetailsBySessionId = async () => {
    const response = await dispatch(
      mentessSessionDetails(objectToFormData({ book_session_id: sessionId }))
    );
    if (response?.status === 200) {
      setSessionData(response?.data);
    }
  };

  useEffect(() => {
    if (deviceWidth <= 650) {
      setIsChat(true);
      setIsSidebar(false);
    } else {
      setIsChat(true);
      setIsSidebar(true);
    }
    getGroupList();
    setTimeout(() => {
      setIsLoader(false);
    }, 1000);

    if (sessionId) {
      getSessionDetailsBySessionId();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mentorGroupID) {
      setGroupID(mentorGroupID);
    } else {
      if (groupList.length > 0) {
        if (localStorage.redirectChat) {
          setGroupID(localStorage.redirectChat);
          localStorage.removeItem("redirectChat");
          chatRef?.current?.scrollIntoView({ behavior: "smooth" });
        } else if (!groupID) {
          setGroupID(groupList[0]?.id);
        } else {
          // Nothing
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupList]);

  useEffect(() => {
    if (groupID) {
      getMessageList();
      if (socket) {
        triggerEvent("JOIN ROOM", {
          type: "JOIN ROOM",
          roomID: `${groupID}`,
          socketID: socket.id,
        });
        // socket.emit("JOIN ROOM", {
        //   type: "JOIN ROOM",
        //   roomID: `${groupID}`,
        //   socketID: socket.id,
        // });
      }
    }
    return () => {
      if (groupID) {
        if (getDataFromLocalStorage("jwt_token")) {
          handelResetBadge();
        }
        if (socket) {
          triggerEvent("LEAVE ROOM", {
            type: "LEAVE ROOM",
            roomID: `${groupID}`,
            socketID: socket.id,
          });
          // socket.emit("LEAVE ROOM", {
          //   type: "LEAVE ROOM",
          //   roomID: `${groupID}`,
          //   socketID: socket.id,
          // });
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupID]);

  useEffect(() => {
    if (socket) {
      socket.on("RECIEVER", (encDetails) => {
        const details = decrypt(encDetails);
        const { type } = details;
        switch (type) {
          case "RECIEVE MESSAGE":
            handelRecieveMessage(details);
            break;
          case "SIDEBAR":
            handelGroupWithSort(details?.sidebar);
            break;
          case "TYPING":
            setIsTyping(details?.isTyping);
            break;
          case "DELETE MESSAGE":
            handleDeleteMessage(details);
            break;
          default:
            break;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (socket?.id) {
      handelUpdateSocket(socket?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket?.id]);
  const activeClass = "p-2 bg-new-car color-white text-16-500 w-50 text-center";
  const inActiveClass =
    "p-2 color-black-olive text-16-500 pointer w-50 text-center border";

  return (
    <div className={`row ${isLoader ? "" : "flex-grow-1"}`} id="chat-container">
      {isLoader ? (
        <Card className="d-flex justify-content-center align-items-center cpt-125 cpb-125">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          {isAdd && (
            <CreateChat
              groupList={groupList}
              onHide={() => {
                setIsAdd(false);
              }}
              handelSuccess={() => {
                setIsAdd(false);
                getGroupList();
              }}
            />
          )}
          {groupList.length > 0 ? (
            <>
              {deviceWidth <= 650 && (
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div
                    className={isChat ? activeClass : inActiveClass}
                    onClick={() => {
                      setIsSidebar(false);
                      setIsChat(true);
                    }}
                  >
                    <i className="bi bi-chat" />
                  </div>
                  <div
                    className={isSidebar ? activeClass : inActiveClass}
                    onClick={() => {
                      setIsSidebar(true);
                      setIsChat(false);
                    }}
                  >
                    <i className="bi bi-layout-text-sidebar" />
                  </div>
                </div>
              )}
              {isChat && (
                <div className="col-md-8 col-12 chat-message-container">
                  <MessageContainer
                    msgRef={msgRef}
                    socket={socket}
                    isTyping={isTyping}
                    groupData={groupData}
                    messageList={messageList}
                    triggerEvent={triggerEvent}
                    mentorGroupID={mentorGroupID}
                  />
                </div>
              )}
              {isSidebar && (
                <div className="col-md-4 col-12">
                  <>
                    {mentorGroupID && sessionData?.id ? (
                      <div className="cpe-10">
                        <Card className="unset-br cps-10 cpt-10 cpe-10 cpb-10">
                          <div className="text-15-500-26 color-dark-navy-blue cmb-10">
                            {titleCaseString(sessionData?.session_name)} - ₹{" "}
                            {sessionData?.session_price}
                          </div>

                          <div className="d-flex align-items-center gap-5 cmb-10">
                            {sessionData?.meeting_link && (
                              <div className="d-flex gap-2 align-items-center">
                                <img src={icons.videoMeet} alt="meet" />
                                <div className="text-14-400 color-dark-blue cpt-2">
                                  1:1 Video Meet
                                </div>
                              </div>
                            )}
                            {sessionData?.meeting_duration && (
                              <div className="d-flex gap-2 align-items-center">
                                <img src={icons.clockTime} alt="clock" />
                                <div className="text-14-400 color-dark-blue">
                                  {sessionData?.meeting_duration}
                                </div>
                              </div>
                            )}
                          </div>

                          {sessionData?.scheduled_on && (
                            <div className="d-flex gap-2 align-items-center cmb-10">
                              <div className="text-14-400 color-dark-navy-blue col-md-5">
                                Scheduled on
                              </div>

                              <div className="text-15-500-26 color-dark-navy-blue text-justify col-md-6">
                                {sessionData?.scheduled_on}
                              </div>
                            </div>
                          )}

                          {sessionData?.scheduled?.length > 0 &&
                            sessionData?.scheduled?.map((elem, index) => {
                              return (
                                <div className="row cmb-10" key={index}>
                                  <div className="text-14-400 color-dark-navy-blue col-md-5">
                                    Speaker's Confirmation
                                  </div>

                                  <div className="text-15-500-26 color-dark-navy-blue text-justify col-md-6">
                                    {elem?.status}
                                  </div>
                                </div>
                              );
                            })}
                        </Card>
                      </div>
                    ) : (
                      <Sidebar
                        chatRef={chatRef}
                        socket={socket}
                        isTyping={isTyping}
                        groupData={groupData}
                        groupList={groupList}
                        setGroupID={setGroupID}
                        setIsAdd={setIsAdd}
                      />
                    )}
                  </>
                </div>
              )}
            </>
          ) : (
            <div className="col-md-6">
              <Card className="cpb-80 cpt-30">
                <div className="text-center">
                  <div style={{ height: "150px" }}>
                    <img
                      src={icons.chatLogo}
                      alt="chat"
                      className="fit-image fill"
                    />
                  </div>
                  <div className="text-20-500 color-title-navy font-poppins mt-3">
                    Start Chat
                  </div>
                  <div className="text-15-400-25 color-subtitle-navy mt-1">
                    Select user for start conversation.
                  </div>
                  <div className="center-flex cmt-30">
                    <Button
                      text="Select User"
                      btnStyle="primary-dark"
                      className="h-35 text-14-500"
                      onClick={() => {
                        setIsAdd(true);
                      }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Chat;
