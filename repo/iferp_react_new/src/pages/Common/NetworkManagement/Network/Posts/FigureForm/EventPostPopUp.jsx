import Modal from "react-bootstrap/Modal";
import {
  convertDescription,
  downloadFile,
  getDataFromLocalStorage,
  messageTime,
  objectToFormData,
  titleCaseString,
  trimLeftSpace,
} from "utils/helpers";
import React, { createRef, useEffect, useRef, useState } from "react";
import Card from "components/Layout/Card";
import Profile from "components/Layout/Profile";
import {
  commentPost,
  editOrDeleteComment,
  fetchPost,
  fetchRequests,
  fetchSinglePost,
  hidePost,
  readPost,
  reminderPostVerify,
  saveUnsavePost,
  sendRequests,
  setPostID,
  setRProfileID,
  updateCoAuthor,
  usefulUnusefulPost,
} from "store/slices";
import { useDispatch } from "react-redux";
import DropdownButton from "components/form/DropdownButton";
import Loader from "components/Layout/Loader";
import moment from "moment";
import { Dropdown } from "react-bootstrap";
import FiguresContainer from "components/Layout/FiguresContainer";
import { upperCase } from "lodash";
import ShareButton from "components/Layout/ShareButton";
import Button from "components/form/Button";
import { cloneDeep } from "lodash";
import { isEqual } from "lodash";
import { membershipType } from "utils/constants";
import { filter } from "lodash";
import "./EventPostPopUp.scss";

