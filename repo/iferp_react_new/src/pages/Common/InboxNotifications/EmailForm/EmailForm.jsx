import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { isEqual, omit } from "lodash";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "components/form/Button";
import Label from "components/form/Label";
import TextArea from "components/form/TextArea";
import FileUpload from "components/form/FileUpload";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import { getFilenameFromUrl, objectToFormData } from "utils/helpers";
import { addKeynoteSpeakerDocument, setApiError } from "store/slices";

const EmailForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef();
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    const payload = objectToFormData(
      omit(values, [
        "passportPhoto",
        "photosOfPreviousEvent",
        "certificatesIfAny",
        "awardsIfAny",
      ])
    );
    const response = await dispatch(addKeynoteSpeakerDocument(payload));
    if (response?.status === 200) {
      dispatch(
        setApiError({
          show: true,
          message: "Document Upload Successfully.",
          type: "success",
        })
      );
      if (formRef.current) {
        formRef.current.resetForm();
      }
    }
    setBtnLoading(false);
  };
  const validationSchema = Yup.object().shape({
    presentation_title: Yup.string()
      .required("Presentaction title is required.")
      .max(100, "Maximum 100 character allow for this field."),
    passport_photo: Yup.string().required("Passport photo is required."),
    photos_of_previous_event: Yup.string().required(
      "Photos of previous event is required."
    ),
  });
  const initialValues = {
    presentation_title: "",
    passport_photo: "",
    passportPhoto: "",
    photos_of_previous_event: "",
    photosOfPreviousEvent: "",
    certificates: "",
    certificatesIfAny: "",
    awards: "",
    awardsIfAny: "",
  };
  return (
    <Card className="cps-40 cpe-40 cpb-30 cpt-30 mb-3">
      <div className="cpt-12 cpb-12 d-flex align-items-center justify-content-between cmb-40">
        <div className="d-flex align-items-center">
          <span
            className="d-flex"
            onClick={() => {
              navigate(-1);
            }}
          >
            <img
              src={icons.leftArrow}
              alt="back"
              className="h-21 me-3 pointer"
            />
          </span>

          <span className="text-18-500 color-black-olive">
            ICERT Conference - Upload documents to participate as Speaker
          </span>
        </div>
      </div>
      <Formik
        enableReinitialize
        innerRef={formRef}
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
              <div className="row d-flex justify-conent-between align-items-start cmb-22">
                <div className="col-md-3 mt-2">
                  <Label label="Presentaction Title" required />
                </div>
                <div className="col-md-9">
                  <TextArea
                    placeholder="Presentaction Title"
                    id="presentation_title"
                    value={values.presentation_title}
                    error={errors.presentation_title}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>
              <div className="row d-flex justify-conent-between align-items-center cmb-22">
                <div className="col-md-3">
                  <Label label="Passport Photo" required />
                </div>
                <div className="col-md-9">
                  <FileUpload
                    id="passport_photo"
                    onChange={(e) => {
                      const fileName = e.target.fileName;
                      setFieldValue("passportPhoto", fileName);
                      handleChange(e);
                    }}
                    fileText={getFilenameFromUrl(values?.passportPhoto || "")}
                    error={errors?.passport_photo}
                  />
                </div>
              </div>
              <div className="row d-flex justify-conent-between align-items-center cmb-22">
                <div className="col-md-3">
                  <Label label="Photos Of Prevous Event" required />
                </div>
                <div className="col-md-9">
                  <FileUpload
                    id="photos_of_previous_event"
                    onChange={(e) => {
                      const fileName = e.target.fileName;
                      setFieldValue("photosOfPreviousEvent", fileName);
                      handleChange(e);
                    }}
                    fileText={getFilenameFromUrl(
                      values?.photosOfPreviousEvent || ""
                    )}
                    error={errors?.photos_of_previous_event}
                  />
                </div>
              </div>
              <div className="row d-flex justify-conent-between align-items-center cmb-22">
                <div className="col-md-3">
                  <Label label="Certificates If Any" />
                </div>
                <div className="col-md-9">
                  <FileUpload
                    id="certificates"
                    onChange={(e) => {
                      const fileName = e.target.fileName;
                      setFieldValue("certificatesIfAny", fileName);
                      handleChange(e);
                    }}
                    fileText={getFilenameFromUrl(
                      values?.certificatesIfAny || ""
                    )}
                    error={errors?.certificates}
                  />
                </div>
              </div>
              <div className="row d-flex justify-conent-between align-items-center cmb-22">
                <div className="col-md-3">
                  <Label label="Awards If Any" />
                </div>
                <div className="col-md-9">
                  <FileUpload
                    id="awards"
                    onChange={(e) => {
                      const fileName = e.target.fileName;
                      setFieldValue("awardsIfAny", fileName);
                      handleChange(e);
                    }}
                    fileText={getFilenameFromUrl(values?.awardsIfAny || "")}
                    error={errors?.awards}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center gap-4 pt-3">
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
                  disabled={isEqual(initialValues, values)}
                  btnLoading={btnLoading}
                />
              </div>
            </form>
          );
        }}
      </Formik>
    </Card>
  );
};
export default EmailForm;
