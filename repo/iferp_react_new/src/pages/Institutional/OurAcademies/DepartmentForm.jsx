import { useDispatch } from "react-redux";
import { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { isEqual } from "lodash";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import CourseDropdown from "components/form/CourseDropdown";
import Label from "components/form/Label";
import Modal from "components/Layout/Modal";
import { addDepartments } from "store/slices";
import { objectToFormData, trimLeftSpace } from "utils/helpers";

const DepartmentForm = ({ editData, onHide, handelSuccess }) => {
  const dispatch = useDispatch();
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    const response = await dispatch(addDepartments(objectToFormData(values)));
    if (response?.status === 200) {
      handelSuccess(response?.data);
    }
    setBtnLoading(false);
  };
  const validationSchema = Yup.object().shape({
    course_id: Yup.string().required("Course is required."),
    name: Yup.string().required("Department name is required."),
    department_id: Yup.string().required("Department id is required."),
    hod_name: Yup.string().required("HOD name is required."),
  });
  const initialValues = {
    course_id: editData?.course_id || "",
    name: editData?.name || "",
    department_id: editData?.department_id || "",
    hod_name: editData?.hod_name || "",
  };
  return (
    <Modal
      onHide={onHide}
      title={editData ? "Edit Department" : "Add Department"}
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
              <div className="row d-flex justify-conent-between align-items-center ps-3 pe-3 pb-3 cmt-40">
                <div className="col-md-3 cmb-22">
                  <Label label="Course" required />
                </div>
                <div className="col-md-9 cmb-22">
                  <CourseDropdown
                    id="course_id"
                    courseType="ug"
                    value={values.course_id}
                    error={errors.course_id}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3 cmb-22">
                  <Label label="Department Name" required />
                </div>
                <div className="col-md-9 cmb-22">
                  <TextInput
                    placeholder="Enter Department"
                    id="name"
                    onChange={handleChange}
                    value={values.name}
                    error={errors.name}
                  />
                </div>
                <div className="col-md-3 cmb-22">
                  <Label label="Department ID" required />
                </div>
                <div className="col-md-9 cmb-22">
                  <TextInput
                    placeholder="Enter Department ID"
                    id="department_id"
                    onChange={(e) => {
                      handleChange({
                        target: {
                          id: "department_id",
                          value: trimLeftSpace(e.target.value),
                        },
                      });
                    }}
                    value={values.department_id}
                    error={errors.department_id}
                  />
                </div>

                <div className="col-md-3 cmb-22">
                  <Label label="HOD Name" />
                </div>
                <div className="col-md-9 cmb-22">
                  <TextInput
                    placeholder="Enter HOD Name"
                    id="hod_name"
                    onChange={handleChange}
                    value={values.hod_name}
                    error={errors.hod_name}
                  />
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
export default DepartmentForm;
