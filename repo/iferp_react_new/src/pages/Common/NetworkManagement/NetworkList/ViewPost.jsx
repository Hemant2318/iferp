import Button from "components/form/Button";
import FilePreview from "components/Layout/FilePreview";
import Modal from "components/Layout/Modal";

const ViewPost = ({ onHide, data }) => {
  const { post, member_id_type, name, title, s3File } = data;
  const postType = post ? post?.split(".")?.pop() : "";
  return (
    <Modal onHide={onHide} title="Post Details">
      <div className="row cmt-40">
        {post && (
          <div className="col-md-6 center-flex">
            {["pdf", "doc", "docx", "csv", "html"].includes(postType) ? (
              <FilePreview url={`http://${post}`} />
            ) : (
              <img src={s3File} alt="post" className="fit-image fill" />
            )}
          </div>
        )}
        <div className={post ? "col-md-6" : "cms-30"}>
          <div className="row cmb-30">
            <span className="text-15-400 color-black-olive col-md-4">
              Member
            </span>
            <span className="text-15-500 color-raisin-black col-md-8">
              {member_id_type}
            </span>
          </div>
          <div className="row cmb-30">
            <span className="text-15-400 color-black-olive col-md-4">Name</span>
            <span className="text-15-500 color-raisin-black col-md-8">
              {name}
            </span>
          </div>
          <div className="row cmb-30">
            <span className="text-15-400 color-black-olive col-md-4">
              Post Title
            </span>
            <span className="text-15-500 color-raisin-black col-md-8">
              {title}
            </span>
          </div>
        </div>
      </div>
      <div className="center-flex cmt-50 cmb-20">
        <Button
          isRounded
          btnStyle="primary-dark"
          onClick={onHide}
          text="Done"
          className="cps-30 cpe-30"
        />
      </div>
    </Modal>
  );
};
export default ViewPost;
