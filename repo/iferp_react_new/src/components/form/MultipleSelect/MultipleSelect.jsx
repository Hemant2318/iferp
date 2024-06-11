import { map, includes } from "lodash";
import Select, { components } from "react-select";
import CheckBox from "../CheckBox";
import Label from "../Label";
import "./MultipleSelect.scss";

const MultipleSelect = ({
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
}) => {
  const optId = optionKey || "id";
  const optVal = optionValue || "label";

  let fillValue = null;
  if (value) {
    const idArray = value.split(",");
    fillValue = options.filter((o) => includes(idArray, o[optId] + ""));
  }

  const Option = (props) => {
    let sLen = fillValue ? fillValue.length : 0;

    return (
      <div>
        {props?.value === "ALL" ? (
          <div
            className={`d-flex align-items-center cps-12 pointer pt-2 pb-2 ${
              sLen === props?.options?.length - 1 ? "selected-blobk" : ""
            }`}
            onClick={() => {
              if (sLen === props?.options?.length - 1) {
                onChange({
                  target: {
                    id: id,
                    value: "",
                    data: props?.options,
                  },
                });
              } else {
                let allIds = map(props?.options, "id").join(",");
                let selectID = allIds.replace("ALL,", "");
                onChange({
                  target: {
                    id: id,
                    value: selectID,
                    data: props?.options,
                  },
                });
              }
            }}
          >
            <div className="me-2 multiple-check">
              <CheckBox
                type="PRIMARY-ACTIVE"
                onClick={() => {}}
                isChecked={sLen === props?.options?.length - 1}
              />
            </div>
            <div> Select All</div>
          </div>
        ) : (
          <components.Option {...props}>
            <div className="d-flex align-items-center">
              <div className="me-2 multiple-check">
                <CheckBox
                  type="PRIMARY-ACTIVE"
                  onClick={() => {}}
                  isChecked={props.isSelected}
                />
              </div>
              <div> {props.label}</div>
            </div>
          </components.Option>
        )}
      </div>
    );
  };
  return (
    <div id="multipleSelect-container">
      {label && (
        <Label label={label} required={isRequired} className={labelClass} />
      )}
      <Select
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
        components={{
          Option,
        }}
        getOptionLabel={(option) => option[optVal]}
        getOptionValue={(option) => option[optId]}
        placeholder={placeholder}
        isDisabled={disabled}
        isLoading={isLoading}
        className="basic-multi-select"
        classNamePrefix="select"
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
      />
      {error && (
        <span className="text-13-400 pt-1">
          <span style={{ color: "red" }}>{error}</span>
        </span>
      )}
    </div>
  );
};
export default MultipleSelect;
