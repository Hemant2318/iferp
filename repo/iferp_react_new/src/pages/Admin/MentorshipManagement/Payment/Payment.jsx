import MenteeSettlements from "./MenteeSettlements";
import MentorSettlements from "./MentorSettlements";
import PaymentReport from "./PaymentReport";
import { useState } from "react";
import BankTransferReport from "./BankTransferReport";

const Payment = () => {
  const [type, setType] = useState("mentor-settlements");
  const activeClass = "p-2 pb-1 color-new-car text-16-500 me-4 bb-new-car";
  const inActiveClass = "p-2 pb-1 color-black-olive text-15-400 me-4 pointer";
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <div className="d-flex align-items-center mb-2 flex-wrap">
          <div
            className={
              type === "mentor-settlements" ? activeClass : inActiveClass
            }
            onClick={() => {
              setType("mentor-settlements");
            }}
          >
            Mentor Settlements
          </div>

          <div
            className={
              type === "mentee-settlements" ? activeClass : inActiveClass
            }
            onClick={() => {
              setType("mentee-settlements");
            }}
          >
            Mentee Settlements
          </div>

          <div
            className={type === "payment-report" ? activeClass : inActiveClass}
            onClick={() => {
              setType("payment-report");
            }}
          >
            Payment Report
          </div>

          <div
            className={
              type === "bank-transfer-report" ? activeClass : inActiveClass
            }
            onClick={() => {
              setType("bank-transfer-report");
            }}
          >
            Bank Transfer Report
          </div>
        </div>
        <div className="d-flex gap-2">
          {type !== "payment-report" && type !== "bank-transfer-report" && (
            <>
              {/* <DatePicker placeholder="Select Date Range" /> */}
              {/* <Button
                className="d-flex gap-2 h-45"
                btnStyle="light-blue-outline"
                text="Export"
                icon={<img src={icons.payment_export} alt="export" />}
              /> */}
            </>
          )}
        </div>
      </div>

      {type === "mentor-settlements" && <MentorSettlements />}
      {type === "mentee-settlements" && <MenteeSettlements />}
      {type === "payment-report" && <PaymentReport />}
      {type === "bank-transfer-report" && <BankTransferReport />}
    </div>
  );
};

export default Payment;
