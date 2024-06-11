import React, { useEffect, useState } from "react";
import "./InputOTP.scss";

const InputOTP = ({
  blockSize = 4,
  isDisableTyping,
  onSubmit,
  resetOTP,
  placeholder,
  setResetOTP,
}) => {
  const [otpInput, setOtpInput] = useState([]);
  const [keyCode, setKeyCode] = useState("");

  const sysncData = () => {
    if (resetOTP) {
      const newOtpInput = [];
      Array.from({ length: blockSize }).forEach((currentElement, i) => {
        newOtpInput.push({
          id: `otpInput-${i + 1}`,
          name: `Input-${i + 1}`,
          value: "",
        });
      });
      setOtpInput(newOtpInput);
      setResetOTP(false);
      setTimeout(() => {
        const inputElement = document.getElementById("otpInput-1");
        if (inputElement) {
          inputElement.disabled = false;
          inputElement.focus();
        }
      }, 100);
    }
  };

  const ontabChange = (e, index) => {
    const id = e.target.id.split("-").pop();
    const code = keyCode;

    const { maxLength } = e.target;
    let { value } = e.target;
    const alphaPattern = /[A-Za-z0-9]/g;
    if (!alphaPattern.test(value)) {
      value = "";
    }
    const { length } = e.target.value;
    if (length === maxLength && code !== 8) {
      if (value) {
        const inputElement = document.getElementById(`otpInput-${+id + 1}`);
        if (inputElement) {
          inputElement.disabled = false;
          inputElement.focus();
        }
      }
    }
    const newOTP = [...otpInput];
    newOTP[index].value = value.toUpperCase();
    setOtpInput(newOTP);
    let otpCode = "";
    otpInput.forEach((elem) => {
      otpCode += elem.value;
    });
    // if (otpCode.length === blockSize) {
    onSubmit(otpCode.trim());
    // }
  };

  const onKeyDown = (e) => {
    setKeyCode(e.keyCode);
    const id = e.target.id.split("-").pop();
    const code = e.keyCode;
    const { length } = e.target.value;
    const elem = document.getElementById(`otpInput-${+id - 1}`);
    if (length === 0 && code === 8 && elem) {
      elem.focus();
    }
  };

  const handelPasteEvent = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const clipboardData = e.clipboardData || e.clipboardData.getData("Text");
    const pastedData = clipboardData
      .getData("Text")
      .replace(/[^A-Za-z0-9]/g, "")
      .substring(0, blockSize);
    if (pastedData) {
      const newOtpInput = [];
      let emptyFieldIndex = blockSize;
      Array.from({ length: blockSize }).forEach((currentElement, i) => {
        let val = "";
        if (pastedData[i]) {
          val = pastedData[i].toUpperCase();
          emptyFieldIndex = i + 2;
        }

        newOtpInput.push({
          id: `otpInput-${i + 1}`,
          name: `Input-${i + 1}`,
          value: val,
        });
      });
      setOtpInput(newOtpInput);
      const inputElement = document.getElementById(
        `otpInput-${emptyFieldIndex > blockSize ? blockSize : emptyFieldIndex}`
      );
      if (inputElement) {
        inputElement.disabled = false;
        inputElement.focus();
      }
      let otpCode = "";
      newOtpInput.forEach((elem) => {
        otpCode += elem.value;
      });
      if (otpCode.length === blockSize) {
        onSubmit(otpCode.trim());
      }
    }
  };

  useEffect(() => {
    sysncData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetOTP]);
  return (
    <div id="InputOTP-container">
      <ul className="verification_code_wrapper">
        {otpInput.map((elem, index) => {
          let isDisabled = false;
          if (index === 0) {
            isDisabled = false;
          } else {
            const obj = otpInput[index - 1];
            const prevValue = obj?.value;
            isDisabled = !prevValue;
          }

          return (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index}>
              <input
                id={elem.id}
                type="text"
                name={elem.name}
                value={elem.value}
                maxLength={1}
                onChange={(e) => {
                  !isDisableTyping && ontabChange(e, index);
                }}
                onKeyDown={onKeyDown}
                placeholder={placeholder || ""}
                className={elem.value ? "" : "no-border"}
                autoComplete="off"
                onPaste={handelPasteEvent}
                disabled={isDisabled}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default InputOTP;
