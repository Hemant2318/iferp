import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import "./ChatNow.scss";
import { useState } from "react";
import { checkGroup, createGroup } from "store/slices";
import { getDataFromLocalStorage, getUserType } from "utils/helpers";
import { useNavigate } from "react-router-dom";

const ChatNow = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const memberType = getUserType();
  const userData = getDataFromLocalStorage();
  let { id: myID } = userData;
  const [isChatLoader, setIsChatLoader] = useState(false);
  const { personalExecutive } = useSelector((state) => ({
    personalExecutive: state.global.personalExecutive || {},
  }));
  const { id } = personalExecutive;
  const redirectToChat = (groupID) => {
    localStorage.redirectChat = groupID;
    navigate(`/${memberType}/network-management/network/chat/message`);
  };
  const handelCreateGroup = async () => {
    const response = await dispatch(
      createGroup({
        userID: myID,
        recieverID: id,
      })
    );
    if (response?.status === 200) {
      redirectToChat(response?.data[0]?.groupID);
    }
    setIsChatLoader(false);
  };
  const handleChatNow = async () => {
    setIsChatLoader(true);
    const response = await dispatch(
      checkGroup({
        userID: myID,
        recieverID: id,
      })
    );
    if (response?.data?.[0]) {
      redirectToChat(response?.data);
      setIsChatLoader(false);
    } else {
      handelCreateGroup();
    }
  };

  return (
    <div id="chat-now-container" onClick={handleChatNow}>
      {isChatLoader ? <Loader size="md" /> : <i className="bi bi-chat-text" />}
    </div>
  );
};

export default ChatNow;
