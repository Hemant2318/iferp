import BootrsapModal from "react-bootstrap/Modal";
import { icons } from "utils/constants";
import "./Modal.scss";

const Modal = ({
  children,
  onHide,
  width,
  title,
  size,
  fullscreen,
  largeClose,
  hideClose,
  className,
  isImage,
  titleClass,
}) => {
  let newWidth = window.innerWidth < 700 ? "100%" : width || "500px";
  return (
    <BootrsapModal
      className={`iferp-scroll modal-block-custom ${className || ""}`}
      onHide={onHide}
      size={size || "lg"}
      fullscreen={fullscreen}
      centered
      show
    >
      <BootrsapModal.Body
        id="modal-container"
        className={`${isImage ? "p-0" : "cpt-44"}`}
        style={{ minWidth: newWidth }}
      >
        {!hideClose && (
          <>
            {largeClose ? (
              <div
                className="modal-close-button text-danger pointer text-26-500"
                onClick={onHide}
              >
                <i className="bi bi-x-square-fill" />
              </div>
            ) : isImage ? (
              <div className="discount-image-block">
                <img
                  src={icons.supperOfferImage}
                  alt="discount"
                  className="discount-image"
                />
                <i
                  className="bi bi-x discount-modal-close-button pointer"
                  onClick={onHide}
                />
              </div>
            ) : (
              <i
                className="bi bi-x modal-close-button pointer"
                onClick={onHide}
              />
            )}
          </>
        )}
        <div
          className={`${
            titleClass
              ? "text-34-500 color-1f40"
              : "text-24-400-30 color-title-navy"
          } col-md-12 text-center d-flex justify-content-center font-poppins`}
        >
          {title}
        </div>

        {children}
      </BootrsapModal.Body>
    </BootrsapModal>
  );
};

export default Modal;
