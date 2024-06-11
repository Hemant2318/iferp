import { useEffect } from "react";
import Label from "../Label";
import DialCode from "./DialCode";
import "./PhoneNumberInput.scss";

const PhoneNumberInput = ({
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
  phoneNumberData,
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
    <div id="phone-number-input-container">
      {label && (
        <Label label={label} required={isRequired} className={labelClass} />
      )}
      <div className="input-container">
        <div className="d-flex align-items-center">
          <DialCode onChange={onChange} phoneNumberData={phoneNumberData} />

          <div className="flex-grow-1">
            <input
              id={id}
              autoComplete="off"
              placeholder={placeholder}
              name={name}
              type={"text"}
              className={`noscroll text-truncate border-start-0 phone-redius ${
                className || "text-input"
              }`}
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

export default PhoneNumberInput;
