import React, { useRef } from "react";
import { Card } from "react-bootstrap";
import { fetchAllCitations } from "store/slices";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  downloadFile,
  generatePreSignedUrl,
  getDataFromLocalStorage,
  objectToFormData,
} from "utils/helpers";
import { networkPath } from "utils/constants";
import Profile from "components/Layout/Profile";
import { membershipType } from "utils/constants";
import "./CitationList.scss";

function CitationsList({ postID }) {
  const [citationList, setCitationList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const offsetRef = useRef(0);
  const totalDocRef = useRef(0);

  const getCitationList = async () => {
    const response = await dispatch(
      fetchAllCitations(
        objectToFormData({
          post_id: postID,
          offset: offsetRef.current,
          total: 0,
          limit: 10,
        })
      )
    );
    if (response?.data) {
      offsetRef.current = offsetRef.current + 10;
      totalDocRef.current = response?.data?.result_count;
      setCitationList((prev) => {
        let resData = response?.data?.result || [];
        let listData = [...prev, ...resData];
        return listData;
      });
      setTotalCount(response?.data?.result_count);
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    offsetRef.current = 0;
    getCitationList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadPdf = async (post) => {
    let postResponse = await generatePreSignedUrl(post, networkPath);
    dispatch(downloadFile(postResponse));
  };

  let loginUserType = "";
  if (getDataFromLocalStorage("id")) {
    loginUserType =
      membershipType.find((o) => o.id === getDataFromLocalStorage("user_type"))
        ?.type || "";
  }

  return (
    <>
      <Card className="mt-2 border-0 h-100">
        <div className="cpt-16 cps-24 cpb-16 border-bottom text-16-400">
          All Citations ({totalDocRef.current})
        </div>
        <div className="cps-24 cpe-24 cpt-24 cpb-24">
          {citationList?.length === 0 ? (
            <div className="cps-8 cpe-8 cpt-8 cpb-12 d-flex justify-content-center color-dark-silver">
              No Records Found.
            </div>
          ) : (
            citationList?.map((elm, index) => {
              const {
                id,
                title,
                created_date,
                profile_photo,
                author_name,
                post,
                category_name,
              } = elm;
              var ext = post.substring(post.lastIndexOf(".") + 1);
              return (
                <div
                  className={`border rounded-1 border-rounded cps-12 cpe-12 cpt-12 cpb-12  mb-3`}
                  key={index}
                >
                  <div className="d-flex gap-2">
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <div
                          className="text-15-500 color-raisin-black pointer hover-effect"
                          onClick={() =>
                            window.open(
                              `/${loginUserType}/network-management/network/post/post-details/${id}`,
                              "_blank"
                            )
                          }
                        >
                          {title}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex flex-wrap gap-3 mt-3 align-items-center">
                    {category_name && (
                      <div id="button-container">
                        <button
                          type="button"
                          class="btn w-100 d-flex align-items-center justify-content-center primary-light btn-square h-auto text-nowrap color-black-olive bg-navy-light text-14-400"
                        >
                          {category_name}
                        </button>
                      </div>
                    )}
                    {post && (
                      <div id="button-container">
                        <button
                          type="button"
                          class="btn w-100 d-flex align-items-center justify-content-center primary-outline btn-square h-auto text-nowrap text-14-400"
                        >
                          Full-text available
                        </button>
                      </div>
                    )}
                    <div className="text-14-400 ">{created_date}</div>
                  </div>
                  <div class="d-flex flex-wrap gap-3 mt-3 align-items-center">
                    <Profile
                      isRounded
                      isS3UserURL
                      text={author_name}
                      size="s-22"
                      url={profile_photo}
                    />
                    <div className="text-14-400 ">{author_name}</div>
                  </div>
                  <div class="d-flex flex-wrap gap-4 mt-3 align-items-center">
                    <div
                      className="text-15-400 color-new-car pointer"
                      onClick={() =>
                        window.open(
                          `/${loginUserType}/network-management/network/post/post-details/${id}`,
                          "_blank"
                        )
                      }
                    >
                      View
                    </div>
                    {post && ext === "pdf" && (
                      <div
                        className="text-15-400 color-new-car pointer"
                        onClick={() => downloadPdf(post)}
                      >
                        Download
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {totalCount > 10 && offsetRef.current < totalDocRef.current && (
          <div
            className="text-15-400 bg-FAFA view-all d-flex align-items-center justify-content-center"
            onClick={() => {
              getCitationList();
            }}
          >
            {totalDocRef.current - offsetRef.current >= 10
              ? "Show More 10"
              : `Show More ${totalDocRef.current - offsetRef.current}`}
          </div>
        )}
      </Card>
    </>
  );
}

export default CitationsList;
