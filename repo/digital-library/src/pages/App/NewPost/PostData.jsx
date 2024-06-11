import {
  Button,
  DatePicker,
  Dropdown,
  FileUpload,
  InputText,
} from "components";
import { icons } from "utils/constants";

const PostData = ({ setFormType }) => {
  return (
    <div className="row cps-16 cpe-16 cpb-30">
      <div className="col-md-6 cmb-20">
        <Dropdown
          options={[]}
          value=""
          label="Post Category"
          placeholder="Select Post Category"
        />
      </div>
      <div className="col-md-6 cmb-20">
        <FileUpload label="Full-paper" />
      </div>
      <div className="cmb-20">
        <InputText label="Post Title" placeholder="Enter Post Title" />
      </div>
      <div className="col-md-6 cmb-20">
        <FileUpload label="Video Presentation" />
      </div>
      <div className="col-md-6 cmb-20">
        <DatePicker placeholder="Select Date" label="Date" />
      </div>
      <div className="col-md-6 cmb-20">
        <Dropdown
          options={[]}
          value=""
          label="Keywords"
          placeholder="Enter or Select Keywords"
        />
      </div>
      <div className="col-md-6 cmb-20">
        <Dropdown
          options={[]}
          value=""
          label="Topic/Area of Interest"
          placeholder="Enter or Select Area of Interest"
        />
      </div>
      <div className="col-md-6 cmb-20">
        <Dropdown
          options={[]}
          value=""
          label="Add Authors"
          placeholder="Enter or Select Authors"
        />
      </div>
      <div className="col-md-6 cmb-20">
        <Dropdown
          options={[]}
          value=""
          label="Add Co-Authors"
          placeholder="Enter or Select Authors"
        />
      </div>
      <div className="col-md-6 cmb-20">
        <InputText label="DOI" placeholder="Enter DOI" />
      </div>
      <div className="f-center gap-4 mt-4">
        <Button
          btnText="Continue"
          btnStyle="SD"
          onClick={() => {
            setFormType(1);
          }}
          rightIcon={icons.rightSuccess}
        />
        <div
          className="text-16-400 color-5555 pointer"
          onClick={() => {
            setFormType(0);
          }}
        >
          Cancel
        </div>
      </div>
    </div>
  );
};

export default PostData;
