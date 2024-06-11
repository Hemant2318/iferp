import Modal from "components/Layout/Modal";
import EducationDetails from "pages/Register/MemberDetails/EducationDetails";

const EditEducationDetails = ({
  profileData,
  getProfiles,
  onHide,
  hideReqField,
}) => {
  return (
    <Modal onHide={onHide} title="Edit Education Profile">
      <div className="cmt-34 cms-34 cme-34 cmb-34">
        <EducationDetails
          isEdit
          hideReqField={hideReqField}
          userDetails={profileData}
          fetchUserData={getProfiles}
          handelSuccess={() => {
            onHide();
          }}
        />
      </div>
    </Modal>
  );
};
export default EditEducationDetails;
