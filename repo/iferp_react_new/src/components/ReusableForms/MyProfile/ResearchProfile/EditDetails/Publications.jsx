import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { cloneDeep, isEqual, some } from "lodash";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import UserDropdown from "components/form/UserDropdown";
import { addPublication, throwError } from "store/slices";
import { getDataFromLocalStorage, trimAllSpace } from "utils/helpers";
import UserCreatable from "components/form/UserCreatable";

const Publications = ({ onHide, getProfileData }) => {
  const dispatch = useDispatch();
  const { researchProfile } = useSelector((state) => ({
    researchProfile: state.student.researchProfile,
  }));
  const { id, email_id, first_name, last_name } =
    getDataFromLocalStorage() || {};
  const { publication } = researchProfile || {};
  const [btnLoading, setBtnLoading] = useState(false);
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
  const handelSave = async (values) => {
    setBtnLoading(true);
    const payload = values?.publication?.map((elm) => {
      return { ...elm, authors_email: elm.authors ? "" : elm.authors_email };
    });
    const response = await dispatch(addPublication(payload));
    if (response?.status === 200) {
      getProfileData();
      onHide();
    }
    setBtnLoading(false);
  };
  const validationSchema = Yup.object().shape({
    publication: Yup.array(
      Yup.object({
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
        issn: Yup.string().required("ISSN/ISBN is required."),
        publication_link: Yup.string().url("Enter valid url."),
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
    publication:
      publication.length > 0
        ? publication?.map((elm) => {
            return {
              ...elm,
              authors_email:
                elm?.authors_email || elm?.author_details?.email || "",
            };
          })
        : defaultData,
  };
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handelSave}
      validationSchema={validationSchema}
    >
      {(props) => {
        const { values, errors, handleChange, setFieldValue, handleSubmit } =
          props;
        const isAddMore = some(
          values.publication,
          (o) => (!o.authors && !o.authors_email) || !o.paper_title || !o.issn
        );
        return (
          <form>
            <div className="row">
              {values.publication.map((elem, index) => {
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
                    <div className="cmb-22">
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
                          value={authors}
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
                                  message: "Author already exist in co-author.",
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

                    <div className="cmb-22">
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
                    <div className="cmb-22">
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
                    <div className="cmb-22">
                      <TextInput
                        label="Publication link"
                        placeholder="Enter Publication link"
                        id={`publication[${index}][publication_link]`}
                        onChange={handleChange}
                        value={publication_link}
                        error={errPublicationLink}
                      />
                    </div>
                    <div
                      className={`d-flex flex-wrap gap-3 ${
                        values.publication.length - 1 === index ? "" : " cmb-22"
                      }`}
                    >
                      {values.publication.length - 1 === index && (
                        <Button
                          isSquare
                          text="+ Add Another Publication"
                          btnStyle="primary-light"
                          className="h-35 text-14-500 text-nowrap"
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
                  disabled={isEqual(values, initialValues) || isAddMore}
                />
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};
export default Publications;
