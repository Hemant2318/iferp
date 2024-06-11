import Card from "components/Layout/Card";
import Button from "components/form/Button";
import React, { useRef } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  icons,
  speakerPost,
  speakerUploadedFile,
  welcomeMessage,
  welcomeVideo,
} from "utils/constants";
import { useDispatch } from "react-redux";
import { fetchInviteSpeakerDetails } from "store/slices";
import { useEffect } from "react";
import {
  downloadFile,
  generatePreSignedUrl,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import Loader from "components/Layout/Loader";
import "./SentInvitationDetails.scss";
import ShareButton from "components/Layout/ShareButton";

const SentInvitationDetails = () => {
  const [isVideoURL, setIsVideoURL] = useState(null);
  const [playButtonVisible, setPlayButtonVisible] = useState(true);
  const [speakerDetail, setSpeakerDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [posterURL, setPosterURL] = useState("");
  const navigate = useNavigate();
  const videoRef = useRef();
  const params = useParams();
  const dispatch = useDispatch();

  const getSpeakerDetails = async () => {
    setIsLoading(true);
    const fomData = objectToFormData({ id: params?.id });
    const response = await dispatch(fetchInviteSpeakerDetails(fomData));
    if (response?.status === 200) {
      setSpeakerDetail(response?.data);
      let downloadWelcomeVideo = "";
      if (response?.data?.welcome_video) {
        downloadWelcomeVideo = await generatePreSignedUrl(
          response?.data?.welcome_video,
          welcomeVideo
        );
        setIsVideoURL(downloadWelcomeVideo);
      }
    }

    setIsLoading(false);
  };

  const openPdfInNewTab = async () => {
    let downloadContent = "";
    if (speakerDetail?.speaker_file_upload) {
      downloadContent = await generatePreSignedUrl(
        speakerDetail?.speaker_file_upload,
        speakerUploadedFile
      );
      window.open(downloadContent, "_blank");
    }
  };
  const getPoster = async (imageURL) => {
    const response = await generatePreSignedUrl(imageURL, speakerPost);
    setPosterURL(response);
  };

  useEffect(() => {
    if (speakerDetail?.speaker_poster) {
      getPoster(speakerDetail?.speaker_poster);
    }
  }, [speakerDetail]);

  useEffect(() => {
    getSpeakerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="invitation-detail-container">
      {isLoading ? (
        <Card className="cpt-80 cpb-80">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          <Card className="d-flex align-items-center unset-br cps-20 cpt-20 cpe-20 cpb-20 cmb-20">
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
            <div className="text-16-400-19">
              {titleCaseString(speakerDetail?.name)}
            </div>
          </Card>

          <Card className="cmb-20">
            <div className="d-flex align-items-center cps-20 cpt-20 cpe-20 cpb-20">
              <span className="d-flex">
                <img
                  src={
                    (speakerDetail?.status === "Accepted" && icons.accepted) ||
                    (speakerDetail?.status === "Pending" && icons.pending) ||
                    (speakerDetail?.status === "Rejected" && icons.rejected)
                  }
                  alt="back"
                  className="h-21 me-3 pointer"
                />
              </span>
              <div className="text-15-500-18">
                {(speakerDetail?.status === "Accepted" &&
                  "Accepted Invitation") ||
                  (speakerDetail?.status === "Pending" && "Pending Review") ||
                  (speakerDetail?.status === "Rejected" &&
                    "Rejected invitation")}
              </div>
            </div>
            <hr className="unset-m unset-p" />
            <div className="row cps-33 cpe-28 cpt-22 cpb-22">
              <div
                className="cmb-20 text-14-400-22"
                dangerouslySetInnerHTML={{
                  __html: titleCaseString(speakerDetail?.messages),
                }}
              ></div>

              {speakerDetail?.speaker_file_upload && (
                <div className="row cps-20">
                  <div className="col-md-7 bg-gray-blue cps-10 cpt-10 cpe-10 cpb-10 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <img src={icons?.file} alt="file" />
                      <div className="d-flex flex-column">
                        <span className="text-14-500-21">
                          {speakerDetail?.speaker_file_upload}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Button
                        text="Preview"
                        btnStyle="primary-outline"
                        className="text-14-500 mw-70 me-2"
                        isSquare
                        onClick={() => {
                          openPdfInNewTab();
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
          {speakerDetail?.status === "Accepted" &&
            speakerDetail?.welcome_video && (
              <div className="row g-0">
                <Card className={posterURL ? "col-md-8" : ""}>
                  <div className="d-flex align-items-center cps-33 cpt-20 cpe-20 cpb-20">
                    <div className="text-15-500-18">Documents</div>
                  </div>
                  <hr className="unset-m unset-p" />
                  <div className="row cps-33 cpt-22 cpb-22">
                    {speakerDetail?.welcome_video && (
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
                              <source src={isVideoURL} type="video/mp4" />
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
                          <div className="text-15-500-18 cmb-12">
                            Welcome Video
                          </div>
                          {speakerDetail?.name && (
                            <div className="text-14-400-17 mb-2">
                              {speakerDetail?.name}
                            </div>
                          )}
                          <div className="text-14-400-17 cmb-12">
                            Keynote Speaker
                          </div>
                          <div className="d-flex gap-3">
                            <Button
                              text="Download"
                              isSquare
                              btnStyle="primary-dark"
                              className="cps-10 cpe-10 gap-2"
                              icon={<img src={icons.download} alt="logo" />}
                              onClick={() => {
                                dispatch(downloadFile(isVideoURL));
                              }}
                            />
                            {/* <Button
                              text="Re-Upload"
                              isSquare
                              btnStyle="primary-outline"
                              className="cps-15 cpe-15 gap-2"
                            /> */}
                          </div>
                        </div>
                      </>
                    )}

                    {speakerDetail?.welcome_messages && (
                      <div className="row cps-20">
                        <div className="col-md-12 bg-gray-blue cps-10 cpt-10 cpe-10 cpb-10 d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <img src={icons?.file} alt="file" />
                            <div className="d-flex flex-column">
                              <span className="text-14-500-21">
                                {speakerDetail?.welcome_messages}
                              </span>
                            </div>
                          </div>
                          <div>
                            <Button
                              text="Download"
                              isSquare
                              btnStyle="primary-dark"
                              className="cps-10 cpe-10 gap-2"
                              icon={<img src={icons.download} alt="logo" />}
                              onClick={async () => {
                                let downloadWelcomeMessage = "";
                                if (speakerDetail?.welcome_messages) {
                                  downloadWelcomeMessage =
                                    await generatePreSignedUrl(
                                      speakerDetail?.welcome_messages,
                                      welcomeMessage
                                    );
                                }
                                dispatch(downloadFile(downloadWelcomeMessage));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
                {posterURL && (
                  <div className="col-md-4">
                    <div className="cps-30 cpe-30">
                      <div>
                        <img
                          src={posterURL}
                          alt="boardImage"
                          className="fill-image"
                        />
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
            )}
        </>
      )}
    </div>
  );
};

export default SentInvitationDetails;
