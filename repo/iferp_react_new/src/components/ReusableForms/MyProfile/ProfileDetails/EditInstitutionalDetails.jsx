import Modal from "components/Layout/Modal";
import InstitutionDetails from "pages/Register/MemberDetails/InstitutionDetails";

const EditInstitutionalDetails = ({ profileData, getProfiles, onHide }) => {
  return (
    <Modal onHide={onHide} title="Edit Institution Details">
      <div className="cmt-34 cms-34 cme-34 cmb-34">
        <InstitutionDetails
          isEdit
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
export default EditInstitutionalDetails;
