import { Player } from "video-react";
import "video-react/dist/video-react.css";
import "./VideoPreview.scss";

const VideoPreview = ({ size = "sm", postURL, videoLink }) => {
  const posterURL = postURL
    ? postURL
    : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg";
  const videoURL = videoLink
    ? videoLink
    : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
  return (
    <div id="video-preview-container" className={`video-size-${size}`}>
      <Player playsInline src={videoURL} poster={posterURL || ""} />
    </div>
  );
};

export default VideoPreview;
