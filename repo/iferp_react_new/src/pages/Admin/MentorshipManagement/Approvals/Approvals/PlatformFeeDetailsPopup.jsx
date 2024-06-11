import React, { useState } from "react";
import Button from "components/form/Button";
import Modal from "components/Layout/Modal";
import { Card } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import Dropdown from "components/form/Dropdown";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import { useDispatch } from "react-redux";
import { fetchProfile, paymentPercent } from "store/slices";

const PlatformFeeDetailsPopup = ({ setIsFeeDetailsPopup }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const dispatch = useDispatch();
  const useData = getDataFromLocalStorage();
  const { free_member_percentage, premium_member_percentage } = useData;

  const percentageList = [
    { label: "20%", id: "20" },
    { label: "25%", id: "25" },
    { label: "40%", id: "40" },
    { label: "45%", id: "45" },
    { label: "60%", id: "60" },
    { label: "65%", id: "65" },
    { label: "80%", id: "80" },
    { label: "85%", id: "85" },
    { label: "100%", id: "100" },
  ];

  const generateInitialValues = () => {
    const initialValues = {
      premium_member_percentage: premium_member_percentage || "",
      free_member_percentage: free_member_percentage || "",
    };
    return initialValues;
  };
  const initialValues = generateInitialValues();
  const validationSchema = Yup.object().shape({
    premium_member_percentage: Yup.string().required("Select Premium Status."),
    free_member_percentage: Yup.string().required("Select Non Premium Status."),
  });
  const handleSave = async (values) => {
    setBtnLoading(true);
    let formData = objectToFormData(values);
    const response = await dispatch(paymentPercent(formData));
    if (response?.status === 200) {
      setIsFeeDetailsPopup(false);
      await dispatch(fetchProfile());
    }

    setBtnLoading(false);
  };

  return (
    <Modal
      onHide={() => {
        setIsFeeDetailsPopup(false);
      }}
    >
      <div className="d-flex flex-column justify-content-center cps-20 cpe-20">
        <div className="text-center cmt-30 cmb-12">
          <div className="text-24-500 color-3146">
            Mentor Platform Fee Details
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
          //   innerRef={ref} // for Reset
        >
          {(props) => {
            const { values, handleChange, handleSubmit, errors } = props;
            const { premium_member_percentage, free_member_percentage } =
              values;
            return (
              <form onSubmit={handleSubmit}>
                <Card className="row cpt-15 border-0 cpb-15 cmb-20">
                  <div className="cmb-24">
                    <Dropdown
                      label="Premium Members"
                      value={premium_member_percentage}
                      id="premium_member_percentage"
                      placeholder="Select the percentage"
                      options={percentageList}
                      optionKey="id"
                      optionValue="label"
                      onChange={handleChange}
                      error={errors?.premium_member_percentage}
                    />
                  </div>
                  <div className="cmb-24">
                    <Dropdown
                      label="Non-Premium Members"
                      value={free_member_percentage}
                      id="free_member_percentage"
                      placeholder="Select Non-Premium Members"
                      options={percentageList}
                      optionKey="id"
                      optionValue="label"
                      onChange={handleChange}
                      error={errors?.free_member_percentage}
                    />
                  </div>
                </Card>
                <div className="d-flex align-items-center justify-content-center cmt-20 cmb-30 gap-4">
                  <Button
                    btnStyle="primary-dark"
                    text="Submit"
                    type="submit"
                    className="cps-30 cpe-30"
                    // disabled={isSubmitting}
                    btnLoading={btnLoading}
                  />
                  <Button
                    btnStyle=""
                    text="Cancel"
                    className="cps-30 cpe-30"
                    onClick={() => setIsFeeDetailsPopup(false)}
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

export default PlatformFeeDetailsPopup;
