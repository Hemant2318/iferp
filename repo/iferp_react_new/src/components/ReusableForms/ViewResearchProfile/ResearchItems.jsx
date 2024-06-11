import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { cloneDeep, omit } from "lodash";
import Button from "components/form/Button";
import CheckBox from "components/form/CheckBox";
import SeachInput from "components/form/SeachInput";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import DeletePopup from "components/Layout/DeletePopup";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import {
  deletePost,
  fetchResearchItems,
  setRProfileID,
  storePostList,
} from "store/slices";
import { useParams } from "react-router-dom";
import { membershipType } from "utils/constants";

const ResearchItems = ({ userID, isMyProfile }) => {
  const dispatch = useDispatch();
  const param = useParams();
  const { memberType, type } = param;
  const [postId, setPostId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState("");
  const [filter, setFilter] = useState([
    {
      id: 1,
      name: "Conference Paper",
    },
    {
      id: 2,
      name: "Presentation",
    },
    {
      id: 3,
      name: "Poster (Conference poster)",
    },
    {
      id: 4,
      name: "Data (Tables, images, etc)",
    },
    {
      id: 5,
      name: "Published Research (Articles, books, etc)",
      data: [
        {
          id: 1,
          category_id: 5,
          name: "Article",
        },
        {
          id: 2,
          category_id: 5,
          name: "Book",
        },
        {
          id: 3,
          category_id: 5,
          name: "Chapter",
        },
        {
          id: 4,
          category_id: 5,
          name: "Code",
        },
        {
          id: 5,
          category_id: 5,
          name: "Cover Page",
        },
        {
          id: 6,
          category_id: 5,
          name: "Experimental Findings",
        },
        {
          id: 7,
          category_id: 5,
          name: "Thesis",
        },
        {
          id: 8,
          category_id: 5,
          name: "Technical Report",
        },
        {
          id: 9,
          category_id: 5,
          name: "Raw Data",
        },
        {
          id: 10,
          category_id: 5,
          name: "Patent",
        },
      ],
    },
    {
      id: 6,
      name: "Preprint (Draft or paper before peer review)",
    },
    {
      id: 7,
      name: "Others (Methods, proposal, code, etc)",
      data: [
        {
          id: 11,
          category_id: 7,
          name: "Code",
        },
        {
          id: 12,
          category_id: 7,
          name: "Cover Page",
        },
        {
          id: 13,
          category_id: 7,
          name: "Experiment Findings",
        },
        {
          id: 14,
          category_id: 7,
          name: "Method",
        },
        {
          id: 15,
          category_id: 7,
          name: "Negative Results",
        },
        {
          id: 16,
          category_id: 7,
          name: "Raw Data",
        },
        {
          id: 17,
          category_id: 7,
          name: "Research Proposal",
        },
        {
          id: 18,
          category_id: 7,
          name: "Thesis",
        },
      ],
    },
  ]);
  const [itemList, setItemList] = useState([]);
  const [params, setParams] = useState({
    post_sub_categories: "",
    post_categories: "",
    limit: 5,
    title: "",
    total: 0,
    offset: 0,
    user_id: userID,
  });

  const handelPagination = (type) => {
    let oldData = cloneDeep(params);
    let offset = oldData?.offset;
    if (type === "NEXT") {
      offset = offset + params?.limit;
    }
    if (type === "PREV") {
      offset = offset - params?.limit <= 0 ? 0 : offset - params?.limit;
    }
    let newData = { ...oldData, offset: offset };
    setParams(newData);
    getPost(newData);
  };

  const handelFilter = (field, id) => {
    const oldData = cloneDeep(params);
    let oldValue = oldData[field] ? oldData[field].split(",") : [];
    if (oldValue.includes(`${id}`)) {
      oldValue = oldValue.filter((o) => o !== `${id}`);
    } else {
      oldValue.push(id);
    }
    const newData = { ...oldData, [field]: oldValue.toString() };
    setParams(newData);
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      getPost(newData);
    }, 800);
    setTimer(time);
  };
  const handelSearch = (e) => {
    const newData = { ...params, title: e.target.value };
    setParams(newData);
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      getPost(newData);
    }, 800);
    setTimer(time);
  };
  const getPost = async (object) => {
    setIsLoading(true);
    let queryParams = new URLSearchParams(omit(object, ["total"])).toString();
    const response = await dispatch(fetchResearchItems(`?${queryParams}`));
    setParams({ ...object, total: response?.data?.result_count || 0 });
    setItemList(response?.data?.posts || []);
    setFilter(response?.data?.research_items || []);
    setIsLoading(false);
  };
  useEffect(() => {
    getPost(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    total,
    limit,
    offset,
    post_categories,
    post_sub_categories,
    title: searchText,
  } = params;

  const totalPage = Math.ceil(total / limit);
  const activePage = Math.floor(offset / limit + 1);
  let page1 = activePage;
  let page2 = activePage + 1;
  let page3 = activePage + 2;
  if (activePage >= totalPage - 2) {
    page1 = totalPage - 2;
    page2 = totalPage - 1;
    page3 = totalPage - 0;
  }

  let loginUserType = "";
  if (getDataFromLocalStorage("id")) {
    loginUserType =
      membershipType.find((o) => o.id === getDataFromLocalStorage("user_type"))
        ?.type || "";
  }

  return (
    <div className="row">
      {postId && (
        <DeletePopup
          title="Delete Post"
          message="Are you sure you want to delete this post?"
          id={postId}
          onHide={() => {
            setPostId(null);
          }}
          handelSuccess={() => {
            const oldPostList = [...itemList].filter((o) => o.id !== postId);
            dispatch(storePostList(oldPostList));
            setPostId(null);
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ post_id: postId, key: "delete" });
            const response = await dispatch(deletePost(forData));
            return response;
          }}
        />
      )}
      <div className="col-md-4">
        <Card className="cps-16 cpe-16 cpt-20 pb-1 mb-3 h-100">
          {filter.map((elem, index) => {
            const { id, name, sub_categories = [], count = 0 } = elem;
            const isParentCheck = post_categories
              ?.split(",")
              ?.includes(`${id}`);
            return (
              <React.Fragment key={index}>
                <div className="d-flex align-items-center gap-2 text-14-400 color-black-olive mb-3">
                  <CheckBox
                    type="PRIMARY-ACTIVE"
                    isChecked={isParentCheck}
                    onClick={() => {
                      handelFilter("post_categories", id);
                    }}
                  />
                  <div>{`${name.replace(/\(.*\)/, "")} (${count})`}</div>
                </div>
                <div className={`cms-20 ${isParentCheck ? "" : "d-none"}`}>
                  {sub_categories.map((cElem, cIndex) => {
                    const isChildCheck = post_sub_categories
                      ?.split(",")
                      ?.includes(`${cElem?.id}`);
                    return (
                      <div
                        className="d-flex align-items-center gap-2 text-14-400 color-black-olive mb-3"
                        key={cIndex}
                      >
                        <CheckBox
                          type="PRIMARY-ACTIVE"
                          isChecked={isChildCheck}
                          onClick={() => {
                            handelFilter("post_sub_categories", cElem?.id);
                          }}
                        />
                        <div>{`${cElem?.name?.replace(/\(.*\)/, "")}`}</div>
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            );
          })}
        </Card>
      </div>
      <div className="col-md-8">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="text-20-500 color-title-navy font-poppins">
            My Research Items
          </div>
        </div>
        <Card className="cps-18 cpe-18 cpt-26 cpb-20">
          <div className="row cmb-22">
            <div className="col-md-6">
              <SeachInput
                placeholder="Search Research Items"
                value={searchText}
                onChange={handelSearch}
              />
            </div>
          </div>
          {isLoading ? (
            <div className="cpt-50 cpb-50">
              <Loader size="md" />
            </div>
          ) : itemList.length === 0 ? (
            <div className="center-flex cpt-40 cpb-50 text-15-400">
              No Data Found
            </div>
          ) : (
            itemList?.map((elem, index) => {
              const {
                id,
                title,
                sub_category_name,
                category_name,
                created_date,
                total_reads,
                total_likes,
                total_shares,
                total_comments,
                user_details,
                co_authors,
                author_details,
                create_by,
              } = elem;

              const isDelete = getDataFromLocalStorage("id") === +create_by;
              const {
                name,
                profile_photo,
                user_type,
                id: userIDetailD,
              } = user_details || {};
              const authorName = author_details?.name || name || "";
              const authorProfie =
                author_details?.profile_photo || profile_photo || "";
              const authorType = author_details?.user_type || user_type || "";
              const authorID = author_details?.user_id || userIDetailD || "";
              let isAnyCoAuthor = co_authors?.some((o) => o.is_ownership);
              const isAuthorResearchProfile =
                ["2", "5"].includes(authorType) && isMyProfile;
              return (
                <div key={index} className="border rounded mb-3">
                  <div className="cps-12 cpe-12 cpt-16 cpb-22 border-bottom">
                    <div
                      className="text-14-400 color-new-car mt-1 mb-2 pointer post-t-block w-fit"
                      onClick={() => {
                        if (loginUserType) {
                          localStorage.prevRoute = window.location.pathname;
                          window.open(
                            `/${loginUserType}/network-management/network/post/post-details/${id}`,
                            "_blank"
                          );
                          // navigate(
                          //   `/${loginUserType}/network-management/network/post/post-details/${id}`
                          // );
                        } else if (memberType) {
                          window.open(
                            `/${memberType}/${type}/network/post/post-details/${id}`,
                            "_blank"
                          );
                        } else {
                          window.open("/member/login", "_blank");
                        }
                      }}
                    >
                      <u>{title}</u>
                    </div>
                    {authorName && (
                      <>
                        <div className="text-13-500 color-raisin-black mb-1">
                          Author
                        </div>
                        <div className="primary-li d-flex gap-2">
                          <span>
                            <Profile
                              isRounded
                              text={authorName}
                              size="s-18"
                              url={authorProfie}
                              isS3UserURL
                            />
                          </span>
                          <span
                            className={`text-13-400 text-nowrap ${
                              isAuthorResearchProfile
                                ? "color-new-car pointer hover-effect"
                                : ""
                            }`}
                            onClick={() => {
                              if (isAuthorResearchProfile) {
                                dispatch(setRProfileID(authorID));
                              }
                            }}
                          >
                            {authorName}
                          </span>
                        </div>
                      </>
                    )}
                    {isAnyCoAuthor && (
                      <>
                        <div className="text-13-500 color-raisin-black mb-1 mt-1">
                          Co Author
                        </div>
                        <div className="d-flex align-items-center flex-wrap text-12-400 color-black-olive gap-3">
                          {co_authors?.map((el, index) => {
                            const isReasearchProfile =
                              ["2", "5"].includes(el?.user_type) && isMyProfile;
                            return (
                              <div
                                className="primary-li d-flex gap-2"
                                key={index}
                              >
                                <span>
                                  <Profile
                                    isRounded
                                    text={el?.name}
                                    size="s-18"
                                    url={el?.profile_photo}
                                    isS3UserURL
                                  />
                                </span>
                                <span
                                  className={`text-13-400 text-nowrap ${
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
                                  {el?.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                    <div className="d-flex align-items-center gap-4 mt-2">
                      <Button
                        isSquare
                        text={sub_category_name || category_name}
                        btnStyle="primary-light"
                        className="text-12-400 h-auto text-nowrap"
                      />

                      <div className="text-12-400 color-black-olive">
                        {moment(created_date, "DD-MM-YYYY hh:mm A").format(
                          "MMMM YYYY"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="cps-12 cpe-12 pt-2 pb-2 d-flex align-items-center justify-content-between">
                    <div className="text-13-500 color-raisin-black d-flex align-items-center">
                      <span>{total_reads} Reads</span>
                      <span className="vr ms-2 me-2" />
                      <span>{total_likes} Likes</span>
                      <span className="vr ms-2 me-2" />
                      <span>{total_shares} Shares</span>
                      <span className="vr ms-2 me-2" />
                      <span>{total_comments} Comments</span>
                    </div>
                    {isMyProfile && isDelete && (
                      <div className="text-13-500 color-black-olive d-flex align-items-center">
                        <span className="vr ms-2 me-2" />
                        <span
                          className="pointer"
                          onClick={() => {
                            setPostId(id);
                          }}
                        >
                          Remove
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          {/* pagination code */}
          {!isLoading && total > 10 && (
            <div className="d-flex align-items-center justify-content-center pt-3 text-14-400 color-black-olive">
              <span
                className={`ms-3 me-3 d-flex ${
                  activePage === 1 ? "" : "color-new-car pointer"
                }`}
                onClick={() => {
                  if (activePage !== 1) {
                    handelPagination("PREV");
                  }
                }}
              >
                <i className="bi bi-chevron-left d-flex" />
              </span>
              <span
                className={`me-3 ${
                  activePage === 1 ? "" : "color-new-car pointer"
                }`}
                onClick={() => {
                  if (activePage !== 1) {
                    handelPagination("PREV");
                  }
                }}
              >
                Prev
              </span>
              {activePage > 1 && totalPage > 3 && (
                <>
                  <span className="ms-3 me-3">1</span>
                  <span className="ms-3 me-3">.....</span>
                </>
              )}
              <span
                className={`ms-3 me-3 ${
                  page1 === activePage ? "color-new-car" : ""
                }`}
              >
                {page1}
              </span>
              <span
                className={`ms-3 me-3 ${
                  page2 === activePage ? "color-new-car" : ""
                }`}
              >
                {page2}
              </span>
              <span
                className={`ms-3 me-3 ${
                  page3 === activePage ? "color-new-car" : ""
                }`}
              >
                {page3}
              </span>
              {totalPage >= 5 && page3 !== totalPage && (
                <>
                  <span className="ms-3 me-3">.....</span>
                  <span className="ms-3 me-3">{totalPage}</span>
                </>
              )}

              <span
                className={`ms-3 ${
                  activePage === totalPage ? "" : "color-new-car pointer"
                }`}
                onClick={() => {
                  if (activePage !== totalPage) {
                    handelPagination("NEXT");
                  }
                }}
              >
                Next
              </span>
              <span
                className={`ms-3 me-3 d-flex ${
                  activePage === totalPage ? "" : "color-new-car pointer"
                }`}
                onClick={() => {
                  if (activePage !== totalPage) {
                    handelPagination("NEXT");
                  }
                }}
              >
                <i className="bi bi-chevron-right d-flex" />
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
export default ResearchItems;
