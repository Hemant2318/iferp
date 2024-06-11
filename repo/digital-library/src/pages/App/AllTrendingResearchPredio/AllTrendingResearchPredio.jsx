import TrendingResearchPredio from "../Home/TrendingResearchPredio";
import LatestRequests from "../Home/LatestRequests";
import Following from "../Home/Following";
import Followers from "../Home/Followers";
import "./AllTrendingResearchPredio.scss";

const AllTrendingResearchPredio = () => {
  return (
    <div
      className="container bg-feff"
      id="all-trending-research-predio-container"
    >
      <div className="row">
        <div className="col-md-8">
          <TrendingResearchPredio />
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

export default AllTrendingResearchPredio;
