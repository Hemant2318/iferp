import { useEffect, useState } from "react";
import Label from "../Label";
import { icons } from "utils/constants";
import { useDispatch } from "react-redux";
import { throwError } from "store/slices";
import { getDataFromLocalStorage } from "utils/helpers";
import "./MultipleFileUpload.scss";

const MultipleFileUpload = ({
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
}) => {
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState([]);

  const getBase64 = (filesList, res) => {
    let promises = [];
    Array.from(filesList)?.forEach((file) => {
      promises.push(
        new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            resolve(reader.result);
          };
          reader.onerror = function (error) {
            reject(error);
          };
        })
      );
    });
    Promise.all(promises)
      .then((results) => {
        res(results);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  const handelOnChange = (e) => {
    const files = e.target.files;
    if (files?.length > 0) {
      let fileNames = Array.from(files)?.map((file) => file?.name);

      let fileType = Array.from(files)?.map((file) =>
        file?.type?.split("/")?.pop()
      );
      let maxVideoSize =
        getDataFromLocalStorage("user_type") === "0" ? 100000000 : 30000000;
      let maxFileSize = 10000000;
      let invalidFiles = [];
      let isVideo = fileType === "mp4";

      Array.from(files)?.forEach((file) => {
        if (acceptType && !acceptType?.includes(file?.type?.split("/")[1])) {
          invalidFiles?.push(file?.name);
        } else if (isVideo && file?.size > maxVideoSize) {
          invalidFiles?.push(file?.name);
        } else if (!isVideo && file?.size > maxFileSize) {
          invalidFiles?.push(file?.name);
        }
      });

      if (invalidFiles?.length > 0) {
        dispatch(
          throwError({
            message: "Invalid file(s) selected: " + invalidFiles.join(", "),
          })
        );
        onChange({
          target: { id: id, value: [], fileNames: [] },
        });
        return;
      }

      getBase64(files, (results) => {
        setFileName(fileNames);
        onChange({
          target: {
            id: id,
            value: results,
            fileNames: fileNames,
            files: files,
          },
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
    <div id="multiple-file-upload-container">
      {label && (
        <Label label={label} required={isRequired} className={labelClass} />
      )}
      <div
        className={`file-upload-data ${disabled ? " disabled-file-block" : ""}`}
      >
        <div className="file-upload-block">
          <span className="file-upload-input">
            <div className="choose_file">
              <span className="btn-block">
                <span className="me-2">
                  <img src={icons.imageUpload} alt="upload" />
                </span>
                <span>Upload</span>
              </span>
              <input
                name="Select File"
                type="file"
                multiple
                onChange={handelOnChange}
                accept={inputFileType}
              />
            </div>
          </span>
          {fileName?.length > 0 && (
            <span className="file-upload-name">{fileName?.join(", ")}</span>
          )}
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
export default MultipleFileUpload;
