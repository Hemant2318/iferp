import { useState } from "react";
import { isEqual } from "lodash";
import { useDispatch } from "react-redux";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import Modal from "components/Layout/Modal";
import { statusType } from "utils/constants";
import { objectToFormData } from "utils/helpers";
import { updateCommitteeMemberStatus } from "store/slices";

const CommitteeMembersFrom = ({ onHide, editData, handelSuccess }) => {
  const dispatch = useDispatch();
  const {
    member_name,
    member_type,
    event_name,
    committee_member_category,
    designation,
    status,
  } = editData;
  const [btnLoading, setBtnLoading] = useState(false);
  const [statusValue, setStatusValue] = useState(status || "");
  const handelSave = async () => {
    setBtnLoading(true);
    let forData = objectToFormData({ status: statusValue, id: editData.id });
    const response = await dispatch(updateCommitteeMemberStatus(forData));
    if (response?.status === 200) {
      handelSuccess();
    }
    setBtnLoading(false);
  };
  return (
    <Modal onHide={onHide} title={editData ? "Edit Member" : "Add Member"}>
      <div className="row mt-5 ps-3 pe-3 pb-4">
        <div className="col-md-6 cmb-22">
          <TextInput onChange={() => {}} value={member_name} disabled />
        </div>
        <div className="col-md-6 cmb-22">
          <TextInput onChange={() => {}} value={member_type} disabled />
        </div>
        <div className="col-md-12 cmb-22">
          <TextInput onChange={() => {}} value={event_name} disabled />
        </div>
        <div className="col-md-6 cmb-22">
          <TextInput onChange={() => {}} value={designation} disabled />
        </div>
        <div className="col-md-6 cmb-22">
          <TextInput
            onChange={() => {}}
            value={committee_member_category}
            disabled
          />
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
export default CommitteeMembersFrom;
