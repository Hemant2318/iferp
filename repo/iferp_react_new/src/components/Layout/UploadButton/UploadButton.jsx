import { useEffect, useState } from "react";
import Button from "../../form/Button";
import "./UploadButton.scss";

const UploadButton = ({
  error,
  onChange,
  id,
  fileText,
  fileType,
  disabled,
}) => {
  const [fileName, setFileName] = useState("");

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
  const handelOnChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      getBase64(file, (result) => {
        setFileName(file["name"]);
        onChange({ target: { id: id, value: result, fileName: file["name"] } });
      });
    }
  };
  useEffect(() => {
    setFileName(fileText);
  }, [fileText]);

  const acceptFileType = (fileType) => {
    let returnValue = "";
    switch (fileType) {
      case "image":
        returnValue = "image/png, image/jpeg";
        break;
      case "file":
        returnValue = "";
        break;
      case "all":
        returnValue = "";
        break;

      default:
        returnValue = "";
        break;
    }
    return returnValue;
  };
  const inputFileType = acceptFileType(fileType || "");
  return (
    <div id="upload-button-container">
      <div
        className={`file-upload-data ${disabled ? " disabled-file-block" : ""}`}
      >
        <div className="file-upload-block">
          <span className="file-upload-input">
            <div className="choose_file">
              <Button
                icon={<i className="bi bi-cloud-arrow-up text-24-500 me-2" />}
                text="Upload"
                btnStyle="primary-outline"
                onClick={() => {}}
                className="cps-24 cpe-24"
                isSquare
              />
              <input
                name="Select File"
                type="file"
                onChange={handelOnChange}
                accept={inputFileType}
              />
            </div>
          </span>
          <span className="file-upload-name">{fileName}</span>
        </div>
      </div>
      {error && (
        <div className="text-13-400 pt-1">
          <span style={{ color: "red" }}>{error}</span>
        </div>
      )}
    </div>
  );
};
export default UploadButton;
