import { useState } from "react";
import PaymentOverview from "./PaymentOverview";
import PaymentAccountDetails from "./PaymentAccountDetails";

const MemberPayment = ({ mentorId }) => {
  const [type, setType] = useState("payment-overview");
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
      {type === "payment-overview" && <PaymentOverview />}
      {type === "payment-account-details" && (
        <PaymentAccountDetails mentorId={mentorId} />
      )}
    </div>
  );
};

export default MemberPayment;
