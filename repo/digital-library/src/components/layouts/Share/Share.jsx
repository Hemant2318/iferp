import { useState } from "react";
import { Modal } from "components";
import { icons } from "utils/constants";
import {
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TwitterShareButton,
} from "react-share";
import "./Share.scss";

const titleObject = {
  EVENT: "Share this Conference",
  POST: "Share this Post",
};
const subTitleObject = {
  EVENT: "If you like this article share it with your friends",
  POST: "If you like this post share it with your friends",
};

const Share = ({ url, type, title, isHideIcon }) => {
  const [isShare, setIsShare] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = () => {
    var textInput = document.getElementById("copy-input-filed");
    navigator?.clipboard?.writeText(textInput?.value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  const shareURL = url
    ? `${import.meta.env.VITE_IFERP_URL}${url}`
    : window.location.href;
  return (
    <>
      {isShare && (
        <Modal
          onHide={() => {
            setIsShare(false);
          }}
        >
          <div
            className="mt-1 cps-30 cpe-30 cpb-20 flex-wrap"
            id="share-popup-conrtainer"
          >
            <div className="text-24-500 color-2121"> {titleObject[type]}</div>
            <div className="text-14-400 color-7070 mt-2">
              {subTitleObject[type]}
            </div>
            <div className="d-flex flex-wrap mt-4">
              <FacebookShareButton url={shareURL} title={title || ""}>
                <div className="me-5">
                  <div
                    className="share-block"
                    style={{
                      backgroundColor: "#365BA1",
                    }}
                  >
                    <img src={icons.facebook} alt="facebook" />
                  </div>
                  <div className="text-12-400 color-3d3d text-center mt-1">
                    Facebook
                  </div>
                </div>
              </FacebookShareButton>
              <LinkedinShareButton url={shareURL} title={title || ""}>
                <div className="me-5">
                  <div
                    className="share-block"
                    style={{
                      backgroundColor: "#0077B7",
                    }}
                  >
                    <img src={icons.linkedin} alt="linkedin" />
                  </div>
                  <div className="text-12-400 color-3d3d text-center mt-1">
                    Linkedin
                  </div>
                </div>
              </LinkedinShareButton>
              <WhatsappShareButton url={shareURL} title={title || ""}>
                <div className="me-5">
                  <div
                    className="share-block"
                    style={{
                      backgroundColor: "#00A859",
                    }}
                  >
                    <img src={icons.whatsapp} alt="whatsapp" />
                  </div>
                  <div className="text-12-400 color-3d3d text-center mt-1">
                    Whatsapp
                  </div>
                </div>
              </WhatsappShareButton>
              <TwitterShareButton url={shareURL} title={title || ""}>
                <div className="me-5">
                  <div
                    className="share-block"
                    style={{
                      backgroundColor: "#1D9BF0",
                    }}
                  >
                    <img src={icons.twitter} alt="twitter" />
                  </div>
                  <div className="text-12-400 color-3d3d text-center mt-1">
                    Twitter
                  </div>
                </div>
              </TwitterShareButton>
            </div>
            <div className="text-14-400 color-black-olive mt-3 mb-3">
              or Copy link
            </div>
            <div className="share-input">
              <input
                id="copy-input-filed"
                className="copy-container cpe-80 text-truncate"
                value={shareURL}
                disabled
              />
              <div
                className="copy-button bg-white"
                onClick={() => {
                  !isCopied && copyToClipboard();
                }}
              >
                {isCopied ? "Copied!" : "Copy"}
              </div>
            </div>
          </div>
        </Modal>
      )}
      <div
        className="fa-center gap-2 pointer"
        onClick={() => {
          setIsShare(true);
        }}
      >
        {!isHideIcon && (
          <span className="d-flex h-16 w-16">
            <img src={icons.successShare} alt="fit-image" />
          </span>
        )}
        <span className="text-14-400 color-5555">Share</span>
      </div>
    </>
  );
};

export default Share;
