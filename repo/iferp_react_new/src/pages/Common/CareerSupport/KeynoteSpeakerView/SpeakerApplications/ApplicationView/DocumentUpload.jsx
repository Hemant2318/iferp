import Card from "components/Layout/Card";
import Button from "components/form/Button";
import { Formik } from "formik";
import React, { useRef } from "react";
import { useState } from "react";
import * as Yup from "yup";
import { commonFile, icons, speakerPost } from "utils/constants";
import FileUpload from "components/form/FileUpload";
import { useNavigate, useParams } from "react-router-dom";
import {
  downloadFile,
  generatePreSignedUrl,
  getFilenameFromUrl,
  getUserType,
  objectToFormData,
} from "utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { setVideoRecordingUrl, uploadDocument } from "store/slices";
import { omit } from "lodash";
import { useEffect } from "react";
import "./DocumentUpload.scss";
import ShareButton from "components/Layout/ShareButton";
import Modal from "components/Layout/Modal";

const DocumentUpload = ({
  getInvitationDetails,
  viewDetails,
  isWelcomePdf,
  isWelcomeVideo,
}) => {
  const dispatch = useDispatch();
  const [videoFile, setVideoFile] = useState(null);

  const formRef = useRef();
  const params = useParams();
  const memberType = getUserType();
  const navigate = useNavigate();
  const [playButtonVisible, setPlayButtonVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef();
  const [posterURL, setPosterURL] = useState("");
  const [url, setUrl] = useState("");
  const [sampleData, setSampleData] = useState(null);
  const { videoRecordingUrl } = useSelector((state) => ({
    videoRecordingUrl: state.global.videoRecordingUrl,
  }));

  const validationSchema = Yup.object().shape({
    welcome_video: Yup.string().required("Video is required."),
    welcome_messages: Yup.string().required("File is required."),
  });
  const initialValues = {
    welcome_video: videoRecordingUrl || "",
    welcome_video_name: videoRecordingUrl
      ? videoRecordingUrl
      : getFilenameFromUrl(""),
    welcome_messages: "",
    welcome_messages_name: getFilenameFromUrl(""),
  };

  const handelSave = async (values) => {
    setIsLoading(true);
    const payload = omit(
      {
        ...values,
        id: params?.id,
        welcome_video: videoFile ? videoFile : url,
      },
      ["welcome_video_name"],
      ["welcome_messages_name"]
    );
    const formData = objectToFormData(payload);
    const response = await dispatch(uploadDocument(formData));
    if (response.status === 200) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
      if (videoRecordingUrl) {
        dispatch(setVideoRecordingUrl(""));
      }
      getInvitationDetails();
    }
    setIsLoading(false);
  };

  const handleSuggetion = async (type) => {
    const newObj = {
      "VIDEO MESSAGE": {
        fileType: "mp4",
        fileName: "sample-ref-welcome-video.mp4",
      },
      "WELCOME VIDEO MESSAGE": {
        fileType: "pdf",
        fileName: "sample-welcome-video-message.pdf",
      },
      "WELCOME MESSAGE": {
        fileType: "pdf",
        fileName: "sample-welcome-message.pdf",
      },
    };
    const response = await generatePreSignedUrl(
      newObj[type]?.fileName,
      commonFile
    );
    setSampleData({
      ...newObj[type],
      s3URL: response,
    });
  };

  const getPoster = async (imageURL) => {
    const response = await generatePreSignedUrl(imageURL, speakerPost);
    setPosterURL(response);
  };

  useEffect(() => {
    if (viewDetails?.speaker_poster) {
      getPoster(viewDetails?.speaker_poster);
    }
  }, [viewDetails]);

  useEffect(() => {
    if (videoRecordingUrl) {
      const blobUrl = videoRecordingUrl;

      fetch(blobUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "MyVideo.mp4", {
            type: blob.type,
          });
          setVideoFile(file);
        })
        .catch((error) => {
          console.error("Error fetching or converting Blob:", error);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { welcome_video: welcomeVideo, name } = viewDetails || {};

  return (
    <div className="row g-0" id="document-uploaded-container">
      {sampleData?.s3URL && (
        <Modal
          title={sampleData?.fileType === "mp4" ? "Sample Video" : "Sample Doc"}
          size="md"
          onHide={() => {
            setSampleData(null);
          }}
        >
          <div className="mt-3">
            {sampleData?.fileType === "mp4" ? (
              <div>
                <video
                  controls
                  width="100%"
                  poster={icons.tempVideoPoster}
                  preload="none"
                  style={{
                    background: `transparent url(${icons.tempVideoPoster}) 50% 50% / cover no-repeat`,
                  }}
                >
                  <source src={sampleData?.s3URL} type="video/mp4" />
                </video>
              </div>
            ) : (
              <div>
                <iframe
                  className="w-100"
                  src={sampleData?.s3URL}
                  title="description"
                  style={{
                    width: "100%",
                    height: "600px",
                  }}
                />
              </div>
            )}
          </div>
        </Modal>
      )}
      <Card className={posterURL ? "col-md-8" : ""}>
        <div className="d-flex align-items-center cps-20 cpt-15 cpe-15 cpb-15">
          <div className="text-15-500-18">Documents</div>
        </div>
        <hr className="unset-m unset-p" />
        <div className="row cps-20 cpt-15 cpe-20">
          {welcomeVideo ? (
            <>
              {viewDetails.welcome_video && (
                <>
                  <div className="col-md-5">
                    <div className="position-relative">
                      <video
                        controls
                        ref={videoRef}
                        width="100%"
                        poster={icons.tempVideoPoster}
                        preload="none"
                        style={{
                          background: `transparent url(${icons.tempVideoPoster}) 50% 50% / cover no-repeat`,
                          marginTop: "20px",
                        }}
                        onPlay={() => {
                          setPlayButtonVisible(false);
                        }}
                      >
                        <source src={isWelcomeVideo} type="video/mp4" />
                      </video>
                      {playButtonVisible && (
                        <div
                          className="btn-vd-play"
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.play();
                            }
                          }}
                        >
                          <i className="bi bi-play-fill" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-7 cmb-20">
                    <div className="text-15-500-18 cmb-12">Welcome Video</div>
                    {name && <div className="text-14-400-17 mb-2">{name}</div>}
                    <div className="text-14-400-17 cmb-12">Keynote Speaker</div>
                    <div className="d-flex gap-3">
                      <Button
                        text="Download"
                        isSquare
                        btnStyle="primary-dark"
                        className="cps-10 cpe-10 gap-2"
                        icon={<img src={icons.download} alt="logo" />}
                        onClick={() => {
                          dispatch(downloadFile(isWelcomeVideo));
                        }}
                      />
                      <ShareButton url={isWelcomeVideo} type="VIDEO" />
                    </div>
                  </div>
                </>
              )}
              {viewDetails.welcome_messages && (
                <div className="row cps-20">
                  <div className="col-md-12 bg-gray-blue cps-10 cpt-10 cpe-10 cpb-10 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <img src={icons?.file} alt="file" />
                      <div className="d-flex flex-column">
                        <span className="text-14-500-21">
                          {viewDetails?.welcome_messages}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Button
                        text="Preview Document"
                        isSquare
                        btnStyle="primary-dark"
                        className="cps-10 cpe-10 gap-2"
                        onClick={() => {
                          dispatch(downloadFile(isWelcomePdf));
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              innerRef={formRef}
              onSubmit={handelSave}
            >
              {(props) => {
                const {
                  values,
                  errors,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                } = props;

                return (
                  <form>
                    <div className="row d-flex justify-conent-between align-items-center cmb-26">
                      <div className="col-md-7 cmb-10">
                        <FileUpload
                          label="Welcome Video*"
                          id="welcome_video"
                          error={errors.welcome_video}
                          fileText={getFilenameFromUrl(
                            values.welcome_video_name || ""
                          )}
                          onChange={(e) => {
                            const fileName = e.target.fileName;
                            const videoFile = e.target.file;
                            setFieldValue("welcome_video_name", fileName);
                            setFieldValue("welcome_video", videoFile);
                            setUrl(videoFile);
                          }}
                          acceptType={["mp4"]}
                        />
                      </div>
                      <span className="col-md-1 cpt-15 text-nowrap text-13-400-16 color-light-gray">
                        OR
                      </span>
                      <div className="col-md-4 cpt-15">
                        <Button
                          icon={<img src={icons.videoRecorder} alt="video" />}
                          btnStyle="primary-outline"
                          text="Record Now"
                          className="gap-2 text-14-500-17 text-nowrap"
                          onClick={() => {
                            localStorage.prevRoute = window.location.pathname;
                            navigate(
                              `/${memberType}/career-support/applied-career-support/video-record`
                            );
                          }}
                        />
                      </div>
                      <div className="text-14-400-17 cmb-22">
                        Kindly refer to the{" "}
                        <span
                          className="color-new-car hover-effect"
                          onClick={() => {
                            handleSuggetion("WELCOME VIDEO MESSAGE");
                          }}
                        >
                          help document
                        </span>{" "}
                        and{" "}
                        <span
                          className="color-new-car hover-effect"
                          onClick={() => {
                            handleSuggetion("VIDEO MESSAGE");
                          }}
                        >
                          {" "}
                          reference video
                        </span>
                      </div>

                      <div className="col-md-12 cmb-22">
                        <FileUpload
                          label="Welcome Message (pdf)*"
                          id="welcome_messages"
                          error={errors.welcome_messages}
                          fileText={getFilenameFromUrl(
                            values.welcome_messages_name || ""
                          )}
                          onChange={(e) => {
                            const fileName = e.target.fileName;
                            const pdfFile = e.target.file;
                            setFieldValue("welcome_messages_name", fileName);
                            setFieldValue("welcome_messages", pdfFile);
                            handleChange(e);
                          }}
                        />
                        <div className="text-14-400-17 cmt-10">
                          Kindly refer to the
                          <span
                            className="color-new-car hover-effect"
                            onClick={() => {
                              handleSuggetion("WELCOME MESSAGE");
                            }}
                          >
                            {" "}
                            help document
                          </span>
                        </div>
                      </div>

                      <div className="d-flex">
                        <Button
                          text="Submit"
                          isSquare
                          btnStyle="primary-dark"
                          className="cps-40 cpe-40"
                          btnLoading={isLoading}
                          onClick={handleSubmit}
                        />
                      </div>
                    </div>
                  </form>
                );
              }}
            </Formik>
          )}
        </div>
      </Card>
      {posterURL && (
        <div className="col-md-4">
          <div className="cps-30 cpe-30">
            <div>
              <img src={posterURL} alt="boardImage" className="fill-image" />
            </div>
            <div className="d-flex align-items-center justify-content-center gap-3 pt-2">
              <Button
                isSquare
                icon={<i className="bi bi-download me-2" />}
                text="Download"
                btnStyle="primary-outline"
                className="h-35 text-13-400 cps-20 cpe-20"
                onClick={() => {
                  dispatch(downloadFile(posterURL));
                }}
              />
              <ShareButton type="SPEAKER" url={posterURL} title="">
                <Button
                  isSquare
                  icon={<i className="bi bi-share me-2" />}
                  text="Share"
                  btnStyle="primary-outline"
                  className="h-35 text-13-400 cps-20 cpe-20"
                  onClick={() => {}}
                />
              </ShareButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
