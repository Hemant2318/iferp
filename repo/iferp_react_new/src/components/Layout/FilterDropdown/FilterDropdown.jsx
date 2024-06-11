import { sortBy } from "lodash";
import { useState } from "react";
import { icons } from "utils/constants";
import CheckBox from "../../form/CheckBox";
import DropdownButton from "../../form/DropdownButton";
import "./FilterDropdown.scss";

const FilterDropdown = ({
  list = [],
  handelChangeFilter,
  label,
  isHideAll,
  className,
}) => {
  const [filters, setFilters] = useState([]);
  const [timer, setTimer] = useState("");
  const handelFilter = (id) => {
    const checkValue = filters.includes(id);
    let val = [];
    if (checkValue) {
      const newValue = filters.filter((item) => item !== id);
      val = newValue;
    } else {
      val = [...filters, id];
    }
    setFilters(val);
    handelChange(val);
  };
  const handelAllFilter = (isCheckAll) => {
    let val = [];
    if (isCheckAll) {
      val = [];
    } else {
      val = list.map((e) => {
        return e.id;
      });
    }
    setFilters(val);
    handelChange(val);
  };
  const handelChange = (val) => {
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      handelChangeFilter(sortBy([...val], "desc").toString());
    }, 800);
    setTimer(time);
  };

  return (
    <DropdownButton
      text={
        <span className="text-start">
          <span className="">{label || "Filter"}</span>{" "}
          <i className="bi bi-chevron-down dropdown-arrow bg-white" />
        </span>
      }
      className={className || "h-35"}
      icon={<img src={icons.filter} alt="export" className="pe-1 h-20" />}
      hideIcon
    >
      {!isHideAll && (
        <div className="d-flex align-items-center cpt-16 cpb-16 cps-16 cpe-16 border-b">
          <CheckBox
            type="ACTIVE"
            onClick={() => {
              handelAllFilter(filters.length === list.length);
            }}
            isChecked={filters.length === list.length}
          />
          <span className="ms-3">All</span>
        </div>
      )}
      {list.map((elem, index) => {
        return (
          <div
            key={index}
            className="d-flex align-items-center cpt-16 cpb-16 cps-16 cpe-16 border-b"
          >
            <CheckBox
              type="ACTIVE"
              onClick={() => {
                handelFilter(elem.id);
              }}
              isChecked={filters.includes(elem.id)}
            />
            <span className="ms-3">{elem.name}</span>
          </div>
        );
      })}
    </DropdownButton>
  );
};
export default FilterDropdown;
