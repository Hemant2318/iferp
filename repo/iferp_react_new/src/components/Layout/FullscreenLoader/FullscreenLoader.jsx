import Loader from "../Loader";
import "./FullscreenLoader.scss";
const FullscreenLoader = () => {
  return (
    <div id="fullscreen-loader-container">
      <Loader size="lg" />
    </div>
  );
};
export default FullscreenLoader;
