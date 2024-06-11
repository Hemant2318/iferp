import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import Card from "components/Layout/Card";
import Button from "components/form/Button";
import CheckBox from "components/form/CheckBox";
import Location from "components/form/Location";
import TextInput from "components/form/TextInput";
import { icons } from "utils/constants";
import { addEventSponsorship, fetchUserEventDetails } from "store/slices";
import {
  convertString,
  getDataFromLocalStorage,
  getEventDate,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const Sponsorship = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { eventData } = useSelector((state) => ({
    eventData: state.global.eventData,
  }));
  const [btnLoading, setBtnLoading] = useState(false);
  const fetchEventDetails = async () => {
    await dispatch(
      fetchUserEventDetails({
        event_id: params?.eventId,
        user_id: getDataFromLocalStorage("id"),
      })
    );
  };

  useEffect(() => {
    fetchEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handelSave = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      ...values,
      event_id: params?.eventId,
      user_id: getDataFromLocalStorage("id"),
    });
    const response = await dispatch(addEventSponsorship(forData));
    if (response?.status === 200) {
      navigate(-1);
    }
    setBtnLoading(false);
  };

  const validationSchema = Yup.object().shape({
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
    address1: Yup.string().required("Address 1 is required."),
    address2: Yup.string().required("Address 2 is required."),
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
    name_of_head: "",
    designation_of_head: "",
    name_of_contact_person: "",
    designation_of_contact_person: "",
    email_id: "",
    contact_number: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    pan_number: "",
    tan_number: "",
    gst_number: "",
    industry_experience: "",
    is_agree: "0",
  };
  const { company_name } = getDataFromLocalStorage("company_details") || {};
  const { event_name, start_date, end_date, city_name, country_name } =
    eventData;
  return (
    <Card className="cps-40 cpe-40 cpt-40 cpb-40">
      <div className="d-flex center-flex position-relative">
        <span
          className="d-flex position-absolute start-0"
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <div className="text-26-500 color-black-olive">Sponsorship</div>
      </div>
      <div className="text-15-400 color-black-olive text-center mt-3">
        Sponsor for the conference and get brand identity by reaching to the
        very large demographic
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handelSave}
      >
        {(props) => {
          const {
            values,
            errors,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
          } = props;
          return (
            <form className="row cmt-40">
              <div className="cmb-22">
                <TextInput value={event_name} disabled />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  value={getEventDate(start_date, end_date)}
                  disabled
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  value={`${city_name ? `${city_name},` : ""} ${country_name}`}
                  disabled
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
                  onChange={(e) => {
                    const id = e.target.id;
                    const value = e.target.value;
                    setFieldValue(id, titleCaseString(value));
                  }}
                  value={values.name_of_head}
                  error={errors.name_of_head}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Designation of the Head"
                  id="designation_of_head"
                  onChange={(e) => {
                    const id = e.target.id;
                    const value = e.target.value;
                    setFieldValue(id, titleCaseString(value));
                  }}
                  value={values.designation_of_head}
                  error={errors.designation_of_head}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Name of the Contact Person"
                  id="name_of_contact_person"
                  onChange={(e) => {
                    const id = e.target.id;
                    const value = e.target.value;
                    setFieldValue(id, titleCaseString(value));
                  }}
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
                  id="address1"
                  onChange={handleChange}
                  value={values.address1}
                  error={errors.address1}
                />
              </div>
              <div className="cmb-22">
                <TextInput
                  placeholder="Address Line 2"
                  id="address2"
                  onChange={handleChange}
                  value={values.address2}
                  error={errors.address2}
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
                      setFieldValue(
                        "is_agree",
                        values.is_agree === "0" ? "1" : "0"
                      );
                    }}
                    isChecked={values.is_agree === "1"}
                  />
                </div>
                <div className="text-14-400 color-raisin-black ms-3">
                  I have carefully read and understood the{" "}
                  <u className="color-new-car">General Exhibitor Rules</u> pdf
                  and I agree to abide by them without any reservations
                  whatsoever. I further understand that this Application form is
                  valid only if accompanied by payment, as per the specified
                  payment schedule in the General Exhibitor Rules and as
                  detailed under
                </div>
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
    </Card>
  );
};
export default Sponsorship;
