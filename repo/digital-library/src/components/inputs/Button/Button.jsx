import { Loader } from "../..";
import "./Button.scss";
const Button = ({
  btnText,
  btnStyle,
  btnType,
  onClick,
  className,
  rightIcon,
  leftIcon,
  text,
  disabled,
  btnLoading,
  onKeyUp,
}) => {
  return (
    <div id="button-container">
      <button
        className={`btn-block ${btnStyle ? btnStyle : ""} ${
          className ? className : ""
        }`}
        onClick={onClick}
        type={btnType || "button"}
        disabled={disabled}
        onKeyUp={onKeyUp}
      >
        <span className={text ? "" : "fa-center gap-2"}>
          {leftIcon && (
            <span>
              <img src={leftIcon} alt="left-icon" />
            </span>
          )}
          {btnText && <span>{btnText}</span>}
          {rightIcon && (
            <span>
              <img src={rightIcon} alt="right-icon" />
            </span>
          )}
          {btnLoading && <Loader className="ms-2" />}
        </span>
      </button>
    </div>
  );
};

export default Button;
