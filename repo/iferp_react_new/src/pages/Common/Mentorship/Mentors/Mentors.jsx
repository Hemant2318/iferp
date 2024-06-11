import Card from "components/Layout/Card";
import React, { useEffect, useState } from "react";
import MySession from "./MySession";
import Payment from "./Payment";
import AllMentees from "./AllMentees";
import UpcommingMeeting from "./UpcommingMeeting";
import { useDispatch, useSelector } from "react-redux";
import { setTabTypeAddedBankAccount } from "store/slices";
import "./Mentors.scss";

const Mentors = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParams = urlParams?.get("scope");
  const dispatch = useDispatch();

  const [type, setType] = useState("mentees");
  const { paymentType, tabTypeAddedBankAccount } = useSelector((state) => ({
    paymentType: state.mentorshipManagement.paymentType,
    tabTypeAddedBankAccount: state.mentorshipManagement.tabTypeAddedBankAccount,
  }));
  useEffect(() => {
    if (searchParams !== null) {
      setType("payment");
    } else if (paymentType === "payment-account-details") {
      setType("payment");
    } else if (tabTypeAddedBankAccount === "my-session") {
      setType("my-session");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeClass = "p-3 bg-new-car color-white text-16-500 me-3 ";
  const inActiveClass = "p-3 color-black-olive text-16-500 me-3 pointer";
  return (
    <div className="mentorship-mentors">
      <Card className="d-flex align-items-center unset-br cmb-20">
        <div className="d-flex align-items-center flex-wrap">
          <div
            id="all-mentors-id"
            className={type === "mentees" ? activeClass : inActiveClass}
            onClick={() => {
              dispatch(setTabTypeAddedBankAccount(""));
              setType("mentees");
            }}
          >
            Mentees
          </div>
          <div
            id="upcoming-meetings-id"
            className={
              type === "upcoming-meetings" ? activeClass : inActiveClass
            }
            onClick={() => {
              dispatch(setTabTypeAddedBankAccount(""));
              setType("upcoming-meetings");
            }}
          >
            Upcoming Meetings
          </div>
          <div
            id="my-submissions-id"
            className={type === "my-session" ? activeClass : inActiveClass}
            onClick={() => {
              setType("my-session");
            }}
          >
            My Sessions
          </div>
          <div
            id="payment-id"
            className={type === "payment" ? activeClass : inActiveClass}
            onClick={() => {
              dispatch(setTabTypeAddedBankAccount(""));
              setType("payment");
            }}
          >
            Payment
          </div>
        </div>
      </Card>

      {type === "mentees" && <AllMentees tabType={setType} />}
      {type === "upcoming-meetings" && <UpcommingMeeting />}
      {type === "my-session" && <MySession />}
      {type === "payment" && <Payment tabType={setType} />}

      {/* <div className="overflow-auto">
        <TableV2 header={header} rowData={rowData} />
      </div> */}
    </div>
  );
};

export default Mentors;
