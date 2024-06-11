import { useEffect, useState } from "react";
import { Player } from "video-react";
import { icons, networkPath } from "utils/constants";
import { generatePreSignedUrl } from "utils/helpers";
import "video-react/dist/video-react.css";
import "./VideoPreview.scss";

const VideoPreview = ({ size = "sm", src, poster, isVideoURL }) => {
  const [videoURL, setVideoURL] = useState("");
  const [posterURL, setPosterURL] = useState("");
  const getPresignURL = async (srcURL) => {
    const response = await generatePreSignedUrl(srcURL, networkPath);
    const response1 = await generatePreSignedUrl(poster, networkPath);
    setVideoURL(response || "");
    setPosterURL(response1 || "");
  };
  useEffect(() => {
    if (isVideoURL && src) {
      getPresignURL(src);
    } else {
      setVideoURL("");
      setPosterURL("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div id="video-preview-container" className={`video-size-${size} h-100`}>
      {videoURL ? (
        <Player playsInline src={videoURL || ""} poster={posterURL || ""} />
      ) : (
        <div className="b-e3e3 h-100 w-100 br-4 f-center">
          <div className="h-38 w-38">
            <img src={icons.noVideo} className="fit-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
