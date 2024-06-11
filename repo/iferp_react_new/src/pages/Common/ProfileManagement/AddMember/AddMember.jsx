import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import Modal from "components/Layout/Modal";
import { addMembers, editMembers } from "store/slices";
import {
  convertString,
  numberOnlyFromInput,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import "./AddMember.scss";

const AddMember = ({ onHide, handelSuccess, editData }) => {
  const dispatch = useDispatch();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = (values) => {
    setBtnLoading(true);
    if (editData) {
      if (isEqual(initialValues, values)) {
        onHide();
      } else {
        handelEditData({ ...values, user_id: editData.id });
      }
    } else {
      handelAddData(values);
    }
  };
  const handelAddData = async (values) => {
    let forData = objectToFormData(values);
    const response = await dispatch(addMembers(forData));
    if (response?.status === 200) {
      handelSuccess();
    } else {
      setBtnLoading(false);
    }
  };
  const handelEditData = async (values) => {
    let forData = objectToFormData(values);
    const response = await dispatch(editMembers(forData));
    if (response?.status === 200) {
      handelSuccess();
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
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required."),
    last_name: Yup.string().required("Last name is required."),
    membership_plan_id: Yup.string().required("Member type is required."),
    email_id: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required."),
    phone: Yup.string()
      .required("Phone number is required.")
      .min(4, "Phone number must be minimum 4 digit.")
      .max(13, "Phone number must be maximum 13 digit."),
  });
  const initialValues = {
    first_name: editData?.firstName || "",
    last_name: editData?.lastName || "",
    membership_plan_id: getMemberId(editData?.memberType) || "",
    email_id: editData?.email || "",
    country_code: editData?.country_code || "IN",
    phone: editData?.phone || "",
    is_admin_add: 1,
  };
  return (
    <Modal
      onHide={onHide}
      title={editData ? "Edit Member" : "Add Member"}
      size="md"
    >
      <div className="cmt-34 cms-20 cme-20 cmb-34">
        <Formik
          initialValues={initialValues}
          onSubmit={handelSave}
          validationSchema={validationSchema}
        >
          {(props) => {
            const {
              values,
              errors,
              handleChange,
              handleSubmit,
              setFieldValue,
            } = props;
            return (
              <form>
                <div className="row d-flex justify-conent-between align-items-center cmb-26">
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      label="First Name"
                      placeholder="Enter First Name"
                      id="first_name"
                      onChange={(e) => {
                        setFieldValue(
                          "first_name",
                          titleCaseString(e.target.value)
                        );
                      }}
                      value={values.first_name}
                      error={errors.first_name}
                    />
                  </div>
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      label="Last Name"
                      placeholder="Enter Last Name"
                      id="last_name"
                      onChange={(e) => {
                        setFieldValue(
                          "last_name",
                          titleCaseString(e.target.value)
                        );
                      }}
                      value={values.last_name}
                      error={errors.last_name}
                    />
                  </div>
                  <div className="col-md-12 cmb-22">
                    <Dropdown
                      label="Member Type"
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
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      label="Email ID"
                      placeholder="Enter Email ID"
                      id="email_id"
                      onChange={(e) => {
                        handleChange(convertString(1, e));
                      }}
                      value={values.email_id}
                      error={errors.email_id}
                    />
                  </div>
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      isPhoneNumber
                      label="Phone Number"
                      id="phone"
                      type="number"
                      placeholder="Enter Phone Number"
                      value={values.phone}
                      error={errors.phone}
                      phoneNumberData={{
                        id: "country_code",
                        value: values.country_code,
                      }}
                      onChange={(e) => {
                        if (e.target.id === "phone") {
                          handleChange(numberOnlyFromInput(e));
                        } else {
                          handleChange(e);
                          handleChange({
                            target: { id: "phone", value: "" },
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-12 d-flex justify-content-center gap-4">
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
                      onClick={handleSubmit}
                      btnLoading={btnLoading}
                      disabled={isEqual(values, initialValues)}
                    />
                  </div>
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
