import { useEffect, useRef } from "react";
import * as Yup from "yup";
import moment from "moment";
import { Formik } from "formik";
import { isEqual } from "lodash";
import Button from "components/form/Button";
import TextArea from "components/form/TextArea";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import DatePicker from "components/form/DatePicker";
import FileUpload from "components/form/FileUpload";
import { getFilenameFromUrl } from "utils/helpers";
import InfoField from "./InfoFiled";

const ConductTraining = ({ handelSaveCareer, btnLoading, reset, setReset }) => {
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
    contact_person_name: Yup.string().required("Name is Required."),
    contact_person_email_id: Yup.string()
      .required("Email is Required.")
      .email("Email must be a valid email"),
    contact_person_contact_number: Yup.string()
      .required("Number is Required.")
      .matches(/^[0-9\s]+$/, "Valid number only.")
      .matches(/^\S*$/, "Whitespace is not allowed.")
      .min(10, "Number must be 10 digit.")
      .max(10, "Number must be 10 digit."),
    training_type: Yup.string().required("Training type is Required."),
    location: Yup.string().required("Location is Required."),
    from_date: Yup.string().required("From date is Required."),
    to_date: Yup.string().required("To date is Required."),
    image: Yup.string().required("Image is Required."),
    course_name: Yup.string().required("Course name is Required."),
    comments: Yup.string().max(
      100,
      "Maximum 100 character allow for this field."
    ),
  });
  const initialValues = {
    contact_person_name: "",
    contact_person_email_id: "",
    contact_person_contact_number: "",
    contact_person_designation: "",
    training_type: "",
    location: "",
    from_date: "",
    to_date: "",
    image: "",
    imageName: "",
    course_name: "",
    comments: "",
  };

  return (
    <>
      <div className="text-center text-15-400 color-black-olive cps-20 cpe-20 cmt-26">
        Conduct world class trainings effortlessly to our IFERP members and get
        various
        <br />
        benefits like certification & rewards
      </div>

      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handelSave}
      >
        {(props) => {
          const {
            values,
            errors,
            handleSubmit,
            resetForm,
            handleChange,
            setFieldValue,
          } = props;
          return (
            <form className="row cmt-40">
              <InfoField isInstitution />
              <div className="cmb-16 text-16-500">Contact Person Details</div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Name of the Contact Person*"
                  id="contact_person_name"
                  onChange={handleChange}
                  value={values.contact_person_name}
                  error={errors.contact_person_name}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Email ID*"
                  id="contact_person_email_id"
                  onChange={handleChange}
                  value={values.contact_person_email_id}
                  error={errors.contact_person_email_id}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Contact Number*"
                  id="contact_person_contact_number"
                  onChange={handleChange}
                  value={values.contact_person_contact_number}
                  error={errors.contact_person_contact_number}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Designation"
                  id="contact_person_designation"
                  onChange={handleChange}
                  value={values.contact_person_designation}
                  error={errors.contact_person_designation}
                />
              </div>
              <div className="cmb-16 text-16-500">Training Requirements</div>
              <div className="col-md-6 cmb-22">
                <Dropdown
                  placeholder="Select type of training*"
                  id="training_type"
                  onChange={handleChange}
                  value={values.training_type}
                  error={errors.training_type}
                  rows={3}
                  optionValue="id"
                  options={[
                    {
                      id: "Internship",
                    },
                    {
                      id: "Industrial Training",
                    },
                    {
                      id: "Courses",
                    },
                  ]}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Location*"
                  id="location"
                  onChange={handleChange}
                  value={values.location}
                  error={errors.location}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <DatePicker
                  id="from_date"
                  placeholder="From Date*"
                  minDate={moment().format("YYYY-MM-DD")}
                  onChange={handleChange}
                  value={values.from_date}
                  error={errors.from_date}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <DatePicker
                  id="to_date"
                  placeholder="To Date*"
                  minDate={values.from_date}
                  onChange={handleChange}
                  value={values.to_date}
                  error={errors.to_date}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <FileUpload
                  id="image"
                  onChange={(e) => {
                    const fileName = e.target.fileName;
                    setFieldValue("imageName", fileName);
                    handleChange(e);
                  }}
                  fileText={getFilenameFromUrl(values?.imageName || "")}
                  error={errors?.image}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Name of the Course*"
                  id="course_name"
                  onChange={handleChange}
                  value={values.course_name}
                  error={errors.course_name}
                />
              </div>
              <div className="cmb-22">
                <TextArea
                  placeholder="Comments if any"
                  id="comments"
                  onChange={handleChange}
                  value={values.comments}
                  error={errors.comments}
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
export default ConductTraining;
