import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { isEqual, omit } from "lodash";
import { Formik } from "formik";
import Label from "components/form/Label";
import FileUpload from "components/form/FileUpload";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import Dropdown from "components/form/Dropdown";
import Card from "components/Layout/Card";
import { awardTypeOptions, icons } from "utils/constants";
import {
  getDataFromLocalStorage,
  getFilenameFromUrl,
  objectToFormData,
} from "utils/helpers";
import {
  addNominateUser,
  setApiError,
  setIsPremiumPopup,
  getNonNominatedUsers,
} from "store/slices";

const guidLine = [
  "A sustained level of contribution over time, with clear impact that extends well beyond his/her own organization",
  "At least 5 years of professional IFERP membership in the last 10 years (to verify membership eligibility, contact helpdesk@iferp.in)",
  "Professional members of ACM at the time of nomination",
  "Senior enough - and collectively representative enough - to make a credible case as to why the candidate's impact merits such a high level of recognition",
  "Familiarize with the Committee on Publication Ethics (COPE) ‘Code of Conduct and Best Practice Guidelines for Journal Editors’",
];
const NominateForAward = () => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const userData = getDataFromLocalStorage();
  const {
    id,
    first_name,
    last_name,
    user_type,
    email_id,
    phone_number,
    member_id,
    membership_plan_id,
    membership_details = {},
    educational_details = {},
  } = userData;
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
  const [type, setType] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);
  const [userListLoading, setUserListLoading] = useState(false);
  const [userList, setUserList] = useState([]);

  const getUserList = async () => {
    setUserListLoading(true);
    const response = await dispatch(getNonNominatedUsers());
    let list = response?.data || [];
    setUserList(list);
    setUserListLoading(false);
  };
  const handelSave = async (values) => {
    if (`${membership_plan_id}` === "2") {
      dispatch(setIsPremiumPopup(true));
      return;
    }
    setBtnLoading(true);
    let payloadObject = omit(values, ["data", "cvFileName"]);
    let forData = objectToFormData({
      ...payloadObject,
    });
    const response = await dispatch(addNominateUser(forData));
    if (response?.status === 200) {
      dispatch(
        setApiError({
          show: true,
          message: "User Add For Nominate IFERP Awards Successfully.",
          type: "success",
        })
      );
      if (formRef.current) {
        formRef.current.resetForm();
      }
      getUserList();
    }
    setBtnLoading(false);
  };

  useEffect(() => {
    if (user_type === "5") {
      setUserList([]);
    } else {
      getUserList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object().shape({
    award_category: Yup.string().required("Award category is required."),
    user_id: Yup.string().required("User is required."),
    cv_file: Yup.string().required("CV file is required."),
  });

  const initialValues = {
    award_category: "",
    user_id: id || "",
    data: {
      member_id: member_id || "",
      member_type: membership_details?.plan_name || "",
      email_id: email_id || "",
      phone_number: phone_number || "",
      institution: institution || "",
      university: university || "",
      department: department || "",
      course: course || "",
    },
    cv_file: "",
    cvFileName: "",
  };
  const access = {
    isUserSelection: false,
  };
  return (
    <Card className="cps-40 cpe-40 cpt-40 cpb-40">
      <div className="position-relative">
        {type === 1 && (
          <span
            className="d-flex position-absolute start-0"
            onClick={() => {
              setType(0);
            }}
          >
            <img
              src={icons.leftArrow}
              alt="back"
              className="h-21 me-3 pointer"
            />
          </span>
        )}
        <div className="text-26-500 color-title-navy font-poppins text-center">
          Nomination For IFERP Awards
        </div>
        <div className="text-14-400 text-center mt-3 color-subtitle-navy">
          As a premium IFERP member you qualify to nomiante a deserving <br />
          premium professional candidate
        </div>
      </div>

      {type === 0 ? (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          innerRef={formRef}
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
              <form className="row cmt-40">
                <div className="col-md-3 d-flex align-items-center">
                  <Label label="Award Category" required />
                </div>
                <div className="col-md-6">
                  <Dropdown
                    id="award_category"
                    placeholder="Select Award Category"
                    options={awardTypeOptions}
                    optionKey="value"
                    optionValue="value"
                    value={values.award_category}
                    error={errors.award_category}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3" />
                <div className="col-md-3" />
                <div className="col-md-6 cmb-42">
                  <div className="text-15-400 color-subtitle-navy mt-2">
                    know more about the{" "}
                    <span
                      className="color-new-car pointer"
                      onClick={() => {
                        setType(1);
                      }}
                    >
                      Nomination Guidelines
                    </span>
                  </div>
                </div>
                <div className="col-md-3" />
                <div className="text-20-400 color-title-navy font-poppins cmb-26">
                  {"Nominee’s Information"}
                </div>
                <div className="col-md-6 cmb-22">
                  {access.isUserSelection ? (
                    <Dropdown
                      placeholder="Select User"
                      id="user_id"
                      options={userList}
                      optionKey="id"
                      optionValue="name"
                      isLoading={userListLoading}
                      onChange={(e) => {
                        const data = e.target.data;
                        handleChange({
                          target: {
                            id: "data",
                            value: data,
                          },
                        });
                        handleChange(e);
                      }}
                      value={values.user_id}
                      error={errors?.user_id}
                    />
                  ) : (
                    <TextInput
                      value={`${first_name} ${last_name}`}
                      onChange={() => {}}
                      disabled
                    />
                  )}
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    value={
                      values?.data?.member_id
                        ? `${values?.data?.member_id} - ${values?.data?.member_type}`
                        : values?.data?.member_type || ""
                    }
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    value={values?.data?.email_id || ""}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    value={values?.data?.phone_number || ""}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    value={values?.data?.course}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    value={values?.data?.department}
                    onChange={() => {}}
                    disabled
                  />
                </div>

                <div className="col-md-6 cmb-22">
                  <TextInput
                    value={values?.data?.university}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    value={values?.data?.institution}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    value={values?.data?.department}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <FileUpload
                    id="cv_file"
                    onChange={(e) => {
                      const id = e.target.id;
                      const value = e.target.value;
                      const fileName = e.target.fileName;
                      setFieldValue("cvFileName", fileName);
                      setFieldValue(id, value);
                    }}
                    fileText={getFilenameFromUrl(
                      values?.cvFileName || values.cv_file || "CV"
                    )}
                    error={errors?.cv_file}
                  />
                </div>
                <div className="d-flex justify-content-center gap-4 mt-3">
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
      ) : (
        <div className="cmt-40">
          {guidLine.map((elem, index) => {
            return (
              <div key={index} className="d-flex cmb-20">
                <div className="d-flex me-3 align-items-start pt-1">
                  <img src={icons.checkCircle} alt="right" />
                </div>
                <div className="text-14-400 color-raisin-black">{elem}</div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
export default NominateForAward;
