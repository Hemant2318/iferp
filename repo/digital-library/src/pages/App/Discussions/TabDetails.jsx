import React, { useEffect, useRef, useState } from "react";
import Profile from "components/layouts/Profile";
import Card from "components/layouts/Card";
import Button from "components/inputs/Button";
import SimilarSkills from "./SimilarSkills";
import Loader from "components/layouts/Loader";
import { useDispatch } from "react-redux";
import SkillsExpertise from "./SkillsExpertise";
import { ceil, cloneDeep, filter, isEqual } from "lodash";
import {
  convertDescription,
  objectToFormData,
  trimLeftSpace,
  messageTime,
  titleCaseString,
} from "utils/helpers/common";
import { useNavigate } from "react-router-dom";
import {
  commentPost,
  editOrDeleteComment,
  fetchRequests,
  saveUnsavePost,
  sendRequests,
} from "store/globalSlice";
import Share from "components/layouts/Share";
import { icons } from "utils/constants/icons";
import TextEditor from "../../../components/inputs/TextEditor/TextEditor";
import { countWordValidation } from "../../../utils/helpers/common";

const TabDetails = ({
  params,
  discussionData,
  // handelHidePost,
  userData,
  setDiscussionData,
  fetchDiscussionsDetails,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const commentRef = useRef();
  const [sendRequestLoader, setSendRequestLoader] = useState("");
  const [requestList, setRequestList] = useState([]);
  const [saveLoader, setSaveLoader] = useState("");
  const [commentData, setCommentData] = useState({
    comment: "",
    isComment: "",
    isCommentLoading: false,
    oldComment: "",
    deleteID: "",
    postID: "",
    commentID: "",
  });
  const [errorMSG, setErrorMSG] = useState("");
  const [isReset, setIsReset] = useState(false);

  const handelCommentPost = async (postID) => {
    setCommentData({ ...commentData, isCommentLoading: true });
    const response = await dispatch(
      commentPost(
        objectToFormData({ comment: commentData?.comment, post_id: postID })
      )
    );

    if (response?.status === 200) {
      let oldPostList = discussionData?.data;
      oldPostList = oldPostList?.map((obj) => {
        let copy = { ...obj };
        if (obj?.id === postID) {
          copy = {
            ...copy,
            total_comments: obj?.total_comments + 1,
            // eslint-disable-next-line no-unsafe-optional-chaining
            comment: [...obj?.comment, response?.data],
          };
        }
        return copy;
      });
      setDiscussionData((prev) => {
        return {
          ...prev,
          data: oldPostList,
        };
      });
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

  const handelDeleteComment = async (postID, commentID) => {
    setCommentData({ ...commentData, deleteID: commentID, postID: postID });
    const response = await dispatch(
      editOrDeleteComment(
        objectToFormData({ post_id: postID, id: commentID, key: "delete" })
      )
    );
    if (response?.status === 200) {
      let oldPostList = discussionData?.data;
      oldPostList = await oldPostList?.map((obj) => {
        let copy = { ...obj };
        if (obj?.id === postID) {
          const count = obj?.total_comments - 1;
          copy = {
            ...copy,
            total_comments: count <= 0 ? 0 : count,
            comment: obj?.comment?.filter((o) => o?.id !== commentID),
          };
        }
        return copy;
      });
      setDiscussionData((prev) => {
        return {
          ...prev,
          data: oldPostList,
        };
      });
    }

    setCommentData({ ...commentData, deleteID: "", postID: "" });
  };

  const handelUpdateComment = async () => {
    setCommentData({ ...commentData, isCommentLoading: true });
    const response = await dispatch(
      editOrDeleteComment(
        objectToFormData({
          comment: commentData?.comment,
          post_id: commentData?.postID,
          id: commentData?.commentID,
          key: "edit",
        })
      )
    );
    if (response?.status === 200) {
      let oldPostList = discussionData?.data;
      oldPostList = await oldPostList?.map((obj) => {
        let copy = { ...obj };
        if (obj?.id === commentData?.postID) {
          copy = {
            ...copy,
            comment: obj?.comment?.map((cObj) => {
              let cCopy = { ...cObj };
              if (cObj?.id === commentData?.commentID) {
                cCopy = {
                  ...cCopy,
                  comment: commentData?.comment,
                };
              }
              return cCopy;
            }),
          };
        }
        return copy;
      });
      setDiscussionData((prev) => {
        return {
          ...prev,
          data: oldPostList,
        };
      });
    }

    setCommentData({
      ...commentData,
      commentID: "",
      postID: "",
      oldComment: "",
      comment: "",
      isCommentLoading: false,
    });
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

  const handelSaveUnsave = async (postID) => {
    setSaveLoader(postID);
    const response = await dispatch(
      saveUnsavePost(objectToFormData({ post_id: postID }))
    );
    if (response?.status === 200) {
      let oldPostList = discussionData?.data || [];
      oldPostList = oldPostList?.map((obj) => {
        let copy = { ...obj };
        if (obj?.id === postID) {
          copy = {
            ...copy,
            is_saved: copy?.is_saved === 0 ? 1 : 0,
          };
        }
        return copy;
      });
      setDiscussionData((prev) => {
        return {
          ...prev,
          data: oldPostList || [],
        };
      });
    }
    setSaveLoader("");
  };

  const getRequest = async () => {
    const response = await dispatch(fetchRequests({ type: "following" }));
    setRequestList(response?.data?.result || []);
  };

  useEffect(() => {
    setCommentData({
      ...commentData,
      comment: "",
      oldComment: "",
      isComment: "",
      commentID: "",
      postID: "",
      isCommentLoading: false,
    });
    getRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPageNumber = (page) => {
    const newData = {
      ...discussionData,
      page: page,
      type: params?.discussionType,
      loading: true,
    };
    setDiscussionData(newData);
    fetchDiscussionsDetails(newData);
  };

  const activePage = discussionData?.page;

  const handlePagination = (type, data) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    let newPage = data?.activePage;
    switch (type) {
      case "next":
        newPage = data?.activePage + 1;
        break;
      case "prev":
        newPage = data?.activePage - 1;
        break;
      case "page":
        newPage = data?.page;
        break;
      default:
        break;
    }
    getPageNumber(newPage);
  };
  const totalPage = ceil(discussionData?.total / discussionData?.limit);
  let page1 = activePage;
  let page2 = activePage + 1;
  let page3 = activePage + 2;
  if (activePage >= totalPage - 2) {
    page1 = totalPage - 2 <= 0 ? 1 : totalPage - 2;
    page2 = totalPage - 1 <= 1 ? 2 : totalPage - 1;
    page3 = totalPage - 0 <= 2 ? 3 : totalPage - 0;
  }

  // const handlePageClick = (e) => {
  //   window.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: "smooth",
  //   });
  //   const pageNumber = e?.selected + 1;
  //   const newData = {
  //     ...discussionData,
  //     page: pageNumber,
  //     type: params?.discussionType,
  //     // loading: true,
  //   };
  //   setDiscussionData(newData);
  //   fetchDiscussionsDetails(newData);
  // };
  const { comment, isComment, isCommentLoading, postID, deleteID, oldComment } =
    commentData;

  let newDiscussionsList = discussionData?.data;
  const finalDiscussionList =
    newDiscussionsList?.length > 0
      ? filter(newDiscussionsList, { is_hidden: 0 })
      : [];

  const isAskAnswer = ["ask", "answer"].includes(params?.discussionType);
  return (
    <div id="tab-details-container">
      <div className="row mt-3">
        <div className="col-md-8">
          {discussionData?.loading ? (
            <Card className="d-flex align-items-center justify-content-center h-100">
              <Loader size="sm" />
            </Card>
          ) : finalDiscussionList?.length > 0 ? (
            <div className="">
              <div className="row cps-10 cpe-10">
                {finalDiscussionList?.map((el, index) => {
                  const {
                    id,
                    title,
                    description,
                    total_comments,
                    total_reads,
                    created_date,
                    is_saved,
                    comment: comments,
                    get_user_details,
                  } = el;

                  const {
                    id: userID,
                    first_name,
                    last_name,
                    profile_photo_path,
                    designation,
                    institution_name,
                    total_followers,
                  } = get_user_details || {};

                  /* const isHidePost = userData?.id !== userID; */
                  const isFollow = userData?.id !== userID;
                  const isExist = requestList?.find(
                    (o) => `${o?.id}` === `${userID}`
                  )
                    ? true
                    : false;
                  const hURL = `${window.location.origin}/discussions/${params?.discussionType}/discussion-details/${id}`;
                  const newDescription = convertDescription(description, hURL);

                  return (
                    <React.Fragment key={index}>
                      <Card className={id !== isComment ? "cmb-20" : ""}>
                        <div className={`cp-20`}>
                          <div className="fb-center cmb-15">
                            <div className="fa-center gap-3">
                              <Profile
                                text={`${first_name} ${last_name}`}
                                size="s-44"
                                isRounded
                                url={profile_photo_path}
                                isS3UserURL
                              />
                              <div>
                                <div className="text-15-500 lh-28 color-3434">
                                  {titleCaseString(
                                    `${first_name} ${last_name}`
                                  )}
                                </div>

                                <div className="text-14-400 lh-22 color-6666">
                                  {`${titleCaseString(designation)} ${
                                    designation && institution_name ? "," : ""
                                  } ${titleCaseString(institution_name)}`}
                                </div>
                              </div>
                            </div>
                            <div>
                              {/* {!isAskAnswer && (
                                <div className="d-flex justify-content-end">
                                  <DropdownOption
                                    icons={
                                      <img
                                        src={icons.moreHorizontal}
                                        alt="more"
                                      />
                                    }
                                  >
                                    {isHidePost && (
                                      <div
                                        className="text-14-400 pointer color-black-olive text-center"
                                        onClick={() => {
                                          handelHidePost(id);
                                        }}
                                      >
                                        Hide This Post
                                      </div>
                                    )}
                                  </DropdownOption>
                                </div>
                              )} */}
                              <div className="text-13-400 lh-22 color-7070">
                                {messageTime(created_date)}
                              </div>
                            </div>
                          </div>

                          <div className="d-flex gap-3 align-items-end flex-wrap cmb-15">
                            <span
                              className="text-20-500 lh-28 color-2d2d pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  ["discover", "feed"].includes(
                                    params?.discussionType
                                  )
                                ) {
                                  navigate(
                                    `/discussions/${params?.discussionType}/discussion-details/${id}`
                                  );
                                }
                              }}
                            >
                              {titleCaseString(title)}
                            </span>
                            <div className="d-flex gap-4 align-items-center flex-wrap">
                              <span className="bg-e314 text-13-400 color-b3df br-4 cp-5">{`${total_comments} Answers`}</span>
                              <span className="text-13-400 color-8080">{`${total_reads} Reads`}</span>
                            </div>
                          </div>
                          <p
                            className="text-16-400 color-4d4d lh-28"
                            style={{ fontSize: "16px", fontWeight: "400" }}
                            dangerouslySetInnerHTML={{
                              __html: newDescription,
                            }}
                          />

                          <div className="d-flex align-items-center justify-content-between flex-wrap">
                            <div className="cmb-20">
                              <Button
                                btnText={isAskAnswer ? "View" : "Answer"}
                                btnStyle="SO"
                                className="cps-20 cpe-20 h-35"
                                onClick={() => {
                                  if (isAskAnswer) {
                                    navigate(
                                      `/discussions/${params?.discussionType}/discussion-details/${id}`
                                    );
                                  } else {
                                    setCommentData({
                                      ...commentData,
                                      comment: "",
                                      isComment: id,
                                    });
                                  }
                                }}
                              />
                            </div>
                            {isAskAnswer ? (
                              <div className="d-flex gap-4 text-15-400 color-5555">
                                <span className="pointer">
                                  Followers ({total_followers})
                                </span>
                                <span className="pointer">
                                  Answers ({total_comments})
                                </span>
                                <span className="pointer">
                                  Reads ({total_reads})
                                </span>
                              </div>
                            ) : (
                              <div className="d-flex gap-4 text-15-400 color-5555 cmb-20">
                                {(isFollow &&
                                params?.discussionType === "follow"
                                  ? isExist
                                  : !isExist) && (
                                  <span className="d-flex gap-2">
                                    <span
                                      className="pointer"
                                      onClick={() => {
                                        handelSendRequest(userID);
                                      }}
                                    >
                                      {params?.discussionType === "follow"
                                        ? "Unfollow"
                                        : "Follow"}
                                    </span>
                                    {userID === sendRequestLoader && (
                                      <Loader size="sm" />
                                    )}
                                  </span>
                                )}
                                <span className="pointer">
                                  <Share
                                    isHideIcon
                                    type="POST"
                                    url={`/member/global-post/${id}`}
                                  />
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
                            )}
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
                          {comments && (
                            <div
                              className="comment-scroll iferp-scroll"
                              id="post-comment-list"
                              ref={commentRef}
                            >
                              {comments?.map((cElem, cIndex) => {
                                const { comment } = cElem;
                                const {
                                  first_name: cFirst_name,
                                  last_name: cLast_name,
                                  id: cUserId,
                                  profile_photo_path: cProfilePhoto,
                                } = cElem?.get_user_details || {};
                                const isDeleteComment =
                                  postID === id && cElem?.id === deleteID;
                                const isEdit = userData?.id === cUserId;
                                const isDelete = userData?.id === cUserId;
                                const cName = `${cFirst_name} ${cLast_name}`;
                                return (
                                  <div
                                    key={cIndex}
                                    className="shadow-sm p-3 cmb-10 bg-white"
                                  >
                                    <div className="d-flex align-items-center">
                                      <Profile
                                        isRounded
                                        isS3UserURL
                                        text={cName}
                                        size="s-34"
                                        url={cProfilePhoto}
                                      />
                                      <div className="ms-2 text-18-400">
                                        {cName && titleCaseString(cName)}
                                      </div>
                                      <div className="flex-grow-1 d-flex justify-content-end text-18-400 color-black-olive gap-3">
                                        {isEdit && (
                                          <div
                                            className="d-flex pointer"
                                            onClick={() => {
                                              setCommentData({
                                                ...commentData,
                                                oldComment: comment,
                                                comment: comment,
                                                commentID: cElem.id,
                                                postID: id,
                                              });
                                              setIsReset(true);
                                            }}
                                          >
                                            <i className="bi bi-pencil-square" />
                                          </div>
                                        )}
                                        {isDelete && (
                                          <div
                                            className="d-flex pointer"
                                            onClick={() => {
                                              handelDeleteComment(id, cElem.id);
                                            }}
                                          >
                                            {isDeleteComment ? (
                                              <Loader size="sm" />
                                            ) : (
                                              <i className="bi bi-trash" />
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div
                                      className="cms-40"
                                      dangerouslySetInnerHTML={{
                                        __html: comment,
                                      }}
                                    ></div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <div className="post-input-container">
                            <TextEditor
                              placeholder="Enter answer"
                              onChange={(e) => {
                                setErrorMSG(
                                  countWordValidation(e.target.value, 500)
                                );
                                setCommentData({
                                  ...commentData,
                                  comment: trimLeftSpace(e.target.value),
                                });
                              }}
                              value={comment}
                              error={errorMSG}
                              setIsReset={() => {
                                setIsReset(false);
                              }}
                              isReset={isReset}
                            />
                          </div>
                          <div className="d-flex justify-content-end cmt-20">
                            <Button
                              className="h-35"
                              btnStyle="SD"
                              btnText="Submit"
                              disabled={
                                errorMSG ||
                                (oldComment
                                  ? isEqual(oldComment, comment)
                                  : !comment)
                              }
                              btnLoading={isCommentLoading}
                              onClick={() => {
                                if (oldComment) {
                                  handelUpdateComment();
                                } else {
                                  handelCommentPost(id);
                                }
                              }}
                            />
                          </div>
                        </Card>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ) : (
            <Card className="d-flex align-items-center justify-content-center h-100">
              No Data Found.
            </Card>
          )}

          {!discussionData?.loading &&
            finalDiscussionList?.length > 0 &&
            totalPage > 1 && (
              <Card className="cmt-50 cp-20">
                <div className="f-center footer-block">
                  <div className="f-center gap-2 flex-nowrap">
                    <div
                      className={`icon-btn ps-2 pe-3 ${
                        activePage !== 1 ? "active-icon-btn" : "opacity-75"
                      }`}
                      onClick={() => {
                        if (activePage !== 1) {
                          handlePagination("prev", {
                            activePage: activePage,
                          });
                        }
                      }}
                    >
                      <span className="d-flex">
                        <img
                          src={activePage !== 1 ? icons.lp : icons.lp}
                          className="fit-image"
                        />
                      </span>
                      <span>Prev</span>
                    </div>
                    <div
                      className={`page-btn ${
                        activePage === page1 ? "active-page-btn" : ""
                      }`}
                      onClick={() => {
                        handlePagination("page", { page: page1 });
                      }}
                    >
                      {page1}
                    </div>
                    <div
                      className={`page-btn ${
                        activePage === page2 ? "active-page-btn" : ""
                      }`}
                      onClick={() => {
                        handlePagination("page", { page: page2 });
                      }}
                    >
                      {page2}
                    </div>
                    <div
                      className={`page-btn ${
                        activePage === page3 ? "active-page-btn" : ""
                      } ${totalPage > 2 ? "" : "d-none"}`}
                      onClick={() => {
                        handlePagination("page", { page: page3 });
                      }}
                    >
                      {page3}
                    </div>
                    <div
                      className={`icon-btn ps-3 pe-2 ${
                        activePage !== totalPage
                          ? "active-icon-btn"
                          : "opacity-75"
                      }`}
                      onClick={() => {
                        if (activePage !== totalPage) {
                          handlePagination("next", {
                            activePage: activePage,
                          });
                        }
                      }}
                    >
                      <span>Next</span>
                      <span className="d-flex">
                        <img
                          src={activePage !== totalPage ? icons.rp : icons.rp}
                          className="fit-image"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
        </div>
        {/* <ReactPagination
                onPageChange={handlePageClick}
                pageRangeDisplayed={totalPage}
                pageCount={totalPage}
              /> */}
        <div className="col-md-4">
          <SkillsExpertise />
          <SimilarSkills />
        </div>
      </div>
    </div>
  );
};

export default TabDetails;
