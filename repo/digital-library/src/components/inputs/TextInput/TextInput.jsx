import { useEffect } from "react";
import { Label } from "../..";
import DialCode from "./DialCode/DialCode";
import "./TextInput.scss";

const TextInput = ({
  className,
  label,
  type,
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
  isPhoneNumber,
  phoneNumberData,
  handelCancel,
  onBlur,
}) => {
  useEffect(() => {
    document.addEventListener("wheel", (event) => {
      if (
        document.activeElement.type === "number" &&
        document.activeElement.classList.contains("noscroll")
      ) {
        document.activeElement.blur();
      }
    });
  }, []);
  return (
    <div id="TextInput-container">
      {label && (
        <Label label={label} required={isRequired} className={labelClass} />
      )}
      <div className="input-container">
        <div className="d-flex align-items-center">
          {isPhoneNumber && (
            <DialCode
              onChange={onChange}
              phoneNumberData={phoneNumberData}
              disabled={disabled}
            />
          )}
          <div className="flex-grow-1">
            <input
              id={id}
              autoComplete="off"
              placeholder={placeholder}
              name={name}
              type={type || "text"}
              className={`noscroll text-truncate ${className || "text-input"} ${
                isPhoneNumber ? "border-start-0 phone-redius" : ""
              } ${handelCancel ? "button-padding" : ""}`}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              ref={reference}
              disabled={disabled}
              autoFocus={autoFocus}
            />
          </div>
        </div>
        {handelCancel && (
          <div
            className="cancel-block"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handelCancel();
            }}
          >
            Cancel
          </div>
        )}

        {error && (
          <span className="text-13-400 pt-1 d-flex align-items-cemter gap-2">
            <span style={{ color: "red" }}>{error}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default TextInput;
