import BootrsapModal from "react-bootstrap/Modal";
import { icons } from "utils/constants";
import "./Modal.scss";

const Modal = ({ children, onHide, width, title, size, fullscreen }) => {
  let newWidth = window.innerWidth < 700 ? "100%" : width || "500px";
  return (
    <BootrsapModal
      className="iferp-scroll modal-block-custom"
      onHide={onHide}
      size={size || "lg"}
      fullscreen={fullscreen}
      centered
      show
    >
      <BootrsapModal.Body id="modal-container" style={{ minWidth: newWidth }}>
        <img
          src={icons.close}
          alt="close"
          className="pointer modal-close-button"
          onClick={onHide}
        />
        <div className="col-md-12 f-center text-20-400 color-3d3d">{title}</div>

        {children}
      </BootrsapModal.Body>
    </BootrsapModal>
  );
};

export default Modal;
