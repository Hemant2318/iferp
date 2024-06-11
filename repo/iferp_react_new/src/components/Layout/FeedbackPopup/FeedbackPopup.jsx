import React, { useState } from "react";
import Modal from "../Modal";
import { icons } from "utils/constants";
import Button from "components/form/Button";
import TextArea from "components/form/TextArea";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import { useDispatch } from "react-redux";
import { addSessionReview, throwError, throwSuccess } from "store/slices";

const FeedbackPopup = ({
  setIsFeedback,
  setRatingData,
  ratingData,
  handleSuccess,
}) => {
  const star = [1, 2, 3, 4, 5];
  const dispatch = useDispatch();
  const authUserDetails = getDataFromLocalStorage();
  const [btnLoading, setBtnLoading] = useState(false);
  const [payload, setPayload] = useState({
    mentor_id: ratingData?.mentor_id,
    mentee_id: authUserDetails?.id,
    session_id: ratingData?.id,
    comment: "",
    rating_start: 0,
  });

  const handleSubmit = async (data) => {
    setBtnLoading(true);
    const response = await dispatch(addSessionReview(objectToFormData(data)));
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      setIsFeedback(false);
      setPayload({
        mentor_id: "",
        mentee_id: "",
        session_id: "",
        comment: "",
        rating_start: 0,
      });
      setRatingData(null);
      handleSuccess();
    } else {
      dispatch(throwError(response?.message));
    }
    setBtnLoading(false);
  };

  return (
    <Modal
      onHide={() => {
        setIsFeedback(false);
      }}
    >
      <div className="d-flex flex-column justify-content-center cps-20 cpe-20">
        <div className="text-center cmt-30 cmb-12">
          <div className="text-24-500 color-3146">Feedback</div>
          <div className="text-16-400 color-dark-silver cmt-16">
            Rate your experience and help us improve
          </div>

          <div className="cmt-20 cmb-20 gap-3 d-flex justify-content-center">
            {star?.map((index) => {
              return (
                <img
                  className="pointer"
                  key={index}
                  src={
                    index <= payload?.rating_start
                      ? icons.fillStar
                      : icons.grayOutlineStar
                  }
                  alt="star"
                  onClick={() => {
                    setPayload((prev) => {
                      return {
                        ...prev,
                        rating_start: index,
                      };
                    });
                  }}
                />
              );
            })}
          </div>
        </div>

        <TextArea
          rows={5}
          placeholder="Please give your valuable feedback"
          labelClass="text-15-400-18 color-black-olive"
          onChange={(e) => {
            setPayload((prev) => {
              return {
                ...prev,
                comment: e?.target?.value,
              };
            });
          }}
        />
        <div className="d-flex align-items-center justify-content-center cmt-30 cmb-30 gap-4">
          <Button
            btnStyle="primary-dark"
            text="Submit"
            className="cps-30 cpe-30"
            onClick={() => {
              handleSubmit(payload);
            }}
            btnLoading={btnLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackPopup;
