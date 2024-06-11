import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { icons } from "utils/constants";
import { Button, Radio } from "components";
import Modal from "../Modal";
import "./ExportButton.scss";

const ExportButton = ({ exportAPI, payload = "", btnName, showExportType }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [isExportType, setIsExportType] = useState(false);
  const handelExport = async () => {
    if (exportAPI) {
      setBtnLoading(true);
      await dispatch(exportAPI(payload));
      setBtnLoading(false);
      setIsExportType(false);
      setType("");
    }
  };
  useEffect(() => {
    return () => {
      setType("");
    };
  }, []);

  return (
    <div className="export-button-container">
      {isExportType && (
        <Modal
          onHide={() => {
            setIsExportType(false);
          }}
          title="Export As"
        >
          <div className="cpt-50 cpb-20">
            <div className="d-flex justify-content-center align-items-center gap-5">
              <div className="d-flex">
                <Radio
                  value={1}
                  onChange={() => {
                    setType(1);
                  }}
                  checked={type === 1}
                />
                <div className="text-center type-block-container ms-3">
                  <img src={icons.pdf} alt="pdf" />
                  <div className="text-16-400 color-black-olive mt-2">PDF</div>
                </div>
              </div>
              <div className="d-flex">
                <Radio
                  value={2}
                  onChange={() => {
                    setType(2);
                  }}
                  checked={type === 2}
                />
                <div className="text-center type-block-container ms-3">
                  <img src={icons.excel} alt="excel" />
                  <div className="text-16-400 color-black-olive mt-2">
                    Excel
                  </div>
                </div>
              </div>
              <div className="d-flex">
                <Radio
                  value={3}
                  onChange={() => {
                    setType(3);
                  }}
                  checked={type === 3}
                />
                <div className="text-center type-block-container ms-3">
                  <img src={icons.jpg} alt="jpg" />
                  <div className="text-16-400 color-black-olive mt-2">JPG</div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center gap-4 cmt-40">
              <Button
                btnText="Cancel"
                className="cps-40 cpe-40"
                onClick={() => {
                  setIsExportType(false);
                }}
              />
              <Button
                btnText="Submit"
                btnStyle="primary-dark"
                className="cps-40 cpe-40"
                onClick={() => {
                  handelExport();
                }}
                type="submit"
                btnLoading={btnLoading}
                disabled={!type}
              />
            </div>
          </div>
        </Modal>
      )}
      <Button
        leftIcon={icons.downloadArrow}
        btnText={btnName}
        btnStyle="SO"
        className="h-35 text-16-400"
        onClick={() => {
          showExportType ? setIsExportType(true) : handelExport();
        }}
        btnLoading={!isExportType && btnLoading}
      />
    </div>
  );
};
export default ExportButton;
