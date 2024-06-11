import Modal from "components/Layout/Modal";
import GroupForm from "components/ReusableForms/GroupForm";

const GroupFormPopup = ({ onHide, handelSuccess, editData }) => {
  return (
    <Modal
      onHide={onHide}
      size="md"
      title={`${editData ? "Edit" : "Create"} Special Interest Community`}
    >
      <GroupForm
        handelSuccess={handelSuccess}
        editData={editData}
        onHide={onHide}
        isPopup
      />
    </Modal>
  );
};
export default GroupFormPopup;
