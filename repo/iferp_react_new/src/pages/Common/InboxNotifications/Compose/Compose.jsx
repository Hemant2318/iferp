import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { cloneDeep } from "lodash";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import TextEditor from "components/form/TextEditor";
import Card from "components/Layout/Card";
import { sendMessage, setApiError } from "store/slices";
import { getDataFromLocalStorage } from "utils/helpers";
import UserDropdown from "components/form/UserDropdown";

const Compose = () => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const { personalExecutive } = useSelector((state) => ({
    personalExecutive: state.global.personalExecutive || {},
  }));
  const recieverID = localStorage.personalExecutiveId || "";
  const [btnLoading, setBtnLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);

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
  const changeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      getBase64(file, (result) => {
        const oldData = cloneDeep(images);
        setImages([...oldData, result]);
      });
    }
  };
  const changeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      getBase64(file, (result) => {
        const oldData = cloneDeep(files);
        setFiles([...oldData, result]);
      });
    }
  };
  useEffect(() => {
    return () => {
      localStorage.removeItem("personalExecutiveId");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handelSave = async (values) => {
    setBtnLoading(true);
    const payloadData = {
      ...values,
      images: images,
      file: files,
    };
    const response = await dispatch(sendMessage(payloadData));
    if (response?.status === 200) {
      dispatch(
        setApiError({
          show: true,
          message: "Message Sent Successfully.",
          type: "success",
        })
      );
      if (formRef.current) {
        setImages([]);
        setFiles([]);
        formRef.current.resetForm();
      }
    }
    setBtnLoading(false);
  };
  const validationSchema = Yup.object().shape({
    receiver_id: Yup.string().required("Member is required."),
    subject: Yup.string().required("Subject is required."),
    description: Yup.string().required("Description is required."),
  });

  const initialValues = {
    sender_id: getDataFromLocalStorage("id"),
    receiver_id: recieverID,
    subject: "",
    description: "",
  };
  let existingList = [];
  if (recieverID && personalExecutive?.id) {
    existingList = [personalExecutive];
  }
  return (
    <Card className="d-flex align-items-center cps-34 cpe-34 cpb-38 cpt-38 unset-br inbox-list-container">
      <div className="border w-100" id="compose-container">
        <div className="bg-new-car-light cps-16 cpt-12 cpb-12">
          Send Message
        </div>
        <Formik
          enableReinitialize
          innerRef={formRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handelSave}
        >
          {(props) => {
            const { values, errors, handleChange, handleSubmit, resetForm } =
              props;
            return (
              <form>
                <div className="cps-16 cpe-16 cpt-24">
                  <div className="cmb-16">
                    <UserDropdown
                      placeholder="Select Member"
                      id="receiver_id"
                      value={values.receiver_id}
                      error={errors.receiver_id}
                      existingList={existingList}
                      onChange={handleChange}
                      filterID={[getDataFromLocalStorage("id")]}
                    />
                    {/* <Dropdown
                      placeholder="Select Member"
                      value={values.receiver_id}
                      error={errors.receiver_id}
                      options={recieverList?.list}
                      optionValue="name"
                      id="receiver_id"
                      isLoading={recieverList?.isLoading}
                      onChange={handleChange}
                      onInputChange={handleSearchUser}
                      onMenuScrollToBottom={handelUserScroll}
                    /> */}
                  </div>
                  <div className="cmb-16">
                    <TextInput
                      placeholder="Subject"
                      id="subject"
                      onChange={handleChange}
                      value={values.subject}
                      error={errors.subject}
                    />
                  </div>
                  <div>
                    <TextEditor
                      placeholder="Description"
                      height="150px"
                      id="description"
                      value={values.description}
                      error={errors.description}
                      images={images}
                      files={files}
                      onRemoveImage={(list) => {
                        setImages(list);
                      }}
                      onRemoveFile={(list) => {
                        setFiles(list);
                      }}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* <div className="cps-16 cpe-16 cpb-20 cpt-30 d-flex align-items-center flex-wrap"> */}
                <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between cps-16 cpe-16 cpb-20 cpt-30">
                  <Button
                    isRounded
                    text="Send Message"
                    btnStyle="primary-dark"
                    className="cps-20 cpe-20 text-nowrap"
                    onClick={handleSubmit}
                    btnLoading={btnLoading}
                    disabled={btnLoading}
                  />
                  <div className="d-flex gap-3">
                    <label id="compose-file-input">
                      <span>
                        <i className="bi bi-paperclip pointer" />
                      </span>
                      <input
                        type="file"
                        name="Select File"
                        id="fileToUpload"
                        onChange={changeFile}
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
                        onChange={changeImage}
                        accept="image/png, image/jpeg"
                      />
                    </label>
                    <label id="compose-file-input">
                      <span>
                        <i
                          className="bi bi-trash pointer"
                          onClick={() => {
                            setImages([]);
                            setFiles([]);
                            resetForm();
                          }}
                        />
                      </span>
                    </label>
                  </div>
                </div>
                {/* </div> */}
              </form>
            );
          }}
        </Formik>
      </div>
    </Card>
  );
};
export default Compose;
