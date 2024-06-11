import { isEqual } from "lodash";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import Modal from "components/Layout/Modal";
import { statusType } from "utils/constants";
import { changeInstituteActivityReportStatus } from "store/slices";

const ActivityReportForm = ({ onHide, editData, handelSuccess }) => {
  const dispatch = useDispatch();
  const { id, institution_name, member_id_type, event_name, status } = editData;
  const [btnLoading, setBtnLoading] = useState(false);
  const [statusValue, setStatusValue] = useState(status || "");
  const handelSave = async () => {
    setBtnLoading(true);
    const response = await dispatch(
      changeInstituteActivityReportStatus(`id=${id}&status=${statusValue}`)
    );
    if (response?.status === 200) {
      handelSuccess(statusValue);
    }
    setBtnLoading(false);
  };
  return (
    <Modal onHide={onHide} title="Edit Activity">
      <div className="row mt-5 ps-3 pe-3 pb-4">
        <div className="col-md-6 cmb-22">
          <TextInput onChange={() => {}} value={institution_name} disabled />
        </div>
        <div className="col-md-6 cmb-22">
          <TextInput onChange={() => {}} value={member_id_type} disabled />
        </div>

        <div className="col-md-6 cmb-22">
          <TextInput onChange={() => {}} value={event_name} disabled />
        </div>

        <div className="col-md-6 cmb-22 d-flex align-items-center">
          <div className="me-2">Status:</div>
          <div className="flex-grow-1">
            <Dropdown
              id="membership_plan_id"
              placeholder="Select Member Type"
              options={statusType}
              value={statusValue}
              optionKey="id"
              optionValue="label"
              onChange={(e) => {
                const val = e.target.value;
                setStatusValue(val);
              }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-center gap-4 mt-3">
          <Button
            text="Cancel"
            isRounded
            btnStyle="light-outline"
            className="cps-40 cpe-40"
            onClick={onHide}
          />
          <Button
            text="Submit"
            isRounded
            btnStyle="primary-dark"
            className="cps-40 cpe-40"
            btnLoading={btnLoading}
            disabled={isEqual(status, statusValue)}
            onClick={handelSave}
          />
        </div>
      </div>
    </Modal>
  );
};
export default ActivityReportForm;
