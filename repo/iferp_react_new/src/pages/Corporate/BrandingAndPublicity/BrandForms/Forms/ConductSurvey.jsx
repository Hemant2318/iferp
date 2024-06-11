import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import { omit } from "lodash";
import Button from "components/form/Button";
import TextArea from "components/form/TextArea";
import Dropdown from "components/form/Dropdown";
import InfoField from "./InfoFiled";

const impressionRate = [
  {
    id: "Very Positive",
  },
  {
    id: "Positive",
  },
  {
    id: "Fair",
  },
  {
    id: "Negative",
  },
  {
    id: "Very Negative",
  },
];
const qualityRate = [
  {
    id: "Strongly High Quality",
  },
  {
    id: "High Quality",
  },
  {
    id: "Medium Quality",
  },
  {
    id: "Low Quality",
  },
  {
    id: "Very Low Quality",
  },
];
const innovativeRate = [
  {
    id: "Extra Innovative",
  },
  {
    id: "Very Innovative",
  },
  {
    id: "Fairly Innovative",
  },
  {
    id: "Not Innovative",
  },
  {
    id: "Not at all Innovative",
  },
];
const moneyRate = [
  {
    id: "Excellent",
  },
  {
    id: "Above Average",
  },
  {
    id: "Average",
  },
  {
    id: "Below Average",
  },
  {
    id: "Poor",
  },
];
const recommendRate = [
  {
    id: "Excellent Likely",
  },
  {
    id: "Very Likely",
  },
  {
    id: "Fairly Likely",
  },
  {
    id: "Not Likely",
  },
  {
    id: "Not at all Likely",
  },
];

const ConductSurvey = ({ handelSaveBrand, btnLoading, reset, setReset }) => {
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
    first_impression_to_product: Yup.string().required(
      "Select first impression of product."
    ),
    rate_quality_of_product: Yup.string().required(
      "Select quality of product."
    ),
    innovative_is_your_product: Yup.string().required(
      "Select innovative of product."
    ),
    money_value_of_product: Yup.string().required(
      "Select money value of product."
    ),
    recommend_of_our_product: Yup.string().required(
      "Select recommend of product."
    ),
    things_like_about_our_product: Yup.string()
      .required("Like about product required.")
      .max(100, "Maximum 100 character allow for this field."),
    improvement_of_our_product: Yup.string()
      .required("Improvement of product required.")
      .max(100, "Maximum 100 character allow for this field."),
    satisfied_with_product: Yup.string()
      .required("Satisfied with product required.")
      .max(100, "Maximum 100 character allow for this field."),
  });
  const initialValues = {
    first_impression_to_product: "",
    rate_quality_of_product: "",
    innovative_is_your_product: "",
    money_value_of_product: "",
    recommend_of_our_product: "",
    things_like_about_our_product: "",
    improvement_of_our_product: "",
    satisfied_with_product: "",
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
            <div className="col-md-6 cmb-22 text-16-500 d-flex align-items-center">
              What is your first impression to the product?*
            </div>
            <div className="col-md-6 cmb-22">
              <Dropdown
                id="first_impression_to_product"
                placeholder="Select"
                onChange={handleChange}
                value={values.first_impression_to_product}
                error={errors.first_impression_to_product}
                options={impressionRate}
                optionValue="id"
              />
            </div>
            <div className="col-md-6 cmb-22 text-16-500 d-flex align-items-center">
              How would you like to rate the quality of the product?*
            </div>
            <div className="col-md-6 cmb-22">
              <Dropdown
                id="rate_quality_of_product"
                placeholder="Select"
                onChange={handleChange}
                value={values.rate_quality_of_product}
                error={errors.rate_quality_of_product}
                options={qualityRate}
                optionValue="id"
              />
            </div>
            <div className="col-md-6 cmb-22 text-16-500 d-flex align-items-center">
              How innovative is your product?*
            </div>
            <div className="col-md-6 cmb-22">
              <Dropdown
                id="innovative_is_your_product"
                placeholder="Select"
                onChange={handleChange}
                value={values.innovative_is_your_product}
                error={errors.innovative_is_your_product}
                options={innovativeRate}
                optionValue="id"
              />
            </div>
            <div className="col-md-6 cmb-22 text-16-500 d-flex align-items-center">
              How would you rate the money value of the product?*
            </div>
            <div className="col-md-6 cmb-22">
              <Dropdown
                id="money_value_of_product"
                placeholder="Select"
                onChange={handleChange}
                value={values.money_value_of_product}
                error={errors.money_value_of_product}
                options={moneyRate}
                optionValue="id"
              />
            </div>
            <div className="col-md-6 cmb-22 text-16-500 d-flex align-items-center">
              How would you like to recommend our product?*
            </div>
            <div className="col-md-6 cmb-22">
              <Dropdown
                id="recommend_of_our_product"
                placeholder="Select"
                onChange={handleChange}
                value={values.recommend_of_our_product}
                error={errors.recommend_of_our_product}
                options={recommendRate}
                optionValue="id"
              />
            </div>

            <div className="cmb-16 text-16-500">
              What are the things you like about our product?
            </div>
            <TextArea
              placeholder="Enter your likes about our prodct"
              id="things_like_about_our_product"
              onChange={handleChange}
              value={values.things_like_about_our_product}
              error={errors.things_like_about_our_product}
              rows={3}
            />
            <div className="cmb-16 text-16-500 cmt-22">
              What would you like to say about the improvement of our product?*
            </div>
            <TextArea
              placeholder="Enter improvements if any"
              id="improvement_of_our_product"
              onChange={handleChange}
              value={values.improvement_of_our_product}
              error={errors.improvement_of_our_product}
              rows={3}
            />
            <div className="cmb-16 text-16-500 cmt-22">
              Overall how satisfied are you with this product?*
            </div>
            <TextArea
              placeholder="Enter your comments"
              id="satisfied_with_product"
              onChange={handleChange}
              value={values.satisfied_with_product}
              error={errors.satisfied_with_product}
              rows={3}
            />

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
export default ConductSurvey;
