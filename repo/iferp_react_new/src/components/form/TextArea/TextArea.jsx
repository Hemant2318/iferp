import Label from "../Label";
import "./TextArea.scss";

const TextArea = ({
  rows,
  name,
  id,
  placeholder,
  value,
  error,
  onChange,
  disabled,
  label,
  isRequired,
  labelClass,
}) => {
  return (
    <div id="text-area-container">
      {label && (
        <Label label={label} required={isRequired} className={labelClass} />
      )}
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="iferp-scroll"
      />
      {error && (
        <span className="text-13-400 pt-1">
          <span style={{ color: "red" }}>{error}</span>
        </span>
      )}
    </div>
  );
};
export default TextArea;
