import {
  Modal,
  InputText,
  TextArea,
  Dropdown,
  Label,
  Button,
} from "components";
import { icons } from "utils/constants";

const Compose = ({ onHide }) => {
  return (
    <Modal title="Compose" size="md" onHide={onHide}>
      <div className="cps-30 cpe-30 cpb-30 cpt-20">
        <div className="cmb-20">
          <Dropdown
            options={[]}
            value=""
            label="To"
            placeholder="Enter or select member"
          />
        </div>
        <div className="cmb-20">
          <InputText label="Subject" placeholder="Enter the subject" />
        </div>
        <div className="cmb-20">
          <TextArea
            label="Message"
            placeholder="Enter the Description"
            rows={4}
          />
        </div>
        <div>
          <Label label="Attach File" />
          <div className="file-upload-block cmt-20">
            <span className="file-upload-input">
              <div className="choose_file">
                <Button
                  btnStyle="SO"
                  btnText="Upload File"
                  leftIcon={icons.successUpload}
                  className="h-34 text-15-400"
                />
                <input name="Select File" type="file" onChange={() => {}} />
              </div>
            </span>
          </div>
          <div className="mt-3">
            <div className="fb-center b-e3e3 rounded cp-16">
              <div className="fa-center gap-2">
                <div>
                  <img src={icons.pdf} alt="pdf" />
                </div>
                <div>
                  <div className="text-13-500 color-2121">
                    Research Article.pdf
                  </div>
                  <div className="text-12-400 color-3d3d">562 KB</div>
                </div>
              </div>
              <div>
                <img src={icons.closeRounded} alt="close" />
              </div>
            </div>
          </div>
          <div className="f-center gap-4 mt-4">
            <Button btnText="Send Message" btnStyle="SD" onClick={() => {}} />
            <div className="text-16-400 color-5555 pointer" onClick={onHide}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Compose;
