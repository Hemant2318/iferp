import { useState } from "react";
import Button from "components/form/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDataFromLocalStorage, getUserType } from "utils/helpers";
import { checkGroup, createGroup } from "store/slices";

const RequestChange = ({ afterRedirect }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const memberType = getUserType();
  const userData = getDataFromLocalStorage();
  let { id: myID } = userData;
  const { personalExecutive } = useSelector((state) => ({
    personalExecutive: state.global.personalExecutive || {},
  }));
  const [isChatLoader, setIsChatLoader] = useState(false);
  const { id } = personalExecutive;
  const redirectToChat = (groupID) => {
    localStorage.redirectChat = groupID;
    navigate(`/${memberType}/network-management/network/chat/message`);
    afterRedirect();
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
    if (response?.data || response?.data?.[0]) {
      redirectToChat(response?.data);
      setIsChatLoader(false);
    } else {
      handelCreateGroup();
    }
  };
  const requestForChange = () => {
    handleChatNow();
  };
  return (
    <Button
      isSquare
      text="Request for change name"
      btnStyle="primary-dark"
      className="text-12-400 h-35"
      onClick={requestForChange}
      btnLoading={isChatLoader}
    />
  );
};

export default RequestChange;
