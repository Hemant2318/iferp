import Loader from "../../Layout/Loader";
import "./Button.scss";
const Button = ({
  text,
  icon,
  rightIcon,
  type,
  btnStyle,
  isRounded,
  isSquare,
  className,
  onClick,
  disabled,
  btnLoading,
}) => {
  return (
    <div id="button-container">
      <button
        type={type || "button"}
        className={`btn w-100 d-flex align-items-center justify-content-center ${btnStyle} ${
          isRounded ? "btn-round" : isSquare ? "btn-square" : ""
        } ${className ? className : ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon && icon}
        {text && text}
        {rightIcon && rightIcon}
        {btnLoading && <Loader className="ms-2" />}
      </button>
    </div>
  );
};
export default Button;
