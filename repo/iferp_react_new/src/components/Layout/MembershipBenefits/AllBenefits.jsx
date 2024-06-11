import React from "react";
import { icons } from "utils/constants";
import { titleCaseString } from "utils/helpers";
import Modal from "../Modal";

const AllBenefits = ({ onHide, data }) => {
  return (
    <Modal onHide={onHide} title="My Current Subscription Benefits">
      <div
        className="mt-3 iferp-scroll cps-30 cpe-30"
        style={{ maxHeight: "600px", overflowY: "auto" }}
      >
        {Object.entries(data).map((key, index) => {
          const [title, list] = key;
          return (
            <React.Fragment key={index}>
              <div className="text-16-500 color-raisin-black mb-3 mt-3">
                {titleCaseString(title.replace(/_/g, " "))}
              </div>
              {list.map((elem, index) => {
                return (
                  <div key={index} className="cmb-12">
                    <img src={icons.rightLabel} alt="right" className="me-2" />
                    {elem?.benefit}
                    <span className="text-primary">{` - ${elem.benefit_type}`}</span>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </Modal>
  );
};
export default AllBenefits;
