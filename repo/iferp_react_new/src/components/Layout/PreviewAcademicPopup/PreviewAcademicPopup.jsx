import React, { useState } from "react";
import Modal from "../Modal";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { cloneDeep, isEqual, some } from "lodash";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Location from "components/form/Location";
import DatePicker from "components/form/DatePicker";
import TextArea from "components/form/TextArea";
import {
  addAchievements,
  addAffiliations,
  addJournalRoles,
  addPublication,
  throwError,
} from "store/slices";
import UserCreatable from "components/form/UserCreatable";
import UserDropdown from "components/form/UserDropdown";
import { objectToFormData, trimAllSpace } from "utils/helpers";
import Dropdown from "components/form/Dropdown";

const PreviewAcademicPopup = ({
  onHide,
  data,
  fetchDetails,
  isFieldEmpty,
  setIsFieldEmpty,
  isFieldEmpty2,
  setIsFieldEmpty2,
}) => {
  console.log("isFieldEmpty", isFieldEmpty);
  console.log("isFieldEmpty2", isFieldEmpty2);
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => ({
    userDetails: state.student.userDetails,
  }));
  const { affiliations, current_journal_roles, achievements, publication } =
    data || {};
  const { id, email_id, first_name, last_name } = userDetails;
  const [btnLoading, setBtnLoading] = useState(false);

  let editData = {};
  editData = affiliations?.find((o) => o?.user_id === userDetails?.id);

  const handelSave = async (values) => {
    setBtnLoading(true);
    const payloadOne = {
      id: affiliations?.[0]?.id,
      user_id: affiliations?.[0]?.user_id,
    };
    const payloadTwo = {};
    const payloadThree = {};
    const payloadFour = {};
    let successOne = false;
    let successTwo = false;
    let successThree = false;
    let successFour = false;

    for (const key in values) {
      if (key === "achievements") {
        payloadFour[key] = values[key];
      } else if (key === "journal_roles") {
        payloadThree[key] = values[key];
      } else if (key === "publication") {
        payloadTwo[key] = values[key]?.map((elm) => {
          return {
            ...elm,
            authors_email: elm?.authors ? "" : elm?.authors_email,
          };
        });
      } else {
        payloadOne[key] = values[key];
      }
    }
    if (payloadOne && payloadTwo && payloadThree) {
      const newPayloadOne = objectToFormData(payloadOne);
      const responseOne = await dispatch(addAffiliations(newPayloadOne));
      if (responseOne?.status === 200) {
        successOne = true;
      }

      const responseTwo = await dispatch(
        addPublication(payloadTwo?.publication)
      );
      if (responseTwo?.status === 200) {
        successTwo = true;
      }

      const newPayloadThree = {
        journal_roles: JSON.stringify(payloadThree.journal_roles),
      };
      const responseThree = await dispatch(addJournalRoles(newPayloadThree));
      if (responseThree?.status === 200) {
        successThree = true;
      }

      const newPayloadFour = {
        achievements: JSON.stringify(payloadFour.achievements),
      };
      const responseFour = await dispatch(addAchievements(newPayloadFour));
      if (responseFour?.status === 200) {
        successFour = true;
      }
    }

    if (successOne && successTwo && successThree && successFour) {
      fetchDetails();
      onHide();
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
    institution: Yup.string().required("Institution is required."),
    department: Yup.string().required("Department is required."),
    position: Yup.string().required("Position is required."),
    start_date: Yup.string().required("Start date is required."),
    end_date: Yup.string().required("End date is required."),
    country_id: Yup.string().required("Country is required."),
    // city_id: Yup.string().required("City is required."),
    description: Yup.string()
      .required("Description is required.")
      .max(100, "Maximum 100 character allow for this field."),
    journal_roles: Yup.array(
      Yup.object({
        role: Yup.string().required("Role is required."),
        journals: Yup.string().required("Journals is required."),
      })
    ),
    achievements: Yup.array(
      Yup.object({
        award_name: Yup.string().required("Award name is required."),
        event_name: Yup.string().required("Event is required."),
        date: Yup.string().required("Date is required."),
        category: Yup.string().required("Category is required."),
      })
    ),
  });
  const defaultData = [
    {
      id: "",
      authors: id,
      authors_email: email_id,
      authors_name: `${first_name} ${last_name}`,
      is_email: false,
      paper_title: "",
      no_of_pages: "",
      issn: "",
      publication_link: "",
      co_authors: [],
    },
  ];
  const initialValues = {
    institution: editData?.institution || "",
    department: editData?.department || "",
    position: editData?.position || "",
    start_date: editData?.start_date || "",
    end_date: editData?.end_date || "",
    country_id: editData?.country_id || "",
    city_id: editData?.city_id || "",
    description: editData?.description || "",
    publication:
      publication.length > 0
        ? publication?.map((elm) => {
            return {
              ...elm,
              authors_email:
                elm?.authors_email || elm?.author_details?.email || "",
              authors_name: elm?.author_details?.name || "",
            };
          })
        : defaultData,
    journal_roles: isFieldEmpty
      ? [
          {
            id: "",
            role: "",
            journals: "",
          },
        ]
      : current_journal_roles,
    achievements: isFieldEmpty2
      ? [
          {
            id: "",
            award_name: "",
            event_name: "",
            category: "",
            date: "",
          },
        ]
      : achievements,
  };
  return (
    <Modal onHide={onHide} title={"Academic Details"} width={"100%"}>
      <Formik
        initialValues={initialValues}
        onSubmit={handelSave}
        validationSchema={validationSchema}
      >
        {(props) => {
          const { values, errors, handleChange, handleSubmit, setFieldValue } =
            props;
          const isAddMore = some(
            values?.publication,
            (o) =>
              (!o?.authors && !o?.authors_email) || !o?.paper_title || !o?.issn
          );
          const isAddMoreJournal = some(
            values?.journal_roles,
            (o) => !o?.role || !o?.journals
          );

          const isAddMoreAchivement = some(
            values?.achievements,
            (o) => !o?.award_name || !o?.event_name
          );
          return (
            <form
              className="cmt-22 overflow-x-hidden overflow-y-auto cmb-22 cpe-5"
              style={{ height: "600px" }}
            >
              <div className="row">
                <div className="text-18-500 color-5068 ">
                  Academic Experience
                </div>
                <div className="cmb-22 col-md-6">
                  <TextInput
                    label="Institution*"
                    placeholder="Enter Institution"
                    id="institution"
                    value={values.institution}
                    error={errors.institution}
                    onChange={handleChange}
                  />
                </div>
                <div className="cmb-22 col-md-6">
                  <TextInput
                    label="Department*"
                    placeholder="Enter Department"
                    id="department"
                    value={values.department}
                    error={errors.department}
                    onChange={handleChange}
                  />
                </div>
                <div className="cmb-22 col-md-6">
                  <TextInput
                    label="Position*"
                    placeholder="Enter Position"
                    id="position"
                    value={values.position}
                    error={errors.position}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <Location
                    type="country"
                    data={{
                      id: "country_id",
                      label: "Country*",
                      optionKey: "id",
                      placeholder: "Select Country",
                      value: values.country_id,
                      error: errors.country_id,
                      onChange: handleChange,
                    }}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <DatePicker
                    label="Start Date*"
                    placeholder="Enter Start Date"
                    id="start_date"
                    value={values.start_date}
                    error={errors.start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <DatePicker
                    label="End Date*"
                    placeholder="Enter End Date"
                    id="end_date"
                    value={values.end_date}
                    error={errors.end_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="cmb-22">
                  <TextArea
                    label="Description*"
                    placeholder="Enter your roles & responsibilities"
                    id="description"
                    value={values.description}
                    error={errors.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                {values?.publication?.length > 0 && (
                  <div className="text-18-500 color-5068 cmb-10">
                    Publications
                  </div>
                )}
                {values?.publication?.map((elem, index) => {
                  const {
                    authors,
                    co_authors,
                    paper_title,
                    no_of_pages,
                    issn,
                    publication_link,
                    is_email,
                    authors_email,
                    authors_name,
                  } = elem;
                  const {
                    authors: errAuthors,
                    paper_title: errPaperTitle,
                    issn: errIssn,
                    publication_link: errPublicationLink,
                    authors_email: errEmail,
                  } = errors?.publication?.[index] || {};
                  let existingList = [];
                  if (authors) {
                    existingList = [
                      {
                        id: +authors,
                        name: authors_name || "",
                      },
                    ];
                  }
                  return (
                    <React.Fragment key={index}>
                      <div className="mb-2 text-15-500">
                        Publication {index + 1}
                      </div>
                      <div className="cmb-22 col-md-6">
                        {is_email ? (
                          <TextInput
                            isRequired
                            label="Authors"
                            placeholder="Enter author email for invite"
                            id={`publication[${index}][authors_email]`}
                            onChange={handleChange}
                            value={authors_email}
                            error={errEmail}
                            onBlur={() => {
                              if (!errEmail) {
                                const selectedEmail = authors_email;
                                const isExist = co_authors?.some(
                                  (o) => o.email === selectedEmail
                                );
                                if (isExist) {
                                  dispatch(
                                    throwError({
                                      message:
                                        "Email already exist in co-author.",
                                    })
                                  );
                                  setFieldValue(
                                    `publication[${index}][authors_email]`,
                                    ""
                                  );
                                }
                              }
                            }}
                            handelCancel={() => {
                              let oldData = cloneDeep(values?.publication);
                              oldData[index] = {
                                ...oldData[index],
                                authors: "",
                                authors_email: "",
                                is_email: false,
                              };
                              setFieldValue("publication", oldData);
                            }}
                          />
                        ) : (
                          <UserDropdown
                            isRequired
                            label="Authors"
                            placeholder="Select Author"
                            id={`publication[${index}][authors]`}
                            value={+authors}
                            error={errAuthors}
                            existingList={existingList}
                            onChange={(e) => {
                              const selectedEmail = e?.target?.data?.email_id;
                              const isExist = co_authors?.some(
                                (o) => o.email === selectedEmail
                              );
                              if (isExist) {
                                dispatch(
                                  throwError({
                                    message:
                                      "Author already exist in co-author.",
                                  })
                                );
                              } else {
                                setFieldValue(
                                  `publication[${index}][authors_email]`,
                                  selectedEmail
                                );
                                handleChange(e);
                              }
                            }}
                            handelInvite={(e) => {
                              let oldData = cloneDeep(values?.publication);
                              oldData[index] = {
                                ...oldData[index],
                                authors: "",
                                authors_email: e?.value || "",
                                is_email: true,
                              };
                              setFieldValue("publication", oldData);
                            }}
                          />
                        )}
                      </div>

                      <div className="cmb-22 col-md-6">
                        <UserCreatable
                          label="CO-Authors"
                          placeholder="Select Member Or Enter Email"
                          id={`publication[${index}][co_authors]`}
                          onChange={(e) => {
                            let res = handelAddAuthor(e, elem);
                            if (res?.email) {
                              let oldData = cloneDeep(co_authors);
                              oldData.push({ ...res, id: "" });
                              setFieldValue(
                                `publication[${index}][co_authors]`,
                                oldData
                              );
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
                                      setFieldValue(
                                        `publication[${index}][co_authors]`,
                                        newArry
                                      );
                                    }}
                                  />
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                      <div className="cmb-22 col-md-6">
                        <TextInput
                          label="Paper Title*"
                          placeholder="Enter paper title"
                          id={`publication[${index}][paper_title]`}
                          onChange={handleChange}
                          value={paper_title}
                          error={errPaperTitle}
                        />
                      </div>
                      <div className="cmb-22 col-md-6">
                        <TextInput
                          label="Publication link"
                          placeholder="Enter Publication link"
                          id={`publication[${index}][publication_link]`}
                          onChange={handleChange}
                          value={publication_link}
                          error={errPublicationLink}
                        />
                      </div>
                      <div className="cmb-22 col-md-6">
                        <TextInput
                          label="No. of pages"
                          placeholder="Enter No. of pages"
                          id={`publication[${index}][no_of_pages]`}
                          onChange={handleChange}
                          value={no_of_pages}
                        />
                      </div>
                      <div className="cmb-22 col-md-6">
                        <TextInput
                          label="ISSN/ISBN*"
                          placeholder="Enter ISSN/ISBN"
                          id={`publication[${index}][issn]`}
                          onChange={handleChange}
                          value={issn}
                          error={errIssn}
                        />
                      </div>

                      <div
                        className={`d-flex flex-wrap gap-3 ${
                          values.publication.length - 1 === index
                            ? ""
                            : " cmb-22"
                        }`}
                      >
                        {values.publication.length - 1 === index && (
                          <Button
                            isSquare
                            text="+ Add Another Publication"
                            btnStyle="primary-light"
                            className="h-35 text-14-500 text-nowrap cmb-22"
                            disabled={isAddMore}
                            onClick={() => {
                              setFieldValue("publication", [
                                ...values.publication,
                                ...defaultData,
                              ]);
                            }}
                          />
                        )}
                        {values?.publication.length > 1 && (
                          <Button
                            isSquare
                            text="Delete"
                            btnStyle="primary-gray"
                            icon={<i className="bi bi-trash me-2" />}
                            className="cpt-5 cpb-5 cps-10 cpe-10 h-35"
                            onClick={() => {
                              const listArray = cloneDeep(values?.publication);
                              listArray.splice(index, 1);
                              setFieldValue("publication", listArray);
                            }}
                          />
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}

                {values?.journal_roles?.length > 0 && (
                  <div className="text-18-500 color-5068 cmb-10">
                    Current Journal Roles
                  </div>
                )}

                {values?.journal_roles?.map((elem, index) => {
                  const { role, journals } = elem;
                  const { role: errRole, journals: errJournals } =
                    errors?.journal_roles?.[index] || {};
                  return (
                    <React.Fragment key={index}>
                      <div className="cmb-22 col-md-6">
                        <TextInput
                          label="Role*"
                          placeholder="Enter a role (e.g., Guest Editor)"
                          onChange={handleChange}
                          value={role}
                          error={errRole}
                          id={`journal_roles[${index}][role]`}
                        />
                      </div>
                      <div className="cmb-22 col-md-6">
                        <TextInput
                          label="Journals*"
                          placeholder="Enter Jounal where you have this role"
                          id={`journal_roles[${index}][journals]`}
                          value={journals}
                          error={errJournals}
                          onChange={handleChange}
                        />
                      </div>
                      <div
                        className={`d-flex gap-3 ${
                          values.journal_roles.length - 1 === index
                            ? ""
                            : " cmb-22"
                        }`}
                      >
                        {values.journal_roles.length - 1 === index && (
                          <Button
                            isSquare
                            text="+ Add Another Role"
                            btnStyle="primary-light"
                            className="h-35 text-14-500"
                            disabled={isAddMoreJournal}
                            onClick={() => {
                              setFieldValue("journal_roles", [
                                ...values.journal_roles,
                                { id: "", role: "", journals: "" },
                              ]);
                            }}
                          />
                        )}
                        {values?.journal_roles.length > 1 && (
                          <Button
                            isSquare
                            text="Delete"
                            btnStyle="delete-outline"
                            icon={<i className="bi bi-trash me-2" />}
                            className="cpt-5 cpb-5 cps-10 cpe-10"
                            onClick={() => {
                              const listArray = cloneDeep(
                                values?.journal_roles
                              );
                              listArray.splice(index, 1);
                              setFieldValue("journal_roles", listArray);
                            }}
                          />
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}

                {values?.achievements?.length > 0 && (
                  <div className="text-18-500 color-5068 cmb-10 cmt-22">
                    Achievements
                  </div>
                )}
                {values?.achievements?.map((elem, index) => {
                  const { award_name, event_name, date, category } = elem;
                  const {
                    award_name: errAward,
                    event_name: errEvent,
                    date: errDate,
                    category: errCategory,
                  } = errors?.achievements?.[index] || {};
                  return (
                    <React.Fragment key={index}>
                      <div className="col-md-6 cmb-22">
                        <TextInput
                          label="Award/Certificate Name*"
                          placeholder="Enter Award/Certificate Name"
                          onChange={handleChange}
                          value={award_name}
                          error={errAward}
                          id={`achievements[${index}][award_name]`}
                        />
                      </div>
                      <div className="col-md-6 cmb-22">
                        <TextInput
                          label="Event Name*"
                          placeholder="Enter Event Name"
                          id={`achievements[${index}][event_name]`}
                          value={event_name}
                          error={errEvent}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 cmb-22">
                        <Dropdown
                          label="Category*"
                          placeholder="Select Category"
                          id={`achievements[${index}][category]`}
                          options={[
                            {
                              id: "Honor",
                              label: "Honor",
                            },
                            {
                              id: "Elected",
                              label: "Elected",
                            },
                          ]}
                          value={category}
                          error={errCategory}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 cmb-22">
                        <DatePicker
                          label="Date*"
                          placeholder="Select Date"
                          id={`achievements[${index}][date]`}
                          value={date}
                          error={errDate}
                          onChange={handleChange}
                        />
                      </div>
                      <div
                        className={`d-flex gap-3 ${
                          values.achievements.length - 1 === index
                            ? ""
                            : " cmb-22"
                        }`}
                      >
                        {values.achievements.length - 1 === index && (
                          <Button
                            isSquare
                            text="+ Add Another Award"
                            btnStyle="primary-light"
                            className="h-35 text-14-500"
                            disabled={isAddMoreAchivement}
                            onClick={() => {
                              setFieldValue("achievements", [
                                ...values.achievements,
                                {
                                  id: "",
                                  award_name: "",
                                  event_name: "",
                                  date: "",
                                  category: "",
                                },
                              ]);
                            }}
                          />
                        )}
                        {values?.achievements.length > 1 && (
                          <Button
                            isSquare
                            text="Delete"
                            btnStyle="primary-gray"
                            icon={<i className="bi bi-trash me-2" />}
                            className="cpt-5 cpb-5 cps-10 cpe-10 h-35"
                            onClick={() => {
                              const listArray = cloneDeep(values?.achievements);
                              listArray.splice(index, 1);
                              setFieldValue("achievements", listArray);
                            }}
                          />
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}

                <div className="d-flex justify-content-center gap-4 cmt-40">
                  <Button
                    isRounded
                    text="Cancel"
                    btnStyle="light-outline"
                    className="cps-40 cpe-40"
                    onClick={onHide}
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
    </Modal>
  );
};

export default PreviewAcademicPopup;
