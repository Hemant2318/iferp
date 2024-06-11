import { useState } from "react";
import Modal from "../Modal/Modal";
import { useDispatch } from "react-redux";
import {
  downloadCitationFormat,
  showSuccess,
  throwError,
} from "store/globalSlice";
import { downloadFile, objectToFormData } from "utils/helpers/common";
import Button from "../../inputs/Button/Button";
import RadioInput from "../../inputs/RadioInput/RadioInput";

const ExportCitationPopup = ({ setExportPopup, exportPopup }) => {
  const dispatch = useDispatch();
  const [cType, setCType] = useState(null);
  const [citationType, setCitationType] = useState(null);
  const [showTypeError, setShowTypeError] = useState("");
  const [showCitationError, setShowCitationError] = useState("");

  const downloadCitation = async (id) => {
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
            post_id: id,
            type: cType,
            cation_type: citationType,
          })
        )
      );
      if (response?.data?.file_path) {
        dispatch(downloadFile(response?.data?.file_path));
        handleCancel();
        dispatch(showSuccess(response?.message));
      } else {
        dispatch(throwError(response?.message));
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
          <div className="mt-1" style={{ color: "red" }}>
            {showTypeError}
          </div>
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
          <div className="mt-1" style={{ color: "red" }}>
            {showCitationError}
          </div>
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
            btnText="Cancel"
            btnStyle="light-yellow"
            className="cps-40 cpe-40"
            onClick={() => handleCancel()}
          />

          <Button
            isRounded
            btnText="Download"
            btnStyle="SD"
            className="cps-40 cpe-40"
            onClick={() => downloadCitation(exportPopup)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ExportCitationPopup;
