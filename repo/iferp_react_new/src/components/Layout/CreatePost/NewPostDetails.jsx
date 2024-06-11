import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep, isEqual, map, union, unionBy } from "lodash";
import * as Yup from "yup";
import { Formik } from "formik";
import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import FileUpload from "components/form/FileUpload";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import CheckBox from "components/form/CheckBox";
import UserCreatable from "components/form/UserCreatable";
import CreatableDropdown from "components/form/CreatableDropdown";
import UserDropdown from "components/form/UserDropdown";
import { icons, networkPath } from "utils/constants";
import { Tooltip as ReactTooltip } from "react-tooltip";
import DatePicker from "components/form/DatePicker";
import "./NewPostDetails.scss";

import {
  generatePreSignedUrl,
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
  getPastEvent,
  setMyNetworkDetails,
  throwSuccess,
} from "store/slices";
import { postAs } from "utils/constants";
import TextArea from "components/form/TextArea";
import Label from "components/form/Label";
import RadioInput from "components/form/RadioInput";

const NewPostDetails = ({
  editData = {},
  onHide,
  postTitle,
  postCategory,
  handelSuccess,
  type,
}) => {
  const dispatch = useDispatch();

  const reduxData = useSelector((state) => state.global);
  const { allNewTopicList, postCategoryList, postList, myNetworkDetails } =
    reduxData || {};
  const [btnLoading, setBtnLoading] = useState(false);
  const [postSubCategoryList, setPostSubCategoryList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [keywordsList, setKeywordsList] = useState({
    existing: [],
    custom: [],
  });
  const [topicsList, setTopicsList] = useState({
    existing: unionBy(allNewTopicList, "topics").map((elm) => {
      return {
        id: elm?.topics,
        label: elm?.topics,
      };
    }),
    custom: [],
  });
  // const [volumeRange, setVolumeRange] = useState(false);
  // const [pageRange, setPageRange] = useState(false);
  const [publicationStatus, setPublicationStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

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
    doi,
    co_authors,
    author_details,
    keywords,
    topics,
    event_id,
    presentation_link,
    paper_text,
    thumbnail,
    pdf_data,
    volume_number,
    // volume_from,
    // volume_to,
    // page_number,
    page_number_from,
    page_number_to,
    issue_number,
    public_status,
    // publication_year,
    // publication_month,
    // publication_day,
    publication_date,
    abstract,
    journal_name,
    is_peer_reviewed,
    user_id,
    // page_number_rang,
    rang,
    post_id,
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
    post_as: (post_as !== undefined && post_as.toString()) || "",
    doi: doi || "",
    co_authors: coAuthorsList || [],
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
    volume_number: volume_number || "",
    // volume_from: volume_from || "",
    // volume_to: volume_to || "",
    // page_number: page_number || "",
    page_number_from: page_number_from || "",
    page_number_to: page_number_to || "",
    issue_number: issue_number || "",
    public_status: public_status || "",
    // publication_year: publication_year || "",
    // publication_month: publication_month || "",
    // publication_day: publication_day || "",
    publication_date: publication_date || "",
    abstract: abstract || "",
    journal_name: journal_name || "",
    is_peer_reviewed: is_peer_reviewed || "",
    user_id: user_id || "",
    // page_number_rang: page_number_rang || "",
    rang: rang || "",
    post_id: post_id || "",
  });

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  };

  const urlToBlob = async (url) => {
    try {
      const response = await fetch(url); // Fetch the file
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob(); // Convert response to Blob
      return blob;
    } catch (error) {
      console.error("Error converting URL to Blob:", error);
      throw error;
    }
  };

  function isBase64(str) {
    const base64Regex = /^data:/;
    return base64Regex.test(str);
  }

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
  // const fetchTopics = async () => {
  //   const response = await dispatch(getTopics());
  //   let listArray = response?.data || [];
  //   setTopicsList((prev) => {
  //     return {
  //       ...prev,
  //       existing: map(listArray, (elm) => {
  //         return { id: elm.topics.trim(), label: elm.topics.trim() };
  //       }),
  //     };
  //   });
  // };
  const fetchEvents = async () => {
    // const payload = objectToFormData({ date: moment().format("YYYY-MM-DD") });
    const response = await dispatch(getPastEvent());
    setEventList(response?.data?.event || []);
  };
  useEffect(() => {
    fetchKeywords();
    // fetchTopics();
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
    volume_number: Yup.string()
      .nullable()
      .transform((curr, orig) => (orig === "" ? "" : curr))
      .matches(/^[0-9]*$/, "Volume Number must be number only."),
    // volume_from: Yup.string()
    //   .nullable()
    //   .transform((curr, orig) => (orig === "" ? "" : curr))
    //   .matches(/^[0-9]*$/, "Volume From must be number only."),
    // volume_to: Yup.string()
    //   .nullable()
    //   .transform((curr, orig) => (orig === "" ? "" : curr))
    //   .matches(/^[0-9]*$/, "Volume To must be number only."),
    // page_number: Yup.string()
    //   .nullable()
    //   .transform((curr, orig) => (orig === "" ? "" : curr))
    //   .matches(/^[0-9]*$/, "Page Number must be number only."),
    page_number_from: Yup.string()
      .nullable()
      .transform((curr, orig) => (orig === "" ? "" : curr))
      .matches(/^[0-9]*$/, "Page Number From must be number only."),
    page_number_to: Yup.string()
      .nullable()
      .transform((curr, orig) => (orig === "" ? "" : curr))
      .matches(/^[0-9]*$/, "Page Number To must be number only."),
    issue_number: Yup.string()
      .nullable()
      .transform((curr, orig) => (orig === "" ? "" : curr))
      .matches(/^[0-9]*$/, "Issue Number must be number only."),

    is_peer_reviewed: Yup.string().required("Select Any One."),
    topics: Yup.string().required(
      "Topic/Research Area of Interest is required."
    ),
  });
  const isSubCategory = postSubCategoryList.length > 0;

  const handleSave = async (values) => {
    setBtnLoading(true);
    let coAuthors =
      values?.co_authors.length > 0
        ? map(values?.co_authors, (o) => {
            return o.email;
          })?.toString()
        : "";

    let objectData = {
      ...values,
      co_authors: coAuthors,
      user_id: getDataFromLocalStorage("id"),
      // rang: volumeRange === true ? 1 : 0,
      // volume_number: volumeRange === true ? "" : values?.volume_number,
      // volume_from: volumeRange === true ? values?.volume_from : "",
      // volume_to: volumeRange === true ? values?.volume_to : "",
      // page_number_rang: pageRange === true ? 1 : 0,
      // page_number: pageRange === true ? "" : values?.page_number,
      // page_number_from: pageRange === true ? values?.page_number_from : "",
      // page_number_to: pageRange === true ? values?.page_number_to : "",
      public_status: publicationStatus,
      publication_date: selectedDate,
    };

    const response = await dispatch(createPost(objectToFormData(objectData)));
    if (response?.status === 200) {
      let postResponse = "";
      let presantationRes = "";
      let thumbnailRes = "";
      if (response?.data?.post) {
        postResponse = await generatePreSignedUrl(
          response?.data.post,
          networkPath
        );
      }
      if (response?.data?.presentation_link) {
        presantationRes = await generatePreSignedUrl(
          response?.data.presentation_link,
          networkPath
        );
      }
      if (response?.data?.thumbnail) {
        thumbnailRes = await generatePreSignedUrl(
          response?.data.thumbnail,
          networkPath
        );
      }
      let resData = {
        ...response?.data,
        nPost: postResponse,
        nPresentationLink: presantationRes,
        nThumbnail: thumbnailRes,
      };
      if (id) {
        const newList = postList?.map((elem) => {
          if (elem?.id === id) {
            elem = resData;
          }
          return elem;
        });
        dispatch(storePostList(newList));
      } else {
        incresePost();
        if (type === "my-posts") {
          dispatch(storePostList([...postList, resData]));
        }
      }
      dispatch(throwSuccess(response?.message));
      handelSuccess();
    } else {
      dispatch(throwError(response?.message));
    }
    setBtnLoading(false);
  };

  const incresePost = () => {
    const newData = {
      ...myNetworkDetails,
      total_posts: myNetworkDetails.total_posts + 1 || 1,
    };
    dispatch(setMyNetworkDetails(newData));
  };

  const handelUpdatePost = async (values) => {
    setBtnLoading(true);
    let coAuthors =
      values?.co_authors.length > 0
        ? map(values?.co_authors, (o) => {
            return o.email;
          })?.toString()
        : "";

    let fileNum = "";
    let objectData = {};

    if (!isBase64(values?.post)) {
      let postResponse = await generatePreSignedUrl(values?.post, networkPath);

      let fileType = await urlToBlob(postResponse)
        .then((blob) => {
          return blob;
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      fileNum = await getBase64(fileType);

      objectData = {
        ...values,
        co_authors: coAuthors,
        post_id: id,
        // rang: volumeRange === true ? 1 : 0,
        // volume_number: volumeRange === true ? "" : values?.volume_number,
        // volume_from: volumeRange === true ? values?.volume_from : "",
        // volume_to: volumeRange === true ? values?.volume_to : "",
        // page_number_rang: pageRange === true ? 1 : 0,
        // page_number: pageRange === true ? "" : values?.page_number,
        // page_number_from: pageRange === true ? values?.page_number_from : "",
        // page_number_to: pageRange === true ? values?.page_number_to : "",
        public_status: publicationStatus,
        user_id: editData?.user_details?.id,
        post: fileNum,
        publication_date: selectedDate,
      };
    } else {
      objectData = {
        ...values,
        co_authors: coAuthors,
        post_id: id,
        // rang: volumeRange === true ? 1 : 0,
        // volume_number: volumeRange === true ? "" : values?.volume_number,
        // volume_from: volumeRange === true ? values?.volume_from : "",
        // volume_to: volumeRange === true ? values?.volume_to : "",
        // page_number_rang: pageRange === true ? 1 : 0,
        // page_number: pageRange === true ? "" : values?.page_number,
        // page_number_from: pageRange === true ? values?.page_number_from : "",
        // page_number_to: pageRange === true ? values?.page_number_to : "",
        public_status: publicationStatus,
        user_id: editData?.user_details?.id,
        publication_date: selectedDate,
      };
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
      dispatch(throwSuccess("Post Updated Successfully."));
      handelSuccess();
    } else {
      dispatch(throwError("Post is not updated."));
    }
    setBtnLoading(false);
  };

  useEffect(() => {
    if (public_status) {
      setPublicationStatus(public_status);
    }
    if (publication_date) {
      setSelectedDate(publication_date);
    }
    // if (page_number_rang === "1") {
    //   // setPageRange(true);
    //   let data = { ...postData };
    //   setPostData(data);
    //   // setPostData({ ...data, page_number: "" });
    // } else {
    //   // setPageRange(false);
    //   let data = { ...postData };
    //   setPostData({ ...data, page_number_from: "", page_number_to: "" });
    // }

    // if (rang === "1") {
    //   setVolumeRange(true);
    //   let data = { ...postData };
    //   setPostData({ ...data, volume_number: "" });
    // } else {
    //   setVolumeRange(false);
    //   let data = { ...postData };
    //   setPostData({ ...data, volume_from: "", volume_to: "" });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatText = [
    "Modern Language Association (MLA)",
    "Chicago Manual of Style",
    "IEEE Style",
    "American Psychological Association (APA)",
    "Harvard Referencing",
  ];

  return (
    <Modal onHide={onHide} size="xl">
      <div className="text-26-500 color-raisin-black d-flex justify-content-center">
        {id ? "Edit Post" : "Create New Post"}
      </div>
      <div className="cmt-34 cmb-22 cms-16 cme-16">
        <Formik
          enableReinitialize
          initialValues={postData}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            if (!id) {
              setPostData(values);
              handleSave(values);
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
              co_authors,
              is_email,
              author_id,
              author_email,
              authors,
              doi,
              keywords,
              topics,
              event_id,
              presentation_link_name,
              thumbnail_name,
              volume_number,
              /* page_number, */
              page_number_from,
              page_number_to,
              issue_number,
              abstract,
              journal_name,
            } = values;
            const {
              sub_category_id: err_sub_category_id,
              post: err_post,
              title: err_title,
              post_as: err_post_as,
              author_id: err_author_id,
              author_email: err_author_email,
              doi: err_doi,
              keywords: err_keywords,
              topics: err_topics,
              event_id: err_event_id,
              volume_number: err_volume_number,
              /* page_number: err_page_number, */
              page_number_from: err_page_number_from,
              page_number_to: err_page_number_to,
              issue_number: err_issue_number,
              abstract: err_abstract,
              journal_name: err_journal_name,
              is_peer_reviewed: err_is_peer_reviewed,
            } = errors;

            return (
              <form className="row">
                <div className="col-md-2 col-12 cmb-22">
                  <label>Post Category*</label>
                </div>
                <div
                  className={
                    isSubCategory
                      ? "col-md-5 col-12 cmb-22"
                      : "col-md-10 cmb-22"
                  }
                >
                  <Dropdown
                    isRequired
                    placeholder="Select Category"
                    options={postCategoryList}
                    value={category_id}
                    optionValue="name"
                    disabled
                  />
                </div>
                {isSubCategory && (
                  <div className="col-md-5 col-12 cmb-22">
                    <Dropdown
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
                <div className="col-md-2 col-12 cmb-22">
                  <label>File Upload*</label>
                </div>
                <div className="col-md-10 col-12 cmb-22">
                  <FileUpload
                    isRequired={+userID === author_id}
                    id="post"
                    error={err_post}
                    fileText={getFilenameFromUrl(fileName || "File*")}
                    onChange={async (e) => {
                      const fileName = e.target.fileName;
                      setFieldValue("fileName", fileName);
                      handleChange(e);
                    }}
                    // acceptType={[
                    //   "jpg",
                    //   "jpeg",
                    //   "png",
                    //   "pdf",
                    //   "doc",
                    //   "msword",
                    //   "csv",
                    // ]}
                  />
                </div>
                <div className="col-md-2 col-12 cmb-22">
                  <label>Post Title*</label>
                </div>
                <div className="col-md-10 col-12 cmb-22">
                  <TextInput
                    isRequired
                    id="title"
                    placeholder="Enter post title"
                    onChange={handleChange}
                    error={err_title}
                    value={title}
                  />
                </div>

                <div className="col-md-2 col-12 cmb-22">
                  <label>Add Authors*</label>
                </div>
                <div className="col-md-10 col-12 cmb-22">
                  {isAdmin ? (
                    is_email ? (
                      <TextInput
                        isRequired
                        id="author_email"
                        // label="Add Authors"
                        placeholder="Enter author email for invite"
                        onChange={handleChange}
                        value={author_email}
                        error={err_author_email}
                        onBlur={() => {
                          if (!errors?.author_email) {
                            const selectedEmail = author_email;
                            const isExist = co_authors?.some(
                              (o) => o.email === selectedEmail
                            );
                            if (isExist) {
                              dispatch(
                                throwError({
                                  message: "Email already exist in co-author.",
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
                        // label="Add Authors"
                        placeholder="Select Author"
                        value={author_id}
                        error={err_author_id}
                        existingList={existingList}
                        onChange={(e) => {
                          let changeData = e?.target?.data;
                          const selectedEmail = changeData?.email_id;
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
                      // label="Add Authors"
                      placeholder="Enter Authors Name"
                      onChange={handleChange}
                      value={authors}
                    />
                  )}
                </div>

                <div className="col-md-2 col-12 cmb-22">
                  <label>Add Co-Authors</label>
                </div>
                <div className="cmb-22 col-md-10">
                  <UserCreatable
                    id="co_authors"
                    placeholder="Select Member Or Enter Email"
                    onChange={(e) => {
                      let res = handelAddAuthor(
                        e,
                        values.co_authors,
                        author_email
                      );
                      if (res?.email) {
                        let oldData = cloneDeep(values.co_authors);
                        oldData.push(res);
                        setFieldValue("co_authors", oldData);
                      }
                    }}
                  />
                </div>
                {co_authors?.length > 0 && (
                  <>
                    <div className="col-md-2 col-12 cmb-22"></div>
                    <div className="d-flex gap-3 flex-wrap cmb-22 col-md-10">
                      {co_authors?.map((elm, index) => {
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
                                  let oldData = cloneDeep(values.co_authors);
                                  let newArry = oldData.filter(
                                    (_, i) => i !== index
                                  );
                                  setFieldValue("co_authors", newArry);
                                }}
                              />
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </>
                )}
                <div className="col-md-2 col-12 cmb-22">
                  <label>Post As*</label>
                </div>
                <div className="col-md-10 col-12 cmb-22">
                  <Dropdown
                    isRequired
                    id="post_as"
                    placeholder="Select Post As"
                    options={postAs}
                    value={post_as}
                    error={err_post_as}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-2 col-12 cmb-22">
                  <label>Volume Number</label>
                </div>
                {/* {volumeRange ? (
                  <>
                    <div className="col-md-4 col-12 cmb-22">
                      <TextInput
                        id="volume_from"
                        placeholder="From"
                        onChange={handleChange}
                        error={err_volume_from}
                        value={volume_from}
                      />
                    </div>
                    <div className="col-md-4 col-12 cmb-22">
                      <TextInput
                        id="volume_to"
                        placeholder="To"
                        onChange={handleChange}
                        error={err_volume_to}
                        value={volume_to}
                      />
                    </div>
                  </>
                ) : ( */}
                <div className="col-md-10 col-12 cmb-22">
                  <TextInput
                    id="volume_number"
                    placeholder="Enter Volume Number"
                    onChange={handleChange}
                    error={err_volume_number}
                    value={volume_number}
                  />
                </div>
                {/* )} */}

                {/* <div className="col-md-2 col-12 cmb-22 d-flex align-items-center gap-2">
                  <CheckBox
                    type="PRIMARY-ACTIVE"
                    onClick={() => {
                      if (volumeRange) {
                        setFieldValue("volume_number", "");
                      } else {
                        setFieldValue("volume_from", "");
                        setFieldValue("volume_to", "");
                      }
                      setVolumeRange(!volumeRange);
                    }}
                    isChecked={volumeRange}
                  />
                  <span>Range</span>
                </div> */}

                <div className="col-md-2 col-12 cmb-22">
                  <label>Issue Number</label>
                </div>
                <div className="col-md-10 col-12 cmb-12">
                  <TextInput
                    id="issue_number"
                    placeholder="Enter Issue Number"
                    onChange={handleChange}
                    error={err_issue_number}
                    value={issue_number}
                  />
                </div>

                <div className="col-md-2 col-12 cmb-22">
                  <div className="d-flex">
                    <label>Publication Status</label>
                    <span
                      className="ps-2"
                      data-tooltip-id="my-publication-status-tooltip"
                    >
                      <img src={icons.biInfoCircle} alt="info-circle" />
                    </span>
                    <ReactTooltip
                      style={{ width: "400px" }}
                      id="my-publication-status-tooltip"
                      place="right"
                      variant="info"
                      className="bg-white shadow-sm bg-white rounded"
                      content={
                        <div>
                          <div className="text-14-400 color-dark-blue">
                            When an article has been accepted for publication
                            but is not yet published, it’s referred to as “in
                            press”
                          </div>
                        </div>
                      }
                    />
                  </div>
                </div>
                <div className="col-md-10 col-12 cmb-12">
                  <div className="d-flex gap-4">
                    <Button
                      isRounded
                      text="Published"
                      btnStyle={
                        publicationStatus === "0"
                          ? "primary-dark"
                          : "light-outline"
                      }
                      className="cps-40 cpe-40"
                      onClick={() => setPublicationStatus("0")}
                    />
                    <Button
                      isRounded
                      text="In Press"
                      btnStyle={
                        publicationStatus === "1"
                          ? "primary-dark"
                          : "light-outline"
                      }
                      className="cps-40 cpe-40"
                      onClick={() => setPublicationStatus("1")}
                    />
                  </div>
                </div>

                <div className="col-md-2 col-12 cmb-22">
                  <label>Publication Date</label>
                </div>
                <div className="col-md-10 col-12 cmb-22 d-flex gap-2">
                  {/* <TextInput
                    id="publication_year"
                    placeholder="Year"
                    onChange={handleChange}
                    error={err_publication_year}
                    value={publication_year}
                  />
                  <TextInput
                    id="publication_month"
                    placeholder="Month"
                    onChange={handleChange}
                    error={err_publication_month}
                    value={publication_month}
                  />
                  <TextInput
                    id="publication_day"
                    placeholder="Day"
                    onChange={handleChange}
                    error={err_publication_day}
                    value={publication_day}
                  /> */}
                  <DatePicker
                    placeholder="Select Date Range"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    value={selectedDate}
                    // maxDate={publicationStatus === '0' ? new Date() : ''}
                    // minDate={publicationStatus === '1' ? new Date() : ''}
                  />
                </div>

                <div className="col-md-2 col-12 cmb-22">
                  <div className="d-flex">
                    <label>Page Number</label>
                    <span
                      className="ps-2"
                      data-tooltip-id="my-page-number-tooltip"
                    >
                      <img src={icons.biInfoCircle} alt="info-circle" />
                    </span>
                    <ReactTooltip
                      style={{ width: "400px" }}
                      id="my-page-number-tooltip"
                      place="right"
                      variant="info"
                      className="bg-white z-1 shadow-sm bg-white rounded"
                      content={
                        <div>
                          <div className="text-14-400 color-dark-blue">
                            If it appears on multiple pages, select the range
                            check box and fill the first and last page
                          </div>
                        </div>
                      }
                    />
                  </div>
                </div>
                {/* {pageRange ? ( */}
                {/* <> */}
                <div className="col-md-5 col-12 cmb-22">
                  <TextInput
                    id="page_number_from"
                    placeholder="From"
                    onChange={handleChange}
                    error={err_page_number_from}
                    value={page_number_from}
                  />
                </div>
                <div className="col-md-5 col-12 cmb-22">
                  <TextInput
                    id="page_number_to"
                    placeholder="To"
                    onChange={handleChange}
                    error={err_page_number_to}
                    value={page_number_to}
                  />
                </div>
                {/* </> */}
                {/* ) : (
                  <div className="col-md-8 col-12 cmb-22">
                    <TextInput
                      id="page_number"
                      placeholder="Enter Page Number"
                      onChange={handleChange}
                      error={err_page_number}
                      value={page_number}
                    />
                  </div>
                )} */}

                {/* <div className="col-md-2 col-12 cmb-22 d-flex align-items-center gap-2">
                  <CheckBox
                    type="PRIMARY-ACTIVE"
                    onClick={() => {
                      if (pageRange) {
                        setFieldValue("page_number", "");
                      } else {
                        setFieldValue("page_number_from", "");
                        setFieldValue("page_number_to", "");
                      }
                      setPageRange(!pageRange);
                    }}
                    isChecked={pageRange}
                  />
                  <span>Range</span>
                </div> */}

                <div className="col-md-2 col-12 cmb-22">
                  <div className="d-flex">
                    <label>DOI</label>
                    <span className="ps-2" data-tooltip-id="my-doi-tooltip">
                      <img src={icons.biInfoCircle} alt="info-circle" />
                    </span>
                    <ReactTooltip
                      style={{ width: "600px" }}
                      id="my-doi-tooltip"
                      place="right"
                      variant="info"
                      className="bg-white z-1 shadow-sm bg-white rounded"
                      content={
                        <div>
                          <div className="text-14-400 color-dark-blue">
                            A DOI (Digital object identifier) is a speacial link
                            for academic sources that’s more reliable than a
                            URL. Look for it on the page hosting the source. If
                            both a DOI and a URL are available, use the DOI
                          </div>
                        </div>
                      }
                    />
                  </div>
                </div>
                <div className="col-md-10 col-12 cmb-22">
                  <TextInput
                    id="doi"
                    placeholder="Enter DOI"
                    onChange={handleChange}
                    value={doi}
                    error={err_doi}
                  />
                </div>

                <div className="col-md-2 col-12 cmb-22">
                  <label>Keywords</label>
                </div>
                <div className="col-md-10 col-12 cmb-22">
                  <CreatableDropdown
                    placeholder="Select or Enter Keywords"
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

                <div className="col-md-2 col-12 cmb-22">
                  {/* <label>Topic/Area of Interest</label> */}
                  <label>Topic/Research Area of Interest*</label>
                </div>
                <div className="col-md-10 col-12 cmb-22">
                  <CreatableDropdown
                    placeholder="Select Research Area of Interest"
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
                        custom: [...topicsList.custom, { id: val, label: val }],
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

                <div className="col-md-2 col-12 cmb-22">
                  <label>Journal Name</label>
                </div>
                <div className="col-md-10 col-12 cmb-22">
                  <TextInput
                    id="journal_name"
                    placeholder="Select Journal"
                    value={journal_name}
                    error={err_journal_name}
                    onChange={(e) => {
                      handleChange({
                        target: {
                          id: e.target.id,
                          value: e.target.value,
                        },
                      });
                    }}
                  />
                </div>

                <div className="col-md-2 col-12 cmb-22">
                  <label>Abstract</label>
                </div>
                <div className="col-md-10 col-12 cmb-22">
                  <TextArea
                    rows={3}
                    placeholder="Enter Abstract or Post Descrption"
                    id="abstract"
                    error={err_abstract}
                    value={abstract}
                    onChange={handleChange}
                    // onChange={(e) =>
                    //   handleChange({
                    //     target: {
                    //       id: "about_article",
                    //       value: trimLeftSpace(e.target.value),
                    //     },
                    //   })
                    // }
                  />
                </div>

                {/* <div className="col-md-6 col-12 cmb-22">
                  <TextInput
                    isRequired
                    id="title"
                    label="Post Title"
                    placeholder="Enter post title"
                    onChange={handleChange}
                    error={err_title}
                    value={title}
                  />
                </div> */}

                {/* <div className="col-md-6 col-12 cmb-22">
                  <DatePicker
                    id="date"
                    label="Date"
                    placeholder="Select date"
                    // minDate={moment().format("YYYY-MM-DD")}
                    onChange={handleChange}
                    value={date}
                    error={err_date}
                  />
                </div> */}
                {isAdmin && (
                  <>
                    <div className="col-md-2 col-12 cmb-22">
                      <label>Event</label>
                    </div>
                    <div className="cmb-22 col-md-10">
                      <Dropdown
                        isClearable
                        isRequired={isAdmin && +userID !== author_id}
                        id="event_id"
                        placeholder="Select Event"
                        options={eventList}
                        value={event_id}
                        optionValue="event_name"
                        onChange={handleChange}
                        error={err_event_id}
                      />
                    </div>
                  </>
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
                    <div className="col-md-2 col-12 cmb-22">
                      <label>Presentation</label>
                    </div>
                    <div className="col-md-10 col-12 cmb-22">
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

                    <div className="col-md-2 col-12 cmb-22">
                      <label>Thumbnail</label>
                    </div>
                    <div className="col-md-10 col-12 cmb-22">
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

                <div className="d-flex flex-wrap">
                  <div className="cme-30">
                    <Label label="Has this been peer reviewed?" required />
                  </div>
                  <div className="d-flex flex-grow-1 gap-3">
                    <RadioInput
                      name="is_peer_reviewed"
                      label="Yes"
                      value={"1"}
                      onChange={handleChange}
                      checked={values.is_peer_reviewed === "1"}
                    />
                    <RadioInput
                      name="is_peer_reviewed"
                      label="No"
                      value={"0"}
                      onChange={handleChange}
                      checked={values.is_peer_reviewed === "0"}
                    />
                  </div>
                </div>

                <div>
                  <div
                    className="text-13-400 pt-1 cmb-22 cme-30"
                    style={{ color: "red" }}
                  >
                    {err_is_peer_reviewed}
                  </div>
                </div>

                <div>
                  <div className="mt-4 mb-4 border border-1 citation-format">
                    <div className="cpt-12 cps-12 cpb-12 border-bottom text-15-500 bg-F8F8 color-2D2D">
                      Note: We support the following citation format
                    </div>

                    <div className="row cmt-20">
                      {formatText?.map((elem, i) => {
                        return (
                          <div className="col-md-4 flex-row cmb-20" key={i}>
                            <div className="d-flex align-items-center gap-2">
                              <div className="citation-dot"></div>
                              <div className="color-raisin-black rounded-circle bg-white text-15-400 color-2121">
                                {elem}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
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
                    have the right to share each file publicly and/or store a
                    private copy accessible to me and the co-authors, as
                    applicable. By uploading this file, I agree to the By
                    uploading each file, I confirm that I hold the rights
                    necessary to publicly display and/or privately store it, as
                    applicable, and that it does not violate the rights of
                    another person or entity. I ask IFERP to extract from each
                    file any structured data (including, without limitation,
                    metadata, text, citations, text snippets, abstracts, tables,
                    graphs, figures/images and captions, and license
                    information) and display them separately. I also ask IFERP
                    to enable an enriched version of each file when downloaded.
                    I understand that if I do not wish to have files enriched
                    when downloaded, I may turn this feature off in my Privacy
                    settings
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
                    disabled={values.isAgree ? isEqual(postData, values) : true}
                  />
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};
export default NewPostDetails;
