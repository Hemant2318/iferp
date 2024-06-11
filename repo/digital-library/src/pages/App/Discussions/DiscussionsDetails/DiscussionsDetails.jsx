import Button from "components/inputs/Button";
import Card from "components/layouts/Card";
import Profile from "components/layouts/Profile";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "utils/constants";
import DiscussionDetailsRightSide from "./DiscussionDetailsRightSide";
import { useDispatch } from "react-redux";
import { fetchSinglePost } from "store/globalSlice";
import { objectToFormData } from "utils/helpers";
import Loader from "components/layouts/Loader";
import {
  getDataFromLocalStorage,
  messageTime,
  titleCaseString,
  trimLeftSpace,
} from "utils/helpers/common";
import {
  commentPost,
  fetchFollowerOrFollowing,
  fetchRequests,
  saveUnsavePost,
  sendRequests,
  setIsShare,
} from "store/globalSlice";
import { cloneDeep, isEqual } from "lodash";
import "./DiscussionsDetails.scss";

const DiscussionsDetails = () => {
  const commentRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const { qId } = param;
  const userData = getDataFromLocalStorage();
  const [pageLoader, setPageLoader] = useState(false);
  const [questionDetails, setQuestionDetails] = useState({});
  const [sendRequestLoader, setSendRequestLoader] = useState("");
  const [requestList, setRequestList] = useState([]);
  const [saveLoader, setSaveLoader] = useState("");
  const [totalFollowersCount, setTotalFollowersCount] = useState(null);
  const [commentData, setCommentData] = useState({
    comment: "",
    isComment: "",
    isCommentLoading: false,
    oldComment: "",
    deleteID: "",
    postID: "",
    commentID: "",
  });

  const handleGetDetails = async () => {
    const response = await dispatch(
      fetchSinglePost(objectToFormData({ post_id: qId }))
    );
    setQuestionDetails(response?.data);
    setPageLoader(false);
  };

  const handelSendRequest = async (id) => {
    setSendRequestLoader(id);
    const response = await dispatch(
      sendRequests(objectToFormData({ receiver_id: id }))
    );
    if (response?.status === 200) {
      let oldList = cloneDeep(requestList);
      if (oldList?.find((o) => `${o?.id}` === `${id}`)) {
        oldList = oldList?.filter((o) => `${o?.id}` !== `${id}`);
      } else {
        oldList = [...oldList, response?.data];
      }
      setRequestList(oldList);
    }
    setSendRequestLoader("");
  };

  const getRequest = async () => {
    const response = await dispatch(fetchRequests({ type: "following" }));
    setRequestList(response?.data?.result || []);
  };

  const handelSaveUnsave = async (postID) => {
    setSaveLoader(postID);
    const response = await dispatch(
      saveUnsavePost(objectToFormData({ post_id: postID }))
    );
    if (response?.status === 200) {
      let oldQuestionDetails = questionDetails || {};
      if (oldQuestionDetails?.id === postID) {
        oldQuestionDetails = {
          ...oldQuestionDetails,
          is_saved: oldQuestionDetails?.is_saved === 0 ? 1 : 0,
        };
      }
      setQuestionDetails(oldQuestionDetails);
    }
    setSaveLoader("");
  };

  const handelCommentPost = async (postID) => {
    setCommentData({ ...commentData, isCommentLoading: true });
    const response = await dispatch(
      commentPost(
        objectToFormData({ comment: commentData?.comment, post_id: postID })
      )
    );
    if (response?.status === 200) {
      let oldQuestionDetails = questionDetails;
      if (oldQuestionDetails?.id === postID) {
        oldQuestionDetails = {
          ...oldQuestionDetails,
          total_comments: oldQuestionDetails?.total_comments + 1,
          // eslint-disable-next-line no-unsafe-optional-chaining
          comments: [...oldQuestionDetails?.comments, response?.data],
        };
      }
      setQuestionDetails(oldQuestionDetails);

      setTimeout(() => {
        if (commentRef?.current) {
          commentRef?.current?.lastChild?.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);
    }

    setCommentData({
      ...commentData,
      isCommentLoading: false,
      comment: "",
      isComment: "",
      oldComment: "",
    });
  };

  const getFollowing = async () => {
    const response = await dispatch(
      fetchFollowerOrFollowing(objectToFormData({ type: "follower" }))
    );
    setTotalFollowersCount(response?.data?.result_count || []);
  };

  useEffect(() => {
    if (qId) {
      setPageLoader(true);
      handleGetDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qId]);

  useEffect(() => {
    getRequest();
    getFollowing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    id,
    title,
    total_reads,
    total_comments,
    is_saved,
    description,
    comments,
    created_date,
    user_details,
  } = questionDetails || {};
  const { id: userID, name, profile_photo, designation } = user_details || {};
  const isFollow = userData?.id !== userID;
  const isExist = requestList?.find((o) => `${o?.id}` === `${userID}`)
    ? true
    : false;

  const { isComment, comment, isCommentLoading, oldComment } = commentData;

  return (
    <div className="container bg-feff" id="discussions-details-container">
      {pageLoader ? (
        <Card className="d-flex align-items-center justify-content-center cpt-200 cpb-200">
          <Loader size="sm" />
        </Card>
      ) : (
        <div className="row mt-3">
          <div className="col-md-8">
            <Card className="cp-20 cmb-30">
              <div className="d-flex gap-3 mb-3">
                <div
                  className="pointer cmt-4"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  <img src={icons.leftArrow} alt="left" />
                </div>
                <div className="d-flex gap-3 align-items-end flex-wrap cmb-15">
                  <span className="text-20-500 lh-28 color-2d2d pointer">
                    {titleCaseString(title)}
                  </span>
                  <div className="d-flex gap-4 align-items-center flex-wrap">
                    <span className="bg-e314 text-13-400 color-b3df br-4 cp-5">{`${total_comments} Answers`}</span>
                    <span className="text-13-400 color-8080">{`${total_reads} Reads`}</span>
                  </div>
                </div>
              </div>

              <div className="fb-center mb-3">
                <div className="fa-center gap-3">
                  <Profile
                    text={name}
                    size="s-44"
                    isRounded
                    isS3UserURL
                    url={profile_photo}
                  />
                  <div>
                    <div className="text-15-500 lh-28 color-3434">
                      {titleCaseString(name)}
                    </div>

                    {designation && (
                      <div className="text-15-500 lh-28 color-3434">
                        {titleCaseString(designation)}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-13-400 lh-22 color-7070">
                    {messageTime(created_date)}
                  </div>
                </div>
              </div>

              <p
                className="text-16-400 color-4d4d lh-28"
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />

              <div className="d-flex align-items-center justify-content-between flex-wrap">
                <div>
                  <Button
                    btnText="Answer"
                    btnStyle="SD"
                    className="cps-30 cpe-30"
                    onClick={() => {
                      setCommentData({
                        ...commentData,
                        comment: "",
                        isComment: id,
                      });
                    }}
                  />
                </div>
                <div className="d-flex gap-4 text-15-400 color-5555">
                  {isFollow && !isExist && (
                    <span className="d-flex gap-2">
                      <span
                        className="pointer"
                        onClick={() => {
                          handelSendRequest(userID);
                        }}
                      >
                        Follow
                      </span>
                      {userID === sendRequestLoader && <Loader size="sm" />}
                    </span>
                  )}
                  <span
                    className="pointer"
                    onClick={() => {
                      dispatch(setIsShare(true));
                    }}
                  >
                    Share
                  </span>
                  <span
                    className="pointer"
                    onClick={() => {
                      if (!saveLoader) {
                        handelSaveUnsave(id);
                      }
                    }}
                  >
                    {saveLoader === id ? (
                      <Loader size="sm" />
                    ) : is_saved ? (
                      "Unsave"
                    ) : (
                      "Save"
                    )}
                  </span>
                </div>
              </div>
            </Card>

            {id === isComment && (
              <Card className="post-block cps-18 cpe-18 cpt-18 cpb-18 unset-br cmt-20 cmb-20">
                <div className="d-flex justify-content-end cmb-20">
                  <i
                    className="bi bi-x modal-close-button pointer text-20-500"
                    onClick={() => {
                      setCommentData({
                        ...commentData,
                        isComment: "",
                        oldComment: "",
                      });
                    }}
                  />
                </div>
                <div className="post-input-container">
                  <input
                    id="post-input"
                    className="cpe-10"
                    placeholder="Enter answer"
                    value={comment}
                    onKeyUp={(e) => {
                      if (e?.keyCode === 13) {
                        if (oldComment) {
                          // handelUpdateComment();
                        } else {
                          handelCommentPost(id);
                        }
                      }
                      if (e?.keyCode === 27) {
                        setCommentData({
                          ...commentData,
                          comment: "",
                          oldComment: "",
                        });
                      }
                    }}
                    onChange={(e) => {
                      setCommentData({
                        ...commentData,
                        comment: trimLeftSpace(e.target.value),
                      });
                    }}
                  />
                  <div className="create-post-icon-container">
                    <div className="create-post-icon-container">
                      <Button
                        className="h-35"
                        btnStyle="SD"
                        btnText="Submit"
                        disabled={
                          oldComment ? isEqual(oldComment, comment) : !comment
                        }
                        btnLoading={isCommentLoading}
                        onClick={() => {
                          if (oldComment) {
                            // handelUpdateComment();
                          } else {
                            handelCommentPost(id);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <Card className="cmb-30">
              <div className="bb-e3e3 fb-center cp-20">
                <div className="text-16-400 color-4d4d">
                  Replies ({comments?.length})
                </div>
              </div>
              <div className="row cps-20 cpe-20 cpt-20">
                {comments?.length > 0 ? (
                  comments?.map((el, index) => {
                    const {
                      comment,
                      created_at: replayDate,
                      user_details: replay_user_details,
                    } = el;
                    const {
                      /* id: replayUserID, */
                      name: replayName,
                      profile_photo: replayImage,
                    } = replay_user_details || {};
                    const isLast = comments?.length - 1 === index;
                    return (
                      <React.Fragment key={index}>
                        <div className={isLast ? "pb-4" : ""}>
                          <div className="fb-center mb-3">
                            <div className="fa-center gap-3">
                              <Profile
                                text={replayName}
                                size="s-26"
                                isRounded
                                url={replayImage}
                                isS3UserURL
                              />
                              <div className="text-14-500 lh-21 color-3d3d">
                                {titleCaseString(replayName)}
                              </div>
                            </div>
                            <div>
                              <div className="d-flex justify-content-end text-13-400 lh-22 color-7070">
                                {messageTime(replayDate)}
                              </div>
                            </div>
                          </div>
                          <div
                            className="text-15-400 lh-26 color-4d4d mb-3"
                            dangerouslySetInnerHTML={{
                              __html: comment,
                            }}
                          ></div>
                          {/* <div className="d-flex gap-3 text-15-400 color-b8e3">
                            <span className="pointer">Replay</span>
                            <span className="pointer">Share</span>
                          </div> */}
                        </div>

                        {!isLast && <div className="bt-e1e1 pb-4 mt-4" />}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <div className="d-flex justify-content-center align-items-center cpt-100 cpb-100">
                    No Data Found.
                  </div>
                )}
              </div>
            </Card>
          </div>

          <DiscussionDetailsRightSide
            questionDetails={questionDetails}
            totalFollowersCount={totalFollowersCount}
          />
        </div>
      )}
    </div>
  );
};

export default DiscussionsDetails;
