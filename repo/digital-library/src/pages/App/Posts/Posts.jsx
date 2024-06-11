import LatestRequests from "../Home/LatestRequests";
import Following from "../Home/Following";
import Followers from "../Home/Followers";
import PostType from "./PostType";

const Posts = () => {
  return (
    <div className="container bg-feff">
      <div className="row">
        <div className="col-md-8 mt-4">
          <PostType />
        </div>
        <div className="col-md-4">
          <LatestRequests />
          <Following />
          <Followers />
        </div>
      </div>
    </div>
  );
};

export default Posts;
