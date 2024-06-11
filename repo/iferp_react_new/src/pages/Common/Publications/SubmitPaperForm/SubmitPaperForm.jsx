import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import Button from "components/form/Button";
import FileUpload from "components/form/FileUpload";
import TextInput from "components/form/TextInput";
import Card from "components/Layout/Card";
import SuccessPopup from "components/Layout/SuccessPopup";
import { addJournalSubmitPaper, fetchAttendedDetails } from "store/slices";
import { icons } from "utils/constants";
import {
  getDataFromLocalStorage,
  getFilenameFromUrl,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const SubmitPaperForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = getDataFromLocalStorage();
  const {
    first_name,
    last_name,
    email_id,
    phone_number,
    educational_details = {},
    personal_details = {},
  } = userData;
  const { city_name, state_name, country_name } = personal_details;
  const {
    phd_university_name,
    phd_institution_name,
    phd_department_name,
    phd_course_name,
    pg_university_name,
    pg_institution_name,
    pg_department_name,
    pg_course_name,
    ug_university_name,
    ug_institution_name,
    ug_department_name,
    ug_course_name,
  } = educational_details;
  const institution =
    phd_institution_name || pg_institution_name || ug_institution_name;
  const university =
    phd_university_name || pg_university_name || ug_university_name;
  const department =
    phd_department_name || pg_department_name || ug_department_name;
  const course = phd_course_name || pg_course_name || ug_course_name;
  const [isSuccess, setIsSuccess] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    author_name: Yup.string().required("Author name is required."),
    co_author_name: Yup.string().required("Co author name is required."),
    paper_title: Yup.string().required("Paper title is required."),
    paper_image: Yup.string().required("Paper file is required."),
  });
  const handelSave = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      ...values,
      id: params.journalId,
      user_id: getDataFromLocalStorage("id"),
    });
    const response = await dispatch(addJournalSubmitPaper(forData));
    if (response?.status === 200) {
      setIsSuccess(true);
      dispatch(fetchAttendedDetails());
    } else {
      setBtnLoading(false);
    }
  };
  const initialValues = {
    author_name: "",
    co_author_name: "",
    paper_title: "",
    paper_image: "",
    paperImageName: "",
  };

  return (
    <Card className="w-100 cps-30 cpe-30 cpt-30 cpb-30 unset-br">
      {isSuccess && (
        <SuccessPopup
          title="Paper Submitted Successfully"
          onHide={() => {
            setIsSuccess(false);
          }}
          onClose={() => {
            setIsSuccess(false);
            navigate(-1);
          }}
        >
          <div className="text-16-400 color-black-olive">
            <div className="mb-2">
              Congratulations you have saved{" "}
              <span className="test-16-500 color-new-car">$20</span>
            </div>
            <div>Looking forward for your journal publication</div>
          </div>
        </SuccessPopup>
      )}
      <div className="text-26-500 color-black-olive text-center cmb-40 position-relative">
        <span
          className="d-flex position-absolute start-0"
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <span className="me-3 me-sm-0">Submit Paper For Journal</span>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={handelSave}
        validationSchema={validationSchema}
      >
        {(props) => {
          const { values, errors, handleSubmit, setFieldValue, resetForm } =
            props;
          return (
            <form>
              <div className="row">
                <div className="col-md-6 cmb-22">
                  <TextInput
                    value={`${first_name} ${last_name}`}
                    disabled
                    onChange={() => {}}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput value={email_id} disabled onChange={() => {}} />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    value={phone_number}
                    disabled
                    onChange={() => {}}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    value={country_name}
                    disabled
                    onChange={() => {}}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput value={state_name} disabled onChange={() => {}} />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    value={city_name || ""}
                    disabled
                    onChange={() => {}}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput value={course} disabled onChange={() => {}} />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput value={department} disabled onChange={() => {}} />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput value={university} disabled onChange={() => {}} />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput value={institution} disabled onChange={() => {}} />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Author’s Name*"
                    id="author_name"
                    onChange={(e) => {
                      setFieldValue(
                        "author_name",
                        titleCaseString(e.target.value)
                      );
                    }}
                    value={values.author_name}
                    error={errors.author_name}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Co-Author’s Name*"
                    id="co_author_name"
                    onChange={(e) => {
                      setFieldValue(
                        "co_author_name",
                        titleCaseString(e.target.value)
                      );
                    }}
                    value={values.co_author_name}
                    error={errors.co_author_name}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Paper Title*"
                    id="paper_title"
                    onChange={(e) => {
                      setFieldValue(
                        "paper_title",
                        titleCaseString(e.target.value)
                      );
                    }}
                    value={values.paper_title}
                    error={errors.paper_title}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <FileUpload
                    id="paper_image"
                    onChange={(e) => {
                      const id = e.target.id;
                      const value = e.target.value;
                      const fileName = e.target.fileName;
                      setFieldValue("paperImageName", fileName);
                      setFieldValue(id, value);
                    }}
                    fileText={getFilenameFromUrl(
                      values.paperImageName || "File"
                    )}
                    error={errors.paper_image}
                  />
                </div>
                <div className="d-flex justify-content-center gap-4 cmt-20">
                  <Button
                    text="Cancel"
                    isRounded
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
              </div>
            </form>
          );
        }}
      </Formik>
    </Card>
  );
};
export default SubmitPaperForm;
