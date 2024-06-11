import { useState } from "react";
import { useDispatch } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import { objectToFormData } from "utils/helpers";
import Loader from "components/Layout/Loader";
import "./StatusButton.scss";
const StatusButton = ({
  options,
  text,
  className,
  icon,
  id,
  handelAPI,
  handelSuccess,
  apiId,
}) => {
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false);
  const [show, setShow] = useState(false);
  const handelClick = async (id) => {
    setIsLoader(true);
    let forData = objectToFormData({ status: id, id: apiId });
    const response = await dispatch(handelAPI(forData));
    if (response?.status === 200) {
      handelSuccess();
    }
    setIsLoader(false);
    setShow(false);
  };
  return (
    <Dropdown
      id="status-button-container"
      align="end"
      show={show}
      onToggle={() => {
        setShow(!show);
      }}
    >
      <Dropdown.Toggle
        variant="success"
        id={id || "dropdown-btn"}
        className={className}
        align="end"
      >
        {icon && icon}
        {isLoader ? (
          <div className="ps-4 pe-4">
            <Loader size="sm" className="ms-2" />
          </div>
        ) : (
          text
        )}
        <i className="bi bi-chevron-down dropdown-arrow ps-2 pt-1" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-body-container">
        {
          <div className="status-selection">
            {options.map((elem, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    handelClick(elem.id);
                  }}
                  className="text-16-400 color-black-olive"
                >
                  {elem.label}
                </div>
              );
            })}
          </div>
        }
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default StatusButton;
