import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep, isEqual, map, omit, union, unionBy } from "lodash";
import * as Yup from "yup";
import { Formik } from "formik";
import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import FileUpload from "components/form/FileUpload";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import DatePicker from "components/form/DatePicker";
import CheckBox from "components/form/CheckBox";
import UserCreatable from "components/form/UserCreatable";
import CreatableDropdown from "components/form/CreatableDropdown";
import UserDropdown from "components/form/UserDropdown";

import {
  getDataFromLocalStorage,
  getFilenameFromUrl,
  objectToFormData,
  titleCaseString,
  trimAllSpace,
} from "utils/helpers";
import {
  createPost,
  fetchPostSubCategories,
  storePostList,
  throwError,
  getKeywords,
  getTopics,
  getPastEvent,
} from "store/slices";
import { postAs } from "utils/constants";
import DOIDetails from "./DOIDetails";

const PostDetails = ({
  editData = {},
  onHide,
  postTitle,
  postCategory,
  handelSuccess,
  type,
}) => {
  const dispatch = useDispatch();
  const { postCategoryList, postList } = useSelector((state) => ({
    postCategoryList: state.global.postCategoryList,
    postList: state.global.postList,
  }));
  const [btnLoading, setBtnLoading] = useState(false);
  const [postSubCategoryList, setPostSubCategoryList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [isDOI, setIsDOI] = useState(false);
  const [keywordsList, setKeywordsList] = useState({
    existing: [],
    custom: [],
  });
  const [topicsList, setTopicsList] = useState({
    existing: [],
    custom: [],
  });
  const {
    id: userID,
    first_name,
    last_name,
    user_type,
    email_id,
  } = getDataFromLocalStorage() || {};
  const isAdmin = user_type === "0";
  const {
    id,
    category_id,
    sub_category_id,
    post,
    title,
    authors,
    post_as,
    date,
    doi,
    additional_details,
    co_authors,
    author_details,
    keywords,
    topics,
    event_id,
    presentation_link,
    paper_text,
    thumbnail,
    pdf_data,
  } = editData || {};
  const existingList = author_details?.user_id
    ? [{ ...author_details, id: +author_details?.user_id }]
    : [
        {
          id: userID,
          name: `${first_name} ${last_name}`,
          email: email_id,
          email_id: email_id,
        },
      ];

  let coAuthorsList = co_authors?.length > 0 ? co_authors : [];
  let isAccessPrasantation = event_id ? true : false;
  const [postData, setPostData] = useState({
    category_id: category_id || postCategory,
    sub_category_id: sub_category_id || "",
    post: post || "",
    fileName: getFilenameFromUrl(post) || "",
    title: title || postTitle,
    authors: authors || `${first_name} ${last_name}`,
    post_as: post_as || "",
    date: date || "",
    doi: doi || "",
    coAuthors: coAuthorsList || [],
    isAgree: false,
    is_email: author_details?.author_email ? true : false,
    author_id: author_details?.user_id || userID || "",
    author_email: author_details?.author_email || "",
    keywords: keywords || "",
    topics: topics || "",
    event_id: event_id || "",
    presentation_link: "",
    presentation_link_name: getFilenameFromUrl(presentation_link),
    paper_text: "",
    paper_text_name: getFilenameFromUrl(paper_text),
    thumbnail: "",
    thumbnail_name: getFilenameFromUrl(thumbnail),
    pdf_data: pdf_data || "",
  });
  const handelUpdatePost = async (values) => {
    setBtnLoading(true);
    let coAuthors =
      values?.coAuthors.length > 0
        ? map(values?.coAuthors, (o) => {
            return o.email;
          })?.toString()
        : "";
    let objectData = omit(
      {
        ...values,
        author_id: userID,
        co_authors: coAuthors,
        user_id: getDataFromLocalStorage("id"),
      },
      ["fileName", "coAuthors"]
    );
    if (values) {
      objectData = { ...objectData, ...values };
    }
    if (id) {
      objectData = { ...objectData, post_id: id };
    }
    const response = await dispatch(createPost(objectToFormData(objectData)));
    if (response?.status === 200) {
      if (id) {
        const newList = postList.map((elem) => {
          if (elem.id === id) {
            elem = response?.data;
          }
          return elem;
        });
        dispatch(storePostList(newList));
      }
      handelSuccess();
    }
    setBtnLoading(false);
  };
  const getPostSubCategory = async (id) => {
    const response = await dispatch(
      fetchPostSubCategories(objectToFormData({ id: id }))
    );
    setPostSubCategoryList(response?.data || []);
  };
  const handelAddAuthor = (e, oldList, author_email = "") => {
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
    if (
      getDataFromLocalStorage("email_id") === email ||
      author_email === email
    ) {
      dispatch(
        throwError({ message: "Author email cannot add as co-author." })
      );
      return;
    }
    if (oldList?.find((o) => o.email === email)) {
      dispatch(throwError({ message: "This email already exist." }));
      return;
    }

    return { email, name };
  };
  const fetchKeywords = async () => {
    const response = await dispatch(getKeywords());
    let listArray = response?.data || [];
    setKeywordsList((prev) => {
      return {
        ...prev,
        existing: map(listArray, (elm) => {
          return { id: elm.keywords, label: elm.keywords };
        }),
      };
    });
  };
  const fetchTopics = async () => {
    const response = await dispatch(getTopics());
    let listArray = response?.data || [];
    setTopicsList((prev) => {
      return {
        ...prev,
        existing: map(listArray, (elm) => {
          return { id: elm.topics.trim(), label: elm.topics.trim() };
        }),
      };
    });
  };
  const fetchEvents = async () => {
    // const payload = objectToFormData({ date: moment().format("YYYY-MM-DD") });
    const response = await dispatch(getPastEvent());
    setEventList(response?.data?.event || []);
  };
  useEffect(() => {
    fetchKeywords();
    fetchTopics();
    if (isAdmin) {
      fetchEvents();
    }
    if (postCategory || category_id) {
      getPostSubCategory(postCategory || category_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required."),
    post_as: Yup.string().required("Post as is required."),
    post: Yup.lazy((_, obj) => {
      if (isAdmin && +obj?.parent?.author_id !== userID) {
        return Yup.string();
      } else {
        return Yup.string().required("Post is required.");
      }
    }),
    authors: Yup.lazy(() => {
      if (isAdmin) {
        return Yup.string();
      } else {
        return Yup.string().required("Author is required.");
      }
    }),
    event_id: Yup.lazy((_, obj) => {
      if (isAdmin && +obj?.parent?.author_id !== userID) {
        return Yup.string().required("Event is required.");
      } else {
        return Yup.string();
      }
    }),
    author_id: Yup.lazy((_, obj) => {
      const { is_email } = obj?.parent;
      if (isAdmin && !is_email) {
        return Yup.string().required("Author is required.");
      } else {
        return Yup.string();
      }
    }),
    author_email: Yup.lazy((_, obj) => {
      const { is_email } = obj?.parent;
      if (isAdmin && is_email) {
        return Yup.string()
          .required("Author email is required.")
          .email("Email must be a valid email");
      } else {
        return Yup.string();
      }
    }),
  });
  const isSubCategory = postSubCategoryList.length > 0;
  return (
    <>
      {isDOI ? (
        <DOIDetails
          isAdmin={isAdmin}
          isAbstarctRequired={+userID !== postData?.author_id}
          type={type}
          editData={editData}
          postData={postData}
          handelSuccess={() => {
            setIsDOI(false);
            handelSuccess();
          }}
          onHide={() => {
            setIsDOI(false);
          }}
        />
      ) : (
        <Modal onHide={onHide} title={id ? "Edit Post" : "Create New Post"}>
          <div className="cmt-34 cmb-22 cms-16 cme-16">
            <Formik
              enableReinitialize
              initialValues={postData}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                if (!id || additional_details) {
                  setPostData(values);
                  setIsDOI(true);
                } else {
                  handelUpdatePost(values);
                }
              }}
            >
              {(props) => {
                const {
                  values,
                  errors,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                } = props;
                const {
                  category_id,
                  sub_category_id,
                  title,
                  fileName,
                  post_as,
                  coAuthors,
                  is_email,
                  author_id,
                  author_email,
                  authors,
                  date,
                  doi,
                  keywords,
                  topics,
                  event_id,
                  presentation_link_name,
                  // paper_text_name,
                  thumbnail_name,
                } = values;
                const {
                  sub_category_id: err_sub_category_id,
                  post: err_post,
                  title: err_title,
                  post_as: err_post_as,
                  author_id: err_author_id,
                  author_email: err_author_email,
                  date: err_date,
                  doi: err_doi,
                  keywords: err_keywords,
                  topics: err_topics,
                  event_id: err_event_id,
                } = errors;
                return (
                  <form className="row">
                    <div
                      className={
                        isSubCategory ? "col-md-6 col-12 cmb-22" : "cmb-22"
                      }
                    >
                      <Dropdown
                        isRequired
                        label="Post Category"
                        placeholder="Select Category"
                        options={postCategoryList}
                        value={category_id}
                        optionValue="name"
                        disabled
                      />
                    </div>
                    {isSubCategory && (
                      <div className="col-md-6 col-12 cmb-22">
                        <Dropdown
                          label="Post Sub Category"
                          id="sub_category_id"
                          placeholder="Select Sub Category"
                          options={postSubCategoryList}
                          value={sub_category_id}
                          error={err_sub_category_id}
                          optionValue="name"
                          onChange={handleChange}
                        />
                      </div>
                    )}
                    <div className="col-md-6 col-12 cmb-22">
                      <FileUpload
                        isRequired={+userID === author_id}
                        id="post"
                        label="Post/Full Paper"
                        error={err_post}
                        fileText={getFilenameFromUrl(fileName || "Upload file")}
                        onChange={async (e) => {
                          const fileName = e.target.fileName;
                          setFieldValue("fileName", fileName);
                          handleChange(e);
                        }}
                        acceptType={[
                          "jpg",
                          "jpeg",
                          "png",
                          "pdf",
                          "doc",
                          "msword",
                          "csv",
                        ]}
                      />
                    </div>

                    <div className="col-md-6 col-12 cmb-12">
                      <Dropdown
                        isRequired
                        id="post_as"
                        label="Post As"
                        placeholder="Select Post As"
                        options={postAs}
                        value={post_as}
                        error={err_post_as}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 col-12 cmb-22">
                      <TextInput
                        isRequired
                        id="title"
                        label="Post Title"
                        placeholder="Enter post title"
                        onChange={handleChange}
                        error={err_title}
                        value={title}
                      />
                    </div>
                    <div className="col-md-6 col-12 cmb-22">
                      {isAdmin ? (
                        is_email ? (
                          <TextInput
                            isRequired
                            id="author_email"
                            label="Add Authors"
                            placeholder="Enter author email for invite"
                            onChange={handleChange}
                            value={author_email}
                            error={err_author_email}
                            onBlur={() => {
                              if (!errors?.author_email) {
                                const selectedEmail = author_email;
                                const isExist = coAuthors?.some(
                                  (o) => o.email === selectedEmail
                                );
                                if (isExist) {
                                  dispatch(
                                    throwError({
                                      message:
                                        "Email already exist in co-author.",
                                    })
                                  );
                                  setFieldValue("author_email", "");
                                }
                              }
                            }}
                            handelCancel={() => {
                              setFieldValue("author_id", "");
                              setFieldValue("is_email", false);
                              setFieldValue("author_email", "");
                            }}
                          />
                        ) : (
                          <UserDropdown
                            isRequired
                            id="author_id"
                            label="Add Authors"
                            placeholder="Select Author"
                            value={author_id}
                            error={err_author_id}
                            existingList={existingList}
                            onChange={(e) => {
                              let changeData = e?.target?.data;
                              const selectedEmail = changeData?.email_id;
                              const isExist = coAuthors?.some(
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
                                setFieldValue("author_email", selectedEmail);
                                handleChange(e);
                              }
                            }}
                            handelInvite={(e) => {
                              setFieldValue("author_id", "");
                              setFieldValue("is_email", true);
                              setFieldValue("author_email", e?.value || "");
                            }}
                          />
                        )
                      ) : (
                        <TextInput
                          isRequired
                          disabled
                          id="authors"
                          label="Add Authors"
                          placeholder="Enter Authors Name"
                          onChange={handleChange}
                          value={authors}
                        />
                      )}
                    </div>
                    <div
                      className={coAuthors?.length > 0 ? "cmb-10" : "cmb-22"}
                    >
                      <UserCreatable
                        id="coAuthors"
                        label="Add Co-Authors"
                        placeholder="Select Member Or Enter Email"
                        onChange={(e) => {
                          let res = handelAddAuthor(
                            e,
                            values.coAuthors,
                            author_email
                          );
                          if (res?.email) {
                            let oldData = cloneDeep(values.coAuthors);
                            oldData.push(res);
                            setFieldValue("coAuthors", oldData);
                          }
                        }}
                      />
                    </div>
                    {coAuthors?.length > 0 && (
                      <div className="d-flex gap-3 flex-wrap cmb-22">
                        {coAuthors?.map((elm, index) => {
                          return (
                            <span
                              key={index}
                              className="d-flex align-items-center gap-1 border p-1 ps-2 pe-2"
                            >
                              <span className="text-14-500">
                                {elm.name || elm.email}
                              </span>
                              <span className="ms-2">
                                <i
                                  className="bi bi-trash-fill text-danger pointer"
                                  onClick={() => {
                                    let oldData = cloneDeep(values.coAuthors);
                                    let newArry = oldData.filter(
                                      (_, i) => i !== index
                                    );
                                    setFieldValue("coAuthors", newArry);
                                  }}
                                />
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                    <div className="col-md-6 col-12 cmb-22">
                      <DatePicker
                        id="date"
                        label="Date"
                        placeholder="Select date"
                        // minDate={moment().format("YYYY-MM-DD")}
                        onChange={handleChange}
                        value={date}
                        error={err_date}
                      />
                    </div>
                    <div className="col-md-6 col-12 cmb-22">
                      <TextInput
                        id="doi"
                        label="DOI (Optional)"
                        placeholder="Enter DOI"
                        onChange={handleChange}
                        value={doi}
                        error={err_doi}
                      />
                    </div>
                    <div className="col-md-6 col-12 cmb-22">
                      <CreatableDropdown
                        label="Keywords"
                        placeholder="Select or enter keywords"
                        options={unionBy(
                          [...keywordsList.existing, ...keywordsList.custom],
                          "id"
                        )}
                        id="keywords"
                        value={keywords}
                        error={err_keywords}
                        onChange={handleChange}
                        onCreateOption={(e) => {
                          let newCreate = [];
                          if (e.includes(",")) {
                            newCreate = e?.split(",");
                          } else {
                            newCreate = [e];
                          }
                          newCreate = newCreate?.map((o) => {
                            let removedSpace = o.trim();
                            return titleCaseString(removedSpace);
                          });
                          let strToArray = keywords ? keywords.split(",") : [];
                          strToArray = union([...strToArray, ...newCreate]);
                          setKeywordsList({
                            ...keywordsList,
                            custom: [
                              ...keywordsList.custom,
                              ...newCreate.map((e) => {
                                return { id: e, label: e };
                              }),
                            ],
                          });
                          handleChange({
                            target: {
                              id: "keywords",
                              value: strToArray.join(","),
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="col-md-6 col-12 cmb-22">
                      <CreatableDropdown
                        label="Topic/Area of Interest"
                        placeholder="Select or enter topics"
                        options={[...topicsList.existing, ...topicsList.custom]}
                        id="topics"
                        value={topics}
                        error={err_topics}
                        onChange={handleChange}
                        onCreateOption={(e) => {
                          let val = titleCaseString(e);
                          let strToArray = topics ? topics.split(",") : [];
                          strToArray.push(val);
                          setTopicsList({
                            ...topicsList,
                            custom: [
                              ...topicsList.custom,
                              { id: val, label: val },
                            ],
                          });
                          handleChange({
                            target: {
                              id: "topics",
                              value: strToArray.join(","),
                            },
                          });
                        }}
                      />
                    </div>
                    {isAdmin && (
                      <div className="cmb-22">
                        <Dropdown
                          isClearable
                          isRequired={isAdmin && +userID !== author_id}
                          label="Event"
                          id="event_id"
                          placeholder="Select Event"
                          options={eventList}
                          value={event_id}
                          optionValue="event_name"
                          onChange={handleChange}
                          error={err_event_id}
                        />
                      </div>
                    )}
                    {(isAdmin || isAccessPrasantation) && (
                      <>
                        {/* <div className="cmb-22">
                          <FileUpload
                            id="paper_text"
                            label="Full Paper"
                            fileText={getFilenameFromUrl(
                              paper_text_name || "Full Paper"
                            )}
                            onChange={(e) => {
                              const fileName = e.target.fileName;
                              setFieldValue("paper_text_name", fileName);
                              handleChange(e);
                            }}
                          />
                        </div> */}
                        <div className="col-md-6 col-12 cmb-22">
                          <FileUpload
                            id="presentation_link"
                            label="Presentation"
                            fileText={getFilenameFromUrl(
                              presentation_link_name || "Presantation Video"
                            )}
                            onChange={(e) => {
                              const fileName = e.target.fileName;
                              const file = e.target.file;
                              setFieldValue("presentation_link_name", fileName);
                              setFieldValue("presentation_link", file);
                            }}
                            acceptType={["mp4"]}
                          />
                        </div>
                        <div className="col-md-6 col-12 cmb-22">
                          <FileUpload
                            id="thumbnail"
                            label="Thumbnail"
                            fileText={getFilenameFromUrl(
                              thumbnail_name || "Presantation thumbnail"
                            )}
                            onChange={(e) => {
                              const fileName = e.target.fileName;
                              setFieldValue("thumbnail_name", fileName);
                              handleChange(e);
                            }}
                            acceptType={["jpg", "jpeg", "png"]}
                          />
                        </div>
                      </>
                    )}
                    <div className="d-flex align-items-top gap-2 cmb-22">
                      <div className="cmt-12">
                        <CheckBox
                          type="ACTIVE"
                          onClick={(e) => {
                            e.preventDefault();
                            setFieldValue("isAgree", !values.isAgree);
                          }}
                          isChecked={values.isAgree}
                        />
                      </div>
                      <div className="flex-grow-1 text-14-400">
                        I have reviewed and verified each file I am uploading. I
                        have the right to share each file publicly and/or store
                        a private copy accessible to me and the co-authors, as
                        applicable. By uploading this file, I agree to the By
                        uploading each file, I confirm that I hold the rights
                        necessary to publicly display and/or privately store it,
                        as applicable, and that it does not violate the rights
                        of another person or entity. I ask IFERP to extract from
                        each file any structured data (including, without
                        limitation, metadata, text, citations, text snippets,
                        abstracts, tables, graphs, figures/images and captions,
                        and license information) and display them separately. I
                        also ask IFERP to enable an enriched version of each
                        file when downloaded. I understand that if I do not wish
                        to have files enriched when downloaded, I may turn this
                        feature off in my Privacy settings
                      </div>
                    </div>
                    <div className="d-flex justify-content-center gap-4 pt-3">
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
                        disabled={
                          values.isAgree ? isEqual(postData, values) : true
                        }
                      />
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        </Modal>
      )}
    </>
  );
};
export default PostDetails;
