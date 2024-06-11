import { useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
import { icons } from "utils/constants";
import NetworkTab from "./NetworkTab";
import Groups from "./Groups";
import Posts from "./Posts";
import Chat from "./Chat";
import "./Network.scss";

const Network = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { memberType, pType } = params;

  const redirect = (optionType) => {
    navigate(`/${memberType}/network-management/network/${optionType}`);
  };
  const activeClass = "p-2 color-new-car text-16-500 me-4 primary-underline";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex align-items-center flex-wrap mb-4">
        <div
          className={pType === "posts" ? activeClass : inActiveClass}
          onClick={() => {
            if (pType !== "posts") {
              redirect("posts/discover-posts");
            }
          }}
        >
          <span className={`me-2 ${pType === 0 ? "primary-image" : ""}`}>
            {<img src={icons.chatPosts} alt="post" height={18} width={18} />}
          </span>
          <span>Posts</span>
        </div>
        <div
          id="network-id"
          className={pType === "network" ? activeClass : inActiveClass}
          onClick={() => {
            if (pType !== "network") {
              redirect("network/new-requests");
            }
          }}
        >
          <span className={`me-2 ${pType === 1 ? "primary-image" : ""}`}>
            {
              <img
                src={icons.chatNetwork}
                alt="network"
                height={18}
                width={18}
              />
            }
          </span>
          <span>Network</span>
        </div>
        <div
         id="groups-id"
          className={pType === "groups" ? activeClass : inActiveClass}
          onClick={() => {
            if (pType !== "groups") {
              redirect("groups/discover-groups");
            }
          }}
        >
          <span className={`me-2 ${pType === "groups" ? "primary-image" : ""}`}>
            {<img src={icons.chatGroups} alt="group" height={18} width={18} />}
          </span>
          <span>Groups</span>
        </div>
        <div
          className={pType === "chat" ? activeClass : inActiveClass}
          onClick={() => {
            if (pType !== "chat") {
              redirect(`chat/message`);
            }
          }}
        >
          <span className={`me-2 ${pType === "chat" ? "primary-image" : ""}`}>
            {<img src={icons.chatMessage} alt="chat" height={18} width={18} />}
          </span>
          <span>Chat</span>
        </div>
      </div>
      {pType === "posts" && <Posts />}
      {pType === "network" && <NetworkTab />}
      {pType === "groups" && <Groups />}
      {pType === "chat" && <Chat />}
    </div>
  );
};
export default Network;
