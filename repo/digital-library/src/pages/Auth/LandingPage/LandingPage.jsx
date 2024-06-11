import Header from "../Header";
import Footer from "../Footer";
import { Button } from "components";
import { icons } from "utils/constants";
import HappyClientSlider from "./Slider/HappyClientSlider";
import TrendingResearchers from "./Researchers/TrendingResearchers";
import JoinExpertCommunity from "./JoinExpert/JoinExpertCommunity";
import ResearchPredio from "./TrendingPredio/ResearchPredio";
const LandingPage = () => {
  const list = [
    "Education",
    "Engineering",
    "Mathematics",
    "Arts & Science",
    "Oncology",
    "Neuro Science",
    "Computer Science",
    "Food & Nutrition",
    "Pharmaceutical Science",
    "Nanotechnology",
    "Nursing",
    "Environmental Science",
    "Dental & Oral Health",
    "Diabetes & Endocrinology",
  ];
  const list2 = [
    "Education",
    "Engineering",
    "Mathematics",
    "Arts & Science",
    "Oncology",
    "Neuro Science",
    "Computer Science",
  ];

  // const topReaserch = [
  //   {
  //     name: "Dr. Paquito",
  //     des: "Principal",
  //     college: "RMK College of Engineering",
  //   },
  //   {
  //     name: "Dr. Manju Gupta",
  //     des: "Professor",
  //     college: "RMK College of Engineering",
  //   },
  //   {
  //     name: "Dr. Alireza",
  //     des: "HOD",
  //     college: "RMK College of Engineering",
  //   },
  //   {
  //     name: "Alena M",
  //     des: "Researcher",
  //     college: "RMK College of Engineering",
  //   },
  // ];

  return (
    <>
      <Header />
      <div className="bg-ffff cpt-20">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="text-46-600 color-1919 mb-2">
                <div>Discover & Globalize</div>
                <div>Your Research</div>
              </div>
              <div className="text-16-400 color-3d3d mb-4">
                Stay connected with various organizations and researchers all
                over the world. Publish your presentation and get recognized all
                over the world
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <span className="me-2">
                    <img src={icons.primaryTick} alt="tick" />
                  </span>
                  <span className="text-16-400 color-1919">Interact</span>
                </div>
                <div className="col-md-4 mb-3">
                  <span className="me-2">
                    <img src={icons.primaryTick} alt="tick" />
                  </span>
                  <span className="text-16-400 color-1919">Publish</span>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-4 mb-3">
                  <span className="me-2">
                    <img src={icons.primaryTick} alt="tick" />
                  </span>
                  <span className="text-16-400 color-1919">Research</span>
                </div>
                <div className="col-md-4 mb-3">
                  <span className="me-2">
                    <img src={icons.primaryTick} alt="tick" />
                  </span>
                  <span className="text-16-400 color-1919">Presentation</span>
                </div>
              </div>
              <div className="pb-4">
                <Button
                  btnText="Create Organizer Profile"
                  btnStyle="SD"
                  onClick={() => {}}
                />
              </div>
            </div>
            <div className="col-md-6">
              <img src={icons.landing1} alt="img1" className="fit-image" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-F50A cpt-74 cpb-74">
        <div className="container">
          <div className="text-40-600 color-1919 text-center">
            Explore Multiple Topics
          </div>
          <div className="text-18-400 color-3d3d text-center">
            Share your presentation, collaborate, challenge your peers & Get the
            support you need to advance your career
          </div>
          <div className="fj-center gap-2 mt-4 cps-40 cpe-40">
            {list.map((elm, index) => {
              return (
                <span key={index} className="primary-pill text-14-400">
                  {elm}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <JoinExpertCommunity />
      <div className="bg-f506 cpt-80 cpb-80">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <img src={icons.landing2} alt="img2" className="fit-image" />
            </div>
            <div className="col-md-7 cps-60">
              <div className="text-40-600 color-1919">
                Publish Research & Get Cited Globally
              </div>
              <div className="text-16-400 color-3d3d">
                Publish your presentations & Get an opportunity to interact with
                millions of researchers all over the globe
              </div>
              <div className="fa-center gap-2 mt-4">
                {list2.map((elm, index) => {
                  return (
                    <span key={index} className="primary-pill text-14-400">
                      {elm}
                    </span>
                  );
                })}
              </div>
              <div className="cmt-40">
                <Button
                  btnText="Publish Now"
                  btnStyle="SD"
                  onClick={() => {}}
                  rightIcon={icons.rightSuccess}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-ffff">
        <div className="container cpt-60 cpb-60 position-relative">
          <div className="text-center text-40-600 color-1919 mb-2">
            Our Happy Clients
          </div>
          <div className="text-18-400 color-3d3d text-center mb-4">
            These are the stories of our customers who have joined us with great
            pleasure
            <br /> & enjoyed our advanced functionalities
          </div>
          {/* slider component */}
          <HappyClientSlider />
        </div>
      </div>
      <TrendingResearchers />
      <ResearchPredio />
      {/* <div className="bg-ffff">
        <div className="container cpt-60 cpb-60">
          <div className="text-40-600 color-1919 text-center cmb-30">
            Trending Research Predio
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="shadow">
                <div className="cp-23 cpb-20">
                  <div className="fa-center gap-3">
                    <Profile text="Alfred Walton" size="s-72" isRounded />
                    <div className="flex-grow-1">
                      <div className="fb-center mb-2">
                        <div className="text-18-500 color-3434">
                          Alfred Walton
                        </div>
                        <div>
                          <img
                            src={icons.moreHorizontal}
                            alt="more"
                            className="pointer"
                          />
                        </div>
                      </div>
                      <div className="fb-center">
                        <div className="text-14-400 color-6666">
                          Professor, was cited in a publication
                        </div>
                        <div className="text-13-400 color-7070">6h ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-16-500 color-3d3d cmt-20 mb-3">
                    Analysis on homomorphic technique for data security in fog
                    computing
                  </div>
                  <VideoPreview size="md" />
                </div>
                <div className="bt-e3e3" />
                <div className="cp-20">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="fa-center gap-2">
                        <span className="d-flex">
                          <img src={icons.successLike} alt="like" />
                        </span>
                        <span className="text-14-500 color-1818 lh-21">70</span>
                        <span className="text-14-400 color-5555 lh-21">
                          Useful
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="fa-center gap-2">
                        <span className="d-flex">
                          <img src={icons.successDeslike} alt="like" />
                        </span>
                        <span className="text-14-500 color-1818 lh-21">20</span>
                        <span className="text-14-400 color-5555 lh-21">
                          Contradict
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="fa-center gap-2">
                        <span className="d-flex">
                          <img src={icons.comment} alt="like" />
                        </span>

                        <span className="text-14-500 color-1818 lh-21">10</span>
                        <span className="text-14-400 color-5555 lh-21">
                          Comments
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="fa-center gap-2">
                        <span className="d-flex">
                          <img src={icons.successShare} alt="like" />
                        </span>
                        <span className="text-14-400 color-5555 lh-21">
                          Share
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="shadow">
                <div className="cp-23 cpb-20">
                  <div className="fa-center gap-3">
                    <Profile text="Alfred Walton" size="s-72" isRounded />
                    <div className="flex-grow-1">
                      <div className="fb-center mb-2">
                        <div className="text-18-500 color-3434">
                          Alfred Walton
                        </div>
                        <div>
                          <img
                            src={icons.moreHorizontal}
                            alt="more"
                            className="pointer"
                          />
                        </div>
                      </div>
                      <div className="fb-center">
                        <div className="text-14-400 color-6666">
                          Professor, was cited in a publication
                        </div>
                        <div className="text-13-400 color-7070">6h ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-16-500 color-3d3d cmt-20 mb-3">
                    Analysis on homomorphic technique for data security in fog
                    computing
                  </div>
                  <VideoPreview size="md" />
                </div>
                <div className="bt-e3e3" />
                <div className="cp-20">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="fa-center gap-2">
                        <span className="d-flex">
                          <img src={icons.successLike} alt="like" />
                        </span>
                        <span className="text-14-500 color-1818 lh-21">70</span>
                        <span className="text-14-400 color-5555 lh-21">
                          Useful
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="fa-center gap-2">
                        <span className="d-flex">
                          <img src={icons.successDeslike} alt="like" />
                        </span>
                        <span className="text-14-500 color-1818 lh-21">20</span>
                        <span className="text-14-400 color-5555 lh-21">
                          Contradict
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="fa-center gap-2">
                        <span className="d-flex">
                          <img src={icons.comment} alt="like" />
                        </span>

                        <span className="text-14-500 color-1818 lh-21">10</span>
                        <span className="text-14-400 color-5555 lh-21">
                          Comments
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="fa-center gap-2">
                        <span className="d-flex">
                          <img src={icons.successShare} alt="like" />
                        </span>
                        <span className="text-14-400 color-5555 lh-21">
                          Share
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="bg-f506">
        <div className="container cpt-48 cpb-48">
          <div className="text-40-600 color-1919 text-center mb-3">
            Get Best Research Updates
          </div>
          <div className="text-18-400 color-3d3d text-center mb-5">
            Subscribe to a community of 20 million scientists, get research news
            and
            <br /> update your knowledge on daily basis
          </div>
          <div className="fj-center">
            <Button btnText="Subscribe Now" btnStyle="SD" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
