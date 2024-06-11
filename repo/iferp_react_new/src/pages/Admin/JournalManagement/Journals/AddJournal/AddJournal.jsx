import { useState } from "react";
import { useDispatch } from "react-redux";
import { isEqual } from "lodash";
import { Formik } from "formik";
import * as Yup from "yup";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import FileUpload from "components/form/FileUpload";
import Dropdown from "components/form/Dropdown";
import Modal from "components/Layout/Modal";
import { journalType } from "utils/constants";
import { addJournal, editJournal } from "store/slices";
import {
  formatNumber,
  getFilenameFromUrl,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const AddJournal = ({ onHide, editData, handelSuccess }) => {
  const dispatch = useDispatch();
  const initialValues = {
    name: editData?.name || "",
    type: editData?.type || "",
    issn: editData?.issn || "",
    logo: editData?.logo || "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    type: Yup.string().required("Type is required."),
    issn: Yup.string().required("ISSN is required."),
    logo: Yup.string().required("Logo is required."),
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = (values) => {
    setBtnLoading(true);
    if (editData) {
      if (isEqual(initialValues, values)) {
        onHide();
      } else {
        handelEditData({ ...values, id: editData.id });
      }
    } else {
      handelAddData(values);
    }
  };
  const handelAddData = async (values) => {
    let forData = objectToFormData(values);
    const response = await dispatch(addJournal(forData));
    if (response?.status === 200) {
      handelSuccess();
    } else {
      setBtnLoading(false);
    }
  };
  const handelEditData = async (values) => {
    let forData = objectToFormData(values);
    const response = await dispatch(editJournal(forData));
    if (response?.status === 200) {
      handelSuccess(true);
    } else {
      setBtnLoading(false);
    }
  };
  return (
    <Modal
      onHide={onHide}
      title={editData ? "Edit Journal" : "Add New Journal"}
    >
      <div className="cmt-34 cms-34 cme-34 cmb-16">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handelSave}
        >
          {(props) => {
            const { values, errors, handleSubmit, setFieldValue } = props;
            return (
              <form>
                <div className="row d-flex justify-conent-between align-items-center cmb-22">
                  <div className="col-md-12 col-10 cmb-22">
                    <TextInput
                      placeholder="Journal Name"
                      id="name"
                      onChange={(e) => {
                        setFieldValue("name", titleCaseString(e.target.value));
                      }}
                      value={values.name}
                      error={errors.name}
                    />
                  </div>
                  <div className="col-md-12 col-10">
                    <div className="row d-flex justify-conent-between">
                      <div className="col-md-6 cmb-22">
                        <Dropdown
                          options={journalType}
                          optionKey="value"
                          optionValue="value"
                          placeholder="Journal Type"
                          id="type"
                          onChange={(e) => {
                            setFieldValue("type", e.target.value);
                          }}
                          value={values.type}
                          error={errors.type}
                        />
                      </div>
                      <div className="col-md-6 cmb-22">
                        <TextInput
                          placeholder="ISSN"
                          id="issn"
                          onChange={(e) => {
                            const value = e.target.value;
                            setFieldValue(
                              "issn",
                              formatNumber("XXXX-XXXX", value)
                            );
                          }}
                          value={values.issn}
                          error={errors.issn}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-10">
                    <FileUpload
                      label="Logo"
                      fileType="image"
                      fileText={getFilenameFromUrl(values.logo)}
                      id="logo"
                      onChange={(e) => {
                        const id = e.target.id;
                        const value = e.target.value;
                        setFieldValue(id, value);
                      }}
                      value={values.logo}
                      error={errors.logo}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center gap-4 col-md-12 col-10">
                  <Button
                    text="Cancel"
                    isRounded
                    btnStyle="light-outline"
                    className="cps-40 cpe-40"
                    onClick={onHide}
                  />
                  <Button
                    text="Done"
                    isRounded
                    btnStyle="primary-dark"
                    className="cps-40 cpe-40"
                    onClick={handleSubmit}
                    btnLoading={btnLoading}
                  />
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};
export default AddJournal;
