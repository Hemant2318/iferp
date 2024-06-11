import Modal from "components/Layout/Modal";
import AdminDetails from "pages/Register/MemberDetails/AdminDetails";

const EditAdminDetails = ({ profileData, getProfiles, onHide }) => {
  return (
    <Modal onHide={onHide} title="Edit Admin Details">
      <div className="cmt-34 cms-34 cme-34 cmb-34">
        <AdminDetails
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
export default EditAdminDetails;
