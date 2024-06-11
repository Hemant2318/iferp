import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Col, Dropdown, Row } from "react-bootstrap";
import moment from "moment";
import Button from "components/form/Button";
import TextArea from "components/form/TextArea";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import Modal from "components/Layout/Modal";
import ShareButton from "components/Layout/ShareButton";
import FiguresContainer from "components/Layout/FiguresContainer";
import { icons, membershipType, networkPath } from "utils/constants";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import {
  commentPost,
  fetchSinglePost,
  reminderPostVerify,
  saveUnsavePost,
  setRProfileID,
  updateCoAuthor,
  usefulUnusefulPost,
  fullPaperRequest,
  eventPostList,
} from "store/slices";
import {
  convertDescription,
  downloadFile,
  extractPDFData,
  generatePreSignedUrl,
  getDataFromLocalStorage,
  getUserType,
  objectToFormData,
  titleCaseString,
  trimLeftSpace,
} from "utils/helpers";
import ViewFigure from "./ViewFigure";
import FigureForm from "./FigureForm";
import EventPostPopUp from "./FigureForm/EventPostPopUp";
import CitationsList from "./Citations/CitationsList";
import CitationsResearchersList from "./Citations/CitationsResearchersList";
import "./PostDetails.scss";

const PostDetails = ({ setConnectModel }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { postID } = params;
  const isGlobalPost = window.location.pathname.includes("global-post");
  const htmlElRef = useRef(null);
  const [popupImage, setPopupImage] = useState("");
  const [type, setType] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [commentLoader, setCommentLoader] = useState(false);
  const [data, setData] = useState({});
  const [ownerLoader, setOwnerLoader] = useState("");
  const [isPageLoader, setIsPageLoader] = useState(true);
  const [isPostLoader, setIsPostLoader] = useState(true);
  const [isPdfLoader, setIsPdfLoader] = useState(true);
  const userData = getDataFromLocalStorage();
  const [isReminder, setIsReminder] = useState(false);
  const [isViewFigure, setIsViewFigure] = useState(false);
  const [isFigureForm, setIsFigureForm] = useState(false);
  const [requestLoader, setRequestLoader] = useState(false);
  const [userEventPostList, setUserEventPostList] = useState([]);
  const [pdfData, setPdfData] = useState({
    pages: [],
    reference: "",
  });
  const [modalShow, setModalShow] = useState(false);
  const [isViewAll, setIsViewAll] = useState(false);
  const {
    id,
    title,
    category_name,
    sub_category_name,
    post,
    created_date,
    // authors,
    comments,
    description,
    abstract,
    co_authors,
    user_details,
    author_details,
    presentation_link,
    // paper_text,
    // thumbnail,
    create_by,
    doi,
    is_liked,
    is_saved,
    // pdf_data,
    total_likes,
    figures = [],
    full_paper_request,
    event_name,
    nPost,
    nPresentationLink,
    nThumbnail,
    event_id,
  } = data || {};
  const { id: loginUserID, user_type } = userData;
  const findType = membershipType.find((o) => o.id === user_type)?.type;
  const handleRequestSend = async (postID) => {
    setRequestLoader(true);
    const response = await dispatch(
      fullPaperRequest(objectToFormData({ post_id: postID }))
    );
    if (response?.status === 200) {
      setData((prev) => {
        return { ...prev, full_paper_request: true };
      });
    }
    setRequestLoader(false);
  };
  const handleReminder = async (postID) => {
    setIsReminder(true);
    await dispatch(reminderPostVerify(objectToFormData({ post_id: postID })));
    setIsReminder(false);
  };
  const handelCommentPost = async () => {
    setCommentLoader(true);
    const payload = objectToFormData({ comment: newComment, post_id: postID });
    const response = await dispatch(commentPost(payload));
    if (response?.status === 200) {
      setData((prev) => {
        return { ...prev, comments: [...prev.comments, response?.data] };
      });
    }
    setCommentLoader(false);
    setNewComment("");
  };
  const getPostDetails = async () => {
    const response = await dispatch(
      fetchSinglePost(objectToFormData({ post_id: postID }))
    );
    let postResponse = "";
    let presantationRes = "";
    let thumbnailRes = "";
    if (response?.data?.post) {
      postResponse = await generatePreSignedUrl(
        response?.data.post,
        networkPath
      );
    }
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
    setData({
      ...response?.data,
      nPost: postResponse,
      nPresentationLink: presantationRes,
      nThumbnail: thumbnailRes,
    });
    setIsPageLoader(false);
  };
  const handelEventPostList = async () => {
    if (!getDataFromLocalStorage("id") && setConnectModel) {
      setConnectModel(true);
      return;
    }
    setIsPostLoader(true);
    setModalShow(true);
    const response = await dispatch(
      eventPostList(objectToFormData({ event_id: event_id }))
    );
    if (response?.status === 200) {
      if (response?.data) {
        const promises = response?.data?.map(async (elm) => {
          let postResponse = await generatePreSignedUrl(elm?.post, networkPath);
          let presantationRes = "";
          let thumbnailRes = "";
          if (elm?.presentation_link) {
            presantationRes = await generatePreSignedUrl(
              elm?.presentation_link,
              networkPath
            );
          }
          if (elm?.thumbnail) {
            thumbnailRes = await generatePreSignedUrl(
              elm?.thumbnail,
              networkPath
            );
          }

          return {
            ...elm,
            nPost: postResponse,
            nPresentationLink: presantationRes,
            nThumbnail: thumbnailRes,
          };
        });
        const results = await Promise.all(promises);
        setUserEventPostList(results);
      }
      setIsPostLoader(false);
    }
  };
  const handelOwenership = async (obj) => {
    setOwnerLoader(`${obj?.post_id}-${obj.status}`);
    const queryParams = new URLSearchParams(obj).toString();
    const response = await dispatch(updateCoAuthor(queryParams));
    if (response?.status === 200) {
      getPostDetails();
    }
    setOwnerLoader("");
  };
  const getPDFData = async () => {
    let pdfFileData = await extractPDFData(nPost);
    let referenceText = "";
    let result = pdfFileData?.content.indexOf("References");
    if (result < 0) {
      result = pdfFileData?.content.indexOf("REFERENCES");
    }
    if (result >= 0) {
      referenceText = pdfFileData?.content.substring(result);
    }
    referenceText = referenceText
      .replace("References", "")
      .replace("REFERENCES", "");

    setPdfData({
      pages: pdfFileData?.pages || [],
      reference: referenceText,
    });
    setIsPdfLoader(false);
  };
  const handelUsefulUnusefulPost = async () => {
    if (!getDataFromLocalStorage("id") && setConnectModel) {
      setConnectModel(true);
      return;
    }
    const response = await dispatch(
      usefulUnusefulPost(objectToFormData({ post_id: data.id }))
    );
    if (response?.status === 200) {
      setData((prev) => {
        let likeStatus = data.is_liked ? 0 : 1;
        let likeCount = likeStatus
          ? data.total_likes + 1
          : data.total_likes - 1;
        return {
          ...prev,
          is_liked: data.is_liked ? 0 : 1,
          total_likes: likeCount < 0 ? 0 : likeCount,
        };
      });
    }
  };
  const handelSaveUnsave = async () => {
    if (!getDataFromLocalStorage("id") && setConnectModel) {
      setConnectModel(true);
      return;
    }
    const response = await dispatch(
      saveUnsavePost(objectToFormData({ post_id: data.id }))
    );
    if (response?.status === 200) {
      setData((prev) => {
        return { ...prev, is_saved: data.is_saved ? 0 : 1 };
      });
    }
  };
  useEffect(() => {
    if (data?.id && localStorage?.isNewComment) {
      setType(2);
      setTimeout(() => {
        htmlElRef?.current?.scrollIntoView({ behavior: "smooth" });
        localStorage.removeItem("isNewComment");
      }, 500);
    }
    if (post) {
      setIsPdfLoader(true);
      if (post.includes("pdf")) {
        getPDFData();
      } else {
        setIsPdfLoader(false);
      }
    } else {
      setIsPdfLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  useEffect(() => {
    getPostDetails();
    let path = window.location.pathname;
    if (findType !== path?.split("/")[1] && !isGlobalPost) {
      let newURL = path?.replace(path?.split("/")[1], findType);
      navigate(newURL);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let referenceContent = convertDescription(pdfData?.reference);
  let about_article = abstract;
  const pendingVerify = [];
  if (author_details?.is_ownership === "0" && author_details?.user_id) {
    pendingVerify.push(author_details?.user_id);
  }
  co_authors?.forEach((cElm) => {
    if (!cElm?.is_ownership) {
      pendingVerify.push(cElm.id);
    }
  });
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
  let authorName = "";
  if (author_details?.user_id === user_details?.id) {
    authorName = user_details?.name;
  } else {
    authorName =
      author_details?.is_ownership === "1" ? author_details?.name : "";
  }
  const isRequestButton = +create_by !== loginUserID;
  const authorProfie =
    author_details?.profile_photo || user_details?.profile_photo || "";
  const isAuthorResrach = ["2", "5"].includes(author_details?.user_type);
  let postUrl = post;
  const postType = post ? post?.split(".")?.pop() : "";
  if (["pdf", "doc", "csv", "html"].includes(postType)) {
    if ((postType === "doc" || postType === "csv") && post) {
      postUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
        nPost
      )}&embedded=true`;
    }
  }
  return (
    <div id="post-details-container">
      {isFigureForm && (
        <FigureForm
          postID={id}
          editData={figures}
          getPostDetails={getPostDetails}
          handleSuccess={() => {
            getPostDetails();
            setIsFigureForm(false);
          }}
          onHide={() => {
            setIsFigureForm(false);
          }}
        />
      )}
      {isViewFigure && (
        <ViewFigure
          figures={figures}
          onHide={() => {
            setIsViewFigure(false);
          }}
        />
      )}
      {popupImage && (
        <Modal
          onHide={() => {
            setPopupImage("");
          }}
        >
          <div
            className="d-flex justify-content-center fit-img-block"
            style={{
              height: "500px",
            }}
          >
            <img src={nPost} alt="post" />
          </div>
        </Modal>
      )}
      <EventPostPopUp
        userEventPostList={userEventPostList}
        setUserEventPostList={setUserEventPostList}
        show={modalShow}
        onHide={() => setModalShow(false)}
        handleSuccess={() => {
          handelEventPostList();
        }}
        isPostLoader={isPostLoader}
      />
      {isPageLoader ? (
        <Card className="pt-5 pb-5">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          <Card className="cps-24 cpe-24 cpt-26 cpb-26 cmb-12 ">
            <div className="row">
              <div className="col-md-6 col-12 col-12">
                <div className="d-flex cmb-22">
                  {!isGlobalPost && (
                    <span
                      className="d-flex"
                      onClick={() => {
                        if (localStorage.prevRoute) {
                          // navigate(localStorage.prevRoute);
                          navigate(-1);
                        } else {
                          const memberType = getUserType();
                          navigate(
                            `/${memberType}/network-management/network/posts/discover-posts`
                          );
                        }
                      }}
                    >
                      <img
                        src={icons.leftArrow}
                        alt="back"
                        className="h-21 me-3 pointer"
                      />
                    </span>
                  )}
                  <span className="text-16-500 color-raisin-black">
                    {title}
                  </span>
                </div>
                <div className="d-flex flex-wrap gap-3 mb-3">
                  {(sub_category_name || category_name) && (
                    <Button
                      isSquare
                      text={sub_category_name || category_name}
                      btnStyle="primary-light"
                      className="h-auto text-nowrap color-black-olive bg-navy-light text-13-400"
                    />
                  )}

                  {post && (
                    <Button
                      isSquare
                      text="Full-text available"
                      btnStyle="primary-outline"
                      className="h-auto text-nowrap text-13-400"
                    />
                  )}
                </div>
                {created_date && (
                  <div className="text-14-400 color-dark-silver mb-3">
                    {moment(created_date, "DD-MM-YYYY hh:mm A").format(
                      "DD MMMM YYYY"
                    )}
                  </div>
                )}
                {authorName && (
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="text-14-400 color-raisin-black">Author</div>
                    <div className="d-flex align-items-center gap-1">
                      <span>
                        <Profile
                          isRounded
                          isS3UserURL
                          text={authorName}
                          size="s-22"
                          url={authorProfie}
                        />
                      </span>
                      <span
                        className={`text-14-400 ${
                          isAuthorResrach
                            ? "color-new-car hover-effect pointer"
                            : "color-black-olive"
                        }`}
                        onClick={() => {
                          if (isAuthorResrach) {
                            dispatch(setRProfileID(author_details?.user_id));
                          }
                        }}
                      >
                        {authorName}
                      </span>
                    </div>
                  </div>
                )}
                {co_authors?.length > 0 && isAnyCoAuthor && (
                  <div className="d-flex gap-3 mb-3">
                    <div className="text-14-400 color-raisin-black text-nowrap">
                      Co Author
                    </div>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
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
                            <span className="d-flex align-items-center flex-wrap gap-1">
                              <span>
                                <Profile
                                  isRounded
                                  isS3UserURL
                                  size="s-22"
                                  text={el?.name}
                                  url={el?.profile_photo}
                                />
                              </span>
                              <span
                                className={`text-14-400 ${
                                  isReasearchProfile
                                    ? "color-new-car pointer hover-effect"
                                    : "color-black-olive"
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
                  </div>
                )}
                {doi && (
                  <div className="d-flex mb-3">
                    <span className="text-14-400 me-1"> DOI -</span>
                    <span className="text-14-500">{doi}</span>
                  </div>
                )}
                <div
                  className={authorVerify || coAuthorVerify ? "mb-3" : "d-none"}
                >
                  <Dropdown className="d-flex pulse">
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
                              authorVerify?.user_id || coAuthorVerify?.id,
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
                            user_id:
                              authorVerify?.user_id || coAuthorVerify?.id,
                            status: 2,
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
                {+create_by === loginUserID && pendingVerify.length > 0 && (
                  <div className="d-flex mb-3">
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
                  </div>
                )}
                <div className="d-flex align-items-center gap-3">
                  <div className="text-14-400 d-flex gap-1">
                    <span>
                      <i
                        className={`color-new-car pointer bi bi-hand-thumbs-up${
                          is_liked ? "-fill" : ""
                        }`}
                        onClick={handelUsefulUnusefulPost}
                      />
                    </span>
                    <span className="color-raisin-black text-14-500">
                      {total_likes}
                    </span>
                    <span className="color-black-olive">Likes</span>
                  </div>
                  <div className="text-14-400 d-flex gap-1">
                    <span>
                      <i
                        className="color-new-car text-14-500 pointer bi bi-chat-square"
                        onClick={() => {
                          if (
                            !getDataFromLocalStorage("id") &&
                            setConnectModel
                          ) {
                            setConnectModel(true);
                            return;
                          }
                          setType(2);
                        }}
                      />
                    </span>
                    <span className="color-raisin-black text-14-500">
                      {comments?.length}
                    </span>
                    <span className="color-black-olive">Comments</span>
                  </div>
                  <div className="text-14-400 d-flex gap-1">
                    <span>
                      <i
                        className={`color-new-car pointer bi bi-plus-square${
                          is_saved ? "-fill" : ""
                        }`}
                        onClick={handelSaveUnsave}
                      />
                    </span>
                    <span className="color-black-olive">
                      {is_saved ? "Unsave" : "Save"}
                    </span>
                  </div>
                </div>
              </div>
              {presentation_link && (
                <div className="col-md-6 col-12 col-12">
                  <Player
                    playsInline
                    src={nPresentationLink}
                    poster={nThumbnail || ""}
                  />
                  {/* <video
                    width="100%"
                    poster={nThumbnail || ""}
                    controls
                    preload="none"
                    style={{
                      background: `transparent url(${nThumbnail}) 50% 50% / cover no-repeat`,
                    }}
                  >
                    <source src={nPresentationLink} type="video/mp4" />
                  </video> */}
                  {event_name && (
                    <div className="mt-1">
                      <span className="me-1 color-raisin-black text-15-500">
                        Presented at -
                      </span>
                      <span
                        className="color-subtitle-navy hover-effect text-15-500"
                        onClick={handelEventPostList}
                      >
                        {event_name}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
          <Card className="pb-1">
            <div className="border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex gap-3">
                <div
                  className={`text-16-500 cps-20 cpe-20 cpt-16 cpb-10 ${
                    type === 0
                      ? "primary-underline color-new-car"
                      : "pointer color-dark-silver"
                  }`}
                  onClick={() => {
                    setType(0);
                  }}
                >
                  Overview
                </div>

                <div
                  className={`text-16-500 cps-20 cpe-20 cpt-16 cpb-10 ${
                    type === 2
                      ? "primary-underline color-new-car"
                      : "pointer color-dark-silver"
                  }`}
                  onClick={() => {
                    setType(2);
                  }}
                >
                  Comments
                </div>
                <div
                  className={`text-16-500 cps-20 cpe-20 cpt-16 cpb-10 ${
                    type === 3
                      ? "primary-underline color-new-car"
                      : "pointer color-dark-silver"
                  }`}
                  onClick={() => {
                    setType(3);
                  }}
                >
                  Citations
                </div>
              </div>
              <div className="d-flex gap-3 align-items-center cpe-10">
                {postUrl ? (
                  <Button
                    isSquare
                    btnStyle="primary-dark"
                    text="Download Full-Text"
                    className="h-auto text-16-400"
                    onClick={() => {
                      if (!getDataFromLocalStorage("id") && setConnectModel) {
                        setConnectModel(true);
                        return;
                      }
                      dispatch(downloadFile(nPost));
                    }}
                  />
                ) : full_paper_request || !isRequestButton ? (
                  ""
                ) : (
                  <Button
                    isSquare
                    btnStyle="primary-outline"
                    text="Request Full-Text"
                    className="h-auto text-16-400 ps-4 pe-4 pt-2 pb-2"
                    btnLoading={requestLoader}
                    disabled={full_paper_request}
                    onClick={() => {
                      handleRequestSend(id);
                    }}
                  />
                )}

                <ShareButton
                  type="POST"
                  // url={window.location.href}
                  url={`${window?.location?.origin}/member/global-post/${id}`}
                  className="cite-available"
                />
              </div>
            </div>
            {type === 0 && (
              <>
                {(description ||
                  about_article ||
                  pdfData?.images?.length > 0) && (
                  <div className="cms-24 cme-24 cmt-24 cmb-24 border rounded">
                    <div className="text-16-500 cps-22 cpe-22 cpt-18 cpb-18 border-bottom d-flex justify-content-between align-items-center">
                      <span>Abstract & Figures</span>
                      {+create_by === loginUserID && !isGlobalPost && (
                        <span>
                          <Button
                            text={
                              figures.length > 0
                                ? "Edit Figures"
                                : "Add Figures"
                            }
                            btnStyle="primary-outline"
                            className="cps-20 cpe-20 h-35 text-14-500"
                            onClick={() => {
                              setIsFigureForm(true);
                            }}
                          />
                        </span>
                      )}
                    </div>
                    <div className="cps-18 cpe-18 cpt-20 cpb-20">
                      {description && (
                        <div
                          className="text-14-400"
                          dangerouslySetInnerHTML={{
                            __html: description,
                          }}
                        />
                      )}
                      {about_article && (
                        <div
                          className="mb-2 text-14-400"
                          dangerouslySetInnerHTML={{
                            __html: convertDescription(about_article),
                          }}
                        />
                      )}
                      {figures.length > 0 && (
                        <FiguresContainer
                          data={figures}
                          loadMore={() => {
                            setIsViewFigure(true);
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
                {isPdfLoader ? (
                  <div className="pt-5 pb-5">
                    <Loader size="md" />
                  </div>
                ) : (
                  <div className="cms-24 cme-24 cmt-40 cmb-24 border rounded">
                    <div className="text-16-500 cps-22 cpt-18 cpb-18 border-bottom">
                      Public Full Text
                    </div>
                    {postUrl ? (
                      pdfData?.pages.length > 0 ? (
                        <div className="cps-18 cpe-18 cpt-20 cpb-20">
                          {pdfData?.pages
                            .filter((_, index) => {
                              return isViewAll ? true : index <= 0;
                            })
                            .map((el, index) => {
                              return (
                                <div className="border mb-3" key={index}>
                                  <div className="text-14-400 border-bottom cpt-12 cpb-12 cps-18 color-davys-gray bg-gainsboro">
                                    {`Page ${index + 1}`}
                                  </div>
                                  <div>
                                    <img
                                      src={el}
                                      alt="page"
                                      className="fill fit-image"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          {!isViewAll && pdfData?.pages.length > 1 && (
                            <div className="center-flex">
                              <Button
                                isSquare
                                btnStyle="primary-dark"
                                text="View All"
                                className="h-auto text-14-400 ps-4 pe-4 pt-2 pb-2"
                                onClick={() => {
                                  setIsViewAll(true);
                                }}
                              />
                            </div>
                          )}
                          {referenceContent && (
                            <div className="border rounded mt-3">
                              <div className="text-16-500 cps-22 cpt-18 cpb-18 border-bottom">
                                References
                              </div>
                              <div className="cps-18 cpe-18 cpt-20 cpb-20 text-14-400 color-black-olive">
                                {referenceContent && (
                                  <div
                                    className="mb-2"
                                    dangerouslySetInnerHTML={{
                                      __html: referenceContent,
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : ["pdf", "doc", "csv", "html"].includes(postType) ? (
                        <div>
                          <iframe
                            className="w-100"
                            src={postUrl}
                            title="description"
                            style={{
                              width: "100%",
                              height: "500px",
                            }}
                          />
                        </div>
                      ) : (
                        <div className="mb-3 img-block">
                          <img
                            src={nPost}
                            alt="post"
                            className="pointer"
                            onClick={() => {
                              setPopupImage(nPost);
                            }}
                          />
                        </div>
                      )
                    ) : (
                      <div className="cps-18 cpe-18 cpt-30 cpb-40">
                        <div className="mb-2 center-flex pt-3 pb-3">
                          <img
                            src={icons.emptyPaperText}
                            alt="emptyPaperText"
                          />
                        </div>
                        <div className="mb-2 text-center text-16-400 color-black-olive">
                          Request a copy of this research directly from the
                          authors
                        </div>
                        {isRequestButton && (
                          <div className="center-flex pt-3">
                            <Button
                              isSquare
                              btnStyle="primary-dark"
                              text={
                                full_paper_request
                                  ? "Request already sent"
                                  : "Request Full-Text"
                              }
                              className="h-auto text-14-400 ps-4 pe-4 pt-2 pb-2"
                              btnLoading={requestLoader}
                              disabled={full_paper_request}
                              onClick={() => {
                                handleRequestSend(id);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </Card>
          {type === 2 && (
            <>
              {comments?.length === 0 ? (
                <Card className="mt-2">
                  <div className="cpt-24 cps-24 cpb-24 text-center color-dark-silver text-15-400">
                    Comments Not Found.
                  </div>
                </Card>
              ) : (
                <Card className="mt-2">
                  <div className="cpt-16 cps-24 cpb-16 border-bottom">
                    Comments({comments?.length})
                  </div>
                  <div className="cps-24 cpe-24 cpt-24 cpb-24">
                    {comments?.map((elm, index) => {
                      const { user_details: userDetails } = elm;
                      const bio =
                        userDetails?.state && userDetails?.country
                          ? `${userDetails?.state}, ${userDetails?.country}`
                          : "";
                      return (
                        <div
                          className="border border-rounded cpt-20 cps-16 cpe-16 cpb-20 mb-2"
                          key={index}
                        >
                          <div className="d-flex gap-2">
                            <Profile
                              isRounded
                              isS3UserURL
                              size="s-48"
                              text={userDetails?.name}
                              url={userDetails?.profile_photo}
                            />
                            <div className="flex-grow-1 mt-2">
                              <div className="d-flex justify-content-between">
                                <div className="text-16-500 color-new-car">
                                  {titleCaseString(userDetails?.name)}
                                </div>
                                <div className="text-13-400 color-black-olive">
                                  {moment(elm?.created_date).format(
                                    "DD MMM YYYY"
                                  )}
                                </div>
                              </div>
                              <div className="text-12-400 color-black-olive">
                                {bio}
                              </div>
                            </div>
                          </div>
                          <div className="text-14-400 color-black-olive mt-2 ms-2">
                            {elm?.comment}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={htmlElRef} />
                  </div>
                </Card>
              )}
              {getDataFromLocalStorage("id") && (
                <Card className="mt-2">
                  <div className="cpt-16 cps-24 cpb-16 border-bottom">
                    Add Comment
                  </div>
                  <div className="cps-24 cpe-24 cpt-24 cpb-24">
                    <TextArea
                      placeholder="Enter your comment"
                      rows={3}
                      value={newComment}
                      onChange={(e) => {
                        setNewComment(trimLeftSpace(e.target.value));
                      }}
                    />
                    <div
                      className="send-btn"
                      onClick={() => {
                        if (newComment) {
                          handelCommentPost();
                        }
                      }}
                    >
                      <span>Send</span>
                      <span>
                        {commentLoader ? (
                          <Loader size="sm" />
                        ) : (
                          <i className="bi bi-send-fill" />
                        )}
                      </span>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
          {type === 3 && (
            <>
              <Row>
                <Col sm={8}>
                  <CitationsList postID={postID} />
                </Col>
                <Col sm={4}>
                  <CitationsResearchersList
                    postID={postID}
                    setConnectModel={setConnectModel}
                  />
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default PostDetails;
