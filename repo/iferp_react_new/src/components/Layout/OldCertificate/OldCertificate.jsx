import { useState } from "react";
import Button from "components/form/Button";
import Modal from "../Modal";
import { useDispatch } from "react-redux";
import { getAbstarctCertificate } from "store/slices";
import { getDataFromLocalStorage } from "utils/helpers";
import Label from "components/form/Label";
import "./OldCertificate.scss";

const OldCertificate = ({ sendToParent, handleSuccess }) => {
  const dispatch = useDispatch();
  const userID = getDataFromLocalStorage("id");
  const [id, setID] = useState("");
  const [btnLoader, setBtnLoader] = useState("");
  const [formData, setFormData] = useState({
    form_link: "",
    certifi_no: "",
    title: "",
    name: "",
    clgname: "",
  });
  const handelSave = async () => {
    setBtnLoader(true);
    const params = `abstract_id=${id}&user_id=${userID}`;
    const response = await dispatch(getAbstarctCertificate(params));
    if (response?.status !== 200) {
      sendToParent(id);
    } else {
      const { certificate_no, form_link, paper_title, user_name } =
        response?.data || {};
      setFormData((prev) => {
        return {
          ...prev,
          form_link: form_link || "",
          certifi_no: certificate_no || "",
          title: paper_title || "",
          name: user_name || "",
          clgname: "",
        };
      });
    }
    setBtnLoader(false);
  };
  const handelChange = (e) => {
    let name = e?.target?.name;
    let value = e?.target?.value;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  return (
    <div className="w-75" id="OldCertificate-container">
      {formData?.form_link && (
        <Modal
          onHide={() => {
            setFormData({
              form_link: "",
              certifi_no: "",
              title: "",
              name: "",
              clgname: "",
            });
          }}
        >
          <div className="outside-certificate-form cps-30 cpe-30 cpb-30 cpt-20">
            <form method="POST" action={formData?.form_link} target="_blank">
              <div className="cmb-20">
                <Label label="Certificate No" />
                <input
                  className="out-input"
                  type="text"
                  value={formData?.certifi_no}
                  name="certifi_no"
                  onChange={handelChange}
                  readOnly
                />
              </div>
              <div className="cmb-20">
                <Label label="Title" required />
                <input
                  className="out-input"
                  type="text"
                  value={formData?.title}
                  name="title"
                  onChange={handelChange}
                  required
                  readOnly
                />
              </div>
              <div className="cmb-20">
                <Label label="Name" required />
                <input
                  className="out-input"
                  type="text"
                  value={formData?.name}
                  name="name"
                  onChange={handelChange}
                  required
                  readOnly
                />
              </div>
              <div className="cmb-20">
                <Label label="College Name" required />
                <input
                  className="out-input"
                  placeholder="Enter college name"
                  type="text"
                  value={formData.clgname}
                  name="clgname"
                  onChange={handelChange}
                  required
                />
              </div>
              <div>
                <input type="hidden" value="1" name="submit" />
              </div>
              <div className="d-flex justify-content-center gap-3 pt-3">
                <Button
                  text="Cancel"
                  isRounded
                  btnStyle="light-outline"
                  className="cps-40 cpe-40"
                  onClick={() => {
                    setFormData({
                      form_link: "",
                      certifi_no: "",
                      title: "",
                      name: "",
                      clgname: "",
                    });
                  }}
                />
                <button type="submit" className="btn-out-save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
      <div className="input-block-box">
        <input
          type="text"
          placeholder="Enter Abstarct ID"
          value={id}
          onChange={(e) => {
            if (e.target.value) {
              setID(e.target.value);
            } else {
              setID("");
              handleSuccess();
            }
          }}
          onKeyUp={(e) => {
            if (e?.keyCode === 13 && id) {
              handelSave();
            }
          }}
        />
        <div className="d-flex btn-b-block">
          <Button
            text="Submit"
            btnStyle="primary-dark"
            className="h-auto text-12-400"
            onClick={handelSave}
            disabled={!id}
            btnLoading={btnLoader}
          />
        </div>
      </div>
    </div>
  );
};
export default OldCertificate;
