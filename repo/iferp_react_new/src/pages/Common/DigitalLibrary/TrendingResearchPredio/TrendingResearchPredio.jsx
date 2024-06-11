import Card from "components/Layout/Card";
import Profile from "components/Layout/Profile";
import ShareButton from "components/Layout/ShareButton";
import Button from "components/form/Button";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  TopResearchPredio,
  commentPost,
  editOrDeleteComment,
  saveUnsavePost,
  usefulUnusefulPost,
} from "store/slices";
import { networkPath } from "utils/constants";
import {
  generatePreSignedUrl,
  objectToFormData,
  titleCaseString,
  messageTime,
  trimLeftSpace,
  getDataFromLocalStorage,
} from "utils/helpers";
import { Player } from "video-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import Loader from "components/Layout/Loader";
import { isEqual } from "lodash";
import "./TrendingResearchPedio.scss";

const TrendingResearchPedio = ({ handleRedirect }) => {
  const dispatch = useDispatch();
  const commentRef = useRef();
  const [saveLoader, setSaveLoader] = useState("");
  const [data, setData] = useState([]);
  const userData = getDataFromLocalStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [commentData, setCommentData] = useState({
    comment: "",
    isComment: "",
    isCommentLoading: false,
    oldComment: "",
    deleteID: "",
    postID: "",
    commentID: "",
  });

  const fetchData = async (data) => {
    setIsLoading(true);
    const formData = objectToFormData(data);
    const response = await dispatch(TopResearchPredio(formData));
    if (response?.status === 200) {
      if (response?.data) {
        const newData = response?.data?.result?.map(async (elem) => {
          // let  = await generatePreSignedUrl(elem?.post, networkPath);
          let presantationRes = "";
          let thumbnailRes = "";
          if (elem?.presentation_link) {
            presantationRes = await generatePreSignedUrl(
              elem?.presentation_link,
              networkPath
            );
          }
          if (elem?.thumbnail) {
            thumbnailRes = await generatePreSignedUrl(
              elem?.thumbnail,
              networkPath
            );
          }
          return {
            ...elem,
            // nPost: response,
            nPresentationLink: presantationRes,
            nThumbnail: thumbnailRes,
          };
        });

        const results = await Promise.all(newData);
        const newList = results;
        const filterList = newList?.filter((o) => o?.nPresentationLink);
        setData(filterList);
      }
    }
    setIsLoading(false);
  };

  const handelSaveUnsave = async (postID) => {
    setSaveLoader(postID);
    const response = await dispatch(
      saveUnsavePost(objectToFormData({ post_id: postID }))
    );
    if (response?.status === 200) {
      let oldPostList = data;
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
      setData(oldPostList);
    }
    setSaveLoader("");
  };

  const handelUsefulUnusefulPost = async (postID) => {
    const response = await dispatch(
      usefulUnusefulPost(objectToFormData({ post_id: postID }))
    );
    if (response?.status === 200) {
      let oldPostList = data;
      oldPostList = oldPostList?.map((obj) => {
        let copy = { ...obj };
        if (obj?.id === postID) {
          const likesStatus = copy?.is_liked === 0 ? 1 : 0;
          let count = copy?.total_likes;
          count = likesStatus === 0 ? count - 1 : count + 1;
          copy = {
            ...copy,
            is_liked: likesStatus,
            total_likes: count <= 0 ? 0 : count,
          };
        }
        return copy;
      });
      setData(oldPostList);
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
      let oldPostList = data;
      oldPostList = oldPostList?.map((obj) => {
        let copy = { ...obj };
        if (obj?.id === postID) {
          copy = {
            ...copy,
            total_comments: obj?.total_comments + 1,
            comments: [...obj?.comments, response?.data],
          };
        }
        return copy;
      });
      setData(oldPostList);
      setTimeout(() => {
        if (commentRef?.current) {
          commentRef?.current?.lastChild?.scrollIntoView({
            behavior: "smooth",
          });
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
      let oldPostList = data;
      oldPostList = await oldPostList.map((obj) => {
        let copy = { ...obj };
        if (obj?.id === postID) {
          const count = obj?.total_comments - 1;
          copy = {
            ...copy,
            total_comments: count <= 0 ? 0 : count,
            comments: obj?.comments.filter((o) => o?.id !== commentID),
          };
        }
        return copy;
      });
      setData(oldPostList);
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
      let oldPostList = data;
      oldPostList = await oldPostList?.map((obj) => {
        let copy = { ...obj };
        if (obj?.id === commentData?.postID) {
          copy = {
            ...copy,
            comments: obj?.comments.map((cObj) => {
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
      setData(oldPostList);
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

  useEffect(() => {
    // setIsLoading(true);
    setCommentData({
      ...commentData,
      comment: "",
      oldComment: "",
      isComment: "",
      commentID: "",
      postID: "",
      isCommentLoading: false,
    });
    fetchData({ category: "Presentation", page: 1, limit: 10 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (commentData?.isComment) {
      setTimeout(() => {
        if (commentRef?.current) {
          commentRef.current.lastChild?.scrollIntoView();
        }
      }, 100);
    }
  }, [commentData?.isComment]);
  const { comment, isComment, isCommentLoading, postID, deleteID, oldComment } =
    commentData;

  const swiperRef = useRef(null);
  const handleNextSlide = () => {
    if (swiperRef.current !== null) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <>
      <Card className="mb-4 trending-research-pedio-container">
        <div className="cpt-30 cpb-30">
          <div className="text-24-500 color-raisin-black text-center">
            Trending Research Presentations
          </div>
          {isLoading ? (
            <div className="cpt-30 cpb-50">
              <Loader size="md" />
            </div>
          ) : data?.length === 0 ? (
            <div className="cpt-30 cpb-50 text-center">No Records Found.</div>
          ) : (
            <>
              <Swiper
                lazy={"true"}
                modules={[Navigation]}
                allowSlidePrev={false}
                grabCursor={true}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                slidesPerView={"auto"}
                spaceBetween={10}
                loop={true}
                navigation={{
                  nextEl: ".next-button",
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                  },
                  768: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                  },
                  1024: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                  1200: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                  2400: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                }}
                className="mySwiper"
              >
                {data?.map((el, index) => {
                  const {
                    id,
                    user_details = {},
                    nPresentationLink,
                    nThumbnail,
                    title,
                    total_comments,
                    comments,
                    total_likes,
                    created_date,
                    is_liked,
                    is_saved,
                    category_name,
                    sub_category_name,
                  } = el;
                  const {
                    name,
                    state,
                    country,
                    profile_photo,
                    designation,
                    institution_name,
                  } = user_details;
                  return (
                    <SwiperSlide className="cmt-15" key={index}>
                      <Card className="pb-3 pt-3 ps-3 pe-3">
                        <div className="d-flex justify-content-between mb-2">
                          <div className="d-flex align-items-center gap-3">
                            <Profile
                              isRounded
                              isS3UserURL
                              text={name}
                              size="s-48"
                              url={profile_photo}
                            />
                            <div className="user-details-block ms-3">
                              <div
                                className={`text-15-500 ${"color-raisin-black"}`}
                              >
                                {name}
                              </div>
                              <div className="text-14-400 color-raisin-black ">
                                {`${
                                  (designation || "") &&
                                  (institution_name || "")
                                } ${(state || "") && (country || "")}`}
                              </div>
                            </div>
                          </div>
                          <div>
                            {/* <div className="d-flex justify-content-end pointer">
                              <i className="bi bi-three-dots d-flex" />
                            </div> */}
                            <div className="text-13-400">
                              {messageTime(created_date)}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-14-500 mb-1 bio-height ellipse-text">
                            {titleCaseString(title)}
                          </div>
                          <div className="border-bottom pb-2">
                            <Player
                              playsInline
                              src={nPresentationLink}
                              poster={nThumbnail}
                            />
                          </div>
                          <div className="d-flex align-items-center justify-content-between flex-wrap">
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
                              <div className="text-nowrap">
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
                                  url={`${window?.location?.origin}/member/global-post/${id}`}
                                  title={`hey, kindly Check ${
                                    sub_category_name || category_name
                                  } on ${title}`}
                                  postID={id}
                                />
                              </div>
                            </div>
                            <div className="cpt-13">
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
                          </div>
                        </div>
                      </Card>
                      {id === isComment && (
                        <Card className="post-block cps-18 cpe-18 cpt-18 cpb-18 unset-br cmt-10">
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
                                } = cElem?.user_details || {};
                                const isDeleteComment =
                                  postID === id && cElem?.id === deleteID;
                                const isEdit = userData?.id === cUserId;
                                const isDelete = userData?.id === cUserId;
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
                    </SwiperSlide>
                  );
                })}
                <div className="next-button">
                  <i
                    className="bi bi-chevron-right color-48c0 pointer"
                    onClick={handleNextSlide}
                  ></i>
                </div>
              </Swiper>
              <div className="center-flex mt-5">
                <Button
                  text="View All"
                  btnStyle="primary-dark"
                  className="cps-20 cpe-20 h-35 text-15-500"
                  onClick={() => {
                    const payload = {
                      type: "Trending Research Presentations",
                    };
                    handleRedirect(payload);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </>
  );
};

export default TrendingResearchPedio;
