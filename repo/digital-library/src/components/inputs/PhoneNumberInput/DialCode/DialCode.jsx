import { useEffect, useRef, useState } from "react";
import { lowerCase } from "lodash";
import { SeachInput } from "components";
import { dialCode } from "utils/constants";
import { titleCaseString } from "utils/helpers";
import "./DialCode.scss";

const DialCode = ({ onChange, phoneNumberData }) => {
  const { id, value } = phoneNumberData || {};
  const myRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [displayList, setDisplayList] = useState(dialCode);
  const handelSearch = (e) => {
    const searchVal = lowerCase(e.target.value);
    setSearchText(titleCaseString(searchVal));
    let newList = [];
    dialCode.forEach((elm) => {
      if (
        elm.dial_code.includes(searchVal) ||
        lowerCase(elm.name).includes(searchVal)
      ) {
        newList.push(elm);
      }
    });
    setDisplayList(newList);
  };
  const handelSelect = (e) => {
    onChange({
      target: {
        id: id,
        value: e.code,
      },
    });
    setSearchText("");
    setIsOpen(false);
    setDisplayList(dialCode);
  };
  const handleClickOutside = (e) => {
    if (myRef.current && !myRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  let val = {};
  if (value) {
    val = dialCode.find((o) => o.code === value);
  }
  return (
    <div id="dial-code-container" ref={myRef}>
      <div
        className="flag-container"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <img
          src={`https://flagpedia.net/data/flags/normal/${lowerCase(
            val?.code
          )}.png`}
          alt={val?.code}
          className="fill fit-image"
        />
      </div>
      <div className="dial-code-block">{val?.dial_code}</div>
      {isOpen && (
        <div className="country-code-selection-container box-shadow">
          <div className="pb-2">
            <SeachInput
              placeholder="Search"
              value={searchText}
              onChange={handelSearch}
            />
          </div>
          <div className="list-containe sp-scroll">
            {displayList.map((elm, index) => {
              return (
                <div
                  key={index}
                  className="d-flex align-items-center gap-2 list-item pt-1 pb-1"
                  onClick={() => {
                    handelSelect(elm);
                  }}
                >
                  <div className="flag-container h-21 w-21">
                    <img
                      src={`https://flagpedia.net/data/flags/normal/${lowerCase(
                        elm.code
                      )}.png`}
                      alt={elm.code}
                      className="fill fit-image"
                    />
                  </div>
                  <div className="flex-grow-1">{`${elm.name} (${elm.dial_code})`}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default DialCode;
