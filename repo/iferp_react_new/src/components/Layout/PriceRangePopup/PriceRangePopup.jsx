import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Button from "components/form/Button";
import ReactSlider from "react-slider";
import { icons } from "utils/constants";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "./PriceRangePopup.scss";

const PriceRangePopup = ({
  onHide,
  setIsPriceRange,
  allMentorsList,
  setAllMentorsList,
  getAllMentors,
}) => {
  const [value, setValue] = useState([0, 10000]);
  const myRef = useRef();
  const handleShowResult = async () => {
    let oldData = {
      ...allMentorsList,
      min_price: value[0],
      max_price: value[1],
      offset: 0,
      loading: true,
    };
    // let oldData = omit(
    //   { ...allMentorsList, min_price: value[0], max_price: value[1] },
    //   ["offset", "limit"]
    // );
    // let formData = new FormData(oldData);
    // const response = await dispatch(fetchAllMentors(oldData));
    // if (response?.status === 200) {
    //   setAllMentorsList({
    //     data: response?.data?.result_data,
    //     total: response?.data?.result_count || 0,
    //   });
    // }
    setAllMentorsList(oldData);
    getAllMentors(oldData, true, true);
    onHide();
  };
  const handleClickOutside = (e) => {
    if (myRef.current && !myRef.current.contains(e.target)) {
      setIsPriceRange(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const renderThumb = (props, state) => {
    return (
      <React.Fragment key={state?.index}>
        <div {...props} data-tooltip-id={`my-tooltip-1 ${state?.index}`}>
          <div className="inner">
            <img src={icons.thumbEllipse} alt="ellipse" />
          </div>
        </div>
        <ReactTooltip
          isOpen
          className="bg-e3ff color-dark-blue cps-15 cpe-15 cpt-10 cpb-10 rounded text-14-400 custom-style"
          id={`my-tooltip-1 ${state?.index}`}
          place="bottom"
          content={<div className="">{`₹ ${value[state?.index]}`}</div>}
        />
      </React.Fragment>
    );
  };
  let newWidth = window.innerWidth < 700 ? "500px" : "500px" || "500px";

  return (
    <div className="price-range-popup" ref={myRef} style={{ width: newWidth }}>
      <div className="d-flex justify-content-between align-items-center color-dark-navy-blue text-15-500 cps-16 cpe-16 cpt-16 cpb-16">
        Price
        <div
          className="pointer"
          onClick={() => {
            onHide();
          }}
        >
          <i className="bi bi-x color-dark-navy-blue" />
        </div>
      </div>
      <hr className="price-range-border unset-p unset-m" />

      <div className="cps-30 cpe-30 cpt-16 cpb-16">
        <div className="range-container">
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            defaultValue={[0, 10000]}
            min={0}
            max={30000}
            renderThumb={renderThumb}
            onChange={(value) => setValue(value)}
          />
        </div>
        <div className="d-flex cmt-60">
          <Button
            text="Show Results"
            btnStyle="primary-outline"
            isRounded
            className="cps-20 cpe-20 text-14-500-26"
            onClick={handleShowResult}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangePopup;
