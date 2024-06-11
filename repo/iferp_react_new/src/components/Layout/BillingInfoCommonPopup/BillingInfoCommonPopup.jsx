import React, { useRef, useState } from "react";
import Modal from "../Modal";
import { Formik } from "formik";
import * as Yup from "yup";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import { useDispatch } from "react-redux";
import { updateAddressDetails } from "store/slices";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import { isEqual } from "lodash";

const BillingInfoCommonPopup = ({ onHide, onSuccess }) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const [btnLoading, setBtnLoading] = useState(false);
  const useDetails = getDataFromLocalStorage();
  const {
    id,
    personal_details = {},
    institution_details = {},
    company_details = {},
    user_type,
  } = useDetails;
  const { address, pincode } = personal_details;
  const { address: institutionAddress, pincode: institutionPincode } =
    institution_details;
  const { address: companyAddress, pincode: companyPincode } = company_details;

  const handelSave = async (values) => {
    setBtnLoading(true);
    const response = await dispatch(
      updateAddressDetails(objectToFormData(values))
    );
    if (response?.status === 200) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
      onSuccess();
    } else {
      setBtnLoading(false);
    }
  };

  const initialValues = {
    address: address || institutionAddress || companyAddress || "",
    pincode: pincode || institutionPincode || companyPincode || "",
    id: id,
    type: "1",
    user_type: user_type,
  };
  const validationSchema = Yup.object().shape({
    address: Yup.string()
      .required("Door no. and street name is required.")
      .max(50, "Address is too long, it must be under 50 character."),
    pincode: Yup.string().required("Pin Code is required."),
  });
  return (
    <>
      <Modal onHide={onHide} size="md" title="Address Details">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handelSave}
          innerRef={formRef}
        >
          {(props) => {
            const { values, errors, handleChange, handleSubmit } = props;
            return (
              <form className="row cmt-22">
                <div className="d-flex align-items-top gap-2 text-15-500 cmb-22">
                  <div>
                    <i className="bi bi-info-circle-fill color-a9b1"></i>
                  </div>
                  <div className="color-a9b1">
                    Please fill your address details because it required for
                    complete your payment.
                  </div>
                </div>
                <div className="col-md-12 cmb-22">
                  <TextInput
                    label="Address"
                    placeholder="Door No. , Street Name*"
                    id="address"
                    value={values?.address}
                    onChange={handleChange}
                    error={errors?.address}
                  />
                </div>

                <div className="col-md-12 cmb-22">
                  <TextInput
                    label="Pin Code"
                    placeholder="Enter Pin Code*"
                    id="pincode"
                    value={values?.pincode}
                    onChange={handleChange}
                    error={errors?.pincode}
                  />
                </div>

                <div className="d-flex justify-content-center mt-3">
                  <Button
                    isRounded
                    text="Continue"
                    btnStyle="primary-dark"
                    className="cps-40 cpe-40"
                    onClick={handleSubmit}
                    btnLoading={btnLoading}
                    disabled={isEqual(initialValues, values)}
                  />
                </div>
              </form>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
};

export default BillingInfoCommonPopup;
