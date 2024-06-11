import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { cloneDeep, isEqual, map, omit } from "lodash";
import * as Yup from "yup";
import Dropdown from "components/form/Dropdown";
import Button from "components/form/Button/Button";
import { awardTypeOptions, icons } from "utils/constants";
import TextInput from "components/form/TextInput";
import FileUpload from "components/form/FileUpload";
import UserDropdown from "components/form/UserDropdown";
import {
  getFilenameFromUrl,
  objectToFormData,
  trimLeftSpace,
} from "utils/helpers";
import { addOldAwardWinners, editOldAwardWinners } from "store/slices";

const OldAwardWinner = ({ editData, fileAcceptTypes }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const handelSave = (values) => {
    setBtnLoading(true);
    values = {
      ...values,
      award_winner_details: map(values.award_winner_details, (o) => {
        return omit(o, ["paper_file_name", "certificate_name"]);
      }),
    };
    if (isEdit) {
      handelUpdate({
        ...values.award_winner_details[0],
        id: editData.id,
        event_name: values.event_name,
      });
    } else {
      handelAdd({
        ...values,
        award_winner_details: JSON.stringify(values.award_winner_details),
      });
    }
  };
  const handelAdd = async (data) => {
    let forData = objectToFormData(data);
    const response = await dispatch(addOldAwardWinners(forData));
    if (response?.status === 200) {
      navigate(-1);
    } else {
      setBtnLoading(false);
    }
  };
  const handelUpdate = async (data) => {
    let forData = objectToFormData(data);
    const response = await dispatch(editOldAwardWinners(forData));
    if (response?.status === 200) {
      navigate(-1);
    } else {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    if (params?.awardWinnerId !== "add-award-winners") {
      setIsEdit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validationSchema = Yup.object().shape({
    event_name: Yup.string().required("Event is required."),
    award_winner_details: Yup.array(
      Yup.object({
        award_type: Yup.string().required("Award type is required."),
        certificate: Yup.string().required("Certificate is required."),
        paper_file: Yup.string().required("Paper is required."),
        user_id: Yup.lazy((_, obj) => {
          const { is_email } = obj?.parent;
          if (!is_email) {
            return Yup.string().required("Award winner is required.");
          } else {
            return Yup.string();
          }
        }),
        user_email: Yup.lazy((_, obj) => {
          const { is_email } = obj?.parent;
          if (is_email) {
            return Yup.string()
              .required("Email is required.")
              .email("Email must be a valid email");
          } else {
            return Yup.string();
          }
        }),
        user_name: Yup.lazy((_, obj) => {
          const { is_email } = obj?.parent;
          if (is_email) {
            return Yup.string().required("Award winner is required.");
          } else {
            return Yup.string();
          }
        }),
      })
    ),
  });
  // userid: editData?.userId || "",
  // memberId: editData?.userMemberId || "",
  // award_type: editData?.awardType || "",
  // certificate: editData?.certificate || "",
  // fileName: getFilenameFromUrl(editData?.certificate || "") || "",
  // paper_file: editData?.paper_file || "",
  // paperFileName: getFilenameFromUrl(editData?.paper_file || "") || "",
  // is_email: false,
  // name: "",
  // email: "",
  const defaultObject = {
    user_id: "",
    member_id: "",
    is_email: false,
    user_name: "",
    user_email: "",
    award_type: "",
    certificate: "",
    certificate_name: "",
    paper_file: "",
    paper_file_name: "",
  };
  const {
    id,
    eventName,
    userId,
    userMemberId,
    user_name,
    user_email,
    awardType,
    certificate,
    paper_file,
  } = editData || {};

  const initialValues = {
    event_name: eventName || "",
    award_winner_details: [
      {
        user_id: userId || "",
        member_id: userMemberId || "",
        is_email: id ? (userId ? false : true) : false,
        user_name: user_name || "",
        user_email: user_email || "",
        award_type: awardType || "",
        certificate: certificate || "",
        certificate_name: certificate ? getFilenameFromUrl(certificate) : "",
        paper_file: paper_file || "",
        paper_file_name: paper_file ? getFilenameFromUrl(paper_file) : "",
      },
    ],
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
            <div className="row">
              <div className="col-md-12 col-12 cmb-22">
                <TextInput
                  isRequired
                  id="event_name"
                  label="Event Name"
                  placeholder="Enter Event Name"
                  value={values.event_name}
                  error={errors?.event_name}
                  onChange={(e) => {
                    setFieldValue("event_name", trimLeftSpace(e.target.value));
                  }}
                />
              </div>
              {values?.award_winner_details.map((elem, index) => {
                const {
                  user_id,
                  member_id,
                  is_email,
                  user_name,
                  user_email,
                  award_type,
                  certificate_name,
                  paper_file_name,
                } = elem;
                const currentError =
                  errors?.award_winner_details?.[index] || {};
                const {
                  user_id: err_user_id,
                  user_name: err_user_name,
                  user_email: err_user_email,
                  award_type: err_award_type,
                  certificate: err_certificate,
                  paper_file: err_paper_file,
                } = currentError;
                return (
                  <React.Fragment key={index}>
                    {values?.award_winner_details.length > 1 && (
                      <div className="col-md-12 col-12 cmb-12 d-flex align-items-end justify-content-end">
                        <Button
                          isSquare
                          btnStyle="light-outline"
                          icon={<img src={icons.deleteIcon} alt="delete" />}
                          onClick={() => {
                            const listArray = cloneDeep(
                              values?.award_winner_details
                            );
                            listArray.splice(index, 1);
                            setFieldValue("award_winner_details", listArray);
                          }}
                        />
                      </div>
                    )}
                    <div className="col-md-6 col-12 cmb-22">
                      {is_email ? (
                        <TextInput
                          isRequired
                          label="Award Winner Email"
                          placeholder="Enter award winner email for invite"
                          id={`award_winner_details[${index}][user_email]`}
                          onChange={handleChange}
                          value={user_email}
                          error={err_user_email}
                          handelCancel={() => {
                            let oldData = cloneDeep(
                              values?.award_winner_details
                            );
                            oldData[index] = {
                              ...oldData[index],
                              user_id: "",
                              member_id: "",
                              user_name: "",
                              user_email: "",
                              is_email: false,
                            };
                            setFieldValue("award_winner_details", oldData);
                          }}
                        />
                      ) : (
                        <UserDropdown
                          isRequired
                          label="Award Winner Name"
                          placeholder="Select Award Winner"
                          id={`award_winner_details[${index}][user_id]`}
                          value={user_id}
                          error={err_user_id}
                          existingList={
                            isEdit
                              ? [
                                  {
                                    email_id: is_email ? user_email : "",
                                    id: user_id,
                                    member_id: member_id,
                                    name: user_name,
                                  },
                                ]
                              : []
                          }
                          onChange={(e) => {
                            const data = e.target.data;
                            handleChange({
                              target: {
                                id: `award_winner_details[${index}][member_id]`,
                                value: data.member_id,
                              },
                            });
                            handleChange(e);
                          }}
                          handelInvite={(e) => {
                            let oldData = cloneDeep(
                              values?.award_winner_details
                            );
                            oldData[index] = {
                              ...oldData[index],
                              user_id: "",
                              member_id: "",
                              user_name: "",
                              user_email: e?.value || "",
                              is_email: true,
                            };
                            setFieldValue("award_winner_details", oldData);
                          }}
                        />
                      )}
                    </div>
                    <div className="col-md-6 col-12 cmb-22">
                      {is_email ? (
                        <TextInput
                          isRequired
                          label="Award Winner Name"
                          value={user_name}
                          error={err_user_name}
                          id={`award_winner_details[${index}][user_name]`}
                          placeholder="Enter name"
                          onChange={handleChange}
                        />
                      ) : (
                        <TextInput
                          label="Award Winner Member ID"
                          value={member_id}
                          placeholder="Member ID"
                          id="member_id"
                          onChange={() => {}}
                          disabled
                        />
                      )}
                    </div>
                    <div className="col-md-6 col-12 cmb-22">
                      <Dropdown
                        isRequired
                        label="Award Type"
                        placeholder="Select Award Type"
                        value={award_type}
                        options={awardTypeOptions}
                        optionKey="value"
                        optionValue="value"
                        id={`award_winner_details[${index}][award_type]`}
                        onChange={handleChange}
                        error={err_award_type}
                      />
                    </div>
                    <div className="col-md-6 col-12 cmb-22">
                      <FileUpload
                        label="Certificate"
                        isRequired
                        id={`award_winner_details[${index}][certificate]`}
                        onChange={(e) => {
                          const fileName = e.target.fileName;
                          handleChange({
                            target: {
                              id: `award_winner_details[${index}][certificate_name]`,
                              value: fileName,
                            },
                          });
                          handleChange(e);
                        }}
                        fileText={certificate_name || "Certificate"}
                        error={err_certificate}
                        acceptType={fileAcceptTypes}
                      />
                    </div>
                    <div className="col-md-6 col-12 cmb-22">
                      <FileUpload
                        label="Paper File"
                        id={`award_winner_details[${index}][paper_file]`}
                        onChange={(e) => {
                          const fileName = e.target.fileName;
                          handleChange({
                            target: {
                              id: `award_winner_details[${index}][paper_file_name]`,
                              value: fileName,
                            },
                          });
                          handleChange(e);
                        }}
                        fileText={paper_file_name || "Paper File"}
                        error={err_paper_file}
                        acceptType={fileAcceptTypes}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {!isEdit && (
              <div className="col-md-6 col-12 d-flex">
                <Button
                  onClick={() => {
                    const newArray = [defaultObject];
                    setFieldValue("award_winner_details", [
                      ...values?.award_winner_details,
                      ...newArray,
                    ]);
                  }}
                  text="+ Add AwardWinner"
                  btnStyle="primary-light"
                  className="h-35 text-14-500"
                  isSquare
                />
              </div>
            )}
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
                text="Done"
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

export default OldAwardWinner;
