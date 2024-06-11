import React, { useState } from "react";
import Modal from "../Modal";
import TextArea from "components/form/TextArea";
import Button from "components/form/Button";
import { useDispatch } from "react-redux";
import { sessionRequest, throwError, throwSuccess } from "store/slices";
import { objectToFormData } from "utils/helpers";

const RemarkPopup = ({ setIsRemarkPopup, data, setData, handleSuccess }) => {
  const dispatch = useDispatch();
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState("");
  const handleRejectSession = async (obj) => {
    if (!obj?.remark) {
      setError("Please enter remarks for rejecting");
      return;
    }
    setBtnLoading(true);
    const response = await dispatch(sessionRequest(objectToFormData(data)));
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      setIsRemarkPopup(false);
      handleSuccess();
    } else {
      dispatch(throwError(response?.message));
    }
    setBtnLoading(false);
  };

  return (
    <Modal
      onHide={() => {
        setIsRemarkPopup(false);
      }}
    >
      <div className="d-flex flex-column justify-content-center cps-20 cpe-20">
        <div className="text-center cmt-30 cmb-12">
          <div className="text-24-500 color-3146">Remarks </div>
        </div>

        <TextArea
          rows={5}
          placeholder="Enter remarks for rejecting"
          labelClass="text-15-400-18 color-black-olive"
          onChange={(e) => {
            setData((prev) => {
              return {
                ...prev,
                remark: e?.target?.value,
              };
            });
            setError("");
          }}
          error={error}
        />
        <div className="d-flex align-items-center justify-content-center cmt-30 cmb-30 gap-4">
          <Button
            btnStyle="primary-dark"
            text="Submit"
            className="cps-30 cpe-30"
            onClick={() => {
              handleRejectSession(data);
            }}
            btnLoading={btnLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default RemarkPopup;
