import Card from "components/Layout/Card";
import Button from "components/form/Button";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { useNavigate } from "react-router-dom";
import { icons } from "utils/constants";
import { setVideoRecordingUrl, throwError } from "store/slices";
import { useDispatch } from "react-redux";
import Loader from "components/Layout/Loader";
import "./VideoRecorder.scss";

const TimerContent = ({ status, stopRecording, setEnable }) => {
  const [counter, setCounter] = useState("");
  useEffect(() => {
    if (status === "recording") {
      setCounter(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (counter >= 0) {
      if (counter === 600) {
        setCounter("");
        stopRecording();
        setEnable(false);
      } else {
        setTimeout(() => {
          setCounter(counter + 1);
        }, 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);
  const minutes = Math.floor(counter / 60);
  const seconds = Math.ceil(counter % 60);
  const recordTimer = `${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
  return (
    <div className="text-15-600 bg-light-orange color-orange cmb-20 ps-2 pe-2">
      You can record upto 10 mins and preview your video.
      {counter >= 0 && <span className="ms-2">{recordTimer}</span>}
    </div>
  );
};
const VideoPreview = ({ stream, status }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  useEffect(() => {
    if (stream && status === "stopped") {
      stream.getTracks().forEach((track) => track.stop());
      stream.getTracks().forEach((track) => (track.enabled = false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!stream) {
    return null;
  }

  return (
    <>
      <video ref={videoRef} autoPlay className="fill-image" />
    </>
  );
};

const VideoRecorder = () => {
  const dispatch = useDispatch();

  const [playButtonVisible, setPlayButtonVisible] = useState(true);
  const [first, setfirst] = useState(false);
  const previewRef = useRef();
  const navigate = useNavigate();
  const [enable, setEnable] = useState(true);
  let errorMSG = {
    message: "Webcam not detected. Please make sure your webcam is connected",
  };

  return (
    <div id="video-recorder-container">
      <Card className="d-flex align-items-center cps-15 cpt-15 cpb-15 unset-br mb-3">
        <span
          className="d-flex"
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <span className="text-16-500 color-subtitle-navy">
          Record Welcome Video
        </span>
      </Card>

      <Card className="cps-15 cpt-15 cpb-15 cpe-15">
        <div id="image-container" className="cmb-30">
          <ReactMediaRecorder
            video
            blobPropertyBag={{
              type: "video/mp4",
            }}
            render={({
              status,
              previewStream,
              startRecording,
              stopRecording,
              pauseRecording,
              resumeRecording,
              mediaBlobUrl,
              error,
            }) => {
              return (
                <div>
                  {/* <p>{status}</p> */}

                  {mediaBlobUrl && (
                    <>
                      <div className="position-relative">
                        <video
                          ref={previewRef}
                          src={mediaBlobUrl}
                          controls
                          preload="none"
                          loop
                          className="fill-image"
                          poster={icons.VideoRecordingPoster}
                          style={{
                            background: `transparent url(${icons.VideoRecordingPoster}) 50% 50% / cover no-repeat`,
                            marginTop: "20px",
                          }}
                          onPlay={() => {
                            setPlayButtonVisible(false);
                          }}
                        />
                        {playButtonVisible && (
                          <div
                            className="btn-vd-play"
                            onClick={() => {
                              if (previewRef.current) {
                                previewRef.current.play();
                              }
                            }}
                          >
                            <i className="bi bi-play-fill" />
                          </div>
                        )}
                      </div>

                      {status === "stopped" && (
                        <>
                          <div className="d-flex justify-content-center align-items-center flex-column cmt-20">
                            <div className="d-flex gap-3">
                              <Button
                                isRounded
                                text="Preview"
                                className="text-16-500 gap-2 align-items-center cps-20 cpe-20 cmb-20"
                                btnStyle="primary-outline"
                                icon={<img src={icons.roundPlay} alt="play" />}
                                onClick={() => {
                                  if (previewRef.current) {
                                    previewRef.current.play();
                                  }
                                }}
                              />
                              <Button
                                isRounded
                                text="Submit"
                                className="text-16-500 gap-2 align-items-center cps-35 cpe-35 cmb-20"
                                btnStyle="primary-dark"
                                onClick={() => {
                                  dispatch(setVideoRecordingUrl(mediaBlobUrl));
                                  if (localStorage.prevRoute) {
                                    navigate(localStorage.prevRoute);
                                  }
                                }}
                              />
                              <Button
                                isRounded
                                text="Retake"
                                className="text-16-500 gap-2 align-items-center cps-35 cpe-35 cmb-20"
                                btnStyle="primary-outline"
                                icon={
                                  <i className="bi bi-arrow-clockwise text-16-500" />
                                }
                                onClick={() => {
                                  window.location.reload();
                                }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {first ? (
                    <div className="cpt-80 pb-5">
                      <Loader size="md" />
                    </div>
                  ) : (
                    enable && (
                      <VideoPreview stream={previewStream} status={status} />
                    )
                  )}

                  {status === "idle" && (
                    <>
                      <div className="cmb-20">
                        <img
                          src={icons.VideoRecordingPoster}
                          alt="poster"
                          className="fill-image"
                        />
                      </div>
                      <div className="d-flex justify-content-center align-items-center flex-column">
                        <Button
                          isRounded
                          text="Start Recording"
                          className="text-16-500 gap-2 align-items-center cps-20 cpe-20 cmb-20"
                          btnStyle="primary-dark"
                          icon={<img src={icons.startRecord} alt="start" />}
                          onClick={() => {
                            if (error) {
                              dispatch(throwError(errorMSG));
                            } else {
                              setfirst(true);
                              startRecording();
                              setTimeout(() => {
                                setfirst(false);
                              }, 1100);
                            }
                          }}
                        />
                        <div className="d-flex gap-2 text-15-400-18">
                          <span className="color-dark-gray">
                            Not ready to record?
                          </span>
                          <span className="color-new-car hover-effect">
                            Upload Video
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                  {status === "recording" && (
                    <>
                      <div className="d-flex justify-content-center align-items-center flex-column cmt-20">
                        <TimerContent
                          status={status}
                          setEnable={setEnable}
                          stopRecording={stopRecording}
                        />
                        {/* <div className="text-15-600 bg-light-orange color-orange cmb-20">
                          You can record upto 10 mins and preview your video
                        </div> */}
                        <div className="d-flex gap-3">
                          <Button
                            isRounded
                            text="Pause Recording"
                            className="text-16-500 gap-2 align-items-center cps-10 cpe-10 cmb-20"
                            btnStyle="primary-outline"
                            icon={<img src={icons.pauseRecord} alt="pause" />}
                            onClick={pauseRecording}
                          />
                          <Button
                            isRounded
                            text="Stop Recording"
                            className="text-16-500 gap-2 align-items-center cps-20 cpe-20 cmb-20"
                            btnStyle="danger-light"
                            icon={<i className="bg-white h-13 w-13" />}
                            onClick={() => {
                              stopRecording();
                              setEnable(false);
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {status === "paused" && (
                    <>
                      <div className="d-flex justify-content-center align-items-center flex-column cmt-20">
                        <div className="text-15-600 bg-light-orange color-orange cmb-20">
                          Recording is paused.
                        </div>
                        <div className="d-flex gap-3">
                          <Button
                            isRounded
                            text="Resume Recording"
                            className="text-16-500 gap-2 align-items-center cps-20 cpe-20 cmb-20"
                            btnStyle="primary-dark"
                            icon={<img src={icons.pauseRecord} alt="resume" />}
                            onClick={resumeRecording}
                          />
                          <Button
                            isRounded
                            text="Stop Recording"
                            className="text-16-500 gap-2 align-items-center cps-20 cpe-20 cmb-20"
                            btnStyle="danger-light"
                            icon={<i className="bg-white h-13 w-13" />}
                            onClick={() => {
                              stopRecording();
                              setEnable(false);
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default VideoRecorder;
