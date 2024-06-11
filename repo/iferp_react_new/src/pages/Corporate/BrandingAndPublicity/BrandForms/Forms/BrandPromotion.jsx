import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import { omit } from "lodash";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import TextArea from "components/form/TextArea";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import InfoField from "./InfoFiled";
import { convertString } from "utils/helpers";

const BrandPromotion = ({ handelSaveBrand, btnLoading, reset, setReset }) => {
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
    handelSaveBrand(omit(values, ["recentPresentationFileName"]));
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required."),
    email_id: Yup.string()
      .required("Email is Required.")
      .email("Email must be a valid email"),
    contact_number: Yup.string()
      .required("Number is Required.")
      .matches(/^[0-9\s]+$/, "Valid number only.")
      .matches(/^\S*$/, "Whitespace is not allowed.")
      .min(10, "Number must be 10 digit.")
      .max(10, "Number must be 10 digit."),
    about_the_product: Yup.string()
      .required("Product details is Required.")
      .max(100, "Maximum 100 character allow for this field."),
    objectives_the_product: Yup.string()
      .required("Product objectives is Required.")
      .max(100, "Maximum 100 character allow for this field."),
  });
  const initialValues = {
    name: "",
    email_id: "",
    contact_number: "",
    designation: "",
    about_the_product: "",
    objectives_the_product: "",
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handelSave}
    >
      {(props) => {
        const { values, errors, handleSubmit, resetForm, handleChange } = props;
        return (
          <form className="row cmt-40">
            <InfoField />
            <div className="cmb-16 text-16-500">Contact Person Details</div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Name of the Contact Person*"
                id="name"
                onChange={handleChange}
                value={values.name}
                error={errors.name}
              />
            </div>
            <div className="col-md-6 cmb-22">
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
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Contact Number*"
                id="contact_number"
                onChange={handleChange}
                value={values.contact_number}
                error={errors.contact_number}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Designation"
                id="designation"
                onChange={handleChange}
                value={values.designation}
                error={errors.designation}
              />
            </div>
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-6">
                  <div className="cmb-16 text-16-500">About the Product*</div>
                  <TextArea
                    placeholder="Enter product details"
                    id="about_the_product"
                    onChange={handleChange}
                    value={values.about_the_product}
                    error={errors.about_the_product}
                    rows={3}
                  />
                  <div className="cmb-16 text-16-500 cmt-22">
                    Objectives Of The Product*
                  </div>
                  <TextArea
                    placeholder="Enter the objectives"
                    id="objectives_the_product"
                    onChange={handleChange}
                    value={values.objectives_the_product}
                    error={errors.objectives_the_product}
                    rows={3}
                  />
                </div>
                <div className="col-md-6">
                  <div className="cmb-16 text-16-500 text-center">
                    Promotion in IFERP Newsletter
                  </div>
                  <Card className="d-flex pb-2">
                    <img
                      src={icons.iferpNewslatter}
                      alt="page"
                      className="fill fit-image"
                    />
                  </Card>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center gap-4 mt-5">
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
                disabled={isEqual(values, initialValues)}
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};
export default BrandPromotion;
