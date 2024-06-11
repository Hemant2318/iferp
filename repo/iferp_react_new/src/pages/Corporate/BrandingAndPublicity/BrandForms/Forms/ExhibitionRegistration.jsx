import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import CheckBox from "components/form/CheckBox";
import Location from "components/form/Location";
import DatePicker from "components/form/DatePicker";
import { convertString, getDataFromLocalStorage } from "utils/helpers";
import InfoField from "./InfoFiled";

const ExhibitionRegistration = ({
  handelSaveBrand,
  btnLoading,
  reset,
  setReset,
}) => {
  const formRef = useRef();
  useEffect(() => {
    if (reset) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
    }
    setReset(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  const handelSave = (values) => {
    handelSaveBrand(values);
  };

  const validationSchema = Yup.object().shape({
    event_name: Yup.string().required("Event name is required."),
    event_date: Yup.string().required("Date is required."),
    event_venue: Yup.string().required("Venue is required."),
    name_of_head: Yup.string().required("Name of head is required."),
    designation_of_head: Yup.string().required(
      "Designation of head is required."
    ),
    name_of_contact_person: Yup.string().required(
      "Name of contact person is required."
    ),
    designation_of_contact_person: Yup.string().required(
      "Designation of contact person is required."
    ),
    address_first: Yup.string().required("Address 1 is required."),
    address_second: Yup.string().required("Address 2 is required."),
    country: Yup.string().required("Country is required."),
    state: Yup.string().required("State/Province is required."),
    pan_number: Yup.string().required("PAN number is required."),
    tan_number: Yup.string().required("TAN number is required."),
    gst_number: Yup.string().required("GST number is required."),
    industry_experience: Yup.string().required(
      "Industry experience is required."
    ),
    email_id: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required."),
    contact_number: Yup.string()
      .required("Contact number is required.")
      .min(10, "Phone number must be 10 digit.")
      .max(10, "Phone number must be 10 digit."),
  });
  const initialValues = {
    event_name: "",
    event_date: "",
    event_venue: "",
    event_website_link: "",
    name_of_head: "",
    designation_of_head: "",
    name_of_contact_person: "",
    designation_of_contact_person: "",
    email_id: "",
    contact_number: "",
    address_first: "",
    address_second: "",
    country: "",
    state: "",
    pan_number: "",
    tan_number: "",
    gst_number: "",
    industry_experience: "",
    status: "0",
  };
  const { company_name } = getDataFromLocalStorage("company_details") || {};
  return (
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
          setFieldValue,
          resetForm,
          handleChange,
        } = props;
        return (
          <form className="row cmt-40">
            <InfoField />
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Name of the event*"
                id="event_name"
                onChange={handleChange}
                value={values.event_name}
                error={errors.event_name}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Venue*"
                id="event_venue"
                onChange={handleChange}
                value={values.event_venue}
                error={errors.event_venue}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <DatePicker
                placeholder="Date*"
                id="event_date"
                onChange={handleChange}
                value={values.event_date}
                error={errors.event_date}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Website Link"
                id="event_website_link"
                onChange={handleChange}
                value={values.event_website_link}
                error={errors.event_website_link}
              />
            </div>
            <div className="text-20-400 color-black-olive cmb-22">
              Head of the Organization Details (CEO/MD/CMD/Director etc)
            </div>
            <div className="cmb-22">
              <TextInput value={company_name} disabled />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Name of the Head"
                id="name_of_head"
                onChange={handleChange}
                value={values.name_of_head}
                error={errors.name_of_head}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Designation of the Head"
                id="designation_of_head"
                onChange={handleChange}
                value={values.designation_of_head}
                error={errors.designation_of_head}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Name of the Contact Person"
                id="name_of_contact_person"
                onChange={handleChange}
                value={values.name_of_contact_person}
                error={errors.name_of_contact_person}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Designation of the Contact Person"
                id="designation_of_contact_person"
                onChange={handleChange}
                value={values.designation_of_contact_person}
                error={errors.designation_of_contact_person}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Email ID"
                id="email_id"
                onChange={(e) => {
                  handleChange(convertString(1, e));
                }}
                value={values.email_id}
                error={errors.email_id}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Contact Number"
                id="contact_number"
                onChange={handleChange}
                value={values.contact_number}
                error={errors.contact_number}
              />
            </div>
            <div className="cmb-22">
              <TextInput
                placeholder="Address Line 1"
                id="address_first"
                onChange={handleChange}
                value={values.address_first}
                error={errors.address_first}
              />
            </div>
            <div className="cmb-22">
              <TextInput
                placeholder="Address Line 2"
                id="address_second"
                onChange={handleChange}
                value={values.address_second}
                error={errors.address_second}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <Location
                type="country"
                data={{
                  id: "country",
                  placeholder: "Country*",
                  value: values.country,
                  error: errors.country,
                  onChange: handleChange,
                }}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <Location
                type="state"
                data={{
                  id: "state",
                  placeholder: "State/Province*",
                  value: values.state,
                  error: errors.state,
                  countryId: values.country,
                  disabled: !values.country,
                  onChange: handleChange,
                }}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="PAN Number"
                id="pan_number"
                value={values.pan_number}
                error={errors.pan_number}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="TAN Number"
                id="tan_number"
                value={values.tan_number}
                error={errors.tan_number}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="GST Number"
                id="gst_number"
                value={values.gst_number}
                error={errors.gst_number}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Industry Experience"
                id="industry_experience"
                value={values.industry_experience}
                error={errors.industry_experience}
                onChange={handleChange}
              />
            </div>

            <div className="cmb-22 d-flex">
              <div className="mt-2">
                <CheckBox
                  type="ACTIVE"
                  onClick={() => {
                    setFieldValue("status", values.status === "0" ? "1" : "0");
                  }}
                  isChecked={values.status === "1"}
                />
              </div>
              <div className="text-14-400 color-raisin-black ms-3">
                I have carefully read and understood the{" "}
                <u className="color-new-car">General Exhibitor Rules</u> pdf and
                I agree to abide by them without any reservations whatsoever. I
                further understand that this Application form is valid only if
                accompanied by payment, as per the specified payment schedule in
                the General Exhibitor Rules and as detailed under
              </div>
            </div>
            <div className="d-flex justify-content-center gap-4 mt-3">
              <Button
                isRounded
                text="Cancel"
                btnStyle="light-outline"
                className="cps-40 cpe-40"
                onClick={resetForm}
              />
              <Button
                isRounded
                text="Submit"
                btnStyle="primary-dark"
                className="cps-40 cpe-40"
                onClick={handleSubmit}
                btnLoading={btnLoading}
                disabled={
                  isEqual(values, initialValues) || values.status === "0"
                }
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default ExhibitionRegistration;
