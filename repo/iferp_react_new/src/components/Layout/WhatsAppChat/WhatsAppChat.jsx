import { icons } from "utils/constants";
import "./WhatsAppChat.scss";

const WhatsAppChat = () => {
  const handleChatNow = async () => {
    window.open(
      "https://api.whatsapp.com/send/?phone=919962691866&text&type=phone_number&app_absent=0",
      "_blank"
    );
  };

  return (
    <div id="whatsapp-chat-container" onClick={handleChatNow}>
      <img
        src={icons.whatsapp}
        alt="whatsapp"
        style={{
          height: "35px",
          width: "35px",
        }}
      />
    </div>
  );
};

export default WhatsAppChat;
