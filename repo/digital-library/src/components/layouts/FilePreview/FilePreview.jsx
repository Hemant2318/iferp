import { useDispatch } from "react-redux";
import { icons } from "utils/constants";
import { downloadFile } from "utils/helpers";
const docExt = "vnd.openxmlformats-officedocument.wordprocessingml.document";
const FilePreview = ({ url, onRemove, isDownload }) => {
  const dispatch = useDispatch();
  const { unknownFile, txtFile, pdfFile, docFile, xlsFile } = icons;
  const getFileExtension = () => {
    let fileType = "";
    if (url.includes("http")) {
      fileType = url.split(".").pop();
    } else {
      fileType = url.split(";")[0].split("/")[1];
    }
    return fileType;
  };
  const getFileContent = (urlContent = "") => {
    let fileType = getFileExtension(urlContent);
    switch (fileType) {
      case "jpg":
      case "jpeg":
      case "png":
        return url;
      case "txt":
      case "plain":
        return txtFile;
      case "pdf":
        return pdfFile;
      case "doc":
      case "docx":
      case "document":
      case docExt:
        return docFile;
      case "xls":
      case "csv":
        return xlsFile;

      default:
        return unknownFile;
    }
  };
  const isImage = ["jpg", "jpeg", "png"].includes(getFileExtension(url));
  return (
    <>
      <div
        className={`h-72 position-relative ${isImage ? "cps-12 cpe-12" : ""}`}
      >
        {onRemove && (
          <i
            className="bi bi-x-circle-fill position-absolute end-0 pe-1 pointer text-danger"
            onClick={onRemove}
          />
        )}

        <img
          src={getFileContent(url)}
          alt="test"
          className={`fit-image fill ${isDownload ? "pointer" : ""}`}
          onClick={() => {
            if (isDownload) {
              dispatch(downloadFile(url));
            }
          }}
        />
      </div>
    </>
  );
};
export default FilePreview;
