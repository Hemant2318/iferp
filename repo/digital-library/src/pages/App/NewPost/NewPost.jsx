import { icons } from "utils/constants";
import PostData from "./PostData";
import PostDetails from "./PostDetails";
import { useState } from "react";

const NewPost = () => {
  const [formType, setFormType] = useState(0);
  return (
    <div className="container bg-feff">
      <div className="shadow cps-5 cpe-5 cpt-20">
        <div className="row cps-16 cpe-16">
          <div className="position-relative mb-5">
            <div className="position-absolute pt-3">
              <img src={icons.leftArrow} alt="back" />
            </div>
            <div className="text-center text-30-500">Publish New Post</div>
          </div>
        </div>
        {formType === 0 && <PostData setFormType={setFormType} />}
        {formType === 1 && <PostDetails setFormType={setFormType} />}
      </div>
    </div>
  );
};

export default NewPost;
