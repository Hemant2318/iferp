import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { capitalize, ceil, join, map, omit, toLower, words } from "lodash";
import { icons } from "utils/constants";
import {
  topResearchPredio,
  usefulUnusefulPost,
  saveUnsavePost,
} from "store/globalSlice";
import { networkPath } from "utils/constants";
import { Button, Profile, VideoPreview, Loader, Share } from "components";
import {
  // titleCaseString,
  objectToFormData,
  generatePreSignedUrl,
  downloadFile,
  messageTime,
} from "utils/helpers";
import ExportCitationPopup from "../../../components/layouts/ExportCitationPopup/ExportCitationPopup";

const DynamicPostType = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { type } = params;
  const dispatch = useDispatch();
  const [exportPopup, setExportPopup] = useState("");

  const [pageData, setPageData] = useState({
    page: 1,
    limit: 5,
    data: [],
    total: 0,
    isLoading: true,
    category: type ? type?.replace("-", " ") : "",
    predio: 1,
  });
  const toSentenceCase = (inputString) => {
    // Convert the string to lower case and split into words
    const words2 = words(toLower(inputString));
    // Capitalize the first word and join the rest with a space
    const sentenceCase = join(map(words2, capitalize), " ");
    return sentenceCase;
  };
  const handelSaveUnsave = async (postID, status) => {
    const response = await dispatch(
      saveUnsavePost(objectToFormData({ post_id: postID }))
    );
    if (response?.status === 200) {
      let newData = JSON.parse(JSON.stringify(pageData?.data));
      newData = newData?.map((elm) => {
        let newElem = elm;
        if (newElem.id === postID) {
          newElem.is_saved = status === 0 ? 1 : 0;
        }
        return newElem;
      });
      setPageData((prev) => {
        return { ...prev, data: newData };
      });
    }
  };
  const handelLikeDislikePost = async (postID, status) => {
    const response = await dispatch(
      usefulUnusefulPost(objectToFormData({ post_id: postID }))
    );
    if (response?.status === 200) {
      let newData = JSON.parse(JSON.stringify(pageData?.data));
      newData = newData?.map((elm) => {
        let newElem = elm;
        if (newElem.id === postID) {
          const isAddLike = status === 0;
          newElem.is_liked = isAddLike ? 1 : 0;
          newElem.total_likes = isAddLike
            ? newElem.total_likes + 1
            : newElem.total_likes - 1;
        }
        return newElem;
      });
      setPageData((prev) => {
        return { ...prev, data: newData };
      });
    }
  };
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
    const oldData = JSON.parse(JSON.stringify(pageData));
    oldData.page = newPage;
    oldData.isLoading = true;
    setPageData(oldData);
    getPageData(oldData);
  };
  const getPageData = async (fData) => {
    const payload = omit(fData, ["data", "total", "isLoading"]);
    const response = await dispatch(
      topResearchPredio(objectToFormData(payload))
    );
    setPageData((prev) => {
      return {
        ...prev,
        isLoading: false,
        data: response?.data?.result || [],
        total: response?.data?.total_count || [],
      };
    });
  };
  useEffect(() => {
    getPageData({ ...pageData, category: type ? type?.replace("-", " ") : "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);
  const { data, total, limit, page, isLoading } = pageData;
  const totalPage = ceil(total / limit);
  const activePage = page;
  let page1 = activePage;
  let page2 = activePage + 1;
  let page3 = activePage + 2;
  if (activePage >= totalPage - 2) {
    page1 = totalPage - 2 <= 0 ? 1 : totalPage - 2;
    page2 = totalPage - 1 <= 1 ? 2 : totalPage - 1;
    page3 = totalPage - 0 <= 2 ? 3 : totalPage - 0;
  }
  let title = "";
  if (type) {
    title = toSentenceCase(type?.replace("-", " "));
  }

  return (
    <div className="shadow">
      {exportPopup && (
        <ExportCitationPopup
          exportPopup={exportPopup}
          setExportPopup={setExportPopup}
        />
      )}
      <div className="fb-center bb-e3e3">
        <div className="cp-20 text-17-400 lh-21 color-2121">{`All ${
          title || ""
        }`}</div>
        <div
          className="cp-20 text-14-400 lh-21 href-block"
          onClick={() => {
            navigate("/post");
          }}
        >
          View All
        </div>
      </div>
      {isLoading ? (
        <div className="cpt-150 cpb-150">
          <Loader size="md" />
        </div>
      ) : (
        <>
          <div className="cps-20 cpe-20 cpt-26 cpb-26">
            {data?.length > 0 ? (
              data?.map((el, index) => {
                const {
                  id,
                  title,
                  category_name,
                  post,
                  author_details,
                  co_author_details,
                  doi,
                  page_number_from,
                  page_number_to,
                  total_reads,
                  total_shares,
                  user_details,
                  total_likes,
                  presentation_link,
                  thumbnail,
                  created_date,
                  is_liked,
                  is_saved,
                } = el;
                const {
                  name: uName,
                  profile_photo: uProfile,
                  institution_name,
                  country,
                  state,
                } = user_details || {};

                let acList = [];
                if (author_details?.name) {
                  acList.push(author_details);
                }
                if (co_author_details?.length > 0) {
                  acList.push(...co_author_details);
                }
                return (
                  <React.Fragment key={index}>
                    <div className="bb-e3e3 cpt-20">
                      <div className="fb-center">
                        <div className="fa-center gap-3">
                          <Profile
                            size="s-44"
                            isRounded
                            isS3UserURL
                            text={uName}
                            url={uProfile}
                          />
                          <div>
                            <div className="text-15-500 lh-28 color-3d3d">
                              {uName}
                            </div>
                            <div className="text-14-400 lh-22 color-6666">
                              {institution_name
                                ? institution_name
                                : country
                                ? `${country}, ${state}`
                                : ""}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-13-400 lh-19 color-7070">
                            {messageTime(created_date)}
                          </div>
                        </div>
                      </div>
                      <div className="text-16-500 lh-24 color-2121 mt-3 mb-3 hover-effect pointer">
                        {title}
                      </div>
                      <div className="row">
                        <div className="col-md-4 cmb-20">
                          <VideoPreview
                            isVideoURL
                            poster={thumbnail}
                            src={presentation_link}
                          />
                        </div>
                        <div className="col-md-8">
                          <div className="d-flex gap-3 mb-3 flex-wrap">
                            <Button
                              btnText={category_name}
                              btnStyle="GD"
                              onClick={() => {}}
                              className="ps-4 pe-4 text-13-400 lh-21 h-32 text-truncate"
                            />
                            {post && (
                              <Button
                                btnText="Full-text available"
                                btnStyle="PO"
                                onClick={() => {}}
                                className="text-13-400 lh-21 h-32 text-truncate"
                              />
                            )}
                          </div>
                          {acList?.length > 0 && (
                            <div className="fa-center gap-3 mb-3">
                              {acList?.map((elm, index) => {
                                return (
                                  <div
                                    className={`fa-center gap-2 ${
                                      elm?.name ? "" : "d-none"
                                    }`}
                                    key={index}
                                  >
                                    <Profile
                                      isRounded
                                      isS3UserURL
                                      text={elm.name}
                                      size="s-26"
                                      url={elm.profile_photo}
                                    />
                                    <div className="text-14-400 lh-21 color-3434">
                                      {elm.name}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {(doi || page_number_from) && (
                            <div className="fa-center gap-4 text-14-400 lh-21 color-3d3d mb-3">
                              {doi && (
                                <div>
                                  DOI -
                                  <span className="text-14-500 ms-1">
                                    {doi}
                                  </span>
                                </div>
                              )}
                              {page_number_from && page_number_to && (
                                <div>
                                  Proceeding page -
                                  <span className="text-14-500 ms-1">
                                    {page_number_from} to {page_number_to}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="fa-center gap-3">
                            <div className="fa-center text-14-400 color-5555 gap-1">
                              <span>
                                <img src={icons.eye} alt="eye" />
                              </span>
                              <span>{total_reads} Views</span>
                            </div>
                            <div className="fa-center text-14-400 color-5555 gap-1">
                              <span>
                                <img src={icons.share} alt="eye" />
                              </span>
                              <span>{total_shares} Citations</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between cmt-10 flex-wrap">
                        <div className="cmb-20">
                          {presentation_link && (
                            <Button
                              btnText="Presentations"
                              btnStyle="SO"
                              leftIcon={icons.downloadArrow}
                              className="h-38"
                              onClick={async () => {
                                const response = await generatePreSignedUrl(
                                  presentation_link,
                                  networkPath
                                );
                                dispatch(downloadFile(response));
                              }}
                            />
                          )}
                        </div>
                        <div className="cmb-20">
                          <Button
                            btnText="Export Citation"
                            btnStyle="SO"
                            className="h-38"
                            onClick={() => {
                              setExportPopup(id);
                            }}
                          />
                        </div>
                        <div className="d-flex align-items-center cmb-20 gap-5">
                          {/* <div className="d-flex align-items-center gap-4"> */}
                          <div className="">
                            <div className="fa-center gap-2">
                              <span
                                className="d-flex h-16 w-16 pointer"
                                onClick={() => {
                                  handelLikeDislikePost(id, is_liked);
                                }}
                              >
                                <img
                                  alt="fit-image"
                                  className={`te-anim ${
                                    is_liked ? "filled" : ""
                                  }`}
                                  src={
                                    is_liked
                                      ? icons.activeLike
                                      : icons.successLike
                                  }
                                />
                              </span>
                              <span className="text-14-500 color-1818 pt-1">
                                {total_likes}
                              </span>
                              <span className="text-14-400 color-5555 pt-1">
                                Useful
                              </span>
                            </div>
                          </div>
                          <div className="">
                            <div className="fa-center gap-2">
                              <span
                                className="d-flex h-16 w-16 pointer"
                                onClick={() => {
                                  handelSaveUnsave(id, is_saved);
                                }}
                              >
                                <img
                                  alt="fit-image"
                                  className={`te-anim ${
                                    is_saved ? "filled" : ""
                                  }`}
                                  src={
                                    is_saved
                                      ? icons.activeSave
                                      : icons.successSave
                                  }
                                />
                              </span>

                              <span className="text-14-400 color-5555">
                                Save
                              </span>
                            </div>
                          </div>
                          <div className="">
                            <Share
                              type="POST"
                              url={`/member/global-post/${id}`}
                              title={`hey, kindly Check ${category_name} on ${title}`}
                            />
                          </div>
                          {/* </div> */}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            ) : (
              <div className="center-flex d-flex align-items-center justify-content-center">
                No Data Found
              </div>
            )}
          </div>
          {totalPage > 1 && (
            <div className="f-center cpb-30 footer-block">
              <div className="fa-center gap-2 cms-30">
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
                    activePage !== totalPage ? "active-icon-btn" : "opacity-75"
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
          )}
        </>
      )}
    </div>
  );
};

export default DynamicPostType;
