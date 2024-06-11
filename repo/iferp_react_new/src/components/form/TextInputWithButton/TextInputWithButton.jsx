import React from "react";
import "./TextInputWithButton.scss";
import { icons } from "utils/constants";
import Button from "../Button";

const TextInputWithButton = ({
  id,
  placeholder,
  name,
  onChange,
  value,
  disabled,
  error,
  onClick,
  isLoading,
}) => {
  return (
    <div id="textInput-with-button-container" className="cmb-20">
      <div id="email-input-container">
        <input
          id={id}
          placeholder={placeholder}
          name={name}
          type="text"
          className="email_input"
          onChange={onChange}
          value={value}
        />
        <span className="arrow-button">
          <Button
            isRounded
            className="user-select-none"
            icon={
              <img
                src={icons.rightRoundArrow}
                alt="right"
                className={disabled && "disable-arrow"}
                onClick={onClick}
              />
            }
            btnLoading={isLoading}
          />
        </span>
      </div>
      {error && (
        <span className="text-13-400 pt-1 d-flex align-items-cemter gap-2">
          <span style={{ color: "red" }}>{error}</span>
        </span>
      )}
    </div>
  );
};

export default TextInputWithButton;
