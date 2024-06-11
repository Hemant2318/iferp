import { Checkbox } from "components";
import { icons } from "utils/constants";

const MessageList = ({ hideStar, isStarred }) => {
  const list = [
    {
      id: 1,
      name: "Naina K",
      message:
        "Liked your Article - Associations of Pulmonary Function with MRI Brain Volumes: A Coordinated..",
      time: "04:30 PM",
      isRead: true,
      isStar: isStarred ? true : false,
    },
    {
      id: 2,
      name: "Nisha",
      message:
        "Liked your Article - Associations of Pulmonary Function with MRI Brain Volumes: A Coordinated..",
      time: "04:30 PM",
      isRead: true,
      isStar: isStarred ? true : false,
    },
    {
      id: 3,
      name: "Naina K",
      message:
        "Liked your Article - Associations of Pulmonary Function with MRI Brain Volumes: A Coordinated..",
      time: "04:30 PM",
      isRead: true,
      isStar: isStarred ? true : false,
    },
    {
      id: 4,
      name: "Anaya",
      message:
        "Liked your Article - Associations of Pulmonary Function with MRI Brain Volumes: A Coordinated..",
      time: "04:30 PM",
      isRead: true,
      isStar: isStarred ? true : false,
    },
    {
      id: 5,
      name: "Preeja",
      message:
        "Liked your Article - Associations of Pulmonary Function with MRI Brain Volumes: A Coordinated..",
      time: "04:30 PM",
      isRead: true,
      isStar: isStarred ? true : false,
    },
  ];
  return (
    <div className="shadow mt-3 ps-4 pe-4">
      {list.map((elm, index) => {
        const { name, message, time, isRead, isStar } = elm;
        return (
          <div className="row pb-3 pt-3 bb-e3e3" key={index}>
            <div className="col-md-2 fa-center gap-3">
              <div className="fa-center">
                <Checkbox />
                {!hideStar && (
                  <div className="d-flex pointer">
                    <img
                      src={isStar ? icons.starFill : icons.star}
                      alt="star"
                    />
                  </div>
                )}
              </div>

              <div className="text-16-400 color-3d3d">{name}</div>
            </div>
            <div className="col-md-10 fb-center gap-2">
              <div className={isRead ? "text-16-400" : "text-16-500"}>
                {message}
              </div>
              <div className="text-14-400 color-3d3d">{time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
