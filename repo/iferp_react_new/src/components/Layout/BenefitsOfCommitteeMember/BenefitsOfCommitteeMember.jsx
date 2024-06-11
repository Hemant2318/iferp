import { icons } from "utils/constants";
import Button from "../../form/Button";
import Modal from "../Modal";

const BenefitsOfCommitteeMember = ({ onHide }) => {
  const freeData = [
    {
      text: "Become an editorial board member",
    },
    {
      text: "Become a Reviewer",
    },
    {
      text: "Become a Keynote Speaker",
    },
    {
      text: "Session Chair Opportunity",
    },
    {
      text: "Patent Filing Assistance",
    },
    {
      text: "Oppotunity for book writing",
    },
  ];
  return (
    <Modal onHide={onHide} title="Benefits Of Committee Member">
      <div className="row cmt-50 cpb-20 cps-10 cpe-10">
        <div className="col-md-6">
          <div className="border rounded cpb-30">
            <div
              className="cpt-26 cpb-30 text-center text-22-500 wave-bottom color-white"
              style={{ backgroundColor: "#004157" }}
            >
              FREE MEMBER
            </div>
            <div className="text-center cpt-26 cpb-26">
              <span className="text-32-500">₹ 0</span>
              <span className="text-13-400">/year</span>
            </div>
            <div className="cps-12 cpe-12">
              {freeData.map((elm, index) => {
                return (
                  <div
                    key={index}
                    className={`cpt-10 cpb-10 cps-10 ${
                      index % 2 === 0 ? "bg-platinum" : ""
                    }`}
                  >
                    <span className="cme-14">
                      {index === 0 || index === 1 ? (
                        <img src={icons.trueIcon} alt="true" />
                      ) : (
                        <img src={icons.falseIcon} alt="false-" />
                      )}
                    </span>
                    <span className="text-15-500">{elm.text}</span>
                  </div>
                );
              })}
            </div>
            <div className="center-flex cmt-40">
              <Button
                isRounded
                text="Access Free"
                btnStyle="primary-outline"
                className="cps-40 cpe-40"
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded cpb-30">
            <div
              className="cpt-26 cpb-30 text-center text-22-500 wave-bottom color-white"
              style={{ backgroundColor: "#2148C0" }}
            >
              PREMIUM MEMBER
            </div>
            <div className="text-center cpt-26 cpb-26">
              <span className="text-32-500">₹ 1000</span>
              <span className="text-13-400">/year</span>
            </div>
            <div className="cps-12 cpe-12">
              {freeData.map((elm, index) => {
                return (
                  <div
                    key={index}
                    className={`cpt-10 cpb-10 cps-10 ${
                      index % 2 === 0 ? "bg-platinum" : ""
                    }`}
                  >
                    <span className="cme-14">
                      <img src={icons.trueIcon} alt="true" />
                    </span>
                    <span className="text-15-500">{elm.text}</span>
                  </div>
                );
              })}
            </div>
            <div className="center-flex cmt-30">
              <Button
                isRounded
                text="Upgrade to Premium"
                btnStyle="primary-dark"
                className="cps-40 cpe-40"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default BenefitsOfCommitteeMember;
