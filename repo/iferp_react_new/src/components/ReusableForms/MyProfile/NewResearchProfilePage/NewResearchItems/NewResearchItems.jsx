import React, { useEffect, useState } from "react";

import Button from "components/form/Button";
import CheckBox from "components/form/CheckBox";
import SeachInput from "components/form/SeachInput";
import Profile from "components/Layout/Profile";
import { useDispatch } from "react-redux";
import { omit } from "lodash";
import { fetchResearchItems } from "store/slices";
import moment from "moment";
import { cloneDeep } from "lodash";
import Loader from "components/Layout/Loader";
import { titleCaseString } from "utils/helpers";
import { useNavigate } from "react-router-dom";
import "./NewResearchItems.scss";

const NewResearchItems = ({
  userID,
  setConnectModel,
  isLoginUser,
  loginUser,
  loginUserType,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const [isLoading, setIsLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [timer, setTimer] = useState("");

  const [params, setParams] = useState({
    post_sub_categories: "",
    post_categories: "",
    limit: 4,
    title: "",
    total: 0,
    offset: 0,
    user_id: userID,
  });

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

  const { post_categories, post_sub_categories, title: searchText } = params;

  return (
    <div className="row">
      <div className="col-md-4">
        <div className=" h-100 border-end">
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
        </div>
      </div>
      <div className="col-md-8">
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
          <div className="text-18-500 color-4b4b font-poppins cpt-10">
            Research Feeds ({params?.total})
          </div>
          <div className="cpt-10">
            <SeachInput
              placeholder="Search Research Items"
              value={searchText}
              onChange={handelSearch}
            />
          </div>
        </div>
        <div className="cps-18 cpe-18 cpt-26 cpb-20">
          {isLoading ? (
            <div className="cpt-50 cpb-50">
              <Loader size="md" />
            </div>
          ) : itemList?.length === 0 ? (
            <div className="center-flex cpt-40 cpb-50 text-15-400">
              No Data Found
            </div>
          ) : (
            itemList?.map((elem, index) => {
              const {
                title,
                category_name,
                created_date,
                total_reads,
                total_likes,
                total_shares,
                total_comments,
                user_details,
                co_authors,
                author_details,
              } = elem;
              const { name, profile_photo } = user_details || {};
              const authorName = author_details?.name || name || "";
              const authorProfie =
                author_details?.profile_photo || profile_photo || "";
              let isAnyCoAuthor = co_authors?.some((o) => o?.is_ownership);

              return (
                <div key={index} className="border rounded mb-3">
                  <div className="cps-12 cpe-12 cpt-16 cpb-22 border-bottom">
                    <div className="text-14-500 color-3d3d mt-1 mb-2 pointer post-t-block w-fit">
                      {titleCaseString(title)}
                    </div>
                    <div
                      className={`d-flex gap-3 align-items-center ${
                        authorName && isAnyCoAuthor && "flex-wrap"
                      }`}
                    >
                      {authorName && (
                        <div className="d-flex gap-2 align-items-center flex-wrap">
                          <span className="text-13-500 color-3d3d">
                            Author:
                          </span>
                          <span>
                            <Profile
                              isRounded
                              text={authorName}
                              size="s-18"
                              url={authorProfie}
                              isS3UserURL
                            />
                          </span>
                          <span className="text-13-400 color-3d3d text-wrap">
                            {authorName}
                          </span>
                        </div>
                      )}
                      {isAnyCoAuthor && (
                        <div className="d-flex gap-2 align-items-center">
                          <span className="text-13-500 color-3d3d">
                            Co-Author:
                          </span>
                          <span className="d-flex align-items-center flex-wrap gap-2">
                            {co_authors?.map((el, ind) => {
                              return (
                                <React.Fragment key={ind}>
                                  <span>
                                    <Profile
                                      isRounded
                                      text={el?.name}
                                      size="s-18"
                                      url={el?.profile_photo}
                                      isS3UserURL
                                    />
                                  </span>
                                  <span className="text-13-400 color-3d3d text-wrap">
                                    {el?.name}
                                  </span>
                                </React.Fragment>
                              );
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="d-flex align-items-center gap-4 mt-2 flex-wrap">
                      <Button
                        isSquare
                        text={category_name}
                        btnStyle="primary-light"
                        className="text-13-400 h-auto text-nowrap"
                      />

                      <div className="text-14-400 color-davys-gray">
                        {moment(created_date, "DD-MM-YYYY HH:mm:ss").format(
                          "MMMM YYYY"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="cps-12 cpe-12 pt-2 pb-2 d-flex align-items-center justify-content-between">
                    <div className="text-12-400 color-3d3d d-flex align-items-center flex-wrap">
                      <span>{total_reads} Reads</span>
                      <span className="vr ms-2 me-2" />
                      <span>{total_likes} Likes</span>
                      <span className="vr ms-2 me-2" />
                      <span>{total_shares} Shares</span>
                      <span className="vr ms-2 me-2" />
                      <span>{total_comments} Comments</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {itemList?.length > 4 && (
            <div
              className="text-16-500 color-105d bg-cd1f br-4 text-center p-2 pointer"
              onClick={() => {
                if (!isLoginUser) {
                  setConnectModel(true);
                  return;
                }
                navigate(
                  `/${loginUserType}/network-management/network/posts/discover-posts`
                );
              }}
            >
              View All Research Feeds
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewResearchItems;
