import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ceil, omit } from "lodash";
import { Profile, VideoPreview, Loader, Share } from "components";
import { messageTime, titleCaseString, objectToFormData } from "utils/helpers";
import { icons } from "utils/constants";
import {
  topResearchPredio,
  saveUnsavePost,
  usefulUnusefulPost,
} from "store/globalSlice";

const TrendingResearchPredio = () => {
  const dispatch = useDispatch();
  const [pageData, setPageData] = useState({
    data: [],
    page: 1,
    total: 0,
    limit: 5,
    predio: 1,
    isLoading: true,
  });
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
  const getPageData = async (obj) => {
    const payload = omit(obj, ["list", "total"]);
    const formData = objectToFormData(payload);
    const response = await dispatch(topResearchPredio(formData));
    setPageData((prev) => {
      return {
        ...prev,
        data: response?.data?.result || [],
        total: response?.data?.total_count || 0,
        isLoading: false,
      };
    });
  };
  useEffect(() => {
    getPageData(pageData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  return (
    <div className="shadow trending-research-predio">
      <div className="fb-center bb-e3e3">
        <div className="cp-20 text-17-400 lh-21 color-2121">
          Trending Research Presentations ({total})
        </div>
      </div>
      <div className="cps-20 cpe-20 cpt-26 cpb-26">
        {isLoading ? (
          <div className="cpt-100 cpb-100">
            <Loader size="md" />
          </div>
        ) : data?.length === 0 ? (
          <div className="text-center cpt-100 cpb-100">No Data Found</div>
        ) : (
          <>
            {data?.map((el, index) => {
              const {
                id,
                user_details = {},
                presentation_link,
                thumbnail,
                title,
                total_likes,
                created_date,
                is_liked,
                is_saved,
              } = el;
              const {
                name,
                state,
                country,
                profile_photo,
                designation,
                institution_name,
                category_name,
              } = user_details;

              return (
                <React.Fragment key={index}>
                  <div>
                    <div className="fb-center">
                      <div className="fa-center gap-3">
                        <Profile
                          isRounded
                          isS3UserURL
                          text={name}
                          size="s-48"
                          url={profile_photo}
                        />
                        <div>
                          <div className="text-15-500 lh-28 color-3d3d">
                            {name}
                          </div>
                          <div className="text-14-400 lh-22 color-6666">
                            {`${
                              (designation || "") && (institution_name || "")
                            } ${(state || "") && (country || "")}`}
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
                      {titleCaseString(title)}
                    </div>
                    <div>
                      <VideoPreview
                        size="lg"
                        isVideoURL
                        src={presentation_link}
                        poster={thumbnail}
                      />
                    </div>
                    <div className="mt-4">
                      <div className="fb-center">
                        <div className="fa-center gap-4">
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
                          {/* <div className="fa-center gap-2">
                        <span className="d-flex">
                          <img src={icons.successDeslike} alt="like" />
                        </span>
                        <span className="text-14-500 color-1818 lh-21">
                          0
                        </span>
                        <span className="text-14-400 color-5555 lh-21">
                          Contradict
                        </span>
                      </div> */}
                        </div>
                        <div className="fa-center gap-4">
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

                            <span className="text-14-400 color-5555">Save</span>
                          </div>
                          <Share
                            type="POST"
                            url={`/member/global-post/${id}`}
                            title={`hey, kindly Check ${category_name} on ${title}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bt-e1e1 mt-4" />
                </React.Fragment>
              );
            })}
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrendingResearchPredio;
