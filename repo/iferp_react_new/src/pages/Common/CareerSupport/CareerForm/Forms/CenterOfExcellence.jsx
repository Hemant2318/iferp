import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";

const CenterOfExcellence = ({
  handelSaveCareer,
  btnLoading,
  reset,
  setReset,
}) => {
  const formRef = useRef();

  const handelSave = (values) => {
    handelSaveCareer(values);
  };
  useEffect(() => {
    if (reset) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
    }
    setReset(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  const validationSchema = Yup.object().shape({
    no_of_departments: Yup.string()
      .required("No. of departments is Required.")
      .matches(/^[0-9\s]+$/, "Valid number only.")
      .matches(/^\S*$/, "Whitespace is not allowed."),
    no_of_faculties: Yup.string()
      .required("No. of faculties is Required.")
      .matches(/^[0-9\s]+$/, "Valid number only.")
      .matches(/^\S*$/, "Whitespace is not allowed."),
    no_of_ug_students: Yup.string()
      .required("No. of ug students is Required.")
      .matches(/^[0-9\s]+$/, "Valid number only.")
      .matches(/^\S*$/, "Whitespace is not allowed."),
    no_of_pg_students: Yup.string()
      .required("No. of pg students is Required.")
      .matches(/^[0-9\s]+$/, "Valid number only.")
      .matches(/^\S*$/, "Whitespace is not allowed."),
    no_of_doctorate_courses: Yup.string()
      .matches(/^[0-9\s]+$/, "Valid number only.")
      .matches(/^\S*$/, "Whitespace is not allowed."),
    no_of_research_faculties: Yup.string()
      .matches(/^[0-9\s]+$/, "Valid number only.")
      .matches(/^\S*$/, "Whitespace is not allowed."),
  });
  const initialValues = {
    no_of_departments: "",
    no_of_faculties: "",
    no_of_ug_students: "",
    no_of_pg_students: "",
    no_of_doctorate_courses: "",
    no_of_research_faculties: "",
  };

  return (
    <>
      <div className="text-center text-15-400 color-black-olive cps-20 cpe-20 cmt-26">
        Opportunity to enhance your knowledge in a specific area from day one by
        educating yourself with your choice of domain. Students can choose a
        subject expert as a mentor to work under his/her guidance on research
        projects. Having center of excellence will increase chances of selection
        of students in MNC’s and National and International research
        organizations
      </div>

      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handelSave}
      >
        {(props) => {
          const { values, errors, handleSubmit, resetForm, handleChange } =
            props;
          return (
            <form className="row cmt-40">
              <div className="text-16-500 color-raisin-black cmb-16">
                Host Institution/Organization
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Total no. of Departments*"
                  id="no_of_departments"
                  onChange={handleChange}
                  value={values.no_of_departments}
                  error={errors.no_of_departments}
                />
              </div>

              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Number of Faculties*"
                  id="no_of_faculties"
                  onChange={handleChange}
                  value={values.no_of_faculties}
                  error={errors.no_of_faculties}
                />
              </div>

              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Number of UG Students*"
                  id="no_of_ug_students"
                  onChange={handleChange}
                  value={values.no_of_ug_students}
                  error={errors.no_of_ug_students}
                />
              </div>

              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Number of PG Students*"
                  id="no_of_pg_students"
                  onChange={handleChange}
                  value={values.no_of_pg_students}
                  error={errors.no_of_pg_students}
                />
              </div>

              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Number of Doctorate Courses"
                  id="no_of_doctorate_courses"
                  onChange={handleChange}
                  value={values.no_of_doctorate_courses}
                  error={errors.no_of_doctorate_courses}
                />
              </div>

              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Number of Research Faculties"
                  id="no_of_research_faculties"
                  onChange={handleChange}
                  value={values.no_of_research_faculties}
                  error={errors.no_of_research_faculties}
                />
              </div>

              <div className="d-flex justify-content-center gap-4">
                <Button
                  text="Cancel"
                  isRounded
                  btnStyle="light-outline"
                  className="cps-40 cpe-40"
                  onClick={resetForm}
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
            </form>
          );
        }}
      </Formik>
    </>
  );
};
export default CenterOfExcellence;
