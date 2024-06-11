import React from "react";
import { useState, useEffect } from "react";
import UserPaymentOverview from "./UserPaymentOverview";
import UserPaymentAccountDetails from "./UserPaymentAccountDetails";
import { useSelector } from "react-redux";

const Payment = ({ tabType }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParams = urlParams?.get("scope");
  const [type, setType] = useState("payment-overview");
  const { paymentType } = useSelector((state) => ({
    paymentType: state.mentorshipManagement.paymentType,
  }));
  useEffect(() => {
    if (searchParams !== null) {
      setType("payment-account-details");
    }
    if (paymentType === "payment-account-details") {
      setType("payment-account-details");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeClass = "p-2 pb-1 color-new-car text-16-500 me-4 bb-new-car";
  const inActiveClass = "p-2 pb-1 color-black-olive text-16-500 me-4 pointer";
  return (
    <div>
      <div className="d-flex align-items-center mb-2">
        <div
          className={type === "payment-overview" ? activeClass : inActiveClass}
          onClick={() => {
            setType("payment-overview");
          }}
        >
          Payment Overview
        </div>
        <div
          className={
            type === "payment-account-details" ? activeClass : inActiveClass
          }
          onClick={() => {
            setType("payment-account-details");
          }}
        >
          Payment Account Details
        </div>
      </div>
      {type === "payment-overview" && <UserPaymentOverview />}
      {type === "payment-account-details" && (
        <UserPaymentAccountDetails tabType={tabType} />
      )}
    </div>
  );
};

export default Payment;
