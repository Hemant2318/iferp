import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import Card from "components/Layout/Card";
import Profile from "components/Layout/Profile";
import LineTextLabel from "components/Layout/LineTextLabel";
import { icons } from "utils/constants";
import EmojiPicker from "components/form/EmojiPicker";
import { useNavigate } from "react-router-dom";
import {
  // downloadFile,
  // generatePreSignedUrl,
  getDataFromLocalStorage,
  // getFilenameFromUrl,
  messageTime,
  objectToFormData,
  trimLeftSpace,
} from "utils/helpers";
import {
  fetchChatMessageDetails,
  sendChatMessages,
  setRProfileID,
  uploadChatFile,
  deleteChatMessage,
  throwError,
} from "store/slices";
import Loader from "components/Layout/Loader";
// import DropdownOption from "components/Layout/DropdownOption";
import MessageBlock from "./MessageBlock";

const MessageContainer = ({
  socket,
  isTyping,
  groupData,
  messageList,
  msgRef,
  triggerEvent,
  mentorGroupID
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const htmlElRef = useRef(null);
  const userData = getDataFromLocalStorage();
  const { id: myID } = userData;
  const { id: groupID, group_detail } = groupData;
  let recieverData =
    group_detail?.find((o) => `${o.user_id}` !== `${myID}`)?.user || {};
  let {
    id: recieverID,
    first_name,
    last_name,
    last_seen,
    profile_photo_path,
    user_type,
    personal_access_tokens,
  } = recieverData;
  const isOnline = personal_access_tokens?.length > 0;
  const isReasearchProfile = ["2", "5"].includes(user_type);
  let recieverName = `${first_name} ${last_name}`;

  const [timer, setTimer] = useState("");
  const [msg, setMsg] = useState("");
  const [fileLoader, setFileLoader] = useState(false);
  const handelChange = (e) => {
    if (!timer) {
      triggerEvent("TYPING", {
        type: "TYPING",
        isTyping: true,
        recieverID: recieverID,
        socketID: socket.id,
      });
    }
    setMsg(trimLeftSpace(e.target.value));
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      setTimer("");
      triggerEvent("TYPING", {
        type: "TYPING",
        isTyping: false,
        recieverID: recieverID,
        socketID: socket.id,
      });
    }, 1000);
    setTimer(time);
  };
  const handelSendMessage = async (messageFile = "") => {
    if (msg || messageFile) {
      const response = await dispatch(
        sendChatMessages({
          groupID: groupID,
          userID: myID,
          message: msg || "",
          message_file: messageFile || "",
        })
      );
      if (response?.status === 200) {
        let msgResponse = await dispatch(
          fetchChatMessageDetails(response?.data?.id)
        );
        triggerEvent("SEND MESSAGE", {
          ...msgResponse?.data,
          recieverID: recieverID,
        });

        setMsg("");
        handelFocus();
        setFileLoader(false);
      } else {
        setMsg("");
        handelFocus();
        setFileLoader(false);
      }
    } else {
      setMsg("");
      handelFocus();
      setFileLoader(false);
    }
  };
  const handelFocus = () => {
    if (htmlElRef?.current) {
      htmlElRef.current.focus();
    }
  };
  const handleUploadChatFile = async (e) => {
    let file = e.target.files[0];
    let type = file?.name?.split(".").pop();

    if (
      ["png", "jpg", "jpeg", "mp3", "mp4", "txt", "doc", "csv", "pdf"].includes(
        type
      )
    ) {
      setFileLoader(true);
      if (e.target.files[0]) {
        let payload = objectToFormData({ chat_file: e.target.files[0] });
        const response = await dispatch(uploadChatFile(payload));
        if (response?.status === 200) {
          handelSendMessage(response?.data?.url);
        } else {
          setFileLoader(false);
        }
      } else {
        setFileLoader(false);
      }
    } else {
      dispatch(
        throwError({
          message:
            "Invalid file selection. accept only png, jpg, jpeg, mp3, mp4, txt, doc, csv, pdf",
        })
      );
    }
  };
  const handleDelete = async (messageID, status) => {
    const response = await dispatch(
      deleteChatMessage({
        message_id: messageID,
        status: status,
      })
    );
    if (response?.status === 200) {
      triggerEvent("DELETE MESSAGE", {
        type: "DELETE MESSAGE",
        group_id: groupID,
        messageID: messageID,
        status: status,
      });
    }
  };
  useEffect(() => {
    handelFocus();
    msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageList]);

  return (
    <Card className="cpt-16 cpb-16 h-100">
      <div className="d-flex align-items-center justify-content-between cps-20 cpe-20 cpb-16 border-bottom-prof">
        <div className="d-flex align-items-center chat-profile-container">
          {mentorGroupID &&
            <span
              className="d-flex"
              onClick={() => {
                navigate(-1);
              }}
            >
              <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
            </span>
          }
          <Profile
            isRounded
            text={recieverName}
            size="s-48"
            url={profile_photo_path}
            isS3UserURL
          />
          <div className="user-details-block ms-3">
            <div
              className={`text-15-600 ${
                isReasearchProfile ? "hover-effect color-new-car" : "title-text"
              }`}
              onClick={() => {
                if (isReasearchProfile) {
                  dispatch(setRProfileID(recieverID));
                }
              }}
            >
              {recieverName}
            </div>
            {last_seen && (
              <div className="text-13-400 color-black-olive">
                {isOnline
                  ? "Online"
                  : `Last seen ${messageTime(
                      moment(last_seen).format("DD-MM-YYYY hh:mm A")
                    )}`}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="chat iferp-scroll">
        <div className="chat__wrapper">
          {messageList?.map((elm, index) => {
            let { sender_id, created_at, message_file, is_delete } = elm;
            let showLine = false;
            let displayDate = "";
            const currentDay = moment(created_at).format("D");
            const nextDay = moment(messageList[index + 1]?.created_at).format(
              "D"
            );

            if (index === 0) {
              showLine = true;
              displayDate = moment(created_at).format("MMM DD, YYYY");
            } else if (nextDay && currentDay !== nextDay) {
              showLine = true;
              displayDate = moment(messageList[index + 1]?.created_at).format(
                "MMM DD, YYYY"
              );
            }
            const isAccess = sender_id === myID;
            return (
              <React.Fragment key={index}>
                {showLine && (
                  <div className="cmt-24 cmb-24">
                    <LineTextLabel
                      text={
                        <span className="text-13-400 color-black-olive">
                          {displayDate}
                        </span>
                      }
                    />
                  </div>
                )}
                <div
                  className={`chat__message ${
                    isAccess ? "chat__message__own" : ""
                  } ${
                    message_file && isAccess ? "chat__message__msg_file" : ""
                  }`}
                >
                  <MessageBlock
                    data={elm}
                    is_delete={is_delete}
                    isAccess={isAccess}
                    handleDelete={handleDelete}
                  />
                </div>
              </React.Fragment>
            );
          })}
          <div ref={msgRef} />
        </div>
      </div>
      <div className="chat-input-container position-relative">
        {isTyping && (
          <div className="typing-container cps-16 pb-1">
            {recieverName} Is Typing...
          </div>
        )}
        <div className="chat-i-block">
          <div className="left-emoji-icon">
            <EmojiPicker
              onChange={(e) => {
                let newMessage = `${msg} ${e?.value}`;
                setMsg(newMessage);
              }}
            />
          </div>
          <input
            autoFocus
            value={msg}
            ref={htmlElRef}
            id="post-input"
            placeholder="Write your message"
            onChange={handelChange}
            onKeyUp={(e) => {
              if (e?.keyCode === 13) {
                handelSendMessage();
              }
            }}
          />
          <div className="create-post-icon-container">
            <label className="create-post-icon">
              <span>
                {fileLoader ? (
                  <Loader size="sm" />
                ) : (
                  <img
                    src={icons.attchment}
                    alt="attch"
                    className="create-post-icon"
                  />
                )}
              </span>
              <input
                type="file"
                name="Select File"
                id="fileToUpload"
                onChange={handleUploadChatFile}
              />
            </label>

            <span
              className="post-send pointer"
              onClick={() => {
                handelSendMessage();
              }}
            >
              <i className="bi bi-send" />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default MessageContainer;
