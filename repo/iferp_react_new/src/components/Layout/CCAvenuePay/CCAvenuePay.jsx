import Button from "components/form/Button";
import { useDispatch } from "react-redux";
import BillingInfoCommonPopup from "../BillingInfoCommonPopup";
import { useState } from "react";
import { fetchProfile } from "store/slices";
import { getDataFromLocalStorage } from "utils/helpers";

const CCAvenuePay = ({
  btnLoading,
  disabled,
  onClick,
  text,
  btnStyle,
  className,
}) => {
  const dispatch = useDispatch();
  const [isBillingInfoCommonPopup, setIsBillingInfoCommonPopup] =
    useState(false);

  const userDetails = getDataFromLocalStorage();
  const {
    personal_details = {},
    institution_details = {},
    company_details = {},
    user_type,
  } = userDetails;
  const { address, pincode } = personal_details;
  const { address: institutionAddress, pincode: institutionPincode } =
    institution_details;
  const { address: companyAddress, pincode: companyPincode } = company_details;

  const fetchUSerProfile = async () => {
    const response = await dispatch(fetchProfile());
    if (response?.status === 200) {
      setTimeout(() => {
        setIsBillingInfoCommonPopup(false);
        onClick();
      }, 500);
    }
  };

  const handlePaymentClick = () => {
    if ((user_type === "2" || user_type === "5") && (!address || !pincode)) {
      setIsBillingInfoCommonPopup(true);
      return;
    } else if (
      user_type === "3" &&
      (!institutionAddress || !institutionPincode)
    ) {
      setIsBillingInfoCommonPopup(true);
      return;
    } else if (user_type === "4" && (!companyAddress || !companyPincode)) {
      setIsBillingInfoCommonPopup(true);
      return;
    }
    onClick();
  };
  return (
    <>
      {isBillingInfoCommonPopup && (
        <BillingInfoCommonPopup
          onHide={() => {
            setIsBillingInfoCommonPopup(false);
          }}
          onSuccess={() => {
            fetchUSerProfile();
          }}
        />
      )}
      <Button
        isRounded
        text={text ? text : "Pay Now"}
        btnStyle={btnStyle ? btnStyle : "primary-dark"}
        className={className ? className : "cps-40 cpe-40"}
        btnLoading={btnLoading}
        disabled={disabled}
        onClick={() => {
          handlePaymentClick();
        }}
      />
    </>
  );
};

export default CCAvenuePay;
