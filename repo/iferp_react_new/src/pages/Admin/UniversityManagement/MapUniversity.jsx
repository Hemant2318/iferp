import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { cloneDeep, forEach } from "lodash";
import Button from "components/form/Button";
import CheckBox from "components/form/CheckBox";
import Modal from "components/Layout/Modal";
import { getOtherUniversities, mapUniversity } from "store/slices";
import { objectToFormData } from "utils/helpers";
import SeachInput from "components/form/SeachInput";

const MapUniversity = ({ onHide, editData, handelSuccess }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  // const [searchData, setSearchData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const handelChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    // let newDataSearch = [];
    // if (value) {
    //   data.forEach((elem) => {
    //     if (elem.name.toLowerCase().includes(value)) {
    //       newDataSearch.push(elem);
    //     }
    //   });
    //   setSearchData(newDataSearch);
    // } else {
    //   setSearchData(data);
    // }
  };
  const handelSave = async () => {
    setBtnLoading(true);
    let newArr = [];
    forEach(data, (o) => {
      if (o.isChecked) {
        newArr.push(o.id);
      }
    });
    const payload = objectToFormData({
      university_id: editData?.id,
      other_universities_id: newArr.toString(),
    });
    const response = await dispatch(mapUniversity(payload));
    if (response?.status === 200) {
      handelSuccess();
    } else {
      setBtnLoading(false);
    }
  };
  const fetchOtherUnivercities = async () => {
    const response = await dispatch(getOtherUniversities());
    let newData = response?.data?.university || [];
    newData = newData.map((o) => {
      return { ...o, isChecked: false };
    });
    setData(newData);
  };
  useEffect(() => {
    fetchOtherUnivercities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let isData =
    data.length > 0 &&
    data.some((o) => o.name.toLowerCase().includes(searchText));
  return (
    <Modal onHide={onHide} title={editData?.name}>
      <div className="row cmt-30">
        <div className="col-md-6">
          <SeachInput
            placeholder="Search here"
            onChange={handelChange}
            value={searchText}
          />
        </div>
      </div>
      {!isData ? (
        <div className="d-flex align-items-center justify-content-center text-15-400 pt-5 pb-5">
          No Other University Found.
        </div>
      ) : (
        <div className="container cpt-20">
          <div className="row max-300 iferp-scroll overflow-auto">
            {data.map((elem, index) => {
              let isVisible = true;
              if (searchText) {
                isVisible = elem.name.toLowerCase().includes(searchText);
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
                  <span className="text-15-400">{elem?.name}</span>
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
              onClick={handelSave}
              btnLoading={btnLoading}
              disabled={!data.some((o) => o.isChecked)}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
export default MapUniversity;
