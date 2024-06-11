import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Label from "components/form/Label";
import Dropdown from "components/form/Dropdown";
import Modal from "components/Layout/Modal";
import { editMembers } from "store/slices";
import { convertString, objectToFormData } from "utils/helpers";

const AddMember = ({ onHide, handelSuccess, editData }) => {
  const dispatch = useDispatch();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [btnLoading, setBtnLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required."),
    last_name: Yup.string().required("Last name is required."),
    membership_plan_id: Yup.string().required("Member type is required."),
    email_id: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required."),
    phone: Yup.string()
      .required("Phone number is required.")
      .min(10, "Phone number must be 10 digit.")
      .max(10, "Phone number must be 10 digit."),
  });
  const handelSave = (values) => {
    setBtnLoading(true);

    if (isEqual(initialValues, values)) {
      onHide();
    } else {
      handelEditData({ ...values, user_id: editData.userId });
    }
  };

  const handelEditData = async (values) => {
    let forData = objectToFormData(values);
    const response = await dispatch(editMembers(forData));
    if (response?.status === 200) {
      handelSuccess(true);
    } else {
      setBtnLoading(false);
    }
  };

  const getMemberId = (name) => {
    let returnValue = "";
    const findObj = membershipList.find((o) => o.name === name);
    if (findObj) {
      returnValue = findObj.id;
    }
    return returnValue;
  };

  const initialValues = {
    first_name: editData?.firstName || "",
    last_name: editData?.lastName || "",
    membership_plan_id: getMemberId(editData?.memberType) || "",
    email_id: editData?.emailId || "",
    phone: editData?.phone || "",
  };
  return (
    <Modal onHide={onHide} title={editData ? "Edit Member" : "Add Member"}>
      <div className="cmt-34 cms-34 cme-34 cmb-34">
        <Formik
          initialValues={initialValues}
          onSubmit={handelSave}
          validationSchema={validationSchema}
        >
          {(props) => {
            const { values, errors, handleChange, handleSubmit } = props;

            return (
              <form>
                <div className="row d-flex justify-conent-between align-items-center cmb-26">
                  <div className="col-md-3">
                    <Label label="First Name" />
                  </div>
                  <div className="col-md-9">
                    <TextInput
                      placeholder="Enter First Name"
                      id="first_name"
                      onChange={handleChange}
                      value={values.first_name}
                      error={errors.first_name}
                    />
                  </div>
                </div>
                <div className="row d-flex justify-conent-between align-items-center cmb-26">
                  <div className="col-md-3">
                    <Label label="Last Name" />
                  </div>
                  <div className="col-md-9">
                    <TextInput
                      placeholder="Enter Last Name"
                      id="last_name"
                      onChange={handleChange}
                      value={values.last_name}
                      error={errors.last_name}
                    />
                  </div>
                </div>
                <div className="row d-flex justify-conent-between align-items-center cmb-26">
                  <div className="col-md-3">
                    <Label label="Member Type" />
                  </div>
                  <div className="col-md-9">
                    <Dropdown
                      id="membership_plan_id"
                      placeholder="Select Member Type"
                      options={membershipList}
                      value={values.membership_plan_id}
                      error={errors.membership_plan_id}
                      optionKey="id"
                      optionValue="name"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row d-flex justify-conent-between align-items-center cmb-26">
                  <div className="col-md-3">
                    <Label label="Email ID" />
                  </div>
                  <div className="col-md-9">
                    <TextInput
                      placeholder="Enter Email ID"
                      id="email_id"
                      onChange={(e) => {
                        handleChange(convertString(1, e));
                      }}
                      value={values.email_id}
                      error={errors.email_id}
                    />
                  </div>
                </div>
                <div className="row d-flex justify-conent-between align-items-center cmb-34">
                  <div className="col-md-3">
                    <Label label="Phone Number" />
                  </div>
                  <div className="col-md-9">
                    <TextInput
                      type="number"
                      placeholder="Enter Phone Number"
                      id="phone"
                      onChange={handleChange}
                      value={values.phone}
                      error={errors.phone}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center gap-4">
                  <Button
                    isRounded
                    text="Cancel"
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
                    type="submit"
                    btnLoading={btnLoading}
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
export default AddMember;
