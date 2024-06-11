import DynamicPostType from "./DynamicPostType";
import LatestRequests from "./LatestRequests";
import Following from "./Following";
import Followers from "./Followers";
import "./Home.scss";

const Home = () => {
  return (
    <div className="container bg-feff">
      <div className="row">
        <div className="col-md-8">
          <DynamicPostType />
        </div>
        <div className="col-md-4">
          {/* <ResearchAnalytics /> */}
          <LatestRequests />
          <Following />
          <Followers />
        </div>
      </div>
    </div>
  );
};

export default Home;
