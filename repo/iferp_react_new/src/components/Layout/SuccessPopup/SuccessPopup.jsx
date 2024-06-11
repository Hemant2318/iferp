import { icons } from "utils/constants";
import Button from "../../form/Button";
import Modal from "../Modal";
import "./SuccessPopup.scss";

const SuccessPopup = ({ onHide, title, children, onClose }) => {
  return (
    <Modal onHide={onHide} size="md" width="100%">
      <div className="text-center" id="scuccess-popup-container">
        <div className="pb-3 header-icon">
          <img src={icons.successTick} alt="success" />
        </div>
        <div className="title-con-block text-28-500 color-raisin-black cmb-26 cmt-50 ">
          {title}
        </div>
        <div className="tit-description-block">{children}</div>
        <div className="center-flex cmt-30">
          <Button
            text="Close"
            btnStyle="primary-outline"
            onClick={onClose}
            className="cps-40 cpe-40"
          />
        </div>
      </div>
    </Modal>
  );
};
export default SuccessPopup;
