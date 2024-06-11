import Label from "../Label";
import "./RadioInput.scss";

const RadioInput = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  className,
}) => (
  <div id="radio-input-container" className={className}>
    <input
      id={id}
      type="radio"
      name={name}
      value={value}
      onChange={onChange}
      onClick={onChange}
      checked={checked}
      className="radio-block pointer"
    />
    {label && <Label label={label} className="ps-2" />}
  </div>
);

export default RadioInput;
