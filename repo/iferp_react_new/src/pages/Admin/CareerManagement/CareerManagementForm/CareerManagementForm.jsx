import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { omit, isEqual } from "lodash";
import Button from "components/form/Button";
import TextEditor from "components/form/TextEditor";
import MultipleSelect from "components/form/MultipleSelect";
import TextInput from "components/form/TextInput";
import TextArea from "components/form/TextArea";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import { addCareer, editCareer } from "store/slices";
import {
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import { getCareerDetails } from "store/slices";

const CareerManagementForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = params.careerId === "add-career" ? false : true;
  const [btnLoading, setBtnLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    career_category: "",
    description: "",
    member_category: "",
    guidelines: "",
    benefits: "",
  });
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));

  const validationSchema = Yup.object().shape({
    career_category: Yup.string().required("Career category is required."),
    member_category: Yup.string().required("Member category is required."),
    description: Yup.string()
      .required("Description is required.")
      .max(100, "Maximum 100 character allow for this field."),
    guidelines: Yup.string().max(
      500,
      "Maximum 500 character allow for this field."
    ),
    benefits: Yup.string().max(
      500,
      "Maximum 500 character allow for this field."
    ),
  });

  const handelSave = (values) => {
    setBtnLoading(true);
    if (isEdit) {
      handelEditData(omit(values, ["created_at", "updated_at", "type"]));
    } else {
      handelAddData(values);
    }
  };

  const handelAddData = async (values) => {
    let forData = objectToFormData(values);
    const response = await dispatch(addCareer(forData));
    if (response?.status === 200) {
      navigate(-1);
    }
    setBtnLoading(false);
  };
  const handelEditData = async (values) => {
    let forData = objectToFormData(values);
    const response = await dispatch(editCareer(forData));
    if (response?.status === 200) {
      getDetails();
    }
    setBtnLoading(false);
  };

  const getDetails = async () => {
    const formData = objectToFormData({
      career_id: params.careerId,
    });
    const response = await dispatch(getCareerDetails(formData));
    setInitialValues(response?.data || {});
  };

  useEffect(() => {
    if (["0", "6"].includes(getDataFromLocalStorage("user_type"))) {
      if (isEdit) {
        getDetails();
      }
    } else {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="cps-40 cpe-40 cpt-40 cpb-40">
      <div className="d-flex">
        <span
          className="d-flex"
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <div className="text-18-400 color-black-olive">{`${
          isEdit ? "Edit" : "Add new"
        } career`}</div>
      </div>
      <div id="chapter-form-container" className="cpt-30 cps-20 cpe-20">
        <Formik
          enableReinitialize
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
              <form>
                <div className="cmt-20">
                  <div className="row">
                    <div className="col-md-6 cmb-24">
                      <TextInput
                        placeholder="Enter Career Category*"
                        id="career_category"
                        onChange={(e) => {
                          setFieldValue(
                            "career_category",
                            titleCaseString(e.target.value)
                          );
                        }}
                        value={values.career_category}
                        error={errors.career_category}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      <MultipleSelect
                        placeholder="Select Member Category*"
                        id="member_category"
                        value={values.member_category}
                        error={errors.member_category}
                        options={membershipList}
                        onChange={handleChange}
                        optionValue="name"
                      />
                    </div>
                  </div>
                  <div className="cmb-24">
                    <TextArea
                      placeholder="Enter Career Description*"
                      rows={3}
                      id="description"
                      onChange={(e) => {
                        const id = e.target.id;
                        const value = titleCaseString(e.target.value);
                        setFieldValue(id, value);
                      }}
                      value={values.description}
                      error={errors.description}
                    />
                  </div>
                  <div className="cmb-24">
                    <TextEditor
                      placeholder="Guidelines*"
                      id="guidelines"
                      onChange={handleChange}
                      value={values.guidelines}
                      error={errors.guidelines}
                    />
                  </div>
                  <div className="cmb-24">
                    <TextEditor
                      placeholder="Benefits*"
                      id="benefits"
                      onChange={handleChange}
                      value={values.benefits}
                      error={errors.benefits}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-4 cmt-42 cpb-20">
                  <Button
                    text="Cancel"
                    isRounded
                    btnStyle="light-outline"
                    className="cps-40 cpe-40"
                    onClick={resetForm}
                  />
                  <Button
                    isRounded
                    text="Done"
                    type="submit"
                    btnStyle="primary-dark"
                    className="cps-40 cpe-40"
                    onClick={handleSubmit}
                    btnLoading={btnLoading}
                    disabled={isEqual(initialValues, values)}
                  />
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </Card>
  );
};
export default CareerManagementForm;
