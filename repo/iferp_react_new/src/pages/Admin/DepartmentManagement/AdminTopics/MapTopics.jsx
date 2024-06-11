import React, { useState } from "react";
import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import SeachInput from "components/form/SeachInput";
import CheckBox from "components/form/CheckBox";
import { cloneDeep } from "lodash";
import { titleCaseString } from "utils/helpers";

const dummyData = [
  {
    id: 1,
    tName: "topic 1",
  },
  {
    id: 2,
    tName: "topic 2",
  },
  {
    id: 3,
    tName: "topic 3",
  },
  {
    id: 4,
    tName: "topic 4",
  },
  {
    id: 5,
    tName: "topic 5",
  },
];
const MapTopics = ({ onHide, editData }) => {
  console.log("editData", editData);
  const [data, setData] = useState(dummyData);
  const [searchText, setSearchText] = useState("");
  const handelChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };
  return (
    <Modal onHide={onHide} title={titleCaseString(editData?.topics)}>
      <div className="row cmt-30">
        <div className="col-md-6">
          <SeachInput
            placeholder="Search here"
            onChange={handelChange}
            value={searchText}
          />
        </div>
      </div>
      {data?.length === 0 ? (
        <div className="d-flex align-items-center justify-content-center text-15-400 pt-5 pb-5">
          No Other Topic Found.
        </div>
      ) : (
        <div className="container cpt-20">
          <div className="row max-300 iferp-scroll overflow-auto">
            {data.map((elem, index) => {
              let isVisible = true;
              if (searchText) {
                isVisible = elem.tName.toLowerCase().includes(searchText);
              }

              return (
                <div
                  key={index}
                  className={`d-flex gap-2 align-items-center col-md-6 mb-3 ${
                    isVisible ? "" : "d-none"
                  }`}
                >
                  <span>
                    <CheckBox
                      type="PRIMARY-ACTIVE"
                      isChecked={elem?.isChecked}
                      onClick={() => {
                        setData((prev) => {
                          let newData = cloneDeep(prev);
                          newData[index].isChecked = !prev[index].isChecked;
                          return newData;
                        });
                      }}
                    />
                  </span>
                  <span className="text-15-400">{elem?.tName}</span>
                </div>
              );
            })}
          </div>
          <div className="col-md-12 d-flex justify-content-center gap-4 cmt-20 cpb-10">
            <Button
              text="Cancel"
              isRounded
              btnStyle="light-outline"
              className="cps-40 cpe-40"
              onClick={onHide}
            />
            <Button
              isRounded
              text="Map"
              btnStyle="primary-dark"
              className="cps-50 cpe-50"
              disabled={!data.some((o) => o.isChecked)}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MapTopics;
