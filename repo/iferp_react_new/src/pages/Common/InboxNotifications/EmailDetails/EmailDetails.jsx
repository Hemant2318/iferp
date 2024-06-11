import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  cloneDeep,
  findIndex,
  forEach,
  map,
  omit,
  unionBy,
  upperCase,
} from "lodash";
import moment from "moment";
import * as Yup from "yup";
import { Formik } from "formik";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import TextEditor from "components/form/TextEditor";
import DropdownButton from "components/form/DropdownButton";
import FilePreview from "components/Layout/FilePreview";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import {
  deleteMessage,
  fetchEmailReciever,
  fetchSingleMessage,
  replyMessage,
  sendMessage,
  setApiError,
  starMessage,
} from "store/slices";
import { icons, limit } from "utils/constants";
import {
  getDataFromLocalStorage,
  messageTime,
  objectToFormData,
} from "utils/helpers";

const EmailDetails = () => {
  const params = useParams();
  const { emailId, emailKey, memberType, type } = params;
  const formRef = useRef();
  const formContainerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailList, setEmailList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [collapseId, setCollapseId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [recieverList, setRecieverList] = useState({
    list: [],
    name: "",
    total: 0,
    offset: 0,
    limit: limit,
    isLoading: true,
  });
  const [initialValues, setInitialValues] = useState({
    id: "",
    key: "",
    type: "",
    sender_id: getDataFromLocalStorage("id"),
    receiver_id: "",
    description: "",
    subject: "",
    images: [],
    file: [],
  });
  const validationSchema = Yup.object().shape({
    receiver_id: Yup.string().required("Member is required."),
    description: Yup.string().required("Description is required."),
  });
  const getBase64 = (file, res) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      res(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };
  const scrollToFrom = () => {
    setTimeout(() => {
      formContainerRef?.current?.scrollIntoView();
    }, 200);
  };
  const getEmailList = async () => {
    const formData = objectToFormData({ id: emailId, key: emailKey });
    const response = await dispatch(fetchSingleMessage(formData));
    const resData = response?.data || [];
    setEmailList(resData);
    if (localStorage.isReply) {
      forEach(resData, (el) => {
        if (el.id === +localStorage.isReply) {
          setCollapseId(el.id);
          setInitialValues({
            ...initialValues,
            id: el.id,
            key: el.key,
            type: "reply",
            description: "",
            receiver_id: el?.sender_detail?.id,
            images: [],
            file: [],
          });
          localStorage.removeItem("isReply");
          scrollToFrom();
        }
      });
    }
    setIsLoading(false);
  };
  const [timer, setTimer] = useState("");

  const handleSearchUser = (e) => {
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      let oldData = cloneDeep({
        ...recieverList,
        offset: 0,
        name: e?.toLowerCase(),
        isLoading: true,
      });
      setRecieverList(oldData);
      getEmailList(oldData, true);
    }, 800);
    setTimer(time);
  };
  const handelUserScroll = () => {
    if (recieverList.list.length < recieverList.total) {
      let oldData = cloneDeep({
        ...recieverList,
        offset: recieverList.offset + limit,
        isLoading: true,
      });
      setRecieverList(oldData);
      getEmailList(oldData);
    }
  };
  const getUserList = async (obj, isReset) => {
    let queryParams = new URLSearchParams(
      omit(obj, ["list", "total", "isLoading"])
    ).toString();
    const response = await dispatch(fetchEmailReciever(queryParams));
    setRecieverList((prev) => {
      let resData = response?.data?.user_data || [];
      let listData = isReset ? resData : [...prev.list, ...resData];
      return {
        ...prev,
        list: listData,
        total: response?.data?.result_count || 0,
        isLoading: false,
      };
    });
  };

  const handelSave = async (values) => {
    setBtnLoading(true);
    if (values.type === "forward") {
      handelForward(values);
    } else {
      handelReply(values);
    }
  };
  const handelForward = async (values) => {
    const formData = omit(
      {
        ...values,
        isForwarded: 1,
        file: map(values.file, (o) => {
          return o.split("/").pop();
        }),
        images: map(values.images, (o) => {
          return o.split("/").pop();
        }),
      },
      ["id", "key", "type"]
    );
    const response = await dispatch(sendMessage(formData));
    if (response?.status === 200) {
      dispatch(
        setApiError({
          show: true,
          message: "Message Forward Successfully.",
          type: "success",
        })
      );
      getEmailList();
      setInitialValues({
        ...initialValues,
        id: "",
        key: "",
        type: "",
        receiver_id: "",
        description: "",
        images: [],
        file: [],
      });
    }
    setBtnLoading(false);
  };
  const handelReply = async (values) => {
    const formData = omit(values, ["subject"]);
    const response = await dispatch(replyMessage(formData));
    if (response?.status === 200) {
      getEmailList();
      dispatch(
        setApiError({
          show: true,
          message: "Message Sent Successfully.",
          type: "success",
        })
      );
      setInitialValues({
        ...initialValues,
        id: "",
        key: "",
        type: "",
        receiver_id: "",
        description: "",
        images: [],
        file: [],
      });
    }
    setBtnLoading(false);
  };
  const handelDeleteMessage = async (data) => {
    setDeleteLoading(data.id);
    const formData = objectToFormData(data);
    const response = await dispatch(deleteMessage(formData));
    if (response?.status === 200) {
      if (emailList.length === 1) {
        navigate(-1);
        return;
      } else {
        getEmailList();
      }
    }
    setDeleteLoading("");
  };
  const handelStarMessage = async (data) => {
    const formData = objectToFormData(data);
    const response = await dispatch(starMessage(formData));
    if (response?.status === 200) {
      const newList = [...emailList];
      const index = findIndex(newList, ["id", data.id]);
      newList[index].is_starred = data.status;
      setEmailList(newList);
    }
  };
  useEffect(() => {
    getEmailList();
    getUserList(recieverList, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {isLoading ? (
        <Card className="d-flex align-items-center justify-content-center cpt-50 cpb-50">
          <Loader size="md" />
        </Card>
      ) : emailList.length === 0 ? (
        <Card className="d-flex justify-content-center text-15-400 cpb-50 cpt-50 unset-br">
          No Data Found
        </Card>
      ) : (
        emailList.map((elem, index) => {
          const {
            id,
            key,
            subject,
            description,
            created_at,
            is_starred,
            is_speaker_view,
            images = [],
            files = [],
            sender_detail = {},
            receiver_detail = {},
          } = elem || {};

          const {
            name: senderName,
            email_id: senderEmail,
            id: senderId,
          } = sender_detail;
          const {
            name: recieverName,
            email_id: recieverEmail,
            id: recieverId,
          } = receiver_detail;
          const msgtime = moment(created_at, "DD-MM-YYYY hh:mm A").format(
            "hh:mm A"
          );
          const isExpand =
            collapseId === elem.id || (!collapseId && index === 0);
          return (
            <div key={index} className="fadeInUp">
              <Card className="cps-20 cpe-20 cpb-20 cpt-20 mb-3">
                <div className="cpt-12 cpb-12 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    {index === 0 && (
                      <span
                        className="d-flex"
                        onClick={() => {
                          navigate(-1);
                        }}
                      >
                        <img
                          src={icons.leftArrow}
                          alt="back"
                          className="h-21 me-3 pointer"
                        />
                      </span>
                    )}
                    <span className="text-18-500 color-black-olive">
                      {subject}
                    </span>
                  </div>
                  <div
                    className="me-2 pointer"
                    onClick={() => {
                      setCollapseId(id);
                    }}
                  >
                    <i
                      className={
                        isExpand ? "bi bi-chevron-up" : "bi bi-chevron-down"
                      }
                    />
                  </div>
                </div>
                {isExpand && (
                  <>
                    <div className="d-flex align-items-center gap-3 cmt-34">
                      <div
                        className="rounded-circle bg-new-car-light center-flex text-22-500"
                        style={{ height: "50px", width: "50px" }}
                      >
                        {upperCase(senderName[0])}
                      </div>
                      <div className="w-100">
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                          <div className="d-flex gap-2">
                            <div className="text-15-500 color-raisin-black">
                              {senderName}
                            </div>
                            <div className="text-14-400 color-black-olive">
                              {`<${senderEmail}>`}
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-4">
                            <div className="text-14-400 color-black-olive">
                              {msgtime} ({messageTime(created_at)})
                            </div>
                            <div className="d-flex align-items-center gap-4">
                              {!initialValues.type === "reply" && (
                                <div
                                  className="d-flex pointer"
                                  onClick={() => {
                                    setInitialValues({
                                      ...initialValues,
                                      id: id,
                                      key: key,
                                      type: "reply",
                                      description: "",
                                      receiver_id: senderId,
                                      images: [],
                                      file: [],
                                    });
                                    scrollToFrom();
                                  }}
                                >
                                  <i className="bi bi-reply text-20-400 color-dark-silver" />
                                </div>
                              )}
                              <div
                                className="d-flex pointer"
                                onClick={() => {
                                  handelStarMessage({
                                    id,
                                    key,
                                    status: is_starred === 0 ? 1 : 0,
                                    type: "inside",
                                  });
                                }}
                              >
                                {is_starred ? (
                                  <i className="bi bi-star-fill text-16-400 color-dark-silver" />
                                ) : (
                                  <i className="bi bi-star text-16-400 color-dark-silver" />
                                )}
                              </div>
                              <div className="d-flex pointer">
                                <DropdownButton
                                  parentClass="op-drop-down"
                                  id="op-drop-down"
                                  text={
                                    <i className="bi bi-three-dots-vertical text-16-400 color-dark-silver" />
                                  }
                                >
                                  <div className="ps-2">
                                    <div
                                      className="me-3 pointer d-flex align-items-center"
                                      onClick={() => {
                                        handelDeleteMessage({ id, key });
                                      }}
                                    >
                                      <span className="me-3">
                                        <i className="bi bi-trash me-3" />
                                        Delete
                                      </span>
                                      {deleteLoading === id && (
                                        <span>
                                          <Loader size="sm" />
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </DropdownButton>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <DropdownButton
                            className="email-drop-down"
                            id="email-drop-down"
                            text={
                              <>
                                <span className="text-12-400 color-black-olive me-3">
                                  {recieverId === getDataFromLocalStorage("id")
                                    ? "to me"
                                    : recieverName}
                                </span>
                              </>
                            }
                          >
                            <div className="row pt-1 text-12-400 ps-2 pe-2">
                              <span className="mb-2 col-md-3">From:</span>
                              <span className="mb-2 col-md-9 text-truncate d-inline-block">{`${senderName} <${senderEmail}>`}</span>
                              <span className="mb-2 col-md-3">To:</span>
                              <span className="mb-2 col-md-9 text-truncate d-inline-block">{`${recieverName} <${recieverEmail}>`}</span>
                              <span className="mb-2 col-md-3">Date:</span>
                              <span className="mb-2 col-md-9">
                                {created_at}
                              </span>
                              <span className="mb-2 col-md-3">Subject:</span>
                              <span className="mb-2 col-md-9 text-truncate d-inline-block">
                                {subject}
                              </span>
                            </div>
                          </DropdownButton>
                        </div>
                      </div>
                    </div>
                    <div
                      className="cmt-30 cmb-30"
                      dangerouslySetInnerHTML={{
                        __html: description,
                      }}
                    />
                    {(images.length > 0 || files.length > 0) && (
                      <div className="d-flex mb-3 gap-3">
                        {images.map((elm, index) => {
                          return (
                            <React.Fragment key={index}>
                              <FilePreview url={elm} isDownload />
                            </React.Fragment>
                          );
                        })}
                        {files.map((elm, index) => {
                          return (
                            <React.Fragment key={index}>
                              <FilePreview url={elm} isDownload />
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}
                    {is_speaker_view === "1" &&
                      getDataFromLocalStorage("user_type") !== "0" && (
                        <div className="d-flex cmb-30">
                          <Button
                            text="Upload Now"
                            btnStyle="primary-light"
                            className="cps-20 cpe-20 h-35"
                            onClick={() => {
                              navigate(
                                `/${memberType}/inbox-notifications/${type}/${emailId}/upload-documents`
                              );
                            }}
                          />
                        </div>
                      )}
                    {!initialValues.type && (
                      <div className="d-flex gap-3">
                        <Button
                          text="Reply"
                          btnStyle="light-outline"
                          icon={<i className="bi bi-arrow-90deg-left me-2" />}
                          className="cps-20 cpe-20 h-35"
                          onClick={() => {
                            let newTempList = cloneDeep(recieverList.list);
                            let recArray = [receiver_detail];
                            setRecieverList((prev) => {
                              return {
                                ...prev,
                                list: unionBy(newTempList, recArray, "id"),
                              };
                            });
                            const recieptID =
                              getDataFromLocalStorage("id") === senderId
                                ? recieverId
                                : senderId;
                            setInitialValues({
                              ...initialValues,
                              id: id,
                              key: key,
                              type: "reply",
                              description: "",
                              receiver_id: recieptID,
                              images: [],
                              file: [],
                            });
                            scrollToFrom();
                          }}
                        />
                        <Button
                          text="Forward"
                          btnStyle="light-outline"
                          icon={<i className="bi bi-arrow-90deg-right me-2" />}
                          className="cps-16 cpe-16 h-35"
                          onClick={() => {
                            setInitialValues({
                              ...initialValues,
                              id: id,
                              type: "forward",
                              description: description,
                              subject: subject,
                              receiver_id: "",
                              key: "",
                              images: images,
                              file: files,
                            });
                            scrollToFrom();
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </Card>
              {initialValues.id === id && (
                <div ref={formContainerRef}>
                  <Card className="cps-20 cpe-20 cpb-20 cpt-20 unset-br mb-3">
                    <Formik
                      innerRef={formRef}
                      enableReinitialize
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handelSave}
                    >
                      {(props) => {
                        const {
                          values,
                          errors,
                          handleChange,
                          handleSubmit,
                          resetForm,
                          setFieldValue,
                        } = props;
                        return (
                          <form>
                            <div className="cps-16 cpe-16 cpt-24">
                              <div className="cmb-16 d-flex align-items-center">
                                <Dropdown
                                  placeholder="Select Member"
                                  value={values.receiver_id}
                                  error={errors.receiver_id}
                                  options={recieverList?.list}
                                  optionValue="name"
                                  extraDisplayKey="email_id"
                                  id="receiver_id"
                                  disabled={values.type === "reply"}
                                  isLoading={recieverList?.isLoading}
                                  onChange={handleChange}
                                  onInputChange={handleSearchUser}
                                  onMenuScrollToBottom={handelUserScroll}
                                />
                              </div>
                              <div>
                                <TextEditor
                                  placeholder="Description"
                                  id="description"
                                  onChange={handleChange}
                                  value={values.description}
                                  images={values?.images}
                                  files={values?.file}
                                  readOnly={values.type !== "reply"}
                                  onRemoveImage={
                                    values.type === "reply"
                                      ? (list) => {
                                          setFieldValue("images", list);
                                        }
                                      : null
                                  }
                                  onRemoveFile={
                                    values.type === "reply"
                                      ? (list) => {
                                          setFieldValue("file", list);
                                        }
                                      : null
                                  }
                                  error={errors.description}
                                />
                              </div>
                              {/* {errors.description && (
                                <span className="text-13-400 pt-1">
                                  <span style={{ color: "red" }}>
                                    {errors.description}
                                  </span>
                                </span>
                              )} */}
                            </div>
                            <div className="cps-16 cpe-16">
                              <div className="cps-16 cpe-16 cpt-10 cpb-10 d-flex align-items-center justify-content-between border border-top-0 flex-wrap gap-2">
                                <div className="d-flex align-items-center gap-3">
                                  <Button
                                    isSquare
                                    text="Send"
                                    btnStyle="primary-dark"
                                    className="cps-34 cpe-34"
                                    onClick={handleSubmit}
                                    btnLoading={btnLoading}
                                    disabled={btnLoading}
                                  />
                                  <Button
                                    isSquare
                                    text="Cancel"
                                    btnStyle="primary-gray"
                                    className="cps-34 cpe-34"
                                    onClick={() => {
                                      setInitialValues({
                                        ...initialValues,
                                        id: "",
                                        key: "",
                                        type: "",
                                        description: "",
                                        receiver_id: "",
                                        images: [],
                                        file: [],
                                      });
                                    }}
                                  />
                                </div>

                                <div className="d-flex gap-3">
                                  {values.type === "reply" && (
                                    <>
                                      <label id="compose-file-input">
                                        <span>
                                          <i className="bi bi-paperclip pointer" />
                                        </span>
                                        <input
                                          type="file"
                                          name="Select File"
                                          id="fileToUpload"
                                          onChange={(e) => {
                                            const inputFile = e.target.files[0];
                                            if (inputFile) {
                                              getBase64(inputFile, (result) => {
                                                const oldData = cloneDeep(
                                                  values.file
                                                );
                                                setFieldValue("file", [
                                                  ...oldData,
                                                  result,
                                                ]);
                                              });
                                            }
                                          }}
                                        />
                                      </label>
                                      <label id="compose-file-input">
                                        <span>
                                          <i className="bi bi-card-image pointer" />
                                        </span>
                                        <input
                                          type="file"
                                          name="Select File"
                                          id="fileToUpload"
                                          onChange={(e) => {
                                            const inputFile = e.target.files[0];
                                            if (inputFile) {
                                              getBase64(inputFile, (result) => {
                                                const oldData = cloneDeep(
                                                  values.images
                                                );
                                                setFieldValue("images", [
                                                  ...oldData,
                                                  result,
                                                ]);
                                              });
                                            }
                                          }}
                                          accept="image/png, image/jpeg"
                                        />
                                      </label>
                                    </>
                                  )}
                                  <label id="compose-file-input">
                                    <span>
                                      <i
                                        className="bi bi-trash pointer"
                                        onClick={resetForm}
                                      />
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </form>
                        );
                      }}
                    </Formik>
                  </Card>
                </div>
              )}
            </div>
          );
        })
      )}
    </>
  );
};
export default EmailDetails;
