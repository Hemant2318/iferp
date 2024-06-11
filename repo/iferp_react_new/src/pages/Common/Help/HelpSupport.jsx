import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import { useState } from "react";
import { checkGroup, createGroup } from "store/slices";
import { getDataFromLocalStorage } from "utils/helpers";

const HelpSupport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [isChatLoader, setIsChatLoader] = useState(false);
  const { personalExecutive } = useSelector((state) => ({
    personalExecutive: state.global.personalExecutive || {},
  }));
  const userData = getDataFromLocalStorage();
  let { id: myID } = userData;
  const { id } = personalExecutive;
  const redirect = () => {
    localStorage.personalExecutiveId = id;
    navigate(`/${params?.memberType}/inbox-notifications/compose`);
  };
  const redirectToChat = (groupID) => {
    localStorage.redirectChat = groupID;
    navigate(`/${params?.memberType}/network-management/network/chat/message`);
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
    <div className="w-100">
      <div className="text-24-500 text-center color-title-navy font-poppins">
        Need Help?
      </div>
      <div className="text-16-500 color-raisin-black text-center mt-3">
        {
          "We’re here to help you. Get in touch with our customer Care executive"
        }
      </div>
      <div className="cmt-40 row w-100">
        <div className="col-md-4 mb-3">
          <Card className="d-flex flex-column justify-content-start align-items-center cpt-40 cpb-40 cps-40 cpe-40">
            <div className="cmb-22">
              <img src={icons.helpEmail} alt="helpEmail" />
            </div>
            <div className="cmb-18 text-18-500 color-title-navy font-poppins">
              Email Us
            </div>
            <div className="cmb-30 text-15-400-25 color-subtitle-navy text-center">
              {"Feel free to email us. We’d love to help you"}
            </div>
            <div className="cmb-12 text-14-500 color-black-olive">
              6 Days a week
            </div>
            <div className="text-14-400 color-black-olive">
              Mon - Sat (10:00 am - 7:00 Pm)
            </div>
            <div className="cmt-32 d-flex">
              <Button
                isRounded
                text="Send Email"
                btnStyle="primary-outline"
                className="text-16-500 cps-40 cpe-40 text-nowrap"
                onClick={redirect}
              />
            </div>
          </Card>
        </div>
        <div className="col-md-4 mb-3">
          <Card className="d-flex flex-column justify-content-start cpt-40 cpb-40 cps-30 cpe-30 h-100">
            <div className="cmb-22 text-center">
              <img src={icons.helpCall} alt="helpEmail" />
            </div>
            <div className="cmb-18 text-18-500 color-title-navy font-poppins text-center">
              Call Us
            </div>
            <div className="cmb-30 text-15-400-25 color-subtitle-navy text-center">
              Feel free to call our customer service executive
            </div>
            <div className="cmb-20 text-14-500 color-black-olive text-center">
              24x7 Support
            </div>
            <div className="text-14-400 color-black-olive text-left cmb-16">
              Toll Free Number
            </div>
            <span className="color-new-car">(+91) 76694 09022</span>
            {/* <div className="text-16-500 color-black-olive text-left cmb-16">
              India - <span className="color-new-car">18001237400</span>
            </div>
            <div className="text-16-500 color-black-olive text-left">
              Other Countries -{" "}
              <span className="color-new-car">76694 09022</span>
            </div> */}
          </Card>
        </div>
        <div className="col-md-4 mb-3">
          <Card className="d-flex flex-column justify-content-start align-items-center cpt-40 cpb-40 cps-40 cpe-40">
            <div className="cmb-22">
              <i className="bi bi-chat-dots color-new-car text-32-600" />
            </div>
            <div className="cmb-18 text-18-500 color-title-navy font-poppins">
              Chat With Us
            </div>
            <div className="cmb-30 text-15-400-25 color-subtitle-navy text-center">
              {"Feel free to chat with us. We’d love to help you"}
            </div>
            <div className="cmb-12 text-14-500 color-black-olive">
              6 Days a week
            </div>
            <div className="text-14-400 color-black-olive">
              Mon - Sat (10:00 am - 7:00 Pm)
            </div>
            <div className="cmt-32 d-flex">
              <Button
                isRounded
                text={isChatLoader ? "" : "Chat Now"}
                btnStyle="primary-outline"
                className="text-16-500 cps-40 cpe-40 text-nowrap"
                onClick={handleChatNow}
                btnLoading={isChatLoader}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default HelpSupport;
