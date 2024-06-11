import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import FileUpload from "components/form/FileUpload";
import Modal from "components/Layout/Modal";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import { cloneDeep } from "lodash";
import { certificateField, certificatePath } from "utils/constants";
import {
  bytesToBase64,
  generatePreSignedUrl,
  getCertificatePdf,
  urlToUnitArray,
} from "utils/helpers";
import "./CustomCertificate.scss";
import CheckBox from "components/form/CheckBox/CheckBox";

const CustomCertificate = ({
  title,
  onHide,
  handleAPI,
  handleSuccess,
  oldData,
}) => {
  const [viewSample, setViewSample] = useState("");
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setIsBtnLoading(true);
    const response = await handleAPI(values);
    if (response?.status === 200) {
      handleSuccess();
    }
    setIsBtnLoading(false);
  };
  const handelView = async (values) => {
    const { certificate, fieldData } = values;
    let selectedFile = "";
    if (certificate.substring(0, 4) === "data") {
      selectedFile = certificate;
    } else {
      if (oldData?.certificate_file) {
        selectedFile = await generatePreSignedUrl(
          oldData?.certificate_file,
          certificatePath
        );
      }
    }
    const pdfFileData = await urlToUnitArray(selectedFile);
    const newFieldData = fieldData.map((elm) => {
      const findVal = certificateField.find(
        (o) => o.id === elm.fieldName
      )?.exText;
      return { ...elm, value: findVal };
    });
    const pdfBytes = await getCertificatePdf(pdfFileData, newFieldData);
    var b64 = bytesToBase64(pdfBytes);
    setViewSample(`data:application/pdf;base64,${b64}`);
  };
  const defaultObject = {
    fieldName: "",
    left: "",
    top: "",
    lineBreak: "",
    wordTop: "",
    wordLeft: "",
    fontSize: "6",
    fontColor: "#000000",
    isCenter: false,
  };
  const initialValues = {
    certificate: oldData?.certificate_file || "",
    certificateFileName: oldData?.certificate_file || "",
    fieldData: oldData?.filed_data
      ? JSON.parse(oldData?.filed_data)
      : [defaultObject],
  };
  const validationSchema = Yup.object().shape({
    // certificate: Yup.string().required("Certificate is required."),
    certificate: Yup.string()
      .required("Certificate is required.")
      .test("fileSize", "File size too large", (value) => {
        if (!value) return true; // if no file uploaded, skip validation
        const maxSize = 1024 * 1024; // 1 MB
        return value?.length <= maxSize;
      }),
    fieldData: Yup.array(
      Yup.object({
        fieldName: Yup.string().required("Field name is required."),
        left: Yup.string()
          .required("Left position is required.")
          .matches(/^[0-9\s]+$/, "Input number only.")
          .matches(/^\S*$/, "Whitespace is not allowed."),
        top: Yup.string()
          .required("Top position is required.")
          .matches(/^[0-9\s]+$/, "Input number only.")
          .matches(/^\S*$/, "Whitespace is not allowed."),
        wordLeft: Yup.lazy((value, obj) => {
          const { lineBreak } = obj?.parent;
          if (lineBreak) {
            return Yup.string()
              .required("Second left position is required.")
              .matches(/^[0-9\s]+$/, "Input number only.")
              .matches(/^\S*$/, "Whitespace is not allowed.");
          } else {
            return Yup.mixed().notRequired();
          }
        }),
        wordTop: Yup.lazy((value, obj) => {
          const { lineBreak } = obj?.parent;
          if (lineBreak) {
            return Yup.string()
              .required("Second left position is required.")
              .matches(/^[0-9\s]+$/, "Input number only.")
              .matches(/^\S*$/, "Whitespace is not allowed.");
          } else {
            return Yup.mixed().notRequired();
          }
        }),
      })
    ),
  });

  return (
    <>
      {viewSample && (
        <Modal
          fullscreen
          largeClose
          onHide={() => {
            setViewSample("");
          }}
        >
          <iframe
            frameBorder="0"
            className="w-100"
            src={`${viewSample}#toolbar=0&navpanes=0`}
            title="description"
            style={{
              width: "100%",
              height: "99%",
            }}
          />
        </Modal>
      )}
      <Modal title={title || ""} onHide={onHide}>
        <Formik
          initialValues={initialValues}
          onSubmit={handelSave}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {(props) => {
            const {
              values,
              errors,
              handleSubmit,
              setFieldValue,
              handleChange,
            } = props;

            const { certificateFileName, fieldData } = values;
            const { certificate: err_certificate } = errors;

            return (
              <form className="p-3">
                <div className="cmb-22">
                  <FileUpload
                    id="certificate"
                    label="Certificate"
                    acceptType={["pdf"]}
                    fileText={certificateFileName || "Upload certificate"}
                    error={err_certificate}
                    onChange={(e) => {
                      setFieldValue("certificateFileName", e.target.fileName);
                      handleChange(e);
                    }}
                  />
                </div>
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <div className="text-16-500">Certificate Fields</div>
                  <div className="">
                    <Button
                      text="Add Fields"
                      className="bg-title-navy color-white text-12-400 h-35"
                      onClick={() => {
                        setFieldValue("fieldData", [
                          ...fieldData,
                          defaultObject,
                        ]);
                      }}
                    />
                  </div>
                </div>
                {fieldData?.map((elm, index) => {
                  const {
                    fieldName,
                    left,
                    top,
                    fontSize,
                    fontColor,
                    lineBreak,
                    wordLeft,
                    wordTop,
                    isCenter,
                  } = elm;
                  const {
                    fieldName: err_fieldName,
                    left: err_left,
                    top: err_top,
                    wordLeft: err_wordLeft,
                    wordTop: err_wordTop,
                  } = errors?.fieldData?.[index] || {};
                  const elmID = `fieldData[${index}]`;
                  const isExistPaperField = [
                    "institution_or_company",
                    "paper_title",
                  ].includes(fieldName);
                  const isShowCenter = [
                    "user_name",
                    "first_name",
                    "last_name",
                  ].includes(fieldName);
                  return (
                    <div
                      className="row mt-3 pt-5 shadow bg-alice-blue position-relative"
                      key={index}
                    >
                      <div className="mb-2">
                        <Dropdown
                          value={fieldName}
                          error={err_fieldName}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          id={`${elmID}[fieldName]`}
                          placeholder="Select field"
                          options={certificateField}
                        />
                      </div>
                      <div className="col-md-3 col-sm-6 col-6 mb-2">
                        <TextInput
                          value={left}
                          error={err_left}
                          id={`${elmID}[left]`}
                          onChange={handleChange}
                          placeholder="Left Position"
                        />
                      </div>
                      <div className="col-md-3 col-sm-6 col-6 mb-2">
                        <TextInput
                          placeholder="Top Position"
                          value={top}
                          error={err_top}
                          id={`${elmID}[top]`}
                          onChange={handleChange}
                        />
                      </div>

                      {isExistPaperField && (
                        <div className="col-md-3 col-sm-3 col-6 mb-2">
                          <TextInput
                            placeholder="Line Break"
                            value={lineBreak}
                            id={`${elmID}[lineBreak]`}
                            onChange={handleChange}
                          />
                        </div>
                      )}

                      {lineBreak && (
                        <>
                          <div className="col-md-3 col-sm-3 col-6 mb-2">
                            <TextInput
                              placeholder="Second Left"
                              value={wordLeft}
                              error={err_wordLeft}
                              id={`${elmID}[wordLeft]`}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3 col-sm-3 col-6 mb-2">
                            <TextInput
                              placeholder="Second Top"
                              value={wordTop}
                              error={err_wordTop}
                              id={`${elmID}[wordTop]`}
                              onChange={handleChange}
                            />
                          </div>
                        </>
                      )}

                      <div className="col-md-3 col-sm-6 col-6 mb-2 d-flex gap-2">
                        <div className="flex-grow-1">
                          <Dropdown
                            value={fontSize}
                            placeholder="Font Size"
                            id={`${elmID}[fontSize]`}
                            onChange={handleChange}
                            options={[
                              6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                              19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                              31, 32, 33, 34,
                            ].map((o) => {
                              return {
                                id: `${o}`,
                                label: `${o}px`,
                              };
                            })}
                          />
                        </div>
                        <div className="col-md-2 col-sm-3 col-3 mb-2 d-flex align-items-start pt-1">
                          <input
                            type="color"
                            value={fontColor}
                            onChange={handleChange}
                            id={`${elmID}[fontColor]`}
                          />
                        </div>
                      </div>
                      {isShowCenter && (
                        <div className="col-md-3 col-sm-6 col-6 mb-2 d-flex align-items-center">
                          <div className="d-flex align-items-center gap-3">
                            <CheckBox
                              className="checkbox-size-24"
                              type="PRIMARY-ACTIVE"
                              onClick={() => {
                                setFieldValue(`${elmID}[isCenter]`, !isCenter);
                              }}
                              isChecked={isCenter}
                            />
                            <div className="text-16-400">Is Center</div>
                          </div>
                        </div>
                      )}
                      <div className="d-flex justify-content-end align-items-start position-absolute top-0 end-0 pt-2">
                        <i
                          className="bi bi-trash color-danger"
                          onClick={() => {
                            const listArray = cloneDeep(fieldData);
                            listArray.splice(index, 1);
                            setFieldValue("fieldData", listArray);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="d-flex justify-content-center mt-4 gap-3">
                  <Button
                    text="View Sample"
                    className="bg-title-navy color-white ps-4 pe-4"
                    disabled={!certificateFileName}
                    onClick={() => {
                      handelView(values);
                    }}
                  />
                  <Button
                    text="Submit"
                    onClick={handleSubmit}
                    className="bg-title-navy color-white ps-5 pe-5"
                    disabled={!certificateFileName}
                    btnLoading={isBtnLoading}
                  />
                </div>
              </form>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
};

export default CustomCertificate;
