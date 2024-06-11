import Button from "components/inputs/Button";
import Card from "components/layouts/Card";
import { useNavigate, useParams } from "react-router-dom";
import TabDetails from "./TabDetails";
import CustomTab from "components/layouts/CustomTab/CustomTab";
import { useEffect, useState } from "react";
import QuestionDetailsPopup from "components/layouts/CustomTab/QuestionDetailsPopup";
import { useDispatch } from "react-redux";
import { getDiscussionUsingType, hidePost } from "store/globalSlice";
import { omit } from "lodash";
import { getDataFromLocalStorage } from "utils/helpers/common";
import { objectToFormData } from "utils/helpers/common";
import "./Discussions.scss";

const Discussions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { discussionType } = params;
  const [isQuestion, setIsQuestion] = useState(false);
  const userData = getDataFromLocalStorage();
  const [discussionData, setDiscussionData] = useState({
    limit: 5,
    page: 1,
    total: 0,
    data: [],
    loading: true,
  });

  const handleChangeTab = (tabId) => {
    navigate(`/discussions/${tabId}`);
  };

  const fetchDiscussionsDetails = async (data) => {
    const payload = omit(data, ["data", "loading", "total"]);
    const formData = objectToFormData(payload);
    const response = await dispatch(getDiscussionUsingType(formData));
    setDiscussionData((prev) => {
      return {
        ...prev,
        data: response?.data?.result || [],
        total: response?.data?.total_count || 0,
        loading: false,
      };
    });
  };

  const handelHidePost = async (postID) => {
    const payload = {
      post_id: postID,
      user_id: userData?.id,
      type: "hide",
    };
    const response = await dispatch(hidePost(objectToFormData(payload)));
    if (response?.status === 200) {
      fetchDiscussionsDetails({
        ...discussionData,
        type: discussionType || "feed",
      });
    }
  };

  useEffect(() => {
    setDiscussionData({ ...discussionData, loading: true, page: 1 });
    fetchDiscussionsDetails({
      ...discussionData,
      page: 1,
      type: discussionType || "feed",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discussionType]);

  const tabs = [
    {
      activeText: "feed",
      title: "Feeds",
      onClick: () => {
        handleChangeTab("feed");
      },
    },
    {
      activeText: "discover",
      title: "Questions you may answer",
      onClick: () => {
        handleChangeTab("discover");
      },
    },
    {
      activeText: "follow",
      title: "Followed Discussions",
      onClick: () => {
        handleChangeTab("follow");
      },
    },
    {
      activeText: "save",
      title: "Saved Discussions",
      onClick: () => {
        handleChangeTab("save");
      },
    },
    {
      activeText: "ask",
      title: "Asked Questions",
      onClick: () => {
        handleChangeTab("ask");
      },
    },
    {
      activeText: "answer",
      title: "Answered Questions",
      onClick: () => {
        handleChangeTab("answer");
      },
    },
  ];

  return (
    <div className="container bg-feff" id="discussion-block">
      {isQuestion && (
        <QuestionDetailsPopup
          onHide={() => {
            setIsQuestion(false);
          }}
          handleSuccess={() => {
            fetchDiscussionsDetails({
              ...discussionData,
              type: discussionType || "feed",
            });
            setIsQuestion(false);
          }}
          setDiscussionData={setDiscussionData}
        />
      )}
      <Card className="cps-20 cpe-20 cpt-60">
        <div className="discussion-header d-flex align-items-center justify-content-center flex-column cmb-60">
          <div className="text-32-500 color-3d3d">Discussions</div>
          <span className="text-16-400 color-3d3d width-50 text-center cmt-5 header-text">
            Start a technical discussion & get answers from experts, or raise
            any technical question and get various solutions from expert driven
            community
          </span>
          <div className="cmt-20">
            <Button
              btnText="Start a Discussion"
              btnStyle="SD"
              onClick={() => {
                setIsQuestion(true);
              }}
            />
          </div>
        </div>
        <div className="tabs-block d-flex justify-content-between align-items-center cpb-10 flex-wrap">
          <CustomTab
            active={discussionType || "feed"}
            options={tabs}
            activeTabClassName="active-tab-discussion"
          />
        </div>
      </Card>

      <TabDetails
        params={params}
        discussionData={discussionData}
        handelHidePost={handelHidePost}
        userData={userData}
        setDiscussionData={setDiscussionData}
        fetchDiscussionsDetails={fetchDiscussionsDetails}
      />
    </div>
  );
};

export default Discussions;
