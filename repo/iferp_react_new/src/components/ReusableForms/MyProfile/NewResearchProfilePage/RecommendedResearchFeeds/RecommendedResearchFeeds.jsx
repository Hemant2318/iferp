import React, { useEffect, useState } from "react";
import Profile from "components/Layout/Profile";
import { objectToQueryParams, titleCaseString } from "utils/helpers";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRecommendedResearchFeed } from "store/slices";
import Loader from "components/Layout/Loader";
import moment from "moment";
import "./RecommendedResearchFeeds.scss";

const RecommendedResearchFeeds = ({
  setConnectModel,
  isLoginUser,
  loginUser,
  loginUserType,
}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [researchFeedList, setResearchFeedList] = useState([]);

  const getFeedData = async () => {
    setIsLoading(true);
    const queryParams = objectToQueryParams({ id: params?.id });
    const response = await dispatch(fetchRecommendedResearchFeed(queryParams));
    if (response?.status === 200) {
      setResearchFeedList(response?.data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getFeedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="recommended-research-feeds-container">
      <div className="cps-20 cpe-20 cpt-20 cpb-20">
        <div className="text-18-600 color-4b4b cmb-10">
          Recommended Research Feeds
        </div>
        {isLoading ? (
          <div className="cmt-50 cmb-50">
            <Loader size="md" />
          </div>
        ) : researchFeedList?.length === 0 ? (
          <div className="cpt-30 cpb-30 text-center">No Records Found.</div>
        ) : (
          researchFeedList?.slice(0, 3)?.map((elem, index) => {
            const {
              id,
              author_first_name,
              author_last_name,
              post_date,
              category,
              post_title,
            } = elem;
            const userName = titleCaseString(
              `${author_first_name} ${author_last_name}`
            );
            return (
              <React.Fragment key={index}>
                <div
                  className={`${
                    researchFeedList?.slice(0, 3)?.length - 1 !== index &&
                    "cpb-15"
                  } d-flex flex-column`}
                >
                  <div className="d-flex align-items-center gap-2 cmb-10">
                    <Profile isRounded text={userName} size="s-22" />
                    <span className="text-14-500 color-3d3d">{userName}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 cmb-10">
                    <span className="p-1 br-2 text-13-400 text-center bg-e8ff color-68d3">
                      {titleCaseString(category)}
                    </span>
                    <span className="text-13-400 color-4b4b">
                      {moment(post_date).format("MMM YYYY")}
                    </span>
                  </div>
                  <div
                    className="color-5068 text-14-500 pointer post-title text-wrap"
                    onClick={() => {
                      if (!isLoginUser) {
                        setConnectModel(true);
                        return;
                      }
                      navigate(
                        `/${loginUserType}/network-management/network/post/post-details/${id}`
                      );
                    }}
                  >
                    {titleCaseString(post_title)}
                  </div>
                </div>

                {researchFeedList?.slice(0, 3)?.length - 1 !== index && (
                  <div className="card-border-bottom cmb-10"></div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
      {researchFeedList?.length > 3 && (
        <div
          className="text-14-500 color-374e bg-f0f2 p-2 br-bs-be text-center pointer"
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
  );
};

export default RecommendedResearchFeeds;
