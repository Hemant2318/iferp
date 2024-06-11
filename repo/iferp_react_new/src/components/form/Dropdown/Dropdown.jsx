import Select from "react-select";
import Label from "../Label";
import "./Dropdown.scss";

const Dropdown = ({
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
  extraDisplayKey,
  isClearable,
  label,
  isRequired,
  labelClass,
  isSearchable = true,
  onInputChange,
  onMenuScrollToBottom,
  isRounded,
}) => {
  const optId = optionKey || "id";
  const optVal = optionValue || "label";
  let fillValue = options?.find((o) => `${o?.[optId]}` === `${value}`);
  if (!fillValue) {
    fillValue = null;
  }
  // console.log(options);
  return (
    <div id="Dropdown-container">
      {label && (
        <Label label={label} required={isRequired} className={labelClass} />
      )}
      <Select
        onChange={(e) => {
          onChange({
            target: {
              id: id,
              value: e ? e[optId] : "",
              data: e,
            },
          });
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: isRounded ? 21 : 4,
        })}
        getOptionLabel={(option) => {
          if (extraDisplayKey) {
            return `${option[optVal] || ""} ${
              option[extraDisplayKey] ? `- ${option[extraDisplayKey]}` : ""
            }`;
          } else {
            return option[optVal];
          }
        }}
        getOptionValue={(option) => option[optId]}
        placeholder={placeholder}
        className={`basic-single ${value ? "" : "placehoder-val"}`}
        classNamePrefix="select"
        value={fillValue}
        isDisabled={disabled}
        isLoading={isLoading}
        name={name}
        options={options}
        isClearable={isClearable}
        isSearchable={isSearchable}
        onMenuScrollToBottom={onMenuScrollToBottom}
        onInputChange={(text, event) => {
          if (onInputChange && event?.action === "input-change") {
            onInputChange(text);
          }
        }}
        autoComplete="off"
        // menuIsOpen
      />

      {error && (
        <span className="text-13-400 pt-1">
          <span style={{ color: "red" }}>{error}</span>
        </span>
      )}
    </div>
  );
};
export default Dropdown;
