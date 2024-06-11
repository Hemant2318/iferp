import { useState } from "react";
import Modal from "components/Layout/Modal";
import CheckBox from "components/form/CheckBox";
import Button from "components/form/Button";
import { icons } from "utils/constants";

const testArray = [
  "To make the scopes, opportunities, updates and notifications of the conference reach all deserving researchers in relevant research areas and geographical locations",
  "To propose the venues and universities for sessions, plenary discussions and institutional visitTo recommend universities & institutions for academic partners",
  "To recommend and refer sponsors & exhibitors for the conference",
  "To notify students, staff & colleagues about the sessions, scientific programs, keynote talks and other academic activities scheduled in the conference",
  "To serve as an ambassador and advocate to the conferences",
  "To notify the involvement, contribution and outcomes to the Organising Secretary/CSO/Program Manager",
];
const RolesAndResponsibilities = ({ onHide, data }) => {
  const [isCheck, setIsCheck] = useState(false);

  const { name } = data;
  return (
    <Modal onHide={onHide} title="Roles and Responsibilities">
      <div className="cps-40 cpe-40 cpb-40">
        <div className="center-flex text-15-500 color-new-car mt-2 mb-2">
          {name}
        </div>
        <div className="cmt-30 cmb-20">
          {testArray.map((elem, index) => {
            return (
              <div key={index} className="cmb-12 d-flex align-items-top">
                <span>
                  <img src={icons.rightLabel} alt="right" className="me-2" />
                </span>
                <span className="text-14-400 color-raisin-black">{elem}</span>
              </div>
            );
          })}
        </div>
        <div className="d-flex align-items-center gap-2">
          <CheckBox
            type="ACTIVE"
            isChecked={isCheck}
            onClick={() => {
              setIsCheck(!isCheck);
            }}
          />
          <div className="text-13-400 color-black-olive">
            I have read all the roles & responsibilities
          </div>
        </div>
        <div className="d-flex justify-content-center gap-4 cmt-40">
          <Button
            isRounded
            text="Cancel"
            btnStyle="light-outline"
            className="cps-40 cpe-40"
            onClick={onHide}
          />
          <Button
            isRounded
            text="Done"
            btnStyle="primary-dark"
            className="cps-50 cpe-50"
            onClick={onHide}
            disabled={!isCheck}
          />
        </div>
      </div>
    </Modal>
  );
};
export default RolesAndResponsibilities;
