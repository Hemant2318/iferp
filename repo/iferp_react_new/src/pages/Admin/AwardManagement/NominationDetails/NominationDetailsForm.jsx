import { useState } from "react";
import { isEqual } from "lodash";
import { Formik } from "formik";
import Label from "components/form/Label";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import Modal from "components/Layout/Modal";

const NominationDetailsForm = ({ onHide, editData, handelChangeStatus }) => {
  const { memberId, nominationsName, status, awardType } = editData;
  const initialValues = {
    status: status || "",
  };
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = (values) => {
    setBtnLoading(true);
    if (isEqual(editData.status, values.status)) {
      onHide();
    } else {
      handelEditData({ id: editData.id, status: values.status });
    }
  };
  const handelEditData = async (data) => {
    const response = await handelChangeStatus(data);
    if (response?.status === 200) {
      onHide();
    }
    setBtnLoading(false);
  };
  return (
    <Modal onHide={onHide} title="Edit Nominations Status">
      <div className="cmt-34 cms-34 cme-34 cmb-16">
        <Formik initialValues={initialValues} onSubmit={handelSave}>
          {(props) => {
            const { values, handleChange, handleSubmit } = props;
            return (
              <form>
                <div className="row d-flex align-items-center">
                  <div className="col-md-4 cmb-22">
                    <Label label="Nominator’sName" />
                  </div>
                  <div className="col-md-8 cmb-22">
                    <TextInput
                      id="nominatorName"
                      placeholder="Nominator Name"
                      value={nominationsName}
                      disabled
                    />
                  </div>
                  <div className="col-md-4 cmb-22">
                    <Label label="Nominator’s Member ID" />
                  </div>
                  <div className="col-md-8 cmb-22">
                    <TextInput
                      placeholder="Nominator Member Id"
                      id="nominatorMemberId"
                      value={memberId}
                      disabled
                    />
                  </div>
                  <div className="col-md-4 cmb-22">
                    <Label label="Nominee’s Name" />
                  </div>
                  <div className="col-md-8 cmb-22">
                    <TextInput
                      id="memberId"
                      placeholder="Nominee’s Name"
                      value={nominationsName}
                      disabled
                    />
                  </div>
                  <div className="col-md-4 cmb-22">
                    <Label label="Nominee’s Member ID" />
                  </div>
                  <div className="col-md-8 cmb-22">
                    <TextInput
                      id="nominationsName"
                      placeholder="Nominee’s Member ID"
                      value={memberId}
                      disabled
                    />
                  </div>
                  <div className="col-md-4 cmb-22">
                    <Label label="Award Category" />
                  </div>
                  <div className="col-md-8 cmb-22">
                    <TextInput
                      id="awardType"
                      placeholder="Award Type"
                      value={awardType}
                      disabled
                    />
                  </div>
                  <div className="col-md-4 cmb-22">
                    <Label label="Status" />
                  </div>
                  <div className="col-md-8">
                    <Dropdown
                      id="status"
                      placeholder="Status"
                      value={values.status}
                      onChange={handleChange}
                      options={[
                        {
                          id: "0",
                          label: "Pending",
                        },
                        {
                          id: "1",
                          label: "Accepted",
                        },
                        {
                          id: "2",
                          label: "Rejected",
                        },
                      ]}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-4 cmt-30">
                  <Button
                    text="Cancel"
                    isRounded
                    btnStyle="light-outline"
                    className="cps-40 cpe-40"
                    onClick={onHide}
                  />
                  <Button
                    isRounded
                    text="Submit"
                    btnStyle="primary-dark"
                    className="cps-40 cpe-40"
                    onClick={handleSubmit}
                    btnLoading={btnLoading}
                    disabled={isEqual(initialValues, values)}
                  />
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};
export default NominationDetailsForm;
