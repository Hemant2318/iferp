import { Button, Label, Radio, TextArea, InputText } from "components";

const PostDetails = ({ setFormType }) => {
  return (
    <div className="row cps-16 cpe-16 cpb-30">
      <div className="cmb-20">
        <TextArea
          label="Abstract/Description"
          placeholder="Enter Abstract/Description"
          rows={4}
        />
      </div>
      <div className="cmb-20">
        <InputText
          label="Conference Name"
          placeholder="Enter or Select Conference Name"
        />
      </div>
      <div className="col-md-6 cmb-20">
        <InputText label="Sponsors" placeholder="Enter Sponsors" />
      </div>
      <div className="col-md-6 cmb-20">
        <InputText label="Council" placeholder="Enter Council" />
      </div>
      <div className="cmb-20 fa-center gap-4">
        <Label label="Has this been peer-reviewed?*" />
        <div className="fa-center gap-4">
          <Radio label="Yes" checked={true} />
          <Radio label="No" />
        </div>
      </div>
      <div className="col-md-6 cmb-20">
        <InputText label="Journal Name" placeholder="Enter Journal Name" />
      </div>
      <div className="col-md-6 cmb-20">
        <InputText
          label="Existing DOI"
          placeholder="Enter Existing DOI, if any"
        />
      </div>
      <div className="f-center gap-4 mt-4">
        <Button
          btnText="Submit"
          btnStyle="SD"
          onClick={() => {}}
          className="ps-4 pe-4"
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

export default PostDetails;
