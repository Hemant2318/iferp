import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Button from "../Button";
import Modal from "../../Layout/Modal";
import { icons } from "utils/constants";
import { bytesToSize, getFilenameFromUrl } from "utils/helpers";
import "./UploadCertificate.scss";

const fileTypes = ["JPG", "PNG", "GIF"];
const UploadCertificate = ({
  onHide,
  onSave,
  handelSuccess,
  oldData,
  isSingle,
  title = "Upload Certificate",
}) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [file, setFile] = useState([]);
  const [oldFile, setOldFile] = useState(oldData || []);
  const handleChange = (e) => {
    let newFiles = [];
    if (isSingle) {
      setOldFile([]);
      newFiles = [e];
    } else {
      Object.entries(e).forEach((elem) => {
        newFiles.push(elem[1]);
      });
    }
    setFile(newFiles);
  };
  const handelRemove = (elemIndex) => {
    let removeList = file.filter((elem, index) => {
      return index !== elemIndex;
    });
    setFile(removeList);
  };
  const getBase64 = (file, res) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      res(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };
  return (
    <Modal onHide={onHide} title={title} size="md">
      <div
        id="upload-certificate-container"
        className="cmt-28 cps-30 cpe-30 text-center"
      >
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          multiple={isSingle ? false : true}
        >
          <div id="drop-area-box">
            <div>
              <img src={icons.imageUpload} alt="img" />
            </div>
            <div className="text-15-400 color-dark-silver cmt-20">
              Drag and drop or{" "}
              <span className="color-new-car pointer">browse</span> your files
            </div>
          </div>
        </FileUploader>
        <div className="list-container cmt-20 iferp-scroll">
          {oldFile.map((elem, index) => {
            return (
              <div className="list-block cmb-12" key={index}>
                <div className="left-block">
                  <div className="image-type">
                    <img src={icons.jpgType} alt="type" />
                  </div>
                  <div className="image-info">
                    <div className="text-13-500 color-raisin-black">
                      {getFilenameFromUrl(elem?.certificate)}
                    </div>
                  </div>
                </div>
                <div className="delete-block">
                  <i
                    className="bi bi-x-circle text-24-400 color-black-olive pointer"
                    onClick={() => {
                      let removeList = oldFile.filter((old, oldIndex) => {
                        return index !== oldIndex;
                      });
                      setOldFile(removeList);
                    }}
                  />
                </div>
              </div>
            );
          })}
          {file &&
            file.length > 0 &&
            file.map((elem, index) => {
              return (
                <div className="list-block cmb-12" key={index}>
                  <div className="left-block">
                    <div className="image-type">
                      <img src={icons.jpgType} alt="type" />
                    </div>
                    <div className="image-info">
                      <div className="text-13-500 color-raisin-black">
                        {elem["name"]}
                      </div>
                      <div className="text-12-400 color-davys-gray mt-1">
                        {bytesToSize(elem["size"])}
                      </div>
                    </div>
                  </div>
                  <div className="delete-block">
                    <i
                      className="bi bi-x-circle text-24-400 color-black-olive pointer"
                      onClick={() => {
                        handelRemove(index);
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
        <div className="d-flex justify-content-center gap-4 cmt-30 cpb-30">
          <Button
            text="Cancel"
            isRounded
            btnStyle="light-outline"
            className="cps-40 cpe-40"
            onClick={onHide}
          />
          <Button
            isRounded
            text="Done"
            btnStyle="primary-dark"
            className="cps-40 cpe-40"
            onClick={() => {
              setBtnLoading(true);
              let encodeFile = [];
              for (var i = 0; i < file.length; i++) {
                getBase64(file[i], (result) => {
                  if (result) {
                    encodeFile.push({ id: "", certificate: result });
                  }
                });
              }
              setTimeout(async () => {
                const response = await onSave([...encodeFile, ...oldFile]);
                if (response?.status === 200) {
                  handelSuccess();
                } else {
                  setBtnLoading(false);
                }
              }, 500);
            }}
            disabled={file.length === 0 && oldFile.length === 0}
            btnLoading={btnLoading}
          />
        </div>
      </div>
    </Modal>
  );
};
export default UploadCertificate;
