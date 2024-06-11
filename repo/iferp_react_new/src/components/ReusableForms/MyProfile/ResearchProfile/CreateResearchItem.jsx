import CreatePost from "components/Layout/CreatePost";
import Modal from "components/Layout/Modal";

const CreateResearchItem = ({ onHide, handelSuccess }) => {
  return (
    <Modal onHide={onHide}>
      <div className="cpb-40">
        <CreatePost
          label="Add Research Item"
          hideParent={onHide}
          successParent={handelSuccess}
        />
      </div>
    </Modal>
  );
};
export default CreateResearchItem;
