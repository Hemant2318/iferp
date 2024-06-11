import React, { useEffect, useState } from "react";
import Profile from "components/Layout/Profile";
import { icons } from "utils/constants";
import Button from "components/form/Button";
import { objectToQueryParams, titleCaseString } from "utils/helpers";
import { Carousel } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchMembersSkills } from "store/slices";
import { useParams } from "react-router-dom";
import Loader from "components/Layout/Loader";
import "./CommonSimilarSkills.scss";

const CommonSimilarSkills = ({
  setConnectModel,
  title,
  isMentorSkills,
  isLoginUser,
  profile_details,
  loginUser,
  handelConnect,
  sendRequestLoader,
  requestList,
  list,
}) => {
  const { mentor_status, speaker_id } = profile_details || {};
  const dispatch = useDispatch();
  const [indexS, setIndexS] = useState(0);
  const [slideData, setSlideData] = useState([]);
  const [loader, setLoader] = useState(false);
  const params = useParams();

  const getMemberSkills = async () => {
    setLoader(true);
    const queryParams = objectToQueryParams({ id: params?.id });
    const response = await dispatch(fetchMembersSkills(queryParams));
    if (response?.status === 200) {
      setSlideData(response?.data1 || []);
    }
    setLoader(false);
  };

  useEffect(() => {
    getMemberSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnectClick = () => {
    setIndexS(indexS + 1);
  };

  const CustomNextArrow = () => (
    <span className="arrow-block pointer">
      <i
        className="bi bi-chevron-right color-4c00"
        onClick={handleConnectClick}
      ></i>
    </span>
  );

  const isSelfUser = `${params?.id}` === `${loginUser?.id}`;

  return (
    <div className="similar-skills-container">
      <div className="text-18-600 color-4b4b cmb-10">
        {title
          ? "Mentor with Similar Skills"
          : mentor_status === "Accepted" && speaker_id
          ? "Speaker with Similar Skills"
          : mentor_status === "Accepted" && !speaker_id
          ? "Mentor with Similar Skills"
          : mentor_status !== "Accepted" && speaker_id
          ? "Speaker with Similar Skills"
          : "Member with Similar Skills"}
      </div>
      {loader ? (
        <div className="cmt-50 cmb-50">
          <Loader size="md" />
        </div>
      ) : slideData?.length === 0 ? (
        <div className="cpt-50 cpb-50 text-center">No Records Found.</div>
      ) : (
        <Carousel
          interval={null}
          indicators={false}
          nextIcon={<CustomNextArrow />}
        >
          {slideData?.map((elem, index) => {
            const {
              id,
              first_name,
              last_name,
              profile_photo_path,
              followers,
              designation,
            } = elem;
            const isExist = requestList?.find((o) => `${o?.id}` === `${id}`)
              ? true
              : false;
            const isAlreadyExist = list?.find((o) => `${o?.id}` === `${id}`)
              ? true
              : false;
            return (
              <Carousel.Item className="fade-slide" key={index}>
                <div
                  className={`${
                    isMentorSkills
                      ? "skills-block-ocean"
                      : "skills-block-orange"
                  } skills-block`}
                >
                  <div
                    className={`${
                      isMentorSkills ? "bg-efd4" : "bg-c05c"
                    } upper-block cmb-50`}
                  >
                    <div
                      className={`${
                        isMentorSkills ? "bg-ffed" : "bg-e3b7"
                      } start-block`}
                    >
                      <img src={icons.starSlider} alt="start" />
                    </div>
                    <div className="profile-image-block">
                      <Profile
                        isS3UserURL
                        isRounded
                        url={profile_photo_path}
                        size="s-115"
                        minWidth
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    {first_name && last_name && (
                      <div className="text-18-600 color-5068 cmb-10">
                        {titleCaseString(`${first_name} ${last_name}`)}
                      </div>
                    )}
                    {designation && (
                      <div className="text-14-400 color-4453">
                        {titleCaseString(designation)}
                      </div>
                    )}
                  </div>
                  <div className="d-flex align-items-center justify-content-between cmt-20 w-100 skill-border-top cpt-10 cpb-10 cpe-20 cps-20 flex-wrap">
                    <div className="d-flex align-items-center gap-3">
                      <div className="">
                        <img src={icons.fillFollowers} alt="followers" />
                      </div>

                      <div className="text-14-500 color-5068">
                        {`${followers} Followers`}
                      </div>
                    </div>
                    <div className="d-flex">
                      {isSelfUser ? (
                        ""
                      ) : isAlreadyExist || isExist ? (
                        <Button
                          onClick={() => {}}
                          text={
                            isAlreadyExist
                              ? "Connected"
                              : isExist
                              ? "Request Sent"
                              : "Try To Connect"
                          }
                          btnStyle="connect-fill-orange"
                          className="text-14-500 text-nowrap"
                          btnLoading={sendRequestLoader}
                          disabled
                        />
                      ) : (
                        <Button
                          text="Connect"
                          btnStyle="connect-fill-orange"
                          className="text-14-500"
                          onClick={() => {
                            if (!isLoginUser) {
                              setConnectModel(true);
                              return;
                            }
                            handelConnect(id);
                          }}
                          btnLoading={id === sendRequestLoader}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            );
          })}
        </Carousel>
      )}
    </div>
  );
};

export default CommonSimilarSkills;
