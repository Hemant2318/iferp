import React from "react";
import Modal from "components/Layout/Modal";
import { icons } from "utils/constants";
import { getDataFromLocalStorage } from "utils/helpers";
import { useDispatch } from "react-redux";
import { getPaymentType, setMentorNotifyPopup } from "store/slices";
import Button from "components/form/Button";
import { useNavigate, useParams } from "react-router-dom";

const BecomeMentorPopup = () => {
  const navigate = useNavigate();
  const params = useParams();
  getDataFromLocalStorage();
  const dispatch = useDispatch();

  return (
    <Modal
      onHide={() => {
        dispatch(setMentorNotifyPopup(false));
      }}
      size="lg"
    >
      <div className="text-center">
        <img src={icons.approved} className="mb-3" alt="type" />
        <p className="fs-4 fw-bold">Mentor Account has been Approved</p>
        <p>Your mentor account has been verified. Start mentoring now!</p>
        <div className="d-flex justify-content-center">
          <Button
            text="Add Payment Details"
            isRounded
            btnStyle="primary-dark"
            className="cps-20 cpe-20"
            onClick={() => {
              navigate(`/${params?.memberType}/mentorship/mentor`);
              dispatch(getPaymentType("payment-account-details"));
              dispatch(setMentorNotifyPopup(false));
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default BecomeMentorPopup;
