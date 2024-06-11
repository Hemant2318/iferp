import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import "./PostPopup.scss";
import {
  commentPost,
  fetchSinglePost,
  saveUnsavePost,
  setPostID,
  setRProfileID,
  storePostList,
  usefulUnusefulPost,
} from "store/slices";
import {
  downloadFile,
  generatePreSignedUrl,
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
  trimLeftSpace,
} from "utils/helpers";
import { upperCase } from "lodash";
import Button from "components/form/Button";
import Profile from "../Profile";
import ShareButton from "../ShareButton/ShareButton";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { icons, membershipType, networkPath } from "utils/constants";
import { useNavigate } from "react-router-dom";

const PostPopup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = getDataFromLocalStorage();
  const {
    // id: loginUserID,
    user_type: userType,
    profile_photo_path,
    first_name,
  } = userData;
  const userProfilePhoto = profile_photo_path || icons.roundLogo;
  const findType = membershipType.find((o) => o.id === userType);
  let moduleType = window.location.href.includes("dashboard")
    ? "dashboard"
    : "network-management";
  const { postID, newPostList } = useSelector((state) => ({
    postID: state.global.postID,
    newPostList: state.global.postList,
  }));
  const [pageLoader, setPageLoader] = useState(false);
  const [postData, setPostData] = useState("");
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
  const handelUsefulUnusefulPost = async (postID) => {
    const response = await dispatch(
      usefulUnusefulPost(objectToFormData({ post_id: postID }))
    );
    if (response?.status === 200) {
      let oldPostList = newPostList;
      let newElem = postData;
      oldPostList = oldPostList.map((obj) => {
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
          newElem = copy;
        }
        return copy;
      });
      setPostData(newElem);
      dispatch(storePostList(oldPostList));
    }
  };
  const handelSaveUnsave = async (postID) => {
    setSaveLoader(postID);
    const response = await dispatch(
      saveUnsavePost(objectToFormData({ post_id: postID }))
    );
    if (response?.status === 200) {
      let oldPostList = newPostList;
      let newElem = postData;
      oldPostList = oldPostList.map((obj) => {
        let copy = { ...obj };
        if (obj.id === postID) {
          copy = {
            ...copy,
            is_saved: copy.is_saved === 0 ? 1 : 0,
          };
          newElem = copy;
        }
        return copy;
      });
      setPostData(newElem);
      dispatch(storePostList(oldPostList));
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
      let oldPostList = newPostList;
      let newElem = postData;
      oldPostList = oldPostList.map((obj) => {
        let copy = { ...obj };
        if (obj.id === postID) {
          copy = {
            ...copy,
            total_comments: obj.total_comments + 1,
            comments: [...obj?.comments, response?.data],
          };
          newElem = copy;
        }
        return copy;
      });
      setPostData(newElem);
      dispatch(storePostList(oldPostList));
    }
    setCommentData({ ...commentData, isCommentLoading: false, comment: "" });
  };
  const handleGetPost = async () => {
    const response = await dispatch(
      fetchSinglePost(objectToFormData({ post_id: postID }))
    );
    let postResponse = await generatePreSignedUrl(
      response?.data.post,
      networkPath
    );
    let presantationRes = "";
    let thumbnailRes = "";
    if (response?.data?.presentation_link) {
      presantationRes = await generatePreSignedUrl(
        response?.data.presentation_link,
        networkPath
      );
    }
    if (response?.data?.thumbnail) {
      thumbnailRes = await generatePreSignedUrl(
        response?.data.thumbnail,
        networkPath
      );
    }
    setPostData({
      ...response?.data,
      nPost: postResponse,
      nPresentationLink: presantationRes,
      nThumbnail: thumbnailRes,
    });
    setPageLoader(false);
  };
  useEffect(() => {
    if (postID) {
      setPageLoader(true);
      handleGetPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postID]);

  const {
    id,
    post,
    co_authors,
    user_details,
    abstract,
    description,
    is_liked,
    total_likes,
    sub_category_name,
    category_name,
    title,
    is_saved,
    author_details,
    nPost,
  } = postData || {};
  const {
    id: userID,
    name,
    state,
    country,
    profile_photo,
    user_type,
  } = user_details || {};
  const authorName = author_details?.name || name || "";
  const authorProfie = author_details?.profile_photo || profile_photo || "";
  let about_article = "";
  if (abstract) {
    let text = abstract || "";
    text = text.replace(/\n\r?/g, "<br />");
    let geturl = new RegExp(
      /(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))/,
      "g"
    );

    let matchData = text.match(geturl);
    matchData?.forEach((e) => {
      text = text.replace(
        e,
        ` <a className="" href="${trimLeftSpace(
          e
        )}" target="_blank">${trimLeftSpace(e)}</a>`
      );
    });
    about_article = text;
  }
  const postType = post ? post?.split(".")?.pop() : "";
  const fileName = post ? post?.split("/")?.pop() : "";
  let isAnyCoAuthor = co_authors?.some((o) => o.is_ownership);
  const isReasearchProfile = ["2", "5"].includes(user_type);
  const { comment, isCommentLoading } = commentData;
  return (
    <>
      {postID && (
        <Modal
          size="lg"
          onHide={() => {
            dispatch(setPostID(null));
          }}
        >
          {pageLoader ? (
            <div className="center-flex pt-5 pb-5">
              <Loader size="md" />
            </div>
          ) : (
            <div id="post-popup-container">
              <div className="left-block">
                {post && (
                  <>
                    {["pdf", "doc", "docx", "csv", "html"].includes(
                      postType
                    ) ? (
                      <div className="d-flex justify-content-between align-items-center flex-wrap bg-new-car-light p-3 rounded mb-2 gap-2 pointer">
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
                              e.stopPropagation();
                              dispatch(downloadFile(nPost));
                            }}
                            isSquare
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3 img-block pointer">
                        <img src={nPost} alt="post" />
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="right-block">
                <div className="d-flex mb-2">
                  <div>
                    <Profile
                      isRounded
                      isS3UserURL
                      text={name}
                      size="s-48"
                      url={profile_photo}
                    />
                  </div>
                  <div className="ms-2">
                    <div
                      className={`text-15-600 ${
                        isReasearchProfile
                          ? "color-new-car pointer hover-effect"
                          : "color-raisin-black"
                      }`}
                      onClick={() => {
                        if (isReasearchProfile) {
                          dispatch(setRProfileID(userID));
                        }
                      }}
                    >
                      {titleCaseString(name)}
                    </div>
                    <div className="text-13-400 color-black-olive">
                      {`${(state || "") && (country || "")}`}
                    </div>
                  </div>
                </div>
                <div className="text-15-600 title-text mb-1">{title}</div>
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
                          size="s-18"
                          text={authorName}
                          url={authorProfie}
                        />
                      </span>
                      <span className="text-13-400">{authorName}</span>
                    </div>
                  </>
                )}
                {co_authors?.length > 0 && isAnyCoAuthor && (
                  <>
                    <div className="text-14-500 color-raisin-black mb-1 mt-1">
                      Co Author
                    </div>
                    <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
                      {co_authors?.map((el, index) => {
                        const isReasearchProfile = ["2", "5"].includes(
                          el?.user_type
                        );
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
                                  isRounded
                                  isS3UserURL
                                  size="s-18"
                                  text={el?.name}
                                  url={el?.profile_photo}
                                />
                              </span>
                              <span
                                className={`text-13-400 ${
                                  isReasearchProfile
                                    ? "color-new-car pointer"
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
                            {co_authors.length > 1 &&
                              co_authors.length - 1 === index && (
                                <span className="bg-light-primary rounded-circle p-1" />
                              )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                {description && (
                  <div
                    className="two-line-elipses mb-2"
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                  />
                )}
                {about_article && (
                  <div
                    className="two-line-elipses mb-2"
                    dangerouslySetInnerHTML={{
                      __html: about_article,
                    }}
                  />
                )}

                {(description || about_article) && (
                  <div
                    className="pointer color-new-car text-12-400"
                    onClick={() => {
                      dispatch(setPostID(null));
                      localStorage.prevRoute = window.location.pathname;
                      navigate(
                        `/${findType?.type}/${moduleType}/network/post/post-details/${id}`
                      );
                    }}
                  >
                    Read More
                  </div>
                )}
                <div className="d-flex flex-wrap gap-5 mt-5">
                  <div>
                    <i
                      className={`color-new-car me-2 pointer bi bi-hand-thumbs-up${
                        is_liked ? "-fill" : ""
                      }`}
                      onClick={() => {
                        handelUsefulUnusefulPost(id);
                      }}
                    />
                    <span className="test-14-500 color-raisin-black me-2">
                      <b>{total_likes}</b>
                    </span>
                    <span className="test-13-400 color-black-olive">
                      Useful
                    </span>
                  </div>
                  <div className="d-flex">
                    <ShareButton
                      postID={id}
                      type="POST"
                      // url={`${window?.location?.origin}/${findType?.type}/${moduleType}/network/post/post-details/${id}`}
                      url={`${window?.location?.origin}/member/global-post/${id}`}
                      title={`hey, kindly Check ${
                        sub_category_name || category_name
                      } on ${title}`}
                    />
                  </div>
                  <div className="d-flex align-items-center gap-2">
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
                    <span>
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
                <div className="d-flex align-items-center gap-2 mt-3">
                  <div>
                    <Profile
                      isS3UserURL
                      text={first_name}
                      size="s-34"
                      url={userProfilePhoto}
                    />
                  </div>
                  <div className="post-input-container flex-grow-1">
                    <input
                      id="post-input"
                      className="cpe-10"
                      placeholder="Enter comment"
                      value={comment}
                      onKeyUp={(e) => {
                        if (e?.keyCode === 13) {
                          handelCommentPost(id);
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
                          // text="Comment"
                          rightIcon={<i className="bi bi-send" />}
                          disabled={!comment}
                          btnLoading={isCommentLoading}
                          onClick={() => {
                            handelCommentPost(id);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};
export default PostPopup;
