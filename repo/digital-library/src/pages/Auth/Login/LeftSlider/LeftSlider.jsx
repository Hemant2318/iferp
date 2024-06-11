import { Swiper, SwiperSlide } from "swiper/react";
import { icons } from "utils/constants";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "./LeftSlider.scss";

const LeftSlider = () => {
  return (
    <div id="left-slider-block">
      <Swiper
        modules={[EffectCoverflow, Autoplay]}
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
        className="mySwiper"
      >
        <SwiperSlide>
          <img src={icons.slideOne} alt="slide1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={icons.slideTwo} alt="slide2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={icons.slideThree} alt="slide3" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={icons.slideFour} alt="slide4" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={icons.slideFive} alt="slide5" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
export default LeftSlider;
