import Modal from "components/Layout/Modal";
import PersonalDetails from "pages/Register/MemberDetails/PersonalDetails";

const EditPersonalDetails = ({ onHide, profileData, getProfiles }) => {
  return (
    <Modal onHide={onHide} title="Edit Personal Profile">
      <div className="cmt-34 cms-34 cme-34 cmb-34">
        <PersonalDetails
          isEdit
          userDetails={profileData}
          fetchUserData={getProfiles}
          afterRedirect={() => {
            onHide();
          }}
          handelSuccess={() => {
            onHide();
          }}
        />
      </div>
    </Modal>
  );
};
export default EditPersonalDetails;
