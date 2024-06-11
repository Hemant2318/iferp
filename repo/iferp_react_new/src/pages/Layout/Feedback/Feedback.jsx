import { useState } from "react";
import Label from "components/form/Label";
import TextArea from "components/form/TextArea";
import { trimLeftSpace } from "utils/helpers";
import Button from "components/form/Button";
import { useDispatch } from "react-redux";
import { addFeedback, setApiError, setIsFeedback } from "store/slices";
import "./Feedback.scss";
import { useEffect } from "react";

const categoryList = [
  {
    title: "Other",
    logo: <i className="bi bi-bullseye" />,
  },
  {
    title: "Bug",
    logo: <i className="bi bi-bug" />,
  },
  {
    title: "Compliment",
    logo: <i className="bi bi-hand-thumbs-up" />,
  },
  {
    title: "Content Error",
    logo: <i className="bi bi-file-earmark" />,
  },
  {
    title: "Suggetion",
    logo: <i className="bi bi-chat" />,
  },
];

const Feedback = () => {
  const dispatch = useDispatch();
  const [opinion, setOpinion] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const handleSend = async () => {
    setCommentLoading(true);
    const res = await dispatch(
      addFeedback({
        category,
        opinion,
        message,
        page_url: window?.location?.href || "",
      })
    );
    if (res?.status === 200) {
      dispatch(setIsFeedback(false));
      dispatch(
        setApiError({
          show: true,
          message: "Feed back send Successfully.",
          type: "success",
        })
      );
      setMessage("");
    }
    setCommentLoading(false);
  };
  useEffect(() => {
    setOpinion("");
    setCategory("");
    setMessage("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAdd = message && opinion && category;
  return (
    <div id="feedback-container">
      <div className="feedback-block">
        <div className="feedback-form">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="text-16-500 color-title-navy">
              What whould you like to report?
            </div>
            <div>
              <i
                className="bi bi-x-lg pointer text-16-500"
                onClick={() => {
                  dispatch(setIsFeedback(false));
                }}
              />
            </div>
          </div>
          <div>
            <Label
              label="Please select your feedback category:*"
              className="text-14-400 mb-1"
            />
            <div className="d-flex flex-wrap gap-2 feedback-category-list">
              {categoryList?.map((elm, index) => {
                const { title, logo } = elm;
                return (
                  <div
                    key={index}
                    className={`d-flex gap-2 category-item ${
                      title === category
                        ? "active-category"
                        : "inactive-category"
                    }`}
                    onClick={() => {
                      setCategory(title);
                    }}
                  >
                    <span>{logo}</span>
                    <span>{title}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="cmt-22 cmb-22">
            <Label
              label="Please leave your feedback below:*"
              className="text-14-400 mb-1"
            />
            <TextArea
              rows={3}
              placeholder="We appreciate as much detail as you can provide."
              value={message}
              onChange={(e) => {
                setMessage(trimLeftSpace(e.target.value));
              }}
            />
          </div>
          <div className="cmb-22">
            <Label
              label="What is your opinion of this page?:*"
              className="text-14-400 mb-1"
            />
            <div className="emoji-list">
              <i
                className={`bi bi-emoji-angry${
                  opinion === 1 ? "-fill active-i" : " inactive-i"
                }`}
                onClick={() => {
                  setOpinion(1);
                }}
              />
              <i
                className={`bi bi-emoji-frown${
                  opinion === 2 ? "-fill active-i" : " inactive-i"
                }`}
                onClick={() => {
                  setOpinion(2);
                }}
              />
              <i
                className={`bi bi-emoji-neutral${
                  opinion === 3 ? "-fill active-i" : " inactive-i"
                }`}
                onClick={() => {
                  setOpinion(3);
                }}
              />
              <i
                className={`bi bi-emoji-smile${
                  opinion === 4 ? "-fill active-i" : " inactive-i"
                }`}
                onClick={() => {
                  setOpinion(4);
                }}
              />
              <i
                className={`bi bi-emoji-laughing${
                  opinion === 5 ? "-fill active-i" : " inactive-i"
                }`}
                onClick={() => {
                  setOpinion(5);
                }}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <Button
              className="h-35"
              btnStyle="primary-dark"
              text="Send"
              rightIcon={
                commentLoading ? "" : <i className="bi bi-send ms-2" />
              }
              disabled={!isAdd}
              btnLoading={commentLoading}
              onClick={handleSend}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
