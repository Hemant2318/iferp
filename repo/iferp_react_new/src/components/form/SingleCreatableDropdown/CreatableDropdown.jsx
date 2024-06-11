import { includes, map } from "lodash";
import CreatableSelect from "react-select/creatable";
// import CheckBox from "../CheckBox";
import Label from "../Label";
import "./CreatableDropdown.scss";

const CreatableDropdown = ({
  value,
  placeholder,
  options,
  error,
  id,
  optionKey,
  optionValue,
  onChange,
  isLoading,
  disabled,
  name,
  label,
  isRequired,
  labelClass,
  onCreateOption,
  onMenuScrollToBottom,
  onInputChange,
}) => {
  const optId = optionKey || "id";
  // const optVal = optionValue || "label";

  let fillValue = options.filter((o) => includes(value, o[optId]));
  if (!fillValue) {
    fillValue = null;
  }
  return (
    <div id="CreatableSelect-container">
      {label && (
        <Label label={label} required={isRequired} className={labelClass} />
      )}
      <div>
        <CreatableSelect
          onChange={(e) => {
            onChange({
              target: {
                id: id,
                value: map(e, "id").join(","),
                data: e,
              },
            });
          }}
          value={fillValue}
          name={name}
          options={options}
          placeholder={placeholder}
          isDisabled={disabled}
          isLoading={isLoading}
          className="basic-multi-select"
          classNamePrefix="select"
          hideSelectedOptions={false}
          closeMenuOnSelect={true}
          onCreateOption={onCreateOption}
          onMenuScrollToBottom={onMenuScrollToBottom}
          onInputChange={(text, event) => {
            if (onInputChange && event?.action === "input-change") {
              onInputChange(text);
            }
          }}
        />
      </div>
      {error && (
        <span className="text-13-400 pt-1">
          <span style={{ color: "red" }}>{error}</span>
        </span>
      )}
    </div>
  );
};
export default CreatableDropdown;
