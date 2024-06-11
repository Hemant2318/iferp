import "./CheckBox.scss";

const CheckBox = ({ type, isChecked, onClick, className }) => {
  let checkBoxStyle = "inActiveUnchecked";
  if (type) {
    switch (type) {
      case "ACTIVE":
        checkBoxStyle = isChecked ? "activeChecked" : "activeUnchecked";
        break;
      case "PRIMARY-ACTIVE":
        checkBoxStyle = isChecked
          ? "primaryActiveChecked"
          : "primaryActiveUnchecked";
        break;

      default:
        checkBoxStyle = isChecked ? "activeChecked" : "activeUnchecked";
        break;
    }
  } else {
    checkBoxStyle = "inActiveUnchecked";
  }
  return (
    <div className="custom-check-box-container">
      <div className={`checkbox-block ${className || ""}`}>
        <input type="checkbox" onClick={onClick} />
        <span
          className={checkBoxStyle}
          aria-label="Check box"
          onClick={onClick}
          onKeyDown={onClick}
          role="button"
          tabIndex={0}
        />
      </div>
    </div>
  );
};
export default CheckBox;
