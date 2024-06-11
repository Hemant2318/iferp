import { Profile } from "components";
import { icons } from "utils/constants";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./HappyClientSlider.scss";

const HappyClientSlider = () => {
  const sliderArray = [
    {
      name: "Briana Patton",
      designation: "Professor",
      description:
        "Sed mattis est eget penatibus mauris, sed condimentum vitae viverra. Ipsum ut aliquet et morbi ac in. Lacinia mattis eget nisl pellentesque non, porttitor. Vitae et vestibulum ac id. Dui aliquet porttitor libero consequat volutpat eget sed turpis.",
      star: [
        { icon: icons.activeStar },
        { icon: icons.activeStar },
        { icon: icons.activeStar },
        { icon: icons.activeStar },
        { icon: icons.activeStar },
      ],
    },
    {
      name: "Imelda Cowen",
      designation: "Professor",
      description:
        "Sed mattis est eget penatibus mauris, sed condimentum vitae viverra. Ipsum ut aliquet et morbi ac in. Lacinia mattis eget nisl pellentesque non, porttitor. Vitae et vestibulum ac id. Dui aliquet porttitor libero consequat volutpat eget sed turpis.",
      star: [
        { icon: icons.activeStar },
        { icon: icons.activeStar },
        { icon: icons.activeStar },
        { icon: icons.activeStar },
      ],
    },
    {
      name: "Alfred Walton",
      designation: "Professor",
      description:
        "Sed mattis est eget penatibus mauris, sed condimentum vitae viverra. Ipsum ut aliquet et morbi ac in. Lacinia mattis eget nisl pellentesque non, porttitor. Vitae et vestibulum ac id. Dui aliquet porttitor libero consequat volutpat eget sed turpis.",
      star: [
        { icon: icons.activeStar },
        { icon: icons.activeStar },
        { icon: icons.activeStar },
      ],
    },
    {
      name: "Briana Pathan",
      designation: "Professor",
      description:
        "Sed mattis est eget penatibus mauris, sed condimentum vitae viverra. Ipsum ut aliquet et morbi ac in. Lacinia mattis eget nisl pellentesque non, porttitor. Vitae et vestibulum ac id. Dui aliquet porttitor libero consequat volutpat eget sed turpis.",
      star: 4,
    },
    {
      name: "John Patton",
      designation: "Professor",
      description:
        "Sed mattis est eget penatibus mauris, sed condimentum vitae viverra. Ipsum ut aliquet et morbi ac in. Lacinia mattis eget nisl pellentesque non, porttitor. Vitae et vestibulum ac id. Dui aliquet porttitor libero consequat volutpat eget sed turpis.",
      star: 3,
    },
  ];

  return (
    <>
      <Swiper
        className="user-swiper"
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={30}
        slidesPerView={3}
        navigation={
          //navigation(arrows)
          { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
        }
        pagination={
          //pagination(dots)
          { el: ".swiper-pagination", clickable: true }
        }
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          // when window width is >= 576px
          576: {
            slidesPerView: 1,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 2,
          },
          // when window width is >= 1024px
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 3,
          },
        }}
        // onSlideChange={() => console.log("slide change")}
        // onSwiper={(swiper) => console.log(swiper)}
      >
        {sliderArray?.map((elem, index) => {
          return (
            <SwiperSlide key={index} className="swiper-slide">
              <div className="shadow cp-30 br-10">
                <div className="fa-center gap-3">
                  <Profile text={elem?.name} size="s-72" isRounded />
                  <div>
                    <div className="text-18-500 color-2121 mb-2">
                      {elem?.name}
                    </div>
                    <div className="text-14-400 color-5555 text-start">
                      {elem?.designation}
                    </div>
                  </div>
                </div>
                <div className="text-14-400 color-7070 mt-4 mb-3 text-start">
                  {elem?.description}
                </div>

                <div className="fa-center gap-2">
                  <img src={icons.activeStar} alt="star" />
                  <img src={icons.activeStar} alt="star" />
                  <img src={icons.activeStar} alt="star" />
                  <img src={icons.activeStar} alt="star" />
                  <img src={icons.activeStar} alt="star" />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="buttons-for-slider d-flex justify-content-between align-items-center cmt-30 p-2">
        <div className="">
          <div className="swiper-pagination" />
        </div>

        <div className="left-right-buttons d-flex gap-3">
          <span className="swiper-button-prev">
            <img src={icons.roundRightArrow} alt="left-arrow" />
          </span>
          <span className="swiper-button-next">
            <img src={icons.roundRightArrow} alt="right-arrow" />
          </span>
        </div>
      </div>
    </>
  );
};

export default HappyClientSlider;
