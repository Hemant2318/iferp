import Dropdown from "react-bootstrap/Dropdown";
import "./DropdownButton.scss";
const DropdownButton = ({
  children,
  text,
  className,
  icon,
  id,
  parentClass,
  hideIcon,
}) => {
  return (
    <Dropdown
      id="dropdown-button-container"
      align="end"
      className={parentClass || ""}
    >
      <Dropdown.Toggle
        variant="light"
        id={id || "dropdown-btn"}
        className={`position-relative ${className}`}
        align="end"
      >
        {icon && icon}
        {text}
        {!hideIcon && (
          <i className="bi bi-chevron-down dropdown-arrow position-absolute end-0 ps-2 pe-2 bg-white" />
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-body-container">
        {children}
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default DropdownButton;
