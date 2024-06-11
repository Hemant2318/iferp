import { useState } from "react";
import Label from "../Label";
import { trimLeftSpace } from "utils/helpers";
// import ProgressBar from "react-bootstrap/ProgressBar";
import "./PasswordInput.scss";

const PasswordInput = ({
  label,
  isRequired,
  labelClass,
  id,
  placeholder,
  name,
  onChange,
  value,
  reference,
  disabled,
  autoFocus,
  type,
  error,
  isShowSuggetion,
}) => {
  const [inputType, setType] = useState("password");
  const [isShow, setIsShow] = useState(false);
  const handleType = (type) => {
    setType(type);
  };
  const isLower = /[a-z]/.test(value);
  const isUpper = /[A-Z]/.test(value);
  const isNumber = /[0-9]/.test(value);
  const isSpecial = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value);
  const isLen = value.length > 5;
  const suggetionArray = [
    {
      title: "One lowercase",
      isTrue: isLower,
    },
    {
      title: "One uppercase",
      isTrue: isUpper,
    },
    {
      title: "Number (0-9)",
      isTrue: isNumber,
    },
    {
      title: "Special Character (!@#$%^&*)",
      isTrue: isSpecial,
    },
    {
      title: "Atleast 6 Character",
      isTrue: isLen,
    },
  ];
  //   let count = 0;
  //   if (isLower) {
  //     count++;
  //   }
  //   if (isUpper) {
  //     count++;
  //   }
  //   if (isNumber) {
  //     count++;
  //   }
  //   if (isSpecial) {
  //     count++;
  //   }
  //   if (isLen) {
  //     count++;
  //   }
  //   let progressCount = (count / 5) * 100;
  return (
    <div id="password-input-container">
      {label && (
        <Label label={label} required={isRequired} className={labelClass} />
      )}
      <div className="password-container">
        <input
          id={id}
          autoComplete="off"
          placeholder={placeholder}
          name={name}
          type={inputType || "text"}
          className="noscroll text-truncate password-input"
          onChange={(e) => {
            onChange({
              target: {
                id: id,
                value: trimLeftSpace(e.target.value),
              },
            });
          }}
          onBlur={() => {
            setIsShow(false);
          }}
          onFocus={() => {
            setIsShow(true);
          }}
          value={value}
          ref={reference}
          disabled={disabled}
          autoFocus={autoFocus}
        />
        <span className="password-icon">
          <i
            className={`pointer bi ${
              inputType === "text" ? "bi-eye" : "bi-eye-slash"
            }`}
            onClick={() => {
              handleType(inputType === "text" ? "password" : "text");
            }}
          />
        </span>
        {isShow && isShowSuggetion && (
          <div className="password-suggetion-popup box-shadow">
            {suggetionArray.map((elm, index) => {
              return (
                <div
                  key={index}
                  className={`mb-1 ${
                    elm.isTrue ? "color-black-olive" : "color-raisin-black"
                  }`}
                >
                  <span className="text-14-400">
                    {elm.isTrue ? (
                      <i className="bi bi-check-lg text-success" />
                    ) : (
                      <i className="bi bi-dot" />
                    )}
                  </span>
                  <span className="text-12-400 ms-1">{elm.title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* {progressCount > 0 && (
        <ProgressBar
          now={progressCount}
          className={`password-indicator success-${count}`}
        />
      )} */}
      {error && (
        <span className="text-13-400 pt-1 d-flex align-items-cemter gap-2">
          <span style={{ color: "red" }}>{error}</span>
        </span>
      )}
    </div>
  );
};

export default PasswordInput;
