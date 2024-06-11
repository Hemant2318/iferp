import { Loader } from "components";
import { icons } from "utils/constants";
import "./SeachInput.scss";
const SeachInput = ({
  className,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  name,
  value,
  reference,
  id,
  isLoading,
}) => {
  return (
    <div id="SeachInput-container">
      <div className="input-container">
        <input
          id={id || "SeachInput-field"}
          autoComplete="off"
          placeholder={placeholder}
          name={name}
          type="text"
          className={className || "text-input text-truncate"}
          onChange={onChange}
          value={value}
          ref={reference}
          onBlur={onBlur}
          onFocus={onFocus}
        />

        {isLoading ? (
          <span className="loader-icon">
            <Loader size="sm" />
          </span>
        ) : (
          <span className="search-icon">
            <img src={icons.search} alt="search" />
          </span>
        )}
      </div>
    </div>
  );
};

export default SeachInput;
