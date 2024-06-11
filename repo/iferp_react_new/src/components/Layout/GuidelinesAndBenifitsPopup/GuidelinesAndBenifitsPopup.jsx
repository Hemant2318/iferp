import { useState } from "react";
import CheckBox from "../../form/CheckBox";
import Button from "../../form/Button";
import Modal from "../Modal";

const GuidelinesAndBenifitsPopup = ({ onHide, title, data, handelSave }) => {
  const [isCheck, setIsCheck] = useState(false);
  const { benefits, guidelines } = data;
  return (
    <Modal onHide={onHide} title={title}>
      <div className="cmt-30 cpb-20 cps-20 cpe-20">
        {guidelines && (
          <>
            <div className="text-14-500 color-new-car">Guidelines</div>
            <div
              className="mt-2"
              dangerouslySetInnerHTML={{
                __html: guidelines,
              }}
            />
          </>
        )}
        {benefits && (
          <>
            <div className="text-14-500 color-new-car mt-3">Benefits</div>
            <div
              className="mt-2"
              dangerouslySetInnerHTML={{
                __html: benefits,
              }}
            />
          </>
        )}

        <div className="d-flex align-items-center gap-2 mt-2">
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
            onClick={handelSave}
            disabled={!isCheck}
          />
        </div>
      </div>
    </Modal>
  );
};
export default GuidelinesAndBenifitsPopup;
