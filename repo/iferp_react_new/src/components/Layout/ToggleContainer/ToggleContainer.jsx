import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setApiError } from "store/slices";
import Card from "../Card";
// import Button from "../../form/Button";

const ToggleContainer = ({
  title,
  children,
  defaultOpen = false,
  className,
  isError,
  errorMessage,
  onClick,
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    setIsOpen(defaultOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOpen]);

  return (
    <div className={className}>
      <Card className="cps-24 cpt-12 cpb-12 d-flex align-items-center cmb-12">
        <span
          className="d-flex me-3 pointer"
          onClick={() => {
            if (isError) {
              dispatch(
                setApiError({
                  show: true,
                  message: errorMessage,
                  type: "danger",
                })
              );
            } else {
              if (onClick) {
                onClick();
              } else {
                setIsOpen(!isOpen);
              }
            }
          }}
        >
          <i className="bi bi-plus-circle color-new-car" />
        </span>
        <span
          className="text-16-500 color-new-car pointer"
          onClick={() => {
            if (isError) {
              dispatch(
                setApiError({
                  show: true,
                  message: errorMessage,
                  type: "danger",
                })
              );
            } else {
              if (onClick) {
                onClick();
              } else {
                setIsOpen(!isOpen);
              }
            }
          }}
        >
          {title}
        </span>
      </Card>
      {isOpen && (
        <Card className="cps-30 cpe-30 cpt-12 cpb-12 cmb-30">{children}</Card>
      )}
    </div>
  );
};
export default ToggleContainer;
