import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSingleUserChapter } from "store/slices";
import { chapterMemberPath, icons } from "utils/constants";
import { generatePreSignedUrl, objectToFormData } from "utils/helpers";

const ChapterDetailOfUser = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userDetail, setUserDetail] = useState({
    profileURL: "",
    loading: true,
    data: [],
  });

  const getSingleUserDetail = async () => {
    let formData = objectToFormData({ id: params?.uId });
    const response = await dispatch(fetchSingleUserChapter(formData));
    let profileUrl = "";
    if (response?.status === 200) {
      profileUrl = await generatePreSignedUrl(
        response?.data?.profile_picture,
        chapterMemberPath
      );
      setUserDetail((prev) => {
        return {
          ...prev,
          data: response?.data,
          loading: false,
          profileURL: profileUrl,
        };
      });
    }
  };
  useEffect(() => {
    getSingleUserDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const details = userDetail?.data;
  const url = userDetail?.profileURL;

  return (
    <div id="single-user-detail-container">
      {userDetail?.loading ? (
        <Card className="cpt-80 cpb-80">
          <Loader size="md" />
        </Card>
      ) : (
        <Card className="unset-br cpe-26 cps-26 pt-4 pb-4 fadeInUp">
          <div className="w-100 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <span
                className="d-flex"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <img
                  src={icons.leftArrow}
                  alt="back"
                  className="h-21 me-3 pointer"
                />
              </span>
              <div className="color-black-olive text-18-500">
                {details?.chapter_title}
              </div>
            </div>
          </div>
          <div className="d-flex cmt-24">
            <div className="cmb-34">
              <Profile url={url} size="s-163" text={details?.name} />
            </div>
            <div className="cps-30 cpe-20">
              <div className="text-22-500 color-new-car">{details?.name}</div>
              <div className="text-18-500 color-subtitle-navy mt-2">
                {details?.member_category}
              </div>
              <div className="text-15-500 color-new-car mt-3 mb-1">
                {details?.designation}
              </div>
              <div className="text-14-500 color-subtitle-navy mb-3">
                {details?.Institute}
              </div>
              <div className="text-15-500 color-new-car mt-3 mb-1">
                {details?.state}
              </div>

              <div className="text-15-500 color-subtitle-navy mb-1">
                {details?.country}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChapterDetailOfUser;
