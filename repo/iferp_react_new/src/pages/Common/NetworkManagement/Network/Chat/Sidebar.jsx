import { Badge, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import Profile from "components/Layout/Profile";
import { icons } from "utils/constants";
import { getDataFromLocalStorage } from "utils/helpers";
import { orderBy } from "lodash";

const Sidebar = ({
  groupData,
  setGroupID,
  groupList,
  setIsAdd,
  chatRef,
  socket,
}) => {
  const { id: groupID } = groupData;
  const userData = getDataFromLocalStorage();
  const { id: myID } = userData;
  const handelGroupClick = (group_id) => {
    if (`${group_id}` !== groupID) {
      setGroupID(group_id);
    }
  };
  let displayList = orderBy(groupList, "updated_at", "desc");
  return (
    <Card className="h-100">
      <div className="cps-18 cpt-18 cpe-18 cpb-18 border-bottom d-flex justify-content-between align-items-center">
        <div className="text-15-500 color-black-olive d-flex align-items-center gap-2">
          <span>Chats</span>
          <span
            className={`h-10 w-10 d-flex rounded-circle ${
              socket.connect ? "bg-success" : "bg-danger"
            }`}
          />
          <OverlayTrigger
            // show
            placement="bottom"
            overlay={
              <Tooltip id="button-tooltip-2" className="my-chat">
                <div className="pt-3 text-15-500">Community Guidelines:</div>
                <ul className="text-12-400 color-black text-start pt-2">
                  <li style={{ listStyleType: "disc" }}>
                    Do not use inappropriate language, or share explicit
                    content. This includes any form of nudity or pornography.
                  </li>
                  <li style={{ listStyleType: "disc" }}>
                    Harassment of any kind will not be tolerated.
                  </li>
                  <li style={{ listStyleType: "disc" }}>
                    Any form of hate speech, including but not limited to
                    racism, sexism, homophobia or religious intolerance, is
                    strictly prohibited.
                  </li>
                  <li style={{ listStyleType: "disc" }}>
                    Do not engage in any illegal activities or encourage others
                    to do so
                  </li>
                  <li style={{ listStyleType: "disc" }}>
                    If vou encounter a user who is violating these guidelines or
                    making you feel uncomfortable, report it to
                    helpdesk@iferp.in
                  </li>
                </ul>
              </Tooltip>
            }
          >
            <i className="bi bi-info-circle pointer" />
          </OverlayTrigger>
        </div>
        <div
          style={{ height: "25px" }}
          className="d-flex pointer"
          onClick={() => {
            setIsAdd(true);
          }}
        >
          {<img src={icons.chatLogo} alt="chat" className="fit-image fill" />}
        </div>
      </div>
      <div className="chat-user-list iferp-scroll">
        {displayList.map((elem, index) => {
          let { id, last_message, group_detail } = elem;

          let dBadge =
            group_detail?.find((o) => `${o.user_id}` === `${myID}`)?.badge || 0;
          let reciever =
            group_detail?.find((o) => `${o.user_id}` !== `${myID}`)?.user || {};
          let { first_name, last_name, profile_photo_path } = reciever;
          let displayName = `${first_name} ${last_name}`;
          let isActive = `${id}` === `${groupID}`;

          return (
            <div
              className={`chat-user-block d-flex align-items-center cpt-20 cpb-20 cps-18 cpe-18 pointer ${
                isActive ? "active-sidebar bg-gainsboro" : ""
              } ${groupList.length - 1 === index ? "" : "border-bottom"}`}
              key={index}
              onClick={() => {
                handelGroupClick(id);
              }}
            >
              <Profile
                isRounded
                isS3UserURL
                text={displayName}
                size="s-48"
                url={profile_photo_path}
              />
              <div className="user-details-block flex-grow-1 ms-3">
                <div className="text-15-600 color-raisin-black d-flex align-items-center justify-content-between">
                  <span>{displayName}</span>
                  {!isActive && dBadge > 0 && (
                    <span>
                      <Badge bg="primary">{dBadge}</Badge>
                    </span>
                  )}
                </div>
                <div className="text-13-400 color-black-olive mt-2">
                  {last_message}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatRef} />
      </div>
    </Card>
  );
};

export default Sidebar;
