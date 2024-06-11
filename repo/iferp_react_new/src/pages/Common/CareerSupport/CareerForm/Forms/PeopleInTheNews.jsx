import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import DatePicker from "components/form/DatePicker";
import InfoField from "./InfoFiled";

const PeopleInTheNews = ({ handelSaveCareer, btnLoading, reset, setReset }) => {
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
    article_title: Yup.string().required("Article title is required."),
    short_description: Yup.string().required("Short description is required."),
    article_website_link: Yup.string().required(
      "Article website link is required."
    ),
    published_date: Yup.string().required("Published date is required."),
  });
  const initialValues = {
    article_title: "",
    short_description: "",
    article_website_link: "",
    published_date: "",
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
            <InfoField isInstitution />

            <div className="cmb-22">
              <TextInput
                placeholder="Article Title*"
                id="article_title"
                onChange={handleChange}
                value={values.article_title}
                error={errors.article_title}
              />
            </div>
            <div className="cmb-22">
              <TextInput
                placeholder="Short Description*"
                id="short_description"
                onChange={handleChange}
                value={values.short_description}
                error={errors.short_description}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <TextInput
                placeholder="Full Article Website Link*"
                id="article_website_link"
                onChange={handleChange}
                value={values.article_website_link}
                error={errors.article_website_link}
              />
            </div>
            <div className="col-md-6 cmb-22">
              <DatePicker
                placeholder="Published Date*"
                id="published_date"
                onChange={handleChange}
                value={values.published_date}
                error={errors.published_date}
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
  );
};
export default PeopleInTheNews;
