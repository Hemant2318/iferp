import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep, filter, isEqual } from "lodash";
import { Formik } from "formik";
import * as Yup from "yup";
import TextInput from "../../form/TextInput";
import FileUpload from "../../form/FileUpload";
import Button from "../../form/Button";
import Dropdown from "../../form/Dropdown";
import Location from "../../form/Location";
import { editEvent, showSuccess, throwError } from "store/slices";
import {
  getFilenameFromUrl,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import ProffetionalDropdown from "components/form/ProffetionalDropdown";

const defaultdata = [
  {
    id: "",
    committee_member_category: "",
    member_id: "",
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
const CommitteeMember = ({ eventId, fetchEventDetails }) => {
  const dispatch = useDispatch();
  const { membersList, comitteeMemberCategoryList, ocm_categories_id } =
    useSelector((state) => ({
      membersList: state.global.eventData?.committee_members || [],
      ocm_categories_id: state.global.eventData?.ocm_categories_id || "",
      comitteeMemberCategoryList: state.global.comitteeMemberCategoryList,
    }));

  const validationSchema = Yup.object().shape({
    committee_members: Yup.array(
      Yup.object({
        committee_member_category: Yup.string().required(
          "Member type is required."
        ),
        designation: Yup.string().required("Designation is required."),
        institution: Yup.string().required("Institution is required."),
        country: Yup.string().required("Country is required."),
        photo: Yup.string().required("Photo is required."),
        member_id: Yup.lazy((_, obj) => {
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
    committee_members: defaultdata,
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    const payloadData = {
      ...values,
      committee_members: JSON.stringify(values.committee_members),
      type: 2,
      id: eventId,
    };

    const payload = objectToFormData(payloadData);
    const response = await dispatch(editEvent(payload));
    if (response?.status === 200) {
      fetchEventDetails();
      const text = membersList.length > 0 ? "update" : "add";
      dispatch(showSuccess(`Committee members ${text} successfully.`));
    }
    setBtnLoading(false);
  };
  useEffect(() => {
    setInitialValues(
      membersList.length > 0
        ? { committee_members: membersList }
        : { committee_members: defaultdata }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membersList]);
  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handelSave}
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
            {values.committee_members.map((elem, index) => {
              const {
                committee_member_category,
                member_id,
                member_name,
                designation,
                institution,
                country,
                photoFileName,
                photo,
                is_email,
                email_id,
                new_user_name,
              } = elem;
              const {
                committee_member_category: errCommitteeMemberCategory,
                member_id: errMemberID,
                designation: errDesignation,
                institution: errInstitution,
                country: errCountry,
                photo: errPhoto,
                email_id: errEmail,
                new_user_name: err_new_user_name,
              } = errors?.committee_members?.[index] || {};
              let existingList = [];
              if (member_id) {
                existingList = [
                  {
                    id: +member_id,
                    name: member_name || "",
                    designation: designation || "",
                    institution_name: institution || "",
                  },
                ];
              }
              return (
                <div className="cpt-24 row" key={index}>
                  <div className="col-md-12 cmb-24 d-flex align-items-center justify-content-end">
                    {values.committee_members.length > 1 && (
                      <Button
                        onClick={() => {
                          const listArray = cloneDeep(values.committee_members);
                          listArray.splice(index, 1);
                          setFieldValue("committee_members", listArray);
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
                    <Dropdown
                      placeholder="Select Member Type"
                      id={`committee_members[${index}][committee_member_category]`}
                      options={filter(comitteeMemberCategoryList, (o) => {
                        return ocm_categories_id.includes(o.id);
                      })}
                      optionKey="id"
                      optionValue="name"
                      onChange={handleChange}
                      value={committee_member_category}
                      error={errCommitteeMemberCategory}
                    />
                  </div>
                  <div className="col-md-6 cmb-24">
                    {is_email ? (
                      <TextInput
                        placeholder="Enter email for invite"
                        id={`committee_members[${index}][email_id]`}
                        onChange={handleChange}
                        value={email_id}
                        error={errEmail}
                        handelCancel={() => {
                          let oldData = cloneDeep(values?.committee_members);
                          oldData[index] = {
                            ...oldData[index],
                            member_id: "",
                            designation: "",
                            institution: "",
                            country: "",
                            photo: "",
                            photoFileName: "",
                            email_id: "",
                            new_user_name: "",
                            is_email: false,
                          };
                          setInitialValues({ committee_members: oldData });
                        }}
                      />
                    ) : (
                      <ProffetionalDropdown
                        placeholder="Select Member"
                        id={`committee_members[${index}][member_id]`}
                        value={member_id}
                        error={errMemberID}
                        existingList={existingList}
                        onChange={(e) => {
                          const value = e?.target?.value;
                          let oldData = cloneDeep(values?.committee_members);
                          const isExist = oldData?.some(
                            (o) => `${o.member_id}` === `${value}`
                          );
                          if (isExist) {
                            dispatch(
                              throwError({
                                message: "This member already exist.",
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
                            member_id: dID || "",
                            designation: dDesignation || "",
                            institution: dInstitution || "",
                            country: dCountryId || "",
                            photo: dprofilePhotoPath || "",
                            photoFileName: "",
                          };
                          setInitialValues({ committee_members: oldData });
                        }}
                        handelInvite={(e) => {
                          let oldData = cloneDeep(values?.committee_members);
                          oldData[index] = {
                            ...oldData[index],
                            member_id: "",
                            designation: "",
                            institution: "",
                            country: "",
                            photo: "",
                            photoFileName: "",
                            email_id: e?.value || "",
                            is_email: true,
                            new_user_name: "",
                          };
                          setInitialValues({ committee_members: oldData });
                        }}
                      />
                    )}
                  </div>
                  {is_email && (
                    <div className="col-md-6 cmb-24">
                      <TextInput
                        placeholder="Enter user name"
                        id={`committee_members[${index}][new_user_name]`}
                        onChange={handleChange}
                        value={new_user_name}
                        error={err_new_user_name}
                      />
                    </div>
                  )}
                  <div className="col-md-6 cmb-24">
                    <TextInput
                      placeholder="Designation"
                      id={`committee_members[${index}][designation]`}
                      onChange={(e) => {
                        const id = e.target.id;
                        const value = titleCaseString(e.target.value);
                        setFieldValue(id, value);
                      }}
                      value={designation}
                      error={errDesignation}
                    />
                  </div>
                  <div className="col-md-6 cmb-24">
                    <TextInput
                      placeholder="Institution / Organization Name"
                      id={`committee_members[${index}][institution]`}
                      onChange={(e) => {
                        const id = e.target.id;
                        const value = titleCaseString(e.target.value);
                        setFieldValue(id, value);
                      }}
                      value={institution}
                      error={errInstitution}
                    />
                  </div>
                  <div className="col-md-6 cmb-24">
                    <Location
                      type="country"
                      data={{
                        id: `committee_members[${index}][country]`,
                        placeholder: "Country",
                        value: country,
                        error: errCountry,
                        onChange: handleChange,
                      }}
                    />
                  </div>
                  <div className="col-md-6 cmb-24 d-flex align-items-center">
                    <FileUpload
                      id={`committee_members[${index}][photo]`}
                      onChange={(e) => {
                        const id = e.target.id;
                        const value = e.target.value;
                        const fileName = e.target.fileName;
                        setFieldValue(
                          `committee_members[${index}][photoFileName]`,
                          fileName
                        );
                        setFieldValue(id, value);
                      }}
                      fileText={getFilenameFromUrl(photoFileName || photo)}
                      error={errPhoto}
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
                        member_id: "",
                        designation: "",
                        institution: "",
                        country: "",
                        photo: "",
                        photoFileName: "",
                      },
                    ];
                    setFieldValue("committee_members", [
                      ...values?.committee_members,
                      ...newArray,
                    ]);
                  }}
                  text="Add Committee Member"
                  btnStyle="primary-light"
                  className="h-35 text-14-500 text-nowrap"
                  isSquare
                />
              </div>
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
                text="Done"
                isRounded
                btnStyle="primary-dark"
                className="cps-40 cpe-40"
                onClick={handleSubmit}
                btnLoading={btnLoading}
                disabled={isEqual(values, { committee_members: membersList })}
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};
export default CommitteeMember;
