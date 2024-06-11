import Dropdown from "react-bootstrap/Dropdown";
import "./DropdownOption.scss";

const DropdownOption = ({ icons, children }) => {
  return (
    <div id="dropdown-option-container">
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">{icons}</Dropdown.Toggle>

        <Dropdown.Menu>{children}</Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DropdownOption;
