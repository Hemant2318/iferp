import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import FileUpload from "components/form/FileUpload";
import TextInput from "components/form/TextInput";
import { Formik } from "formik";
import { cloneDeep, isEqual, remove } from "lodash";
import React from "react";
import { getFilenameFromUrl, objectToFormData } from "utils/helpers";
import * as Yup from "yup";
import {
  createAdvertisement,
  throwError,
  throwSuccess,
  updateSingleAdvertisement,
} from "store/slices";

const AddNewsNotification = ({ onHide, editData, handleSuccess }) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const [btnLoading, setBtnLoading] = useState(false);

  const handleSave = (values) => {
    setBtnLoading(true);
    const newData = remove(cloneDeep(values.news_notification_details), (e) => {
      delete e.fileName;
      return e;
    });
    const payload = {
      news_notification_details: JSON.stringify(newData),
    };
    if (editData) {
      handelEditData(payload);
    } else {
      handelAddData(payload);
    }
  };

  const handelAddData = async (values) => {
    let formData = objectToFormData(values);
    const response = await dispatch(createAdvertisement(formData));
    if (response?.status === 200) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
      dispatch(throwSuccess(response?.message));
      setBtnLoading(false);
      handleSuccess();
    } else {
      setBtnLoading(false);
    }
  };

  const handelEditData = async (values) => {
    console.log("values", values);
    let formData = objectToFormData(values);
    const response = await dispatch(
      updateSingleAdvertisement(editData?.id, formData)
    );
    console.log("response", response);

    if (response?.status === 200) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
      dispatch(throwSuccess(response?.message));
      setBtnLoading(false);
      handleSuccess();
    } else {
      dispatch(throwError(response?.message));
      setBtnLoading(false);
    }
  };

  const initialValues = {
    news_notification_details: [
      {
        image: editData?.image || "",
        fileName: "",
        website_url: editData?.website_url || "",
      },
    ],
  };
  const validationSchema = Yup.object().shape({
    news_notification_details: Yup.array(
      Yup.object({
        image: Yup.string().required("Image is required."),
      })
    ),
  });
  // useEffect(() => {
  //   if (editData?.id) {
  //     setInitialValues((prev) => {
  //       console.log("prev", prev);
  //       return {
  //         ...prev,
  //         news_notification_details: [
  //           {
  //             image: editData?.image || "",
  //             fileName: editData?.image || "",
  //             website_url: editData?.website_url || "",
  //           },
  //         ],
  //       };
  //     });
  //   }
  // }, [editData]);

  console.log("edit", editData);
  console.log("initialValues", initialValues);

  return (
    <Modal
      onHide={onHide}
      title={editData ? "Edit News" : "Add News"}
      size="md"
    >
      <div className="cmt-34 cms-20 cme-20 cmb-34">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
          innerRef={formRef}
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
            const { news_notification_details = [] } = values;
            /* console.log("values", values); */
            return (
              <form
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              >
                <div className="row d-flex justify-content-between align-items-center cmb-26">
                  {news_notification_details?.map((elem, index) => {
                    const { image, fileName, website_url } = elem;
                    const { image: errImage } =
                      errors?.news_notification_details?.[index] || {};
                    return (
                      <React.Fragment key={index}>
                        <div className="col-md-12 cmb-22">
                          <FileUpload
                            isRequired
                            label="News Image"
                            fileType="image"
                            id={`news_notification_details[${index}][image]`}
                            onChange={(e) => {
                              handleChange({
                                target: {
                                  id: `news_notification_details[${index}][fileName]`,
                                  value: e.target.fileName,
                                },
                              });
                              handleChange(e);
                            }}
                            fileText={
                              fileName || getFilenameFromUrl(image) || ""
                            }
                            error={errImage}
                          />
                        </div>
                        <div className="col-md-12 cmb-22">
                          <TextInput
                            label="Website URL"
                            placeholder="Enter the URL of website"
                            id={`news_notification_details[${index}][website_url]`}
                            onChange={handleChange}
                            value={website_url}
                          />
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {!editData && (
                    <div className="d-flex cmb-22">
                      <Button
                        icon={
                          <i
                            className="bi bi-plus-circle"
                            style={{ fontSize: "15px" }}
                          ></i>
                        }
                        text="Add Another"
                        btnStyle="primary-outline"
                        className="h-39 text-14-500 text-nowrap gap-2 align-items-center"
                        onClick={() => {
                          const newArray = [
                            {
                              image: "",
                              fileName: "",
                              website_url: "",
                            },
                          ];
                          setFieldValue("news_notification_details", [
                            ...news_notification_details,
                            ...newArray,
                          ]);
                        }}
                      />
                    </div>
                  )}

                  <div className="col-md-12 d-flex justify-content-center gap-4">
                    <Button
                      text="Cancel"
                      isRounded
                      btnStyle="light-outline"
                      className="cps-40 cpe-40"
                      onClick={() => {
                        resetForm();
                      }}
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
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default AddNewsNotification;
