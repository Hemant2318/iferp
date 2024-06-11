import Card from "components/Layout/Card";
import React, { useState } from "react";
import PendingPayments from "./PendingPayments/PendingPayments";
import PaidOuts from "./PaidOuts/PaidOuts";
import { icons } from "utils/constants";
import { exportBankTransferPending } from "store/slices";
import { objectToFormData } from "utils/helpers";
import ExportButton from "components/Layout/ExportButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BankTransferReport.scss";

const BankTransferReport = () => {
  const activeClass = "p-2 bg-ebff color-new-car text-15-500";
  const inActiveClass = "p-2 color-5068 text-15-400 pointer";
  const [tab, setTab] = useState("pending-payments");

  const [sessionData, setSessionData] = useState({});

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const setSession = (obj) => {
    setSessionData(obj);
  };

  const handleDateRangeChange = (range) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <div id="bank-transfer-component">
      <Card className="d-flex align-items-center justify-content-between unset-br p-1 mb-3 pe-3 flex-wrap">
        <div className="d-flex align-items-center flex-wrap gap-2">
          <div
            className={tab === "pending-payments" ? activeClass : inActiveClass}
            onClick={() => {
              setTab("pending-payments");
            }}
          >
            Pending Payments
          </div>
          <div
            className={tab === "paid-outs" ? activeClass : inActiveClass}
            onClick={() => {
              setTab("paid-outs");
            }}
          >
            Paid Outs
          </div>
        </div>

        <div className="d-flex gap-2 date-picker">
          <div id="date-picker-container">
            <div className="input-container">
              <DatePicker
                selected=""
                onChange={handleDateRangeChange}
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select Date Range"
                selectsRange
                isClearable={startDate || endDate ? true : false}
              />
              <span className={`calender-icon w-fit`}>
                <img src={icons.calendar} alt="calender" />
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <ExportButton
              exportAPI={exportBankTransferPending}
              payload={objectToFormData(sessionData)}
            />
          </div>
        </div>
      </Card>

      {tab === "pending-payments" && (
        <Card className="overflow-auto">
          <PendingPayments
            setSession={setSession}
            startDate={startDate}
            endDate={endDate}
          />
        </Card>
      )}
      {tab === "paid-outs" && (
        <Card className="overflow-auto">
          <PaidOuts
            setSession={setSession}
            startDate={startDate}
            endDate={endDate}
          />
        </Card>
      )}
    </div>
  );
};

export default BankTransferReport;
