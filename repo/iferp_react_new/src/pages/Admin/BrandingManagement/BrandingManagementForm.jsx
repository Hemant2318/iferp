import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import TextInput from "components/form/TextInput";
import TextArea from "components/form/TextArea";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import Modal from "components/Layout/Modal";
import { addBranding, editBranding } from "store/slices";
import { objectToFormData, titleCaseString } from "utils/helpers";

const BrandingManagementForm = ({ editData, onHide, handelSuccess }) => {
  const dispatch = useDispatch();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [btnLoading, setBtnLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    category: Yup.string().required("Category is required."),
    description: Yup.string()
      .required("Description is required.")
      .max(100, "Maximum 100 character allow for this field."),
    member_type: Yup.string().required("Member type is required."),
  });
  const getMemberId = (name) => {
    let returnValue = "";
    const findObj = membershipList.find((o) => o.name === name);
    if (findObj) {
      returnValue = findObj.id;
    }
    return returnValue;
  };
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
    const response = await dispatch(addBranding(forData));
    if (response?.status === 200) {
      handelSuccess();
    } else {
      setBtnLoading(false);
    }
  };
  const handelEditData = async (values) => {
    let forData = objectToFormData(values);
    const response = await dispatch(editBranding(forData));
    if (response?.status === 200) {
      handelSuccess(true);
    } else {
      setBtnLoading(false);
    }
  };
  const initialValues = {
    category: editData?.category || "",
    description: editData?.description || "",
    member_type: getMemberId(editData?.memberCategory) || "",
  };
  return (
    <Modal
      size="md"
      onHide={onHide}
      title={editData ? "Edit Branding Category" : "Add Branding Category"}
    >
      <div className="row cmt-34 cms-20 cme-20 cmb-24">
        <Formik
          initialValues={initialValues}
          onSubmit={handelSave}
          validationSchema={validationSchema}
        >
          {(props) => {
            const {
              values,
              errors,
              handleChange,
              handleSubmit,
              setFieldValue,
            } = props;
            return (
              <form>
                <div className="col-md-12 cmb-22">
                  <TextInput
                    placeholder="Category Name"
                    id="category"
                    onChange={(e) => {
                      setFieldValue(
                        "category",
                        titleCaseString(e.target.value)
                      );
                    }}
                    value={values.category}
                    error={errors.category}
                  />
                </div>
                <div className="col-md-12 cmb-22">
                  <TextArea
                    placeholder="Description"
                    rows={4}
                    id="description"
                    onChange={(e) => {
                      setFieldValue(
                        "description",
                        titleCaseString(e.target.value)
                      );
                    }}
                    value={values.description}
                    error={errors.description}
                  />
                </div>

                <div className="col-md-12 cmb-22">
                  <Dropdown
                    placeholder="Select Member Type"
                    id="member_type"
                    options={membershipList}
                    value={values.member_type}
                    error={errors.member_type}
                    optionKey="id"
                    optionValue="name"
                    onChange={handleChange}
                  />
                </div>

                <div className="d-flex justify-content-center gap-4 cmt-30">
                  <Button
                    text="Cancel"
                    isRounded
                    btnStyle="light-outline"
                    className="cps-40 cpe-40"
                    onClick={onHide}
                  />
                  <Button
                    text="Submit"
                    isRounded
                    btnStyle="primary-dark"
                    className="cps-40 cpe-40"
                    onClick={handleSubmit}
                    btnLoading={btnLoading}
                    disabled={isEqual(values, initialValues)}
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
export default BrandingManagementForm;
