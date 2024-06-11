import { icons } from "utils/constants";
import Label from "../Label";
import { useEffect, useRef, useState } from "react";
import "./Timepicker.scss";

const Timepicker = ({
  id,
  // name,
  error,
  label,
  value,
  // onBlur,
  disabled,
  onChange,
  required,
  placeholder,
  is24Hour,
  isClearable,
}) => {
  const myRef = useRef();
  const [isPopup, setIsPopup] = useState(false);
  const [clockVal, setClockVal] = useState({
    hour: "",
    minut: "",
    ampm: "",
  });
  const hourSelect = (e) => {
    const val = e.target.value;
    setClockVal((prev) => {
      return {
        ...prev,
        hour: val,
        minut: prev.minut ? prev.minut : "00",
        ampm: is24Hour ? "" : prev.ampm ? prev.ampm : "AM",
      };
    });
  };
  const minutSelect = (e) => {
    const val = e.target.value;
    setClockVal((prev) => {
      return {
        ...prev,
        minut: val,
      };
    });
  };
  const ampmSelect = (e) => {
    const val = e.target.value;
    setClockVal((prev) => {
      return {
        ...prev,
        ampm: val,
      };
    });
  };
  const handleClickOutside = (e) => {
    if (myRef && myRef?.current && !myRef.current.contains(e.target)) {
      setIsPopup(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  useEffect(() => {
    if (clockVal.hour && clockVal.minut) {
      if (is24Hour) {
        onChange({
          target: {
            id: id,
            value: `${clockVal.hour}:${clockVal.minut}${
              is24Hour ? "" : ` ${clockVal.ampm}`
            }`,
            data: clockVal,
          },
        });
      } else {
        if (clockVal.ampm) {
          onChange({
            target: {
              id: id,
              value: `${clockVal.hour}:${clockVal.minut}${
                is24Hour ? "" : ` ${clockVal.ampm}`
              }`,
              data: clockVal,
            },
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clockVal]);
  useEffect(() => {
    if (value) {
      setClockVal({
        hour: value.substring(0, 2),
        minut: value.substring(3, 5),
        ampm: value.substring(6, 8),
      });
    }
  }, [value]);

  const { hour, minut, ampm } = clockVal;
  let newVal =
    hour && minut
      ? `${clockVal.hour}:${clockVal.minut}${
          is24Hour ? "" : ` ${clockVal.ampm}`
        }`
      : "";
  return (
    <div id="timepicker-container">
      {label && <Label label={label} required={required} />}
      <div
        className="clock-container"
        id="clock-container-block"
        onClick={() => {
          if (!disabled) {
            setIsPopup(true);
          }
        }}
      >
        <span>{newVal || placeholder}</span>
        {isClearable && newVal ? (
          <span
            className="clock-icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setClockVal({
                hour: "",
                minut: "",
                ampm: "",
              });
              onChange({
                target: {
                  id: id,
                  value: "",
                  data: { hour: "", minut: "", ampm: "" },
                },
              });
            }}
          >
            <img src={icons.close} alt="close" />
          </span>
        ) : (
          <span className="clock-icon">
            <img src={icons.clock} alt="clock" />
          </span>
        )}
        {isPopup && (
          <div className="clock-popup shadow" ref={myRef}>
            <div className="timepicker_data_select">
              <select
                className="timepicker-select"
                size={5}
                onChange={hourSelect}
              >
                {Array.from({ length: is24Hour ? 23 : 12 }).map((_, i) => {
                  let newHour = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
                  return (
                    <option
                      key={i}
                      value={newHour}
                      className={hour === newHour ? "active-op" : ""}
                    >
                      {newHour}
                    </option>
                  );
                })}
              </select>
              <select
                className="timepicker-select"
                size={5}
                onChange={minutSelect}
              >
                {Array.from({ length: 60 }).map((_, i) => {
                  let newMinut = i < 10 ? `0${i}` : `${i}`;
                  return (
                    <option
                      key={i}
                      value={newMinut}
                      className={minut === newMinut ? "active-op" : ""}
                    >
                      {newMinut}
                    </option>
                  );
                })}
              </select>
              {!is24Hour && (
                <select
                  className="timepicker-select"
                  size={5}
                  onChange={ampmSelect}
                >
                  <option
                    value="AM"
                    className={ampm === "AM" ? "active-op" : ""}
                  >
                    AM
                  </option>
                  <option
                    value="PM"
                    className={ampm === "PM" ? "active-op" : ""}
                  >
                    PM
                  </option>
                </select>
              )}
            </div>
          </div>
        )}
      </div>
      {error && !isPopup && <div className="input-error">{error}</div>}
    </div>
  );
};

export default Timepicker;
