import React from "react";
import { icons } from "utils/constants";

const JoinExpertCommunity = () => {
  const expertArray = [
    {
      title: "Engineering",
      no_of_researchers: "8,00,000+ Researchers",
      img: icons.engineering,
      bgColor: "#DCF3FF",
    },
    {
      title: "Medical Science",
      no_of_researchers: "4,00,000+ Researchers",
      img: icons.engineering,
      bgColor: "#DCDFFF",
    },
    {
      title: "Arts & Science",
      no_of_researchers: "3,00,000+ Researchers",
      img: icons.engineering,
      bgColor: "#CCF5E4",
    },
    {
      title: "Mathematics",
      no_of_researchers: "50,000+ Researchers",
      img: icons.engineering,
      bgColor: "#FEE3E0",
    },
  ];
  return (
    <div className="container cpt-40">
      <div className="text-center text-40-600 color-1919 mb-2">
        Join Expert Driven Community
      </div>
      <div className="text-18-400 color-3d3d text-center">
        Connect and gain knowledge from various researchers & organizations all
        over the world
      </div>
      <div className="row cmt-40 cmb-40">
        {expertArray?.map((elem, index) => {
          return (
            <div className="col-md-6 col-lg-4 col-xl-3 h-100 gy-4" key={index}>
              <div className="p-3 border rounded">
                <div
                  className="f-center"
                  style={{
                    backgroundColor: elem?.bgColor,
                    height: "188px",
                    borderRadius: "32px",
                  }}
                >
                  <div className="b-ffff rounded cp-14">
                    <div className="bg-ffff rounded cp-14">
                      <img src={elem?.img} alt="engineering" />
                    </div>
                  </div>
                </div>
                <div className="text-24-500 color-2121 text-center mt-4 mb-2">
                  {elem?.title}
                </div>
                <div className="text-16-400 color-5555 text-center">
                  {elem?.no_of_researchers}
                </div>
              </div>
            </div>
          );
        })}
        {/* <div className="col-md-3 h-100">
          <div className="p-3 border rounded">
            <div
              className="f-center"
              style={{
                backgroundColor: "#DCDFFF",
                height: "188px",
                borderRadius: "32px",
              }}
            >
              <div className="b-ffff rounded cp-14">
                <div className="bg-ffff rounded cp-14">
                  <img src={icons.engineering} alt="engineering" />
                </div>
              </div>
            </div>
            <div className="text-24-500 color-2121 text-center mt-4 mb-2">
              Medical Science
            </div>
            <div className="text-16-400 color-5555 text-center">
              4,00,000+ Researchers
            </div>
          </div>
        </div>
        <div className="col-md-3 h-100">
          <div className="p-3 border rounded">
            <div
              className="f-center"
              style={{
                backgroundColor: "#CCF5E4",
                height: "188px",
                borderRadius: "32px",
              }}
            >
              <div className="b-ffff rounded cp-14">
                <div className="bg-ffff rounded cp-14">
                  <img src={icons.engineering} alt="engineering" />
                </div>
              </div>
            </div>
            <div className="text-24-500 color-2121 text-center mt-4 mb-2">
              Arts & Science
            </div>
            <div className="text-16-400 color-5555 text-center">
              3,00,000+ Researchers
            </div>
          </div>
        </div>
        <div className="col-md-3 h-100">
          <div className="p-3 border rounded">
            <div
              className="f-center"
              style={{
                backgroundColor: "#FEE3E0",
                height: "188px",
                borderRadius: "32px",
              }}
            >
              <div className="b-ffff rounded cp-14">
                <div className="bg-ffff rounded cp-14">
                  <img src={icons.engineering} alt="engineering" />
                </div>
              </div>
            </div>
            <div className="text-24-500 color-2121 text-center mt-4 mb-2">
              Mathematics
            </div>
            <div className="text-16-400 color-5555 text-center">
              50,000+ Researchers
            </div>
          </div>
        </div> */}
      </div>
      <div className="fj-center cpb-60">
        <div className="b-b176 rounded fa-center gap-2 bg-7614 pt-3 pb-3 cps-22 cpe-22 pointer">
          <span className="text-16-600 color-b176">View all Communities</span>
          <span>
            <img src={icons.rightSuccess} alt="ticl" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default JoinExpertCommunity;
