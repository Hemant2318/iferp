import React from "react";
import Button from "components/form/Button";
import { useDispatch } from "react-redux";
import Modal from "components/Layout/Modal";
import TextInput from "components/form/TextInput";
import { Card } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import Dropdown from "components/form/Dropdown";
import { objectToFormData } from "utils/helpers";
import { mentorStatusEdit, sessionStatusEdit } from "store/slices";

const EditStatusPopup = ({
  setIsFeedback,
  sessionEditData,
  mentorEditData,
  setMentorDataUpadate,
  setSessionDataUpadate,
}) => {
  const {
    name,
    mentor_id,
    membership_type,
    session_name,
    added_on,
    status,
    id,
    set_on,
  } = sessionEditData || mentorEditData || [];
  const statusDataType = [
    // { id: "0", label: "Pending" },
    { id: "1", label: "Approved" },
    { id: "2", label: "Rejected" },
  ];
  const matchingStatus = statusDataType.find((item) => item?.label === status);
  const generateInitialValues = () => {
    const initialValues = {
      id: id || "",
      name: name || "",
      mentor_id: mentor_id || "",
      membership_type: membership_type || "",
      added_on: added_on || set_on || "",
      session_name: session_name || "",
      status: Number(matchingStatus?.id) || "",
    };
    return initialValues;
  };
  const initialValues = generateInitialValues();
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Mentor Name is required."),
    mentor_id: Yup.string().required("Mentor ID is required."),
    membership_type: Yup.string().required("Mentor Type is required."),
    added_on: Yup.string().required("Mentor Select Date is required."),
    session_name:
      session_name && Yup.string().required("Session Name is required."),
    status: Yup.string().required("Select Status is required."),
  });
  const handleSave = async (values) => {
    const { status, id } = values;
    if (session_name) {
      let formData = objectToFormData({
        session_id: id,
        status: status,
      });
      const response = await dispatch(sessionStatusEdit(formData));
      if (response?.status === 200) {
        setIsFeedback(false);
        setSessionDataUpadate(false);
      }
    } else {
      let formData = objectToFormData({
        mentor_id: mentor_id,
        status: status,
      });
      const response = await dispatch(mentorStatusEdit(formData));
      if (response?.status === 200) {
        setIsFeedback(false);
        setMentorDataUpadate(false);
      }
    }
  };

  return (
    <Modal
      onHide={() => {
        setIsFeedback(false);
      }}
    >
      <div className="d-flex flex-column justify-content-center cps-20 cpe-20">
        <div className="text-center cmt-30 cmb-12">
          <div className="text-24-500 color-3146">Edit Status</div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
          //   innerRef={ref} // for Reset
        >
          {(props) => {
            const { values, handleChange, handleSubmit, errors } = props;
            const {
              name,
              mentor_id,
              status,
              membership_type,
              added_on,
              session_name,
            } = values;
            return (
              <form onSubmit={handleSubmit}>
                <Card className="row cpt-15 border-0 cpb-15 cmb-24">
                  <div className="cmb-14">
                    <TextInput
                      label="Mentor Name"
                      id="name"
                      className="text-input"
                      value={name}
                      disabled={true}
                      placeholder="Enter Mentor Name"
                      onChange={handleChange}
                      error={errors?.name}
                    />
                  </div>
                  <div className="cmb-14">
                    <TextInput
                      label="Mentor ID"
                      id="mentor_id"
                      className="text-input"
                      value={mentor_id}
                      disabled={true}
                      placeholder="Enter Mentor ID"
                      onChange={handleChange}
                      error={errors?.mentor_id}
                    />
                  </div>
                  <div className="cmb-14">
                    <TextInput
                      label="Membership Type"
                      id="membership_type"
                      className="text-input"
                      value={membership_type}
                      disabled={true}
                      placeholder="Enter Mentor Type"
                      onChange={handleChange}
                      error={errors?.membership_type}
                    />
                  </div>
                  {session_name && (
                    <div className="cmb-14">
                      <TextInput
                        label="Session Name"
                        id="session_name"
                        className="text-input"
                        value={session_name}
                        disabled={true}
                        placeholder="Enter Session Name"
                        onChange={handleChange}
                        error={errors?.session_name}
                      />
                    </div>
                  )}
                  <div className="cmb-14">
                    <TextInput
                      label="Sent On"
                      id="added_on"
                      className="text-input"
                      value={added_on}
                      disabled={true}
                      placeholder="Enter Mentor Type"
                      onChange={handleChange}
                      error={errors?.added_on}
                    />
                  </div>
                  <div className="cmb-24">
                    <Dropdown
                      id="status"
                      placeholder="Select Status"
                      options={statusDataType}
                      value={status}
                      optionKey="id"
                      optionValue="label"
                      label="Status"
                      onChange={handleChange}
                      // onChange={(e) => {
                      //   const val = e.target.value;
                      //   // const val = e.target.data?.label;
                      //   setStatusValue(val);
                      // }}
                      error={errors?.status}
                    />
                  </div>
                </Card>
                <div className="d-flex align-items-center justify-content-center cmt-30 cmb-30 gap-4">
                  <Button
                    btnStyle="primary-dark"
                    text="Update"
                    type="submit"
                    className="cps-30 cpe-30"
                  />
                  <Button
                    btnStyle=""
                    text="Cancel"
                    className="cps-30 cpe-30"
                    onClick={() => setIsFeedback(false)}
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

export default EditStatusPopup;
