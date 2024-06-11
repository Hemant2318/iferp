import React, { useEffect, useState } from "react";
import {
  generatePreSignedUrl,
  objectToQueryParams,
  titleCaseString,
} from "utils/helpers";
import VideoPreview from "components/Layout/VideoPreview";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRecommendedPresentation } from "store/slices";
import Loader from "components/Layout/Loader";
import moment from "moment";
import { networkPath } from "utils/constants";
import "./RecommendedPresentations.scss";

const RecommendedPresentations = ({
  setConnectModel,
  isLoginUser,
  loginUserType,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [presentationData, setPresentationData] = useState([]);

  const getPresentationData = async () => {
    setIsLoading(true);
    const queryParams = objectToQueryParams({ id: params?.id });
    const response = await dispatch(fetchRecommendedPresentation(queryParams));
    if (response?.status === 200) {
      if (response?.data) {
        const presentationData = response?.data?.map(async (elm) => {
          let presantationRes = "";
          let thumbnailRes = "";
          if (elm?.presentation_link) {
            presantationRes = await generatePreSignedUrl(
              elm.presentation_link,
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
            nPresentationLink: presantationRes,
            nThumbnail: thumbnailRes,
          };
        });
        const results = await Promise.all(presentationData);
        setPresentationData(results || []);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getPresentationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="recommended-presentations-container">
      <div className="cps-20 cpe-20 cpt-20 cpb-20">
        <div className="text-18-600 color-4b4b cmb-10">
          Recommended Presentations
        </div>
        {isLoading ? (
          <div className="cmt-50 cmb-50">
            <Loader size="md" />
          </div>
        ) : presentationData?.length === 0 ? (
          <div className="cpt-30 cpb-30 text-center">No Records Found.</div>
        ) : (
          presentationData?.slice(0, 3)?.map((elem, index) => {
            const {
              id,
              category,
              post_date,
              post_title,
              nPresentationLink,
              nThumbnail,
            } = elem;
            return (
              <React.Fragment key={index}>
                <div
                  className={`${
                    presentationData?.slice(0, 3)?.length - 1 !== index &&
                    "cmb-5"
                  } d-flex flex-column`}
                >
                  <div className="cmb-10 poster">
                    <VideoPreview
                      postURL={nThumbnail}
                      videoLink={nPresentationLink}
                    />
                    {/* <img
                    src={icons.tempPosterPresentation}
                    alt="poster"
                    className="poster-image"
                  />
                  <div className="play-button">
                    <img src={icons.presentationPlayButton} alt="poster" />
                  </div> */}
                  </div>
                  <div className="d-flex align-items-center gap-3 cmb-10">
                    <span className="p-1 br-2 text-13-400 text-center bg-e8ff color-68d3">
                      {category}
                    </span>
                    {post_date && (
                      <span className="text-13-400 color-4b4b">
                        {moment(post_date, "DD-MM-YYYY HH:mm:ss").format(
                          "MMM YYYY"
                        )}
                      </span>
                    )}
                  </div>
                  <div
                    className="text-14-500 color-3d3d pointer post-title text-wrap"
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

                {presentationData?.slice(0, 3)?.length - 1 !== index && (
                  <div className="card-border-bottom cmb-10"></div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
      {presentationData?.length > 3 && (
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
          View All Presentations
        </div>
      )}
    </div>
  );
};

export default RecommendedPresentations;
