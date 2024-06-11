import ReactDatePicker from "react-datepicker";
import Label from "../Label";
import "./TimePicker.scss";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const TimePicker = ({
  label,
  error,
  isRequired,
  placeholder,
  onChange,
  name,
  value,
  id,
  disabled,
}) => {
  return (
    <div id="time-picker-container">
      {label && <Label label={label} required={isRequired} />}
      <div className="input-container">
        <ReactDatePicker
          id={id}
          name={name}
          selected={value ? new Date(moment(value, "hh:mm")) : null}
          onChange={(e) => {
            onChange({
              target: {
                id: id,
                value: e ? moment(e).format("HH:mm") : "",
              },
            });
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="hh:mm a"
          placeholderText={placeholder}
          disabled={disabled}
        />
        <span className="calender-icon">
          <i className="bi bi-clock" />
        </span>

        {error && (
          <span className="text-13-400 pt-1">
            <span style={{ color: "red" }}>{error}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default TimePicker;
