import { map } from "lodash";
import CreatableSelect from "react-select/creatable";
import CheckBox from "../CheckBox";
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
  onInputChange,
}) => {
  const optId = optionKey || "id";
  const optVal = optionValue || "label";

  let fillValue = [];
  if (value) {
    options.forEach((element) => {
      if (value?.split(",")?.includes(element[optId])) {
        fillValue.push(element);
      }
    });
  }
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
          isMulti
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
          getOptionLabel={(option) => {
            const isCheck = value?.split(",")?.includes(option[optId]);

            return (
              <div className="d-flex align-items-center">
                <div className="me-2 multiple-check">
                  <CheckBox
                    type="PRIMARY-ACTIVE"
                    onClick={() => {}}
                    isChecked={isCheck}
                  />
                </div>
                <div> {option[optVal]}</div>
              </div>
            );
          }}
          getOptionValue={(option) => option[optId]}
          placeholder={placeholder}
          isDisabled={disabled}
          isLoading={isLoading}
          className="basic-multi-select"
          classNamePrefix="select"
          hideSelectedOptions={false}
          closeMenuOnSelect={false}
          onCreateOption={onCreateOption}
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
