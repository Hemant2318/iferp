import { useState } from "react";
import Button from "../../form/Button";
import Modal from "../Modal";
import { useDispatch } from "react-redux";
import { throwSuccess } from "store/slices";
import SeachInput from "components/form/SeachInput";
import CheckBox from "components/form/CheckBox";
import { titleCaseString } from "utils/helpers";
import { cloneDeep } from "lodash";
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
const DeletePopup = ({
  title = "Delete Record",
  message = "Are you sure you want to delete this record?",
  onHide,
  handelSuccess,
  handelDelete,
  isTopics,
}) => {
  const [data, setData] = useState(dummyData);

  const [searchText, setSearchText] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const dispatch = useDispatch();
  const deleteRecord = async () => {
    setBtnLoading(true);
    const response = await handelDelete();
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      handelSuccess();
    } else {
      setBtnLoading(false);
    }
  };

  const handelChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };
  return (
    <Modal onHide={onHide} title={title || "Delete Record"}>
      <div className="center-flex text-20-400 cmt-30">{message}</div>
      {isTopics ? (
        <>
          <div className="row cmt-30">
            <div className="col-md-6">
              <SeachInput
                placeholder="Search here"
                onChange={handelChange}
                value={searchText}
              />
            </div>
          </div>
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
                    <span className="text-15-400">
                      {titleCaseString(elem?.tName)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="col-md-12 d-flex justify-content-center gap-4 cmt-20 cpb-10">
              <Button
                text="Cancel"
                isRounded
                btnStyle="light-outline"
                className="cps-30 cpe-30"
                onClick={onHide}
              />
              <Button
                isRounded
                text="Assign"
                btnStyle="primary-dark"
                className="cps-30 cpe-30"
                btnLoading={btnLoading}
                disabled={!data.some((o) => o.isChecked)}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center gap-4 cmt-30 cpb-30">
          <Button
            isRounded
            text="Cancel"
            btnStyle="light-outline"
            className="cps-40 cpe-40"
            onClick={onHide}
          />
          <Button
            isRounded
            text="Delete"
            btnStyle="danger-dark"
            className="cps-40 cpe-40"
            onClick={deleteRecord}
            btnLoading={btnLoading}
          />
        </div>
      )}
    </Modal>
  );
};
export default DeletePopup;
