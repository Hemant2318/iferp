import React, { useEffect, useState } from "react";
import { icons } from "utils/constants";
import Modal from "components/Layout/Modal";
import { useDispatch } from "react-redux";
import {
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TwitterShareButton,
} from "react-share";
import {
  getDataFromLocalStorage,
  objectToFormData,
  downloadFile,
} from "utils/helpers";
import {
  fetchFollowerOrFollowing,
  sharePost,
  downloadCitationFormat,
  throwSuccess,
  throwError,
} from "store/slices";
import "./ShareButton.scss";
import { Card } from "react-bootstrap";
import CheckBox from "components/form/CheckBox";
import TextArea from "components/form/TextArea";
import Button from "components/form/Button";
import RadioInput from "components/form/RadioInput";
import Profile from "../Profile";
import { useParams } from "react-router-dom";
import { sendChatMessagesInBulk } from "store/slices/chatSlice";

const ShareButton = ({ children, url, type, title, className, noTitle }) => {
  const titleObject = {
    EVENT: "Share this Webinar",
    POST: "Share this Post",
    VIDEO: "Share this Video",
    SPEAKER: "Share this speaker",
  };
  const subTitleObject = {
    EVENT: "If you like this article share it with your friends",
    POST: "If you like this post share it with your friends",
    VIDEO: "If you like this video share it with your friends",
    SPEAKER: "If you like this post share it with your friends",
  };
  const dispatch = useDispatch();
  const shareURL = url || window.location.href;
  const [isShare, setIsShare] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [communityPopup, setCommunityPopup] = useState(false);
  const [selectProfile, setSelectProfile] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [exportPopup, setExportPopup] = useState(false);
  const [list, setList] = useState([]);
  const [cType, setCType] = useState(null);
  const [citationType, setCitationType] = useState(null);
  const [showTypeError, setShowTypeError] = useState("");
  const [showCitationError, setShowCitationError] = useState("");
  const [message, setMessage] = useState("");
  const params = useParams();
  const { postID } = params;
  const [btnLoading, setBtnLoading] = useState(false);

  const copyToClipboard = () => {
    var textInput = document.getElementById("copy-input-filed");
    navigator?.clipboard?.writeText(textInput?.value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  useEffect(() => {
    if (isShare && getDataFromLocalStorage("id")) {
      if (type === "POST") {
        dispatch(
          sharePost(
            objectToFormData({ post_id: postID || url.split("/").pop() })
          )
        );
      }
      getFollowings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShare]);

  const openShareToCommunityPopup = () => {
    setIsShare(false);
    setCommunityPopup(true);
  };

  const addSelectedProfileInList = (obj) => {
    let isExist = false;
    if (selectProfile?.length > 0) {
      selectProfile?.map((profile, i) => {
        if (profile?.id === obj?.id) {
          isExist = true;
        }
        return null;
      });
    }
    if (!isExist) {
      let newProfile = [...selectProfile];
      newProfile.push(obj);
      setSelectProfile(newProfile);

      let newId = [...selectedId];
      newId.push(obj?.id);
      setSelectedId(newId);
    }

    if (isExist) {
      let newProfile = [...selectProfile];
      const removeIndex = newProfile.findIndex((item) => item.id === obj?.id);
      newProfile.splice(removeIndex, 1);
      setSelectProfile(newProfile);

      let newId = [...selectedId];
      const removeId = newId.findIndex((item) => item === obj?.id);
      newId.splice(removeId, 1);
      setSelectedId(newId);
    }
  };

  const removeFromList = (obj) => {
    let newProfile = [...selectProfile];
    const removeIndex = newProfile.findIndex((item) => item.id === obj?.id);
    newProfile.splice(removeIndex, 1);
    setSelectProfile(newProfile);

    let newId = [...selectedId];
    const removeId = newId.findIndex((item) => item === obj?.id);
    newId.splice(removeId, 1);
    setSelectedId(newId);
  };

  const getFollowings = async () => {
    const response = await dispatch(
      fetchFollowerOrFollowing(objectToFormData({ type: "following" }))
    );
    setList(response?.data?.result || []);
  };

  const handelCreateGroup = async () => {
    setBtnLoading(true);
    const userId = getDataFromLocalStorage("id");
    let receiverIds = [...selectedId];

    const response = await dispatch(
      sendChatMessagesInBulk({
        sender_id: userId,
        receiver_ids: receiverIds,
        url: url.replace(window.location.origin, ""),
        message: message,
      })
    );
    if (response?.status === 200) {
      setCommunityPopup(false);
      setSelectProfile([]);
      setSelectedId([]);
      setMessage("");
      dispatch(throwSuccess(response?.message));
    } else {
      setCommunityPopup(false);
      setSelectProfile([]);
      setSelectedId([]);
      setMessage("");
      dispatch(throwError(response?.message));
    }
    setBtnLoading(false);
  };

  const downloadCitation = async () => {
    if (cType === null && citationType === null) {
      setShowTypeError("Please select type*");
      setShowCitationError("Please select type*");
      setTimeout(() => {
        setShowTypeError("");
        setShowCitationError("");
      }, 1500);
    } else if (cType === null) {
      setShowTypeError("Please select type*");
      setTimeout(() => {
        setShowTypeError("");
      }, 1500);
    } else if (citationType === null) {
      setShowCitationError("Please select type*");
      setTimeout(() => {
        setShowCitationError("");
      }, 1500);
    } else {
      const response = await dispatch(
        downloadCitationFormat(
          objectToFormData({
            post_id: postID,
            type: cType,
            cation_type: citationType,
          })
        )
      );
      if (response?.data?.file_path) {
        dispatch(downloadFile(response?.data?.file_path));
        handleCancel();
        dispatch(throwSuccess("Citation has been downloaded successfully."));
      } else {
        dispatch(throwError("Citation is not downloaded."));
      }
    }
  };

  const handleCancel = () => {
    setExportPopup(false);
    setCitationType(null);
    setCType(null);
    setShowTypeError("");
    setShowCitationError("");
  };

  return (
    <div id="share-button-block">
      {isShare && (
        <Modal
          onHide={() => {
            setIsShare(false);
            setSelectProfile([]);
            setSelectedId([]);
          }}
        >
          <div className="cps-40 cpe-40 share-button-popup">
            <div className="text-24-500 color-raisin-black mt-3">
              {titleObject[type]}
            </div>
            <div className="text-14-400 color-silver-gray mt-3">
              {subTitleObject[type]}
            </div>

            <div className="d-flex flex-wrap mt-5 mb-5 gap-5">
              <div className="d-flex flex-wrap pointer">
                <FacebookShareButton url={shareURL} title={title || ""}>
                  <img src={icons.shareFacebook} alt="facebook" />
                </FacebookShareButton>
              </div>
              <div className="d-flex pointer">
                <LinkedinShareButton url={shareURL} title={title || ""}>
                  <img src={icons.shareLinkedin} alt="linkedin" />
                </LinkedinShareButton>
              </div>
              <div className="d-flex pointer">
                <WhatsappShareButton url={shareURL} title={title || ""}>
                  <img src={icons.shareWhatsapp} alt="whatsapp" />
                </WhatsappShareButton>
              </div>
              <div className="d-flex pointer">
                <TwitterShareButton url={shareURL}>
                  <img src={icons.shareTwitter} alt="twitter" />
                </TwitterShareButton>
              </div>
              <div
                className="pointer"
                onClick={() => openShareToCommunityPopup()}
              >
                <div className="community-section">
                  <img
                    src={icons.community}
                    alt="community"
                    className="community-icon"
                  />
                </div>
                <div className="community-text text-12-500 mt-2">Community</div>
              </div>
            </div>
            <div className="text-14-400 color-black-olive mt-2 mb-3">
              or Copy link
            </div>
            <div className="share-input mb-5">
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
      {communityPopup && (
        <Modal
          onHide={() => {
            setCommunityPopup(false);
            setSelectProfile([]);
            setSelectedId([]);
            setMessage("");
          }}
          size="modal-sm"
        >
          <div className="">
            <div className="text-24-500 color-raisin-black d-flex justify-content-center">
              Share To Community
            </div>
            <div className="d-flex flex-wrap border border-1 selected-name-border mt-4">
              {selectProfile?.length > 0 ? (
                selectProfile?.map((elm, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div className="bg-ecec p-2 m-1 d-flex">
                        <div className="text-14-400">{elm?.name + " "}</div>
                        <div className="ps-2 text-14-400 pointer">
                          <img
                            src={icons.close}
                            alt="close"
                            className="close-icon"
                            onClick={() => removeFromList(elm)}
                          />
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="text-16-400 m-1 p-2 color-davys-gray">
                  Share with your network
                </div>
              )}
            </div>
          </div>
          <Card className="mt-3">
            <div
              id="custom-card-container"
              className="share-to-community-popup-scroll iferp-scroll"
            >
              {list?.length > 0 ? (
                list?.map((elm, index) => {
                  const { id, profile_photo_path, name } = elm;
                  return (
                    <>
                      <div className="cps-8 cpe-8 cpt-8">
                        <div class="request-block p-2">
                          <div class="d-flex justify-content-between align-items-center flex-wrap">
                            <div class="d-flex align-items-center left-block mb-2">
                              <div id="select-member" className="me-3">
                                <CheckBox
                                  type="PRIMARY-ACTIVE"
                                  onClick={() => {
                                    addSelectedProfileInList(elm);
                                  }}
                                  isChecked={selectedId?.includes(id)}
                                />
                              </div>
                              <div id="profile-container">
                                <Profile
                                  isS3UserURL
                                  isRounded
                                  text={name}
                                  size="s-60"
                                  url={profile_photo_path}
                                />
                              </div>
                              <div class="user-details-block ms-3 ">
                                <div class="text-16-500 text-truncate d-inline-block w-100 color-black-olive pointer">
                                  {name}
                                </div>
                                <div class="text-13-400 color-davys-gray mt-1">
                                  abc
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {list?.length > 1 && index !== list?.length - 1 && (
                        <div className="border-bottom text-16-400"></div>
                      )}
                    </>
                  );
                })
              ) : (
                <div className="cps-8 cpe-8 cpt-8 cpb-8">
                  You are not following anyone.
                </div>
              )}
            </div>
          </Card>
          <div className="mt-3">
            <TextArea
              rows={3}
              placeholder="Add message"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={list?.length === 0}
              error={
                message?.length > 100 &&
                "You can only send message upto 100 characters."
              }
              // error={err_abstract}
              // value={abstract}
              // onChange={handleChange}
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
          <div className="mt-4 d-flex justify-content-center align-items-center flex-wrap">
            <Button
              isSquare
              text="Share"
              btnStyle="primary-dark"
              className="cps-40 cpe-40"
              // onClick={onHide}
              onClick={() => handelCreateGroup()}
              disabled={
                list?.length === 0 ||
                selectProfile?.length === 0 ||
                btnLoading ||
                message?.length > 100
              }
              btnLoading={btnLoading}
            />
          </div>
        </Modal>
      )}
      {exportPopup && (
        <Modal
          onHide={() => {
            handleCancel();
          }}
          size="modal-sm"
        >
          <div className="">
            <div className="text-22-400 color-raisin-black d-flex justify-content-center">
              Export Citation
            </div>
            <div className="ms-4 me-4 mt-4">
              <div className="mt-1">Select the type of file</div>
              <div className="color-danger mt-1">{showTypeError}</div>
              <div className="d-flex flex-wrap mt-3">
                <div className="d-flex flex-grow-1 gap-3">
                  <RadioInput
                    name="type"
                    label="RIS"
                    value={0}
                    onChange={(e) => setCType(e?.target?.value)}
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap mt-3">
                <div className="d-flex flex-grow-1 gap-3">
                  <RadioInput
                    name="type"
                    label="BibTex"
                    value={1}
                    onChange={(e) => setCType(e?.target?.value)}
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap mt-3">
                <div className="d-flex flex-grow-1 gap-3">
                  <RadioInput
                    name="type"
                    label="Plain Text"
                    value={2}
                    onChange={(e) => setCType(e?.target?.value)}
                  />
                </div>
              </div>
            </div>

            <div className="ms-4 me-4 mt-4">
              <div className="mt-1">Select the type of file</div>
              <div className="color-danger mt-1">{showCitationError}</div>
              <div className="d-flex flex-wrap mt-3">
                <div className="d-flex flex-grow-1 gap-3">
                  <RadioInput
                    name="citation_type"
                    label="Citation Only"
                    value={0}
                    onChange={(e) => setCitationType(e?.target?.value)}
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap mt-3">
                <div className="d-flex flex-grow-1 gap-3">
                  <RadioInput
                    name="citation_type"
                    label="Citation and Abstract"
                    value={1}
                    onChange={(e) => setCitationType(e?.target?.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 d-flex justify-content-center gap-4 align-items-center flex-wrap mb-4">
              <Button
                isRounded
                text="Cancel"
                btnStyle="light-yellow"
                className="cps-40 cpe-40"
                onClick={() => handleCancel()}
              />

              <Button
                isRounded
                text="Download"
                btnStyle="primary-dark"
                className="cps-40 cpe-40"
                onClick={() => downloadCitation()}
              />
            </div>
          </div>
        </Modal>
      )}
      {children ? (
        <div
          className="d-flex pointer"
          onClick={() => {
            setIsShare(true);
          }}
        >
          {children}
        </div>
      ) : (
        <>
          {className?.includes("cite-available") && (
            <div
              className="color-new-car text-16-400 pointer d-flex align-items-center me-3"
              onClick={() => {
                setExportPopup(true);
              }}
            >
              <button type="button" class="btn btn-outline-primary">
                Export Citation
              </button>
            </div>
          )}
          <div
            className={
              className
                ? className?.includes("cite-available")
                  ? "color-new-car text-16-400 pointer d-flex align-items-center"
                  : className
                : "color-new-car text-16-400 pointer d-flex align-items-center"
            }
            onClick={() => {
              setIsShare(true);
            }}
          >
            <i className="bi bi-share me-2" />
            {!noTitle && (
              <span className="test-14-400 color-title-navy">Share</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default ShareButton;
