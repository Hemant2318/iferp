import { useState } from "react";
import {
  Button,
  Checkbox,
  Radio,
  InputText,
  PasswordInput,
  PhoneNumberInput,
  Profile,
  FileUpload,
  TextArea,
  Modal,
  CustomTab,
} from "components";
import { useDispatch } from "react-redux";
import { showSuccess, throwError } from "store/globalSlice";
import { icons } from "utils/constants";

const imageURL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjb-Jsep9tAcYMGcwnDZl9MuXwtJ87LMh-KkFZT04M9XQRs6I0mWi4GJcUD7bTPEOAXRU&usqp=CAU";

const Typography = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="container mt-5">
      {showModal && (
        <Modal
          onHide={() => {
            setShowModal(false);
          }}
        >
          Content
        </Modal>
      )}
      <div className="d-flex flex-wrap gap-3 mb-3">
        <Button btnText="Join Now" btnStyle="PD" onClick={() => {}} />
        <Button
          btnText="Full-text available"
          btnStyle="PO"
          onClick={() => {}}
        />
        <Button
          btnText="Follow"
          btnStyle="PO"
          onClick={() => {}}
          className="ps-4 pe-4"
        />
        <Button
          btnText="Article"
          btnStyle="GD"
          onClick={() => {}}
          className="ps-4 pe-4"
        />
        <Button btnText="Unfollow" btnStyle="GO" onClick={() => {}} />
        <Button
          btnText="ERROR"
          btnStyle="PD"
          onClick={() => {
            dispatch(throwError("Something went wrong!"));
          }}
        />
        <Button
          btnText="SUCCESS"
          btnStyle="SD"
          onClick={() => {
            dispatch(showSuccess("Data Fetch Successfully."));
          }}
        />
        <Button
          btnText="OPEN MODAL"
          btnStyle="SO"
          onClick={() => {
            setShowModal(true);
          }}
        />
      </div>
      <div className="d-flex flex-wrap gap-3 mb-3">
        <Button
          btnText="Create Organizer Profile"
          btnStyle="SD"
          onClick={() => {}}
        />
        <Button
          btnText="Publish Now"
          btnStyle="SD"
          onClick={() => {}}
          rightIcon={icons.rightSuccess}
        />

        <Button
          btnText="Continue"
          btnStyle="SD"
          onClick={() => {}}
          rightIcon={icons.rightArrow}
        />
        <Button
          btnText="Publish"
          btnStyle="SD"
          onClick={() => {}}
          leftIcon={icons.publish}
        />
        <Button
          btnText="Predio"
          btnStyle="SO"
          onClick={() => {}}
          leftIcon={icons.downloadArrow}
        />
      </div>

      <div className="fa-center gap-5 mb-3">
        <div className="primary-pill">Education</div>
        <div className="d-flex gap-3">
          <Radio
            label="RIS"
            checked={true}
            onClick={(e) => {
              console.log(e);
            }}
          />
          <Radio
            label="BibTeX"
            checked={false}
            onClick={(e) => {
              console.log(e);
            }}
          />
        </div>
        <div className="d-flex gap-3">
          <Checkbox
            label="RIS"
            checked={true}
            onClick={(e) => {
              console.log(e);
            }}
          />
          <Checkbox
            label="BibTeX"
            checked={false}
            onClick={(e) => {
              console.log(e);
            }}
          />
        </div>
      </div>
      <div className="mb-3 border rounded p-2">
        <div className="fb-center">
          <CustomTab
            active="abstract"
            options={[
              {
                title: "Abstract",
                activeText: "abstract",
              },
              {
                title: "Conferences",
                activeText: "conferences",
              },
              {
                title: "Statistics",
                activeText: "statistics",
              },
              {
                title: "Comments",
                activeText: "comments",
              },
              {
                title: "Figures",
                activeText: "figures",
              },
              {
                title: "Citations",
                activeText: "citations",
              },
            ]}
          />
          <div className="d-flex gap-3">
            <Button
              btnText="Follow"
              btnStyle="PD"
              onClick={() => {}}
              className="ps-4 pe-4"
            />
            <Button
              btnText="Share"
              btnStyle="PO"
              onClick={() => {}}
              className="ps-4 pe-4"
            />
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <InputText
            label="Organization Name*"
            placeholder="Enter organization name"
          />
        </div>
        <div className="col-md-6 mb-2">
          <PasswordInput
            isShowSuggetion
            label="Password*"
            placeholder="Enter password"
            onChange={() => {}}
            value=""
          />
        </div>
        <div className="col-md-6 mb-2">
          <PhoneNumberInput
            isShowSuggetion
            label="Contact Number*"
            placeholder="Enter contact number"
            onChange={() => {}}
            value=""
            phoneNumberData={{
              id: "country_code",
              value: "IN",
            }}
          />
        </div>
        <div className="col-md-6 mb-2">
          <FileUpload
            label="Organization’s Logo*"
            id="profile_photo_path"
            onChange={(e) => {
              console.log(e);
            }}
            fileText=""
            fileType="image"
          />
        </div>
        <div className="mb-2">
          <TextArea
            rows={3}
            label="About Organization*"
            placeholder="Enter few lines about the organization"
            value=""
            id="about_article"
            onChange={() => {}}
          />
        </div>
      </div>
      <div>
        <div className="fa-center gap-4 mb-3">
          <Profile text="John Doe" url={imageURL} size="s-18" />
          <Profile text="John Doe" size="s-18" />
          <Profile isRounded text="John Doe" url={imageURL} size="s-18" />
          <Profile isRounded text="John Doe" size="s-18" />
          <Profile text="John Doe" url={imageURL} size="s-26" />
          <Profile text="John Doe" size="s-26" />
          <Profile isRounded text="John Doe" url={imageURL} size="s-26" />
          <Profile isRounded text="John Doe" size="s-26" />
          <Profile text="John Doe" url={imageURL} size="s-44" />
          <Profile text="John Doe" size="s-44" />
          <Profile isRounded text="John Doe" url={imageURL} size="s-44" />
          <Profile isRounded text="John Doe" size="s-44" />
          <Profile text="John Doe" url={imageURL} size="s-52" />
          <Profile text="John Doe" size="s-52" />
          <Profile isRounded text="John Doe" url={imageURL} size="s-52" />
          <Profile isRounded text="John Doe" size="s-52" />
          <Profile text="John Doe" url={imageURL} size="s-66" />
          <Profile text="John Doe" size="s-66" />
          <Profile isRounded text="John Doe" url={imageURL} size="s-66" />
          <Profile isRounded text="John Doe" size="s-66" />
          <Profile text="John Doe" url={imageURL} size="s-72" />
          <Profile text="John Doe" size="s-72" />
          <Profile isRounded text="John Doe" url={imageURL} size="s-72" />
          <Profile isRounded text="John Doe" size="s-72" />
          <Profile text="John Doe" url={imageURL} size="s-172" />
          <Profile text="John Doe" size="s-172" />
          <Profile isRounded text="John Doe" url={imageURL} size="s-172" />
          <Profile isRounded text="John Doe" size="s-172" />
          <Profile text="John Doe" url={imageURL} size="s-262" />
          <Profile text="John Doe" size="s-262" />
          <Profile isRounded text="John Doe" url={imageURL} size="s-262" />
          <Profile isRounded text="John Doe" size="s-262" />
        </div>
      </div>
    </div>
  );
};

export default Typography;
