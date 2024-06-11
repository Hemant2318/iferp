import Card from "components/Layout/Card";
import Button from "components/form/Button";
import React, { useEffect, useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useDispatch } from "react-redux";
import {
  fetchRequests,
  fetchResearchStatistics,
  sendRequests,
} from "store/slices";
import {
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import Profile from "components/Layout/Profile";
import Loader from "components/Layout/Loader";
import { cloneDeep } from "lodash";
import "./TopResearcherBlock.scss";

const TopResearcherBlock = ({ handleRedirect }) => {
  const useDetails = getDataFromLocalStorage();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [isFollowLoader, setIsFollowLoader] = useState("");

  const getTopResearch = async (object) => {
    setIsLoading(true);
    let queryParams = new URLSearchParams(object).toString();
    const response = await dispatch(fetchResearchStatistics(`?${queryParams}`));
    setData(response?.data || {});
    setIsLoading(false);
  };

  const getRequest = async () => {
    const response = await dispatch(fetchRequests({ type: "following" }));
    setRequestList(response?.data?.result);
  };

  const handelSendRequest = async (id) => {
    setIsFollowLoader(id);
    const response = await dispatch(
      sendRequests(objectToFormData({ receiver_id: id }))
    );
    if (response?.status === 200) {
      let oldList = cloneDeep(requestList);
      if (oldList?.find((o) => `${o?.id}` === `${id}`)) {
        oldList = oldList?.filter((o) => `${o?.id}` !== `${id}`);
      } else {
        oldList = [...oldList, response?.data];
      }
      setRequestList(oldList);
    }
    setIsFollowLoader("");
  };

  useEffect(() => {
    getTopResearch({
      // chart_year: moment().format("YYYY"),
      // statistics_year: moment().format("YYYY"),
      user_id: useDetails?.id,
      page: 1,
      limit: 10,
    });
    if (useDetails?.id) {
      getRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const swiperRef = useRef(null);
  const handleNextSlide = () => {
    if (swiperRef.current !== null) {
      swiperRef.current.slideNext();
    }
  };

  const { trending_researchers = [] } = data;
  return (
    <>
      <div id="top-researcher-block-container">
        <div className="mt-5 text-24-500 color-raisin-black text-center mb-3">
          Top Researchers
        </div>
        {isLoading ? (
          <Card className="cpt-30 cpb-50">
            <Loader size="md" />
          </Card>
        ) : trending_researchers?.length === 0 ? (
          <div className="cpt-30 cpb-50 text-center">No Records Found.</div>
        ) : (
          <>
            <Swiper
              modules={[Navigation]}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              grabCursor={true}
              slidesPerView={"auto"}
              className="mySwiper row"
              navigation={{
                nextEl: ".next-button",
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1200: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
                2400: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
              }}
            >
              {trending_researchers?.map((elem, index) => {
                const {
                  id,
                  name,
                  profile_photo_path,
                  designation,
                  institution_name,
                } = elem;
                const isExist = requestList?.find((o) => `${o?.id}` === `${id}`)
                  ? true
                  : false;
                return (
                  <SwiperSlide key={index} className="swiper-slide">
                    <div className="cmt-15">
                      <Card className="text-center pb-3 pt-3 ps-3 pe-3">
                        <div className="h-100">
                          <Profile
                            text={name}
                            url={profile_photo_path}
                            size="s-200"
                            isS3UserURL
                          />
                          {/* <div className="pb-2 mb-2 image-section">
                        <img
                          src={profile_photo_path}
                          alt="digital"
                          className="child-image"
                        />
                      </div> */}
                          <div className="text-16-500 color-raisin-black mt-3 mb-3">
                            {titleCaseString(name)}
                          </div>
                          <div className="text-16-500 color-new-car mb-3">
                            {designation ? titleCaseString(designation) : "-"}
                          </div>
                          <div className="text-14-400 color-black-olive mb-3">
                            {institution_name
                              ? titleCaseString(institution_name)
                              : "-"}
                          </div>
                          <div className="center-flex">
                            <Button
                              text={isExist ? "Cancel" : "Follow"}
                              btnStyle={
                                isExist ? "primary-light" : "primary-outline"
                              }
                              btnLoading={isFollowLoader === id}
                              className="cps-20 cpe-20 h-35 text-14-500"
                              onClick={() => {
                                handelSendRequest(id);
                              }}
                            />
                          </div>
                        </div>
                      </Card>
                    </div>
                  </SwiperSlide>
                );
              })}
              <div className="next-button">
                <i
                  className="bi bi-chevron-right color-48c0 pointer"
                  onClick={handleNextSlide}
                ></i>
              </div>
            </Swiper>
            <div className="center-flex mt-5">
              <Button
                text="View All"
                btnStyle="primary-dark"
                className="cps-20 cpe-20 h-35 text-15-500"
                onClick={() => {
                  handleRedirect({ type: "Top Researchers" });
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TopResearcherBlock;
