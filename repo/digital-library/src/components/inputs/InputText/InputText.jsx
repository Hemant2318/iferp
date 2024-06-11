import Label from "../Label";
import "./InputText.scss";

const InputText = ({
  className,
  label,
  error,
  isRequired,
  placeholder,
  onChange,
  name,
  value,
  reference,
  id,
  disabled,
  labelClass,
  autoFocus,
  onBlur,
}) => {
  return (
    <div id="inputtext-container">
      {" "}
      {label && (
        <Label label={label} required={isRequired} className={labelClass} />
      )}
      <div className="input-container">
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <input
              id={id}
              autoComplete="off"
              placeholder={placeholder}
              name={name}
              type={"text"}
              className={`noscroll text-truncate ${className || "text-input"}`}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              ref={reference}
              disabled={disabled}
              autoFocus={autoFocus}
            />
          </div>
        </div>
        {error && (
          <span className="text-13-400 pt-1 d-flex align-items-cemter gap-2">
            <span style={{ color: "red" }}>{error}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default InputText;