function EventPostPopUp(props) {
  const {
    userEventPostList,
    setUserEventPostList,
    handleSuccess,
    isPostLoader,
  } = props;
  const dispatch = useDispatch();
  const userData = getDataFromLocalStorage();
  const { id: loginUserID } = userData;
  // const findType = membershipType.find((o) => o.id === userType);
  const [playIndex, setPlayIndex] = useState("");
  const [elRefs, setElRefs] = useState([]);
  const [saveLoader, setSaveLoader] = useState("");
  const commentRef = useRef();
  const [sendRequestLoader, setSendRequestLoader] = useState("");
  const [ownerLoader, setOwnerLoader] = useState("");
  const [commentData, setCommentData] = useState({
    comment: "",
    isComment: "",
    isCommentLoading: false,
    oldComment: "",
    deleteID: "",
    postID: "",
    commentID: "",
  });
  const [requestList, setRequestList] = useState([]);
  const [isReminder, setIsReminder] = useState(false);
  const type = "discover-posts";

  const handleReminder = async (postID) => {
    setIsReminder(true);
    await dispatch(reminderPostVerify(objectToFormData({ post_id: postID })));
    setIsReminder(false);
  };
  const handelSaveUnsave = async (postID) => {
    setSaveLoader(postID);
    const response = await dispatch(
      saveUnsavePost(objectToFormData({ post_id: postID }))
    );
    if (response?.status === 200) {
      let oldPostList = userEventPostList;
      oldPostList = oldPostList.map((obj) => {
        let copy = { ...obj };
        if (obj.id === postID) {
          copy = {
            ...copy,
            is_saved: copy.is_saved === 0 ? 1 : 0,
          };
        }
        return copy;
      });
      setUserEventPostList(oldPostList);
      handleSuccess();
    }
    setSaveLoader("");
  };
  const handelUsefulUnusefulPost = async (postID) => {
    const response = await dispatch(
      usefulUnusefulPost(objectToFormData({ post_id: postID }))
    );
    if (response?.status === 200) {
      let oldPostList = userEventPostList;
      oldPostList = oldPostList?.map((obj) => {
        let copy = { ...obj };
        if (obj.id === postID) {
          const likesStatus = copy.is_liked === 0 ? 1 : 0;
          let count = copy.total_likes;
          count = likesStatus === 0 ? count - 1 : count + 1;
          copy = {
            ...copy,
            is_liked: likesStatus,
            total_likes: count <= 0 ? 0 : count,
          };
        }
        return copy;
      });
      setUserEventPostList(oldPostList);
      handleSuccess();
    }
  };
  const handelCommentPost = async (postID) => {
    setCommentData({ ...commentData, isCommentLoading: true });
    const response = await dispatch(
      commentPost(
        objectToFormData({ comment: commentData?.comment, post_id: postID })
      )
    );
    if (response?.status === 200) {
      let oldPostList = userEventPostList;
      oldPostList = oldPostList.map((obj) => {
        let copy = { ...obj };
        if (obj.id === postID) {
          copy = {
            ...copy,
            total_comments: obj.total_comments + 1,
            comments: [...obj?.comments, response?.data],
          };
        }
        return copy;
      });
      setUserEventPostList(oldPostList);
      handleSuccess();
      setTimeout(() => {
        if (commentRef?.current) {
          commentRef.current.lastChild?.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
    setCommentData({ ...commentData, isCommentLoading: false, comment: "" });
  };
  const handelDeleteComment = async (postID, commentID) => {
    setCommentData({ ...commentData, deleteID: commentID, postID: postID });
    const response = await dispatch(
      editOrDeleteComment(
        objectToFormData({ post_id: postID, id: commentID, key: "delete" })
      )
    );
    if (response?.status === 200) {
      let oldPostList = userEventPostList;
      oldPostList = await oldPostList.map((obj) => {
        let copy = { ...obj };
        if (obj.id === postID) {
          const count = obj.total_comments - 1;
          copy = {
            ...copy,
            total_comments: count <= 0 ? 0 : count,
            comments: obj.comments.filter((o) => o.id !== commentID),
          };
        }
        return copy;
      });
      setUserEventPostList(oldPostList);
      handleSuccess();
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
      let oldPostList = userEventPostList;
      oldPostList = await oldPostList.map((obj) => {
        let copy = { ...obj };
        if (obj.id === commentData.postID) {
          copy = {
            ...copy,
            comments: obj.comments.map((cObj) => {
              let cCopy = { ...cObj };
              if (cObj.id === commentData.commentID) {
                cCopy = {
                  ...cCopy,
                  comment: commentData.comment,
                };
              }
              return cCopy;
            }),
          };
        }
        return copy;
      });
      setUserEventPostList(oldPostList);
      handleSuccess();
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
  const handelHidePost = async (postID) => {
    const payload = {
      post_id: postID,
      user_id: loginUserID,
      type: "hide",
    };
    const response = await dispatch(hidePost(objectToFormData(payload)));
    if (response?.status === 200) {
      setUserEventPostList(response?.data);
      handleSuccess();
      getPost();
    }
  };
  const getPost = async () => {
    let postAPIType = {
      "discover-posts": "discover",
      "my-posts": "my",
      "saved-posts": "saved",
      "our-institutional-posts": "our-institutional-posts",
      "pending-ownership": "pending-ownership",
    };
    const newType = postAPIType[type] || "";
    const res = await dispatch(fetchPost(newType));
    let newData = [];
    res?.data?.forEach((_index) => {
      newData.push(createRef());
    });
    setElRefs(newData);
    // if (setIsPostLoading) {
    //   setIsPostLoading(false);
    // }
  };
  const getRequest = async () => {
    const response = await dispatch(fetchRequests({ type: "following" }));
    setRequestList(response?.data?.result || []);
  };
  const handelSendRequest = async (id) => {
    setSendRequestLoader(id);
    const response = await dispatch(
      sendRequests(objectToFormData({ receiver_id: id }))
    );
    if (response?.status === 200) {
      let oldList = cloneDeep(requestList);
      if (oldList.find((o) => `${o.id}` === `${id}`)) {
        oldList = oldList.filter((o) => `${o.id}` !== `${id}`);
      } else {
        oldList = [...oldList, response?.data];
      }
      setRequestList(oldList);
    }
    setSendRequestLoader("");
  };
  const handelOwenership = async (obj) => {
    setOwnerLoader(`${obj?.post_id}-${obj.status}`);
    const queryParams = new URLSearchParams(obj).toString();
    const response = await dispatch(updateCoAuthor(queryParams));
    if (response?.status === 200) {
      getPost();
    }
    setOwnerLoader("");
  };
  useEffect(() => {
    getRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // useEffect(() => {
  //   setCommentData({
  //     ...commentData,
  //     comment: "",
  //     oldComment: "",
  //     isComment: "",
  //     commentID: "",
  //     postID: "",
  //     isCommentLoading: false,
  //   });
  //   // if (setIsPostLoading) {
  //   //   setIsPostLoading(true);
  //   // }
  //   getPost();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [type]);
  useEffect(() => {
    if (commentData?.isComment) {
      setTimeout(() => {
        if (commentRef?.current) {
          commentRef.current.lastChild?.scrollIntoView();
        }
      }, 100);
    }
  }, [commentData?.isComment]);
  let loginUserType = "";
  if (getDataFromLocalStorage("id")) {
    loginUserType =
      membershipType.find((o) => o.id === getDataFromLocalStorage("user_type"))
        ?.type || "";
  }
  const { comment, isComment, isCommentLoading, postID, deleteID, oldComment } =
    commentData;
  let displayList =
    userEventPostList && userEventPostList.length > 0
      ? filter(userEventPostList, { is_hidden: 0 })
      : [];
  return (
    <div id="event-post-popup">
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <p>Presented Post</p>
        </Modal.Header>
        <Modal.Body>
          {isPostLoader ? (
            <Card className="pt-5 pb-5">
              <Loader size="md" />
            </Card>
          ) : (
            <div id="event-post-list-container-page">
              {displayList?.length > 0 &&
                displayList?.map((elem, index) => {
                  const {
                    id,
                    user_details,
                    title,
                    post,
                    nPost,
                    created_date,
                    is_liked,
                    is_saved,
                    total_likes,
                    total_comments,
                    comments,
                    post_as,
                    category_name,
                    sub_category_name,
                    description,
                    additional_details,
                    co_authors,
                    author_details,
                    figures,
                    presentation_link,
                    nPresentationLink,
                    nThumbnail,
                  } = elem;

                  /* let hURL = `${window.location.origin}/${findType?.type}/${moduleType}/network/post/post-details/${id}`; */

                  let hURL = ``;
                  let about_article = "";
                  if (additional_details?.about_article) {
                    let text = additional_details?.about_article || "";
                    text = convertDescription(text, hURL);
                    about_article = text;
                  }
                  const {
                    id: userID,
                    name,
                    state,
                    country,
                    profile_photo,
                    user_type,
                  } = user_details;
                  // const authorName = author_details?.name || name || "";
                  let authorName = "";
                  if (author_details?.user_id === userID) {
                    authorName = name;
                  } else {
                    authorName =
                      author_details?.is_ownership === "1"
                        ? author_details?.name
                        : "";
                  }

                  const authorProfie =
                    author_details?.profile_photo || profile_photo || "";

                  const isReasearchProfile = ["2", "5"].includes(user_type);
                  const isAuthorReasearchProfile = ["2", "5"].includes(
                    author_details?.user_type
                  );

                  let isAnyCoAuthor = co_authors?.some((o) => o.is_ownership);

                  let authorVerify =
                    author_details?.user_type !== "0" &&
                    author_details?.user_id === loginUserID &&
                    author_details?.is_ownership === "0"
                      ? author_details
                      : null;
                  let coAuthorVerify = co_authors?.find(
                    (o) => o.id === loginUserID && !o.is_ownership
                  );

                  const isEdit = loginUserID === userID;
                  const isDelete = loginUserID === userID;
                  const isHidePost = loginUserID !== userID;
                  const isFollow = loginUserID !== userID;
                  const isExist = requestList?.find(
                    (o) => `${o.id}` === `${userID}`
                  )
                    ? true
                    : false;
                  const postType = post ? post?.split(".")?.pop() : "";
                  const fileName = post ? post?.split("/")?.pop() : "";
                  const pendingVerify = [];
                  if (
                    author_details?.is_ownership === "0" &&
                    author_details?.user_id
                  ) {
                    pendingVerify.push(author_details?.user_id);
                  }
                  co_authors?.forEach((cElm) => {
                    if (!cElm?.is_ownership) {
                      pendingVerify.push(cElm.id);
                    }
                  });
                  return (
                    <React.Fragment key={index}>
                      <Card className="post-block unset-br">
                        <div className="top-block">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center left-block">
                              <Profile
                                isRounded
                                isS3UserURL
                                text={name}
                                size="s-48"
                                url={profile_photo}
                              />
                              <div className="user-details-block ms-3">
                                <div
                                  className={`text-15-500 ${
                                    isReasearchProfile
                                      ? "color-title-navy pointer hover-effect"
                                      : "color-raisin-black"
                                  }`}
                                  onClick={() => {
                                    if (isReasearchProfile) {
                                      dispatch(setRProfileID(userID));
                                    }
                                  }}
                                >
                                  {name}
                                </div>
                                <div className="text-14-400 color-raisin-black  ">
                                  {`${(state || "") && (country || "")}`}
                                </div>
                              </div>
                            </div>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <div className="d-flex justify-content-end">
                                <DropdownButton
                                  parentClass="post-options"
                                  className="d-flex justify-content-end"
                                  id="iconType"
                                  icon={
                                    <i className="bi bi-three-dots text-18-400 color-gray pointer" />
                                  }
                                >
                                  <div className="post-options-list">
                                    {isEdit && (
                                      <div
                                        className="text-14-400 pointer color-black-olive"
                                        // onClick={() => {
                                        //   if (elem?.category_id === "8") {
                                        //     setQEditData(elem);
                                        //   } else {
                                        //     setEditData(elem);
                                        //   }
                                        // }}
                                      >
                                        Edit
                                      </div>
                                    )}
                                    {isDelete && (
                                      <div
                                        className="text-14-400 pointer color-black-olive"
                                        // onClick={() => {
                                        //   setPostId(id);
                                        // }}
                                      >
                                        Delete
                                      </div>
                                    )}
                                    {isFollow && !isExist && (
                                      <div
                                        className="text-14-400 pointer color-black-olive d-flex align-items-center justify-content-between gap-3"
                                        onClick={() => {
                                          handelSendRequest(userID);
                                        }}
                                      >
                                        <div className="p-0">Follow</div>
                                        {userID === sendRequestLoader && (
                                          <Loader size="sm" />
                                        )}
                                      </div>
                                    )}
                                    {isHidePost && (
                                      <div
                                        className="text-14-400 pointer color-black-olive"
                                        onClick={() => {
                                          handelHidePost(id);
                                        }}
                                      >
                                        Hide This Post
                                      </div>
                                    )}
                                  </div>
                                </DropdownButton>
                              </div>
                              <div className="text-14-400   color-davys-gray">
                                {messageTime(created_date)}
                              </div>
                            </div>
                          </div>
                          <div
                            className="post-t-block text-16-400-24 color-raisin-black mt-3 mb-3 pointer w-fit hover-effect"
                            onClick={async () => {
                              dispatch(
                                readPost(
                                  objectToFormData({
                                    post_id: id,
                                    user_id: loginUserID,
                                  })
                                )
                              );
                              localStorage.prevRoute = window.location.pathname;
                              window.open(
                                `/${loginUserType}/network-management/network/post/post-details/${id}`,
                                "_blank"
                              );
                              await dispatch(
                                fetchSinglePost(
                                  objectToFormData({ post_id: id })
                                )
                              );
                              // props?.onHide();
                            }}
                          >
                            {title}
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                            <div className="d-flex align-items-center flex-wrap gap-4">
                              <Button
                                text={sub_category_name || category_name}
                                btnStyle="primary-light"
                                className="h-auto text-14-400"
                                isSquare
                              />
                              {post_as === 1 && (
                                <Button
                                  text="Private"
                                  btnStyle="primary-outline"
                                  className="h-35"
                                  isSquare
                                />
                              )}
                              <div className="text-13-400 text-nowrap">
                                {moment(
                                  created_date,
                                  "DD-MM-YYYY hh:mm A"
                                ).format("MMMM YYYY")}
                              </div>
                            </div>
                            <div
                              className={
                                authorVerify || coAuthorVerify ? "" : "d-none"
                              }
                            >
                              <Dropdown>
                                <Dropdown.Toggle id="verify-dropdown-basic">
                                  Verify Ownership
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="pt-0 pb-0 shadow">
                                  <Dropdown.Item
                                    href=""
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handelOwenership({
                                        post_id: id,
                                        user_id:
                                          authorVerify?.user_id ||
                                          coAuthorVerify?.id,
                                        status: 1,
                                        type: authorVerify ? 0 : 1,
                                      });
                                    }}
                                    className="text-13-400 pt-2 pb-2 border-bottom d-flex align-items-center justify-content-between gap-2"
                                  >
                                    <span>Accept</span>
                                    {ownerLoader === `${id}-1` && (
                                      <span>
                                        <Loader size="sm" />
                                      </span>
                                    )}
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    href=""
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handelOwenership({
                                        post_id: id,
                                        status: 2,
                                        user_id:
                                          authorVerify?.user_id ||
                                          coAuthorVerify?.id,
                                        type: authorVerify ? 0 : 1,
                                      });
                                    }}
                                    className="text-13-400 pt-2 pb-2 d-flex align-items-center justify-content-between gap-2"
                                  >
                                    <span>Reject</span>
                                    {ownerLoader === `${id}-2` && (
                                      <span>
                                        <Loader size="sm" />
                                      </span>
                                    )}
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                            {isEdit && pendingVerify.length > 0 && (
                              <Button
                                isSquare
                                text="Remind to Your Authors"
                                btnStyle="primary-dark"
                                className="h-auto text-14-400"
                                btnLoading={isReminder}
                                onClick={() => {
                                  handleReminder(id);
                                }}
                              />
                            )}
                          </div>
                          {authorName && (
                            <>
                              <div className="text-14-500 color-raisin-black mb-1">
                                Author
                              </div>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <span>
                                  <Profile
                                    isRounded
                                    isS3UserURL
                                    text={authorName}
                                    size="s-18"
                                    url={authorProfie}
                                  />
                                </span>
                                <span
                                  className={`text-13-400 ${
                                    isAuthorReasearchProfile
                                      ? "color-new-car pointer hover-effect"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    if (isAuthorReasearchProfile) {
                                      dispatch(
                                        setRProfileID(author_details?.user_id)
                                      );
                                    }
                                  }}
                                >
                                  {authorName}
                                </span>
                              </div>
                            </>
                          )}
                          {co_authors.length > 0 && isAnyCoAuthor && (
                            <>
                              <div className="text-14-500 color-raisin-black mb-1 mt-1">
                                Co Author
                              </div>
                              <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
                                {co_authors?.map((el, index) => {
                                  const isReasearchProfile = [
                                    "2",
                                    "5",
                                  ].includes(el?.user_type);
                                  return (
                                    <div
                                      key={index}
                                      className={`d-flex align-items-center gap-3 ${
                                        el.is_ownership ? "" : "d-none"
                                      }`}
                                    >
                                      <span className="d-flex align-items-center gap-2">
                                        <span>
                                          <Profile
                                            size="s-18"
                                            text={el?.name}
                                            url={el?.profile_photo}
                                            isRounded
                                            isS3UserURL
                                          />
                                        </span>
                                        <span
                                          className={`text-13-400 ${
                                            isReasearchProfile
                                              ? "color-new-car pointer hover-effect"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            if (isReasearchProfile) {
                                              dispatch(setRProfileID(el?.id));
                                            }
                                          }}
                                        >
                                          {titleCaseString(el?.name)}
                                        </span>
                                      </span>
                                      {/* {co_authors.length > 1 &&
                                  co_authors.length - 1 !== index && (
                                    <span className="bg-gray rounded-circle p-1" />
                                  )} */}
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          )}
                          {(description || about_article) && (
                            <div className="text-14-500 color-raisin-black mb-1">
                              Abstract/Description:
                            </div>
                          )}
                          {description && (
                            <div
                              className="mb-2 text-14-400 color-raisin-black two-line-elipses"
                              dangerouslySetInnerHTML={{
                                __html: description,
                              }}
                            />
                          )}

                          {about_article && (
                            <div
                              className="mb-2 text-14-400 color-raisin-black"
                              dangerouslySetInnerHTML={{
                                __html: about_article,
                              }}
                            />
                          )}

                          {figures?.length > 0 && (
                            <>
                              <div className="text-14-500 color-raisin-black mb-1">
                                Figures:
                              </div>
                              <FiguresContainer
                                data={figures}
                                loadMore={() => {
                                  localStorage.prevRoute =
                                    window.location.pathname;
                                  // navigate(
                                  //   `/${findType?.type}/${moduleType}/network/post/post-details/${id}`
                                  // );
                                }}
                              />
                            </>
                          )}
                          {presentation_link && (
                            <div className="mb-2">
                              <div className="text-14-500 color-raisin-black mb-1">
                                Presentation:
                              </div>

                              {/* <Player
                          ref={elRefs[index]}
                          playsInline
                          src={nPresentationLink}
                          poster={nThumbnail || ""}
                          onPlay={() => {
                            if (lastID !== "") {
                              elRefs[lastID]?.current?.video?.handlePause();
                            }
                            setLastID(index);
                          }}
                        /> */}
                              <div className="position-relative">
                                <video
                                  controls={playIndex === index}
                                  ref={elRefs[index]}
                                  width="100%"
                                  poster={nThumbnail || ""}
                                  preload="none"
                                  style={{
                                    background: `transparent url(${nThumbnail}) 50% 50% / cover no-repeat`,
                                    marginTop: "20px",
                                  }}
                                >
                                  <source
                                    src={nPresentationLink}
                                    type="video/mp4"
                                  />
                                </video>
                                {playIndex !== index && (
                                  <div
                                    className="btn-vd-play"
                                    onClick={() => {
                                      if (playIndex !== "") {
                                        elRefs[playIndex]?.current?.pause();
                                      }
                                      elRefs[index]?.current?.play();
                                      setPlayIndex(index);
                                    }}
                                  >
                                    <i className="bi bi-play-fill" />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {post && (
                            <>
                              {["pdf", "doc", "docx", "csv", "html"].includes(
                                postType
                              ) ? (
                                <>
                                  <div className="text-14-500 color-raisin-black mb-1">
                                    Full-Text Paper:
                                  </div>
                                  <div
                                    className="d-flex justify-content-between align-items-center flex-wrap bg-new-car-light p-3 rounded mb-2 gap-2 pointer"
                                    onClick={() => {
                                      dispatch(setPostID(id));
                                    }}
                                  >
                                    <div className="d-flex flex-wrap gap-3">
                                      <div className="post-file">
                                        <i className="bi bi-file-earmark-text" />
                                      </div>
                                      <div>
                                        <div className="text-14-500 color-raisin-black">
                                          {titleCaseString(fileName)}
                                        </div>
                                        <div className="text-10-400 color-raisin-black">
                                          {upperCase(postType)} file
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <Button
                                        icon={
                                          <i className="bi bi-cloud-arrow-down text-24-500 me-2" />
                                        }
                                        text="Download"
                                        btnStyle="primary-dark"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          dispatch(downloadFile(nPost));
                                        }}
                                        isSquare
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div
                                  className="mb-3 img-block pointer"
                                  onClick={() => {
                                    dispatch(setPostID(id));
                                  }}
                                >
                                  <img src={nPost} alt="post" />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div className="bottom-block">
                          <div className="">
                            <i
                              className={`color-new-car me-2 pointer bi bi-hand-thumbs-up${
                                is_liked ? "-fill" : ""
                              }`}
                              onClick={() => {
                                handelUsefulUnusefulPost(id);
                              }}
                            />
                            <span className="test-14-500 color-title-navy me-2">
                              <b>{total_likes}</b>
                            </span>
                            <span className="test-14-400 color-title-navy  ">
                              Useful
                            </span>
                          </div>
                          <div className=" text-nowrap">
                            <i
                              className="bi bi-chat color-new-car me-2 pointer"
                              onClick={() => {
                                setCommentData({
                                  ...commentData,
                                  comment: "",
                                  isComment: id,
                                });
                              }}
                            />
                            <span className="test-14-500 color-raisin-black  me-2">
                              <b>{total_comments}</b>
                            </span>
                            <span className="test-14-400 color-title-navy  ">
                              Comments
                            </span>
                          </div>
                          <div className="">
                            <ShareButton
                              type="POST"
                              // url={`${window?.location?.origin}/${findType?.type}/dashboard/network/post/post-details/${id}`}
                              url={`${window?.location?.origin}/member/global-post/${id}`}
                              title={`hey, kindly Check ${
                                sub_category_name || category_name
                              } on ${title}`}
                            />
                          </div>
                          <div>
                            <span>
                              <i
                                className={`color-new-car pointer bi bi-plus-square${
                                  is_saved ? "-fill" : ""
                                }`}
                                onClick={() => {
                                  if (!saveLoader) {
                                    handelSaveUnsave(id);
                                  }
                                }}
                              />
                            </span>
                            <span className="test-14-400 color-title-navy ms-2">
                              {saveLoader === id ? (
                                <Loader size="sm" />
                              ) : is_saved ? (
                                "Unsave"
                              ) : (
                                "Save"
                              )}
                            </span>
                          </div>
                          {/* <div className="d-flex align-items-center w-100 flex-wrap">
                      <div>
                        <i
                          className={`color-new-car me-2 pointer bi bi-hand-thumbs-up${
                            is_liked ? "-fill" : ""
                          }`}
                          onClick={() => {
                            handelUsefulUnusefulPost(id);
                          }}
                        />
                        <span className="test-14-500 color-title-navy me-2">
                          <b>{total_likes}</b>
                        </span>
                        <span className="test-14-400 color-title-navy  ">
                          Useful
                        </span>
                      </div>
                      <div className="cms-30 cpe-30">
                        <i
                          className="bi bi-chat color-new-car me-2 pointer"
                          onClick={() => {
                            setCommentData({
                              ...commentData,
                              comment: "",
                              isComment: id,
                            });
                          }}
                        />
                        <span className="test-14-500 color-raisin-black  me-2">
                          <b>{total_comments}</b>
                        </span>
                        <span className="test-14-400 color-title-navy  ">
                          Comments
                        </span>
                      </div>
                      <div>
                        <ShareButton
                          type="POST"
                          url={`${window?.location?.origin}/${findType?.type}/${moduleType}/network/post/post-details/${id}`}
                          title={`hey, kindly Check ${
                            sub_category_name || category_name
                          } on ${title}`}
                        />
                      </div>
                      <div className="d-flex justify-content-end align-items-center flex-grow-1 gap-2">
                        <span>
                          <i
                            className={`color-new-car pointer bi bi-plus-square${
                              is_saved ? "-fill" : ""
                            }`}
                            onClick={() => {
                              if (!saveLoader) {
                                handelSaveUnsave(id);
                              }
                            }}
                          />
                        </span>
                        <span className="test-14-400 color-title-navy  ">
                          {saveLoader === id ? (
                            <Loader size="sm" />
                          ) : is_saved ? (
                            "Unsave"
                          ) : (
                            "Save"
                          )}
                        </span>
                      </div>
                    </div> */}
                        </div>
                      </Card>
                      {id === isComment && (
                        <Card className="post-block cps-18 cpe-18 cpt-18 cpb-18 unset-br">
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
                                  name: cName,
                                  id: cUserId,
                                  profile_photo: cProfilePhoto,
                                } = cElem.user_details || {};
                                const isDeleteComment =
                                  postID === id && cElem.id === deleteID;
                                const isEdit = loginUserID === cUserId;
                                const isDelete = loginUserID === cUserId;
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
                                    <div className="cms-40">{comment}</div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <div className="post-input-container">
                            <input
                              id="post-input"
                              className="cpe-10"
                              placeholder="Enter comment"
                              value={comment}
                              onKeyUp={(e) => {
                                if (e?.keyCode === 13) {
                                  if (oldComment) {
                                    handelUpdateComment();
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
                                  btnStyle="primary-dark"
                                  text="Comment"
                                  disabled={
                                    oldComment
                                      ? isEqual(oldComment, comment)
                                      : !comment
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
                            </div>
                          </div>
                        </Card>
                      )}
                    </React.Fragment>
                  );
                })}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default EventPostPopUp;