import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import "./Advertisements.scss";

const Advertisements = ({ advertisementsList }) => {
  const [index, setIndex] = useState(0);

  const handleConnectClick = () => {
    setIndex(index + 1);
  };
  const CustomNextArrow = () => (
    <span className="arrow-block pointer">
      <i className="bi bi-chevron-right color-4c00"></i>
    </span>
  );

  return (
    <div className="advertisement-container">
      <div className="text-16-600 text-4b4b cmb-10">News & Notifications</div>

      <Carousel
        interval={null}
        indicators={false}
        nextIcon={advertisementsList?.length > 1 && <CustomNextArrow />}
        className={advertisementsList?.length > 1 && "multiple-items"}
      >
        {advertisementsList?.map((elem, index) => {
          return (
            <Carousel.Item
              className="fade-slide"
              onClick={handleConnectClick}
              key={index}
            >
              <div className="advertise-poster-block">
                <img
                  src={elem?.newAdsImageURl}
                  alt="advertise"
                  className={`${
                    elem?.website_url && "pointer"
                  } advertise-image`}
                  onClick={() => {
                    if (elem?.website_url) {
                      window.open(elem?.website_url, "_blank");
                    }
                  }}
                />
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Advertisements;
