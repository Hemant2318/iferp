import Modal from "components/Layout/Modal";

const ViewCV = ({ file, onHide }) => {
  const fileEx = file ? file?.split(".")?.pop() : "";
  let fileUrl = file;
  if (["pdf", "doc", "csv", "html"].includes(fileEx)) {
    if ((fileEx === "doc" || fileEx === "csv") && file) {
      fileUrl = `https://docs.google.com/gview?url=${file}&embedded=true`;
    }
  }
  return (
    <Modal onHide={onHide}>
      {file && (
        <>
          {["pdf", "doc", "csv", "html"].includes(fileEx) ? (
            <div>
              <iframe
                className="w-100"
                src={fileUrl}
                title="description"
                style={{
                  width: "100%",
                  height: "500px",
                }}
              />
            </div>
          ) : (
            <div className="mb-3 fit-img-block">
              <img src={file} alt="cv" />
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default ViewCV;
