import Modal from "components/Layout/Modal";
import CompanyDetails from "pages/Register/MemberDetails/CompanyDetails";

const EditCompanyDetails = ({ profileData, getProfiles, onHide }) => {
  return (
    <Modal onHide={onHide} title="Edit Company Details">
      <div className="cmt-34 cms-34 cme-34 cmb-34">
        <CompanyDetails
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
export default EditCompanyDetails;
