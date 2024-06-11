import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep, isEqual } from "lodash";
import { Formik } from "formik";
import * as Yup from "yup";
import TextInput from "components/form/TextInput";
import FileUpload from "components/form/FileUpload";
import Button from "components/form/Button";
import Location from "components/form/Location";
import ProffetionalDropdown from "components/form/ProffetionalDropdown";
import { editEvent, showSuccess, throwError } from "store/slices";
import {
  getFilenameFromUrl,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const defaultdata = [
  {
    id: "",
    user_id: "",
    designation: "",
    institution: "",
    country: "",
    photo: "",
    photoFileName: "",
    is_email: false,
    email_id: "",
    new_user_name: "",
  },
];

const Speaker = ({ eventId, fetchEventDetails }) => {
  const key = "speaker_details";
  const dispatch = useDispatch();
  const { membersList } = useSelector((state) => ({
    membersList: state.global.eventData?.speaker_details || [],
  }));
  const validationSchema = Yup.object().shape({
    speaker_details: Yup.array(
      Yup.object({
        designation: Yup.string().required("Designation is required."),
        institution: Yup.string().required("Institution is required."),
        country: Yup.string().required("Country is required."),
        photo: Yup.string().required("Photo is required."),
        user_id: Yup.lazy((_, obj) => {
          const { is_email } = obj?.parent;
          if (!is_email) {
            return Yup.string().required("Member is required.");
          } else {
            return Yup.string();
          }
        }),
        email_id: Yup.lazy((_, obj) => {
          const { is_email } = obj?.parent;
          if (is_email) {
            return Yup.string()
              .required("Email is required.")
              .email("Email must be a valid email");
          } else {
            return Yup.string();
          }
        }),
        new_user_name: Yup.lazy((_, obj) => {
          const { is_email } = obj?.parent;
          if (is_email) {
            return Yup.string().required("User name is required.");
          } else {
            return Yup.string();
          }
        }),
      })
    ),
  });

  const [initialValues, setInitialValues] = useState({
    speaker_details: defaultdata,
  });
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    setInitialValues(
      membersList.length > 0
        ? {
            speaker_details: membersList?.map((o) => {
              return { ...o, photo: getFilenameFromUrl(o?.photo) };
            }),
          }
        : { speaker_details: defaultdata }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membersList]);

  const handelSave = async (values) => {
    setBtnLoading(true);
    const payloadData = {
      ...values,
      speaker_details: JSON.stringify(values.speaker_details),
      type: 3,
      id: eventId,
    };
    const payload = objectToFormData(payloadData);
    const response = await dispatch(editEvent(payload));
    if (response?.status === 200) {
      fetchEventDetails();
      const text = membersList.length > 0 ? "update" : "add";
      dispatch(showSuccess(`Speakers ${text} successfully.`));
    }
    setBtnLoading(false);
  };

  return (
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
          resetForm,
          handleChange,
        } = props;
        return (
          <form>
            {values?.speaker_details.map((elem, index) => {
              const {
                is_email,
                email_id,
                user_id,
                name,
                institution,
                designation,
                new_user_name,
              } = elem;
              const { email_id: errEmail, new_user_name: err_new_user_name } =
                errors?.["speaker_details"]?.[index] || {};
              let existingList = [];
              if (user_id) {
                existingList = [
                  {
                    id: +user_id,
                    name: name || "",
                    designation: designation || "",
                    institution_name: institution || "",
                  },
                ];
              }
              return (
                <div className="cpt-24 row" key={index}>
                  <div className="col-md-12 cmb-24 d-flex align-items-center justify-content-end">
                    {values?.speaker_details.length > 1 && (
                      <Button
                        onClick={() => {
                          const listArray = cloneDeep(values?.speaker_details);
                          listArray.splice(index, 1);
                          setFieldValue(key, listArray);
                        }}
                        btnStyle="delete-outline"
                        icon={
                          <i className="bi bi-trash me-2 d-flex align-items-center" />
                        }
                        text="Delete"
                        className="cpt-5 cpb-5 cps-10 cpe-10"
                        isSquare
                      />
                    )}
                  </div>
                  <div className="col-md-6 cmb-24">
                    {is_email ? (
                      <TextInput
                        placeholder="Enter email for invite"
                        id={`speaker_details[${index}][email_id]`}
                        onChange={handleChange}
                        value={email_id}
                        error={errEmail}
                        handelCancel={() => {
                          let oldData = cloneDeep(values?.speaker_details);
                          oldData[index] = {
                            ...oldData[index],
                            user_id: "",
                            designation: "",
                            institution: "",
                            country: "",
                            photo: "",
                            photoFileName: "",
                            email_id: "",
                            new_user_name: "",
                            is_email: false,
                          };
                          setInitialValues({ speaker_details: oldData });
                        }}
                      />
                    ) : (
                      <ProffetionalDropdown
                        placeholder="Select Speaker"
                        id={`speaker_details[${index}][user_id]`}
                        value={values?.speaker_details?.[index]?.["user_id"]}
                        error={errors?.speaker_details?.[index]?.["user_id"]}
                        existingList={existingList}
                        onChange={(e) => {
                          const value = e?.target?.value;
                          let oldData = cloneDeep(values?.speaker_details);
                          const isExist = oldData?.some(
                            (o) => `${o.user_id}` === `${value}`
                          );
                          if (isExist) {
                            dispatch(
                              throwError({
                                message: "This speaker already exist.",
                              })
                            );
                            return;
                          }

                          const {
                            id: dID,
                            designation: dDesignation,
                            institution_name: dInstitution,
                            country_id: dCountryId,
                            profile_photo_path: dprofilePhotoPath,
                          } = e?.target?.data;
                          oldData[index] = {
                            ...oldData[index],
                            user_id: dID || "",
                            designation: dDesignation || "",
                            institution: dInstitution || "",
                            country: dCountryId || "",
                            photo: dprofilePhotoPath || "",
                            photoFileName: dprofilePhotoPath
                              ? getFilenameFromUrl(dprofilePhotoPath)
                              : "",
                          };
                          setInitialValues({ speaker_details: oldData });
                        }}
                        handelInvite={(e) => {
                          let oldData = cloneDeep(values?.speaker_details);
                          oldData[index] = {
                            ...oldData[index],
                            user_id: "",
                            designation: "",
                            institution: "",
                            country: "",
                            photo: "",
                            photoFileName: "",
                            email_id: e?.value || "",
                            is_email: true,
                          };
                          setInitialValues({ speaker_details: oldData });
                        }}
                      />
                    )}
                  </div>
                  {is_email && (
                    <div className="col-md-6 cmb-24">
                      <TextInput
                        placeholder="Enter user name"
                        id={`speaker_details[${index}][new_user_name]`}
                        onChange={handleChange}
                        value={new_user_name}
                        error={err_new_user_name}
                      />
                    </div>
                  )}
                  <div className="col-md-6 cmb-24">
                    <TextInput
                      placeholder="Designation"
                      id={`${key}[${index}][designation]`}
                      onChange={(e) => {
                        const id = e.target.id;
                        const value = titleCaseString(e.target.value);
                        setFieldValue(id, value);
                      }}
                      value={values?.speaker_details?.[index]?.["designation"]}
                      error={errors?.speaker_details?.[index]?.["designation"]}
                    />
                  </div>
                  <div className="col-md-6 cmb-24">
                    <TextInput
                      placeholder="Institution/Organization Name"
                      id={`${key}[${index}][institution]`}
                      onChange={(e) => {
                        const id = e.target.id;
                        const value = titleCaseString(e.target.value);
                        setFieldValue(id, value);
                      }}
                      value={values?.speaker_details?.[index]?.["institution"]}
                      error={errors?.speaker_details?.[index]?.["institution"]}
                    />
                  </div>
                  <div className="col-md-6 cmb-24">
                    <Location
                      type="country"
                      data={{
                        id: `${key}[${index}][country]`,
                        placeholder: "Country",
                        value: values?.speaker_details?.[index]?.["country"],
                        error: errors?.speaker_details?.[index]?.["country"],
                        onChange: handleChange,
                      }}
                    />
                  </div>
                  <div className="col-md-6 cmb-22">
                    <FileUpload
                      id={`${key}[${index}][photo]`}
                      onChange={(e) => {
                        const id = e.target.id;
                        const value = e.target.value;
                        const fileName = e.target.fileName;
                        setFieldValue(
                          `${key}[${index}][photoFileName]`,
                          fileName
                        );
                        setFieldValue(id, value);
                      }}
                      fileText={
                        getFilenameFromUrl(elem?.photoFileName || elem.photo) ||
                        "Profile photo"
                      }
                      error={errors?.speaker_details?.[index]?.["photo"]}
                      fileType="image"
                    />
                  </div>
                </div>
              );
            })}
            <div className="row cmt-12">
              <div className="col-md-6 d-flex">
                <Button
                  onClick={() => {
                    const newArray = [
                      {
                        user_id: "",
                        designation: "",
                        institution: "",
                        country: "",
                        photo: "",
                        photoFileName: "",
                      },
                    ];
                    setFieldValue("speaker_details", [
                      ...values?.speaker_details,
                      ...newArray,
                    ]);
                  }}
                  text="Add Speaker"
                  btnStyle="primary-light"
                  className="h-35 text-14-500"
                  isSquare
                />
              </div>
            </div>
            <div className="d-flex justify-content-center gap-4 cmt-20 col-md-12">
              <Button
                text="Cancel"
                isRounded
                btnStyle="light-outline"
                className="cps-40 cpe-40"
                onClick={resetForm}
              />
              <Button
                text="Done"
                isRounded
                btnStyle="primary-dark"
                className="cps-40 cpe-40"
                onClick={handleSubmit}
                btnLoading={btnLoading}
                disabled={isEqual(values, { speaker_details: membersList })}
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};
export default Speaker;
