import { useState } from "react";
import { useSelector } from "react-redux";
import Card from "components/Layout/Card";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import { trimLeftSpace } from "utils/helpers";
import QuestionDetails from "./QuestionDetails";
import NewPostDetails from "./NewPostDetails";
import "./CreatePost.scss";

const CreatePost = ({
  type,
  label = "Create Your Research Post",
  successParent,
}) => {
  const { postCategoryList } = useSelector((state) => ({
    postCategoryList: state.global.postCategoryList,
  }));
  const [postCategory, setPostCategory] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [isNext, setIsNext] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  return (
    <Card className="mt-3 cps-24 cpe-24 cpt-24 cpb-10">
      {isNext && (
        <>
          {/* <PostDetails
            type={type}
            postCategory={postCategory}
            postTitle={postTitle}
            onHide={() => {
              setIsNext(false);
              setPostCategory("");
              setPostTitle("");
            }}
            handelSuccess={() => {
              setIsNext(false);
              setPostCategory("");
              setPostTitle("");
              if (successParent) {
                successParent();
              }
            }}
          /> */}
          <NewPostDetails
            type={type}
            postCategory={postCategory}
            postTitle={postTitle}
            onHide={() => {
              setIsNext(false);
              setPostCategory("");
              setPostTitle("");
            }}
            handelSuccess={() => {
              setIsNext(false);
              setPostCategory("");
              setPostTitle("");
              if (successParent) {
                successParent();
              }
            }}
          />
        </>
      )}
      {isQuestion && (
        <QuestionDetails
          postTitle={postTitle}
          onHide={() => {
            setIsQuestion(false);
            setPostCategory("");
            setPostTitle("");
          }}
          handelSuccess={() => {
            setIsQuestion(false);
            setPostCategory("");
            setPostTitle("");
            if (successParent) {
              successParent();
            }
          }}
        />
      )}
      <div
        className="d-flex justify-content-between align-items-center mb-3 w-fit"
        id="create-new-post-id"
      >
        <div className="text-18-500-27 color-title-navy font-poppins">
          {label}
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <Dropdown
            id="eventid"
            placeholder="Select post category*"
            value={postCategory}
            options={postCategoryList}
            optionValue="name"
            onChange={(e) => {
              setPostCategory(e.target.value);
            }}
          />
        </div>
        <div className="col-md-8 mb-3 post-input-container">
          <input
            id="post-input"
            placeholder="Post Title*"
            value={postTitle}
            onChange={(e) => {
              setPostTitle(trimLeftSpace(e.target.value));
            }}
          />
          <div className="create-post-icon-container">
            <div className="create-post-icon-container">
              <Button
                className="h-35"
                btnStyle="primary-dark"
                text={
                  <>
                    <span>
                      Next
                      <i className="ms-2 bi bi-send" />
                    </span>
                  </>
                }
                disabled={!postCategory || !postTitle}
                onClick={() => {
                  if (postCategory === 8) {
                    setIsQuestion(true);
                  } else {
                    setIsNext(true);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default CreatePost;
