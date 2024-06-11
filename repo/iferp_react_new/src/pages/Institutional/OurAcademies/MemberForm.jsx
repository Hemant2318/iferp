import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { omit } from "lodash";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import CourseDropdown from "components/form/CourseDropdown";
import Modal from "components/Layout/Modal";
import { addInstitutionalMembers } from "store/slices";
import {
  numberOnlyFromInput,
  objectToFormData,
  titleCaseString,
  getYearList,
  convertString,
} from "utils/helpers";

const MemberForm = ({ editData, onHide, type, handelSuccess }) => {
  const dispatch = useDispatch();
  const { departmentList } = useSelector((state) => ({
    departmentList: state.global.departmentList,
  }));
  const {
    id = "",
    first_name = "",
    last_name = "",
    email_id = "",
    phone_number = "",
    department_id = "",
    course_id = "",
    year_of_study = "",
    designation = "",
  } = editData || {};
  const memberType = type.replace("-members", "");
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    let formData = omit(
      values,
      values.type === "student" ? ["designation", "year_of_study"] : []
    );
    if (id) {
      formData = { ...formData, id: id };
    }
    const response = await dispatch(
      addInstitutionalMembers(objectToFormData(formData))
    );
    if (response?.status === 200) {
      handelSuccess();
    }
    setBtnLoading(false);
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required."),
    last_name: Yup.string().required("Last name is required."),
    department_id: Yup.string().required("Department name is required."),
    course_id: Yup.string().required("Course is required."),
    email_id: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required."),
    phone_number: Yup.string()
      .required("Phone number is required.")
      .min(10, "Phone number must be 10 digit.")
      .max(10, "Phone number must be 10 digit."),
  });
  const initialValues = {
    type: memberType,
    first_name: first_name,
    last_name: last_name,
    course_id: course_id,
    department_id: department_id,
    email_id: email_id,
    phone_number: phone_number,
    designation: designation,
    year_of_study: year_of_study,
  };

  return (
    <Modal
      onHide={onHide}
      title={`${editData ? "Edit" : "Add"} ${titleCaseString(memberType)}`}
      size="md"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handelSave}
        validationSchema={validationSchema}
      >
        {(props) => {
          const { values, errors, handleChange, handleSubmit } = props;
          return (
            <form>
              <div className="row d-flex justify-conent-between align-items-center ps-4 pe-4 pb-3 cmt-40">
                <div className="cmb-22">
                  <TextInput
                    placeholder="First Name*"
                    id="first_name"
                    onChange={handleChange}
                    value={values.first_name}
                    error={errors.first_name}
                  />
                </div>
                <div className="cmb-22">
                  <TextInput
                    placeholder="Last Name*"
                    id="last_name"
                    onChange={handleChange}
                    value={values.last_name}
                    error={errors.last_name}
                  />
                </div>
                <div className="cmb-22">
                  <CourseDropdown
                    id="course_id"
                    onChange={handleChange}
                    value={values.course_id}
                    error={errors.course_id}
                  />
                </div>
                <div className="cmb-22">
                  <Dropdown
                    id="department_id"
                    optionValue="name"
                    onChange={handleChange}
                    options={departmentList}
                    placeholder="Department*"
                    value={values.department_id}
                    error={errors.department_id}
                  />
                </div>

                <div className="cmb-22">
                  <TextInput
                    placeholder="Email ID*"
                    id="email_id"
                    onChange={(e) => {
                      handleChange(convertString(1, e));
                    }}
                    value={values.email_id}
                    error={errors.email_id}
                  />
                </div>
                <div className="cmb-22">
                  <TextInput
                    id="phone_number"
                    placeholder="Phone Number*"
                    value={values.phone_number}
                    onChange={(e) => {
                      handleChange(numberOnlyFromInput(e));
                    }}
                    error={errors.phone_number}
                  />
                </div>

                {values.type === "faculty" && (
                  <div className="cmb-22">
                    <TextInput
                      placeholder="Designation"
                      id="designation"
                      onChange={handleChange}
                      value={values.designation}
                      error={errors.designation}
                    />
                  </div>
                )}
                {values.type === "faculty" && (
                  <div className="cmb-22">
                    <Dropdown
                      options={getYearList(30)}
                      optionValue="id"
                      placeholder="Year Of Study"
                      id="year_of_study"
                      onChange={handleChange}
                      value={values.year_of_study}
                      error={errors.year_of_study}
                    />
                  </div>
                )}
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
    </Modal>
  );
};
export default MemberForm;
