import { useEffect, useState } from "react";
import Label from "../Label";
import { icons } from "utils/constants";
import { useDispatch } from "react-redux";
import { throwError } from "store/globalSlice";
import "./FileUpload.scss";

const FileUpload = ({
  error,
  onChange,
  id,
  fileText,
  fileType,
  disabled,
  label,
  isRequired,
  labelClass,
  acceptType,
  placeholder,
}) => {
  const dispatch = useDispatch();
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
      let fileName = file["name"];
      let fileType = file["type"]?.split("/")?.pop();
      let isVideo = ["mp4"].includes(fileType);
      let maxVideoSize = 100000000;
      let maxFileSize = 10000000;
      let isInvalidaFileSize = isVideo
        ? file?.size > maxVideoSize
        : file?.size > maxFileSize;
      if (acceptType) {
        if (!acceptType.includes(fileType)) {
          dispatch(throwError("Invalid file selected"));
          onChange({
            target: { id: id, value: "", fileName: "" },
          });
          return;
        }
      }
      if (isInvalidaFileSize) {
        dispatch(throwError("File size is too large."));
        onChange({
          target: { id: id, value: "", fileName: "" },
        });
        return;
      }
      getBase64(file, (result) => {
        setFileName(fileName);
        onChange({
          target: { id: id, value: result, fileName: fileName, file: file },
        });
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
        returnValue = "image/png, image/jpeg, image/jpg";
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
    <div id="file-upload-container">
      {label && (
        <Label label={label} required={isRequired} className={labelClass} />
      )}
      <div
        className={`file-upload-data ${disabled ? " disabled-file-block" : ""}`}
      >
        <div className="file-upload-block d-flex gap-2">
          <span className="file-upload-input">
            <div className="choose_file">
              <span className="btn-block">
                <span className="me-2">
                  <img src={icons.imageUpload} alt="upload" />
                </span>
                <span className="text-14-500 color-3d3d">Upload</span>
              </span>
              <input
                name="Select File"
                placeholder={placeholder}
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
export default FileUpload;
