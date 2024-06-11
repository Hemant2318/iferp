import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { cloneDeep, isEqual } from "lodash";
import { Formik } from "formik";
import Label from "components/form/Label";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import CheckBox from "components/form/CheckBox";
import TextArea from "components/form/TextArea";
import TextInput from "components/form/TextInput";
import FileUpload from "components/form/FileUpload";
import Card from "components/Layout/Card";
import SuccessPopup from "components/Layout/SuccessPopup";
import Location from "components/form/Location";
import UserDropdown from "components/form/UserDropdown";
import UserCreatable from "components/form/UserCreatable";
import { eventMode, icons } from "utils/constants";
import {
  addEventSubmitAbstract,
  fetchUserEventDetails,
  throwError,
} from "store/slices";
import {
  convertString,
  getDataFromLocalStorage,
  getEventDate,
  getFilenameFromUrl,
  objectToFormData,
  trimAllSpace,
} from "utils/helpers";

const AbstractSubmission = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { eventData } = useSelector((state) => ({
    eventData: state.global.eventData,
  }));
  const [isSuccess, setIsSuccess] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchEventDetails = async () => {
    await dispatch(
      fetchUserEventDetails({
        event_id: params?.eventId,
        user_id: getDataFromLocalStorage("id"),
      })
    );
  };

  useEffect(() => {
    fetchEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handelSave = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      ...values,
      event_id: params?.eventId,
      user_id: getDataFromLocalStorage("id"),
      co_authors: JSON.stringify(values.co_authors),
    });
    const response = await dispatch(addEventSubmitAbstract(forData));
    if (response?.status === 200) {
      setIsSuccess(true);
    }
    setBtnLoading(false);
  };
  const handelAddAuthor = (e, data) => {
    const { co_authors, authors_email } = data;
    let email = "";
    let name = "";
    if (e?.target?.isCreate) {
      email = trimAllSpace(e?.target?.value);
    } else {
      email = trimAllSpace(e?.target?.data?.email_id);
      name = e?.target?.data?.name;
    }
    const isValidEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
    if (!isValidEmail) {
      dispatch(throwError({ message: "Please enter valid email" }));
      return;
    }
    if (authors_email === email) {
      dispatch(
        throwError({ message: "Author email cannot add as co-author." })
      );
      return;
    }
    if (co_authors?.find((o) => o.email === email)) {
      dispatch(throwError({ message: "This email already exist in list." }));
      return;
    }
    return { email, name };
  };
  const validationSchema = Yup.object().shape({
    // author_name: Yup.string().required("Author name is required."),
    // co_author_name: Yup.string().required("Co-Author name is required."),
    authors: Yup.lazy((_, obj) => {
      const { is_email } = obj?.parent;
      if (is_email) {
        return Yup.string();
      } else {
        return Yup.string().required("Author is required.");
      }
    }),
    authors_email: Yup.lazy((_, obj) => {
      const { is_email } = obj?.parent;
      if (is_email) {
        return Yup.string()
          .required("Author email is required.")
          .email("Email must be a valid email");
      } else {
        return Yup.string();
      }
    }),
    paper_title: Yup.string().required("Paper title is required."),
    email_id: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required."),
    contact_number: Yup.string()
      .required("Contact number is required.")
      .min(10, "Phone number must be 10 digit.")
      .max(10, "Phone number must be 10 digit."),
    whatsapp_number: Yup.string()
      .min(10, "Phone number must be 10 digit.")
      .max(10, "Phone number must be 10 digit."),
    submission_type: Yup.string().required("Select any submission type."),
    abstract_path: Yup.string().required("File is required."),
    presentation_type: Yup.string().required("Presentation type is required."),
    comments: Yup.string().max(
      100,
      "Maximum 100 character allow for this field."
    ),
  });
  const initialValues = {
    authors: "",
    authors_email: "",
    is_email: "",
    co_authors: [],
    author_name: "",
    co_author_name: "",
    email_id: "",
    contact_number: "",
    whatsapp_number: "",
    country: "",
    submission_type: "",
    presentation_type: "",
    source: "",
    comments: "",
    abstract_path: "",
    abstractPathFileName: "",
    paper_title: "",
  };
  const { event_name, start_date, end_date } = eventData;
  const educationalDetails = getDataFromLocalStorage("educational_details");
  const {
    phd_university_name,
    phd_department_name,
    phd_course_name,
    pg_university_name,
    pg_department_name,
    pg_course_name,
    ug_university_name,
    ug_department_name,
    ug_course_name,
  } = educationalDetails;

  const university =
    phd_university_name || pg_university_name || ug_university_name;
  const department =
    phd_department_name || pg_department_name || ug_department_name;
  const course = phd_course_name || pg_course_name || ug_course_name;

  return (
    <Card className="cps-40 cpe-40 cpt-40 cpb-40">
      {isSuccess && (
        <SuccessPopup
          title="Abstract Submitted Successfully"
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
              <span className="test-16-500 color-new-car">$30</span>
            </div>
            <div>Looking forward to meet you at the Conference</div>
          </div>
        </SuccessPopup>
      )}
      <div className="d-flex center-flex position-relative">
        <span
          className="d-flex position-absolute start-0"
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <div className="text-26-500 color-black-olive">Abstract Submission</div>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handelSave}
        validationSchema={validationSchema}
      >
        {(props) => {
          const {
            values,
            errors,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
            setValues,
          } = props;
          const { authors_email, authors, is_email, co_authors } = values;
          const { authors_email: err_authors_email, authors: err_authors } =
            errors;

          return (
            <form className="row cmt-40">
              <div className="cmb-22">
                {is_email ? (
                  <TextInput
                    isRequired
                    label="Author"
                    placeholder="Enter author email"
                    id="authors_email"
                    onChange={handleChange}
                    value={authors_email}
                    error={err_authors_email}
                    onBlur={() => {
                      if (!err_authors_email) {
                        const selectedEmail = authors_email;
                        const isExist = co_authors?.some(
                          (o) => o.email === selectedEmail
                        );
                        if (isExist) {
                          dispatch(
                            throwError({
                              message: "Email already exist in co-author.",
                            })
                          );
                          setFieldValue("authors_email", "");
                        }
                      }
                    }}
                    handelCancel={() => {
                      setValues({
                        ...values,
                        authors: "",
                        authors_email: "",
                        is_email: false,
                      });
                    }}
                  />
                ) : (
                  <UserDropdown
                    isRequired
                    showOnSearch
                    label="Author"
                    placeholder="Enter author email"
                    id="authors"
                    value={authors}
                    error={err_authors}
                    existingList={[]}
                    onChange={(e) => {
                      const {
                        email_id: selectedEmail,
                        country_id,
                        mobile_number,
                      } = e?.target?.data;
                      const isExist = co_authors?.some(
                        (o) => o.email === selectedEmail
                      );
                      if (isExist) {
                        dispatch(
                          throwError({
                            message: "Author already exist in co-author.",
                          })
                        );
                      } else {
                        setValues({
                          ...values,
                          authors_email: selectedEmail || "",
                          email_id: selectedEmail || "",
                          contact_number: mobile_number || "",
                          whatsapp_number: mobile_number || "",
                          country: country_id || "",
                        });
                        handleChange(e);
                      }
                    }}
                    handelInvite={(e) => {
                      setValues({
                        ...values,
                        authors: "",
                        authors_email: e?.value || "",
                        is_email: true,
                      });
                    }}
                  />
                )}
              </div>
              <div className="cmb-22">
                <UserCreatable
                  showOnSearch
                  label="Co Authors"
                  placeholder="Enter co-auther email"
                  id="co_authors"
                  onChange={(e) => {
                    let res = handelAddAuthor(e, values);
                    if (res?.email) {
                      let oldData = cloneDeep(co_authors);
                      oldData.push({ ...res, id: e?.target?.data?.id || "" });
                      setFieldValue("co_authors", oldData);
                    }
                  }}
                />
              </div>
              {co_authors?.length > 0 && (
                <div className="cmb-22 d-flex flex-wrap gap-2">
                  {co_authors?.map((elm, cindex) => {
                    return (
                      <span
                        key={cindex}
                        className="d-flex align-items-center gap-1 border p-1 ps-2 pe-2 w-fit"
                      >
                        <span className="text-14-500">
                          {elm.name || elm.email}
                        </span>
                        <span className="ms-2">
                          <i
                            className="bi bi-trash-fill text-danger pointer"
                            onClick={() => {
                              let oldData = cloneDeep(co_authors);
                              let newArry = oldData.filter(
                                (_, i) => i !== cindex
                              );
                              setFieldValue("co_authors", newArry);
                            }}
                          />
                        </span>
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Email ID*"
                  id="email_id"
                  onChange={(e) => {
                    handleChange(convertString(1, e));
                  }}
                  value={values.email_id}
                  error={errors.email_id}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Contact Number*"
                  id="contact_number"
                  onChange={handleChange}
                  value={values.contact_number}
                  error={errors.contact_number}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput
                  placeholder="Whatsapp Number"
                  id="whatsapp_number"
                  onChange={handleChange}
                  value={values.whatsapp_number}
                  error={errors.whatsapp_number}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <Location
                  type="country"
                  data={{
                    id: "country",
                    placeholder: "Select Country",
                    value: values.country,
                    onChange: handleChange,
                  }}
                />
              </div>
              <div className="cmb-22">
                <TextInput value={event_name} disabled />
              </div>

              <div className="col-md-6 cmb-22">
                <TextInput
                  value={getEventDate(start_date, end_date)}
                  disabled
                />
              </div>

              <div className="col-md-6 cmb-22">
                <TextInput value={university} disabled />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput value={course} disabled />
              </div>
              <div className="col-md-6 cmb-22">
                <TextInput value={department} disabled />
              </div>
              <div className="d-flex gap-3">
                <div className="mb-2 d-flex align-items-center gap-3">
                  <Label label="Submission Type*" />
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <CheckBox
                      type="ACTIVE"
                      onClick={() => {
                        setFieldValue("submission_type", "Abstract Submission");
                      }}
                      isChecked={
                        values.submission_type === "Abstract Submission"
                      }
                    />
                    <div className="text-16-400 color-raisin-black ms-3">
                      Abstract Submission
                    </div>
                  </div>
                  <div className="d-flex align-items-center ms-5">
                    <CheckBox
                      type="ACTIVE"
                      onClick={() => {
                        setFieldValue(
                          "submission_type",
                          "Full Paper Submission"
                        );
                      }}
                      isChecked={
                        values.submission_type === "Full Paper Submission"
                      }
                    />
                    <div className="text-16-400 color-raisin-black ms-3">
                      Full Paper Submission
                    </div>
                  </div>
                </div>
              </div>
              <div className="cmb-22">
                {errors?.submission_type && (
                  <span style={{ color: "red" }} className="text-12-400">
                    {errors?.submission_type}
                  </span>
                )}
              </div>
              <div className="cmb-22">
                <TextInput
                  placeholder="Paper Title"
                  id="paper_title"
                  onChange={handleChange}
                  value={values?.paper_title}
                  error={errors?.paper_title}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <Dropdown
                  id="presentation_type"
                  placeholder="Select Presentation Type"
                  options={eventMode}
                  optionKey="value"
                  optionValue="value"
                  onChange={handleChange}
                  value={values.presentation_type}
                  error={errors?.presentation_type}
                />
              </div>
              <div className="cmb-22 col-md-6">
                <TextInput
                  placeholder="How did you get to know about the conference?"
                  id="source"
                  onChange={handleChange}
                  value={values.source}
                  error={errors.source}
                />
              </div>

              <div className="cmb-22">
                <TextArea
                  placeholder="Comments"
                  id="comments"
                  onChange={handleChange}
                  value={values.comments}
                  error={errors.comments}
                  rows={3}
                />
              </div>
              <div className="col-md-6 cmb-22">
                <FileUpload
                  id="abstract_path"
                  onChange={(e) => {
                    const id = e.target.id;
                    const value = e.target.value;
                    const fileName = e.target.fileName;
                    setFieldValue("abstractPathFileName", fileName);
                    setFieldValue(id, value);
                  }}
                  fileText={getFilenameFromUrl(
                    values?.abstractPathFileName || values.abstract_path
                  )}
                  error={errors?.abstract_path}
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
    </Card>
  );
};
export default AbstractSubmission;
