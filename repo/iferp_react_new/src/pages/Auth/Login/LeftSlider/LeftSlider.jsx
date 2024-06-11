import { Swiper, SwiperSlide } from "swiper/react";
import { icons } from "utils/constants";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "./LeftSlider.scss";

const LeftSlider = () => {
  return (
    <div id="left-slider-block">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        spaceBetween={100}
        loop={true}
        zoom={true}
        speed={1300}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 300,
          modifier: 1,
          slideShadows: true,
        }}
        modules={[EffectCoverflow, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src={icons.loginS1} alt="slide1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={icons.loginS2} alt="slide2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={icons.loginS3} alt="slide3" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={icons.loginS4} alt="slide4" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={icons.loginS5} alt="slide5" />
        </SwiperSlide>
      </Swiper>
      <div className="icon-flud-block">
        <img src={icons.iferpConferenceNew} alt="conference" />
        <img src={icons.iferpWebinarNew} alt="webinar" />
        <img src={icons.iferpPublication} alt="publication" />
        <img src={icons.iferpMember} alt="member" />
      </div>
    </div>
  );
};
export default LeftSlider;
