import React, { useEffect, useRef, useState } from "react";
import Card from "components/Layout/Card";
import Button from "components/form/Button";
import { posterPath } from "utils/constants";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { useDispatch } from "react-redux";
import { getTopConferences } from "store/slices";
import {
  generatePreSignedUrl,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import Loader from "components/Layout/Loader";
import "./TopConferenceBlock.scss";

const TopConferenceBlock = ({ handleRedirect }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const response = await dispatch(
      getTopConferences(objectToFormData({ page: 1, limit: 10 }))
    );
    if (response?.status === 200) {
      if (response?.data) {
        const newData = response?.data?.result?.map(async (elem) => {
          let posterImage = "";
          if (elem?.poster_path) {
            posterImage = await generatePreSignedUrl(
              elem?.poster_path,
              posterPath
            );
          }
          return {
            ...elem,
            newPostImage: posterImage,
          };
        });
        const result = await Promise.all(newData);
        setData(result);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const swiperRef = useRef(null);
  const handleNextSlide = () => {
    if (swiperRef.current !== null) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <>
      <Card className="mb-4 top-conference-container">
        <div className="cpt-30 cpb-30">
          <div className="text-24-500 color-raisin-black text-center">
            Top Conference Proceedings
          </div>
          {isLoading ? (
            <div className="cpt-30 cpb-50">
              <Loader size="md" />
            </div>
          ) : data?.length === 0 ? (
            <div className="cpt-30 cpb-50 text-center">No Records Found.</div>
          ) : (
            <>
              <Swiper
                lazy={"true"}
                modules={[Navigation]}
                allowSlidePrev={false}
                grabCursor={true}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                slidesPerView={"auto"}
                spaceBetween={10}
                loop={true}
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
                    slidesPerView: 4,
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
                className="mySwiper"
              >
                {data?.map((elem, index) => {
                  const { id, event_name, newPostImage } = elem;
                  return (
                    <SwiperSlide key={index} className="swiper-slide">
                      <div className="pb-3 pt-3 ps-3 pe-3">
                        <div className="h-100">
                          <div className="pb-2 image-section">
                            <img
                              src={newPostImage}
                              alt="digital"
                              className="child-image"
                              loading="lazy"
                            />
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                          </div>
                          <span className="text-14-500 mb-2 two-line-elipses">
                            {titleCaseString(event_name)}
                          </span>
                          <div
                            className="text-15-400 color-new-car hover-effect pointer text-decoration-underline d-flex align-items-center gap-3"
                            onClick={() => {
                              const payload = {
                                type: "Top Conference",
                                event_id: id,
                              };
                              handleRedirect(payload);
                            }}
                          >
                            <span>View Proceedings</span>
                            <span className="">
                              <i className="bi bi-arrow-right" />
                            </span>
                          </div>
                        </div>
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
                  text="Explore All"
                  btnStyle="primary-dark"
                  className="cps-20 cpe-20 h-35 text-15-500"
                  onClick={() => {
                    const payload = {
                      type: "Top Conference",
                    };
                    handleRedirect(payload);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </>
  );
};

export default TopConferenceBlock;
