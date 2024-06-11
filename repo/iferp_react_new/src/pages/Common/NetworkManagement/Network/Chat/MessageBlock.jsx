import DropdownOption from "components/Layout/DropdownOption";
import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";
import { chatPath } from "utils/constants";
import { generatePreSignedUrl, getFilenameFromUrl } from "utils/helpers";

const MessageBlock = ({ data, is_delete, isAccess, handleDelete }) => {
  const { id, message, created_at, message_file, url } = data;
  let fileType = message_file ? message_file?.split(".").pop() : "";
  const [fileURL, setFileURL] = useState("");
  const getURL = async (url) => {
    let fileContent = await generatePreSignedUrl(
      getFilenameFromUrl(url),
      chatPath
    );
    setFileURL(fileContent);
  };
  useEffect(() => {
    if (message_file) {
      getURL(message_file);
    }
  }, [message_file]);

  return (
    <div>
      {is_delete ? (
        <div className="d-flex gap-5">
          <span className="text-12-400">This message was deleted.</span>
          {isAccess && (
            <span
              className="ps-1 pe-1 border rounded text-12-400 pointer"
              onClick={() => {
                handleDelete(id, 0);
              }}
            >
              Undo
            </span>
          )}
        </div>
      ) : (
        <div>
          {isAccess && (
            <div className="d-flex justify-content-end pointer h-auto">
              <DropdownOption icons={<i className="bi bi-three-dots" />}>
                <div
                  className="d-flex gap-3 text-16-400 ps-3"
                  onClick={() => {
                    handleDelete(id, 1);
                  }}
                >
                  <span>
                    <i className="bi bi-trash text-danger" />
                  </span>
                  <span>Delete</span>
                </div>
              </DropdownOption>
            </div>
          )}
          <div className="d-flex justify-content-between gap-2">
            {message_file ? (
              <div>
                {["png", "jpg", "jpef"].includes(fileType) ? (
                  <img
                    src={fileURL}
                    className="fill fit-image"
                    alt="chatImage"
                    style={{
                      height: "150px",
                    }}
                    onClick={() => window.open(fileURL, '_blank')}
                  />
                ) : ["txt", "pdf", "doc", "csv"].includes(fileType) ? (
                  <div className="d-flex align-items-center border rounded p-2 gap-4" >
                    <div className="text-18-400">
                      <i className="bi bi-file-earmark" />
                    </div>
                    <div>{getFilenameFromUrl(message_file)}</div>
                    <div className="ps-2 pe-2 pt-1 pb-1 border rounded pointer">
                      <i className="bi bi-cloud-arrow-down-fill"  onClick={()=>{
                        window.open(fileURL, '_blank')
                      }} />
                    </div>
                  </div>
                ) : fileType === "mp3" ? (
                  <audio key={fileURL} controls>
                    <source src={fileURL} type="audio/mpeg" />
                  </audio>
                ) : fileType === "mp4" ? (
                  <>
                    <video width="100%" key={fileURL} controls>
                      <source src={fileURL} type="video/mp4" />
                    </video>
                  </>
                ) : (
                  "File not suported"
                )}
              </div>
            ) : (
              <div>{message}
                <div className={`${!isAccess && 'color-new-car'} text-decoration-underline pointer`} onClick={() => window.open( window.location.origin + url, "_blank")}>{url !== null ? window.location.origin + url : ''}</div>
              </div>
            )}
          </div>
          <div className="chat__message__date mt-1">
            {moment(created_at).format("hh:mm A")}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBlock;
