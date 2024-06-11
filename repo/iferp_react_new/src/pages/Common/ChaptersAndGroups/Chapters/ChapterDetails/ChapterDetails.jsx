import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "components/form/Button";
import { icons } from "utils/constants";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import { chapterFollow, setFollowedChapterList } from "store/slices";
import EventAndPeople from "./EventAndPeople";
import ChapterMembers from "./ChapterMembers";
import "./ChapterDetails.scss";

const ChapterDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { chapterId, memberType, type } = params;
  const { followedChapterList } = useSelector((state) => ({
    followedChapterList: state.global.followedChapterList,
  }));
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [title, setTitle] = useState("Chapter");
  const handleRedirect = (optionType) => {
    navigate(
      `/${memberType}/chapters-groups/chapters/${chapterId}/${optionType}`
    );
  };
  const handelChapterFollow = async (isFollowChapter) => {
    setIsFollowLoading(true);
    const response = await dispatch(
      chapterFollow(objectToFormData({ id: chapterId }))
    );
    if (response?.status === 200) {
      let oldList = followedChapterList;
      if (isFollowChapter) {
        oldList = oldList.filter((o) => `${o.id}` !== chapterId);
        dispatch(setFollowedChapterList(oldList));
      } else {
        oldList = [...oldList, response?.data];
        dispatch(setFollowedChapterList(oldList));
      }
    }
    setIsFollowLoading(false);
  };
  const userType = getDataFromLocalStorage("user_type");
  const access = {
    isFollow: userType !== "0" && userType !== "6",
  };
  const isFollowChapter = followedChapterList.find(
    (o) => `${o.id}` === chapterId
  );
  return (
    <div id="chapter-details-container">
      <div className="cpt-12 cpb-12 d-flex align-items-center justify-content-between cmb-12 ">
        <span className="d-flex">
          <img
            src={icons.leftArrow}
            alt="back"
            className="h-21 me-3 pointer"
            onClick={() => {
              navigate(`/${memberType}/chapters-groups/chapters`);
            }}
          />
          <span className="text-20-500 color-black-olive font-poppins">
            {title}
          </span>
        </span>
        {access.isFollow && (
          <span className="d-flex">
            <Button
              isSquare
              text={isFollowChapter ? "Unfollow" : "Follow"}
              onClick={() => {
                handelChapterFollow(isFollowChapter);
              }}
              btnStyle="primary-dark"
              className="h-35 cps-16 cpe-16"
              btnLoading={isFollowLoading}
            />
          </span>
        )}
      </div>
      {userType === "0" ? (
        <Tabs
          defaultActiveKey={type}
          id="uncontrolled-tab-example"
          className="mb-3 gap-4"
        >
          <Tab
            eventKey="event-people"
            title={"Events & People"}
            onEnter={() => {
              handleRedirect("event-people");
            }}
          >
            {type === "event-people" && <EventAndPeople setTitle={setTitle} />}
          </Tab>
          <Tab
            eventKey="chapter-members"
            title={`${title} Members`}
            onEnter={() => {
              handleRedirect("chapter-members");
            }}
          >
            {type === "chapter-members" && <ChapterMembers />}
          </Tab>
        </Tabs>
      ) : (
        <EventAndPeople setTitle={setTitle} />
      )}
    </div>
  );
};
export default ChapterDetails;
