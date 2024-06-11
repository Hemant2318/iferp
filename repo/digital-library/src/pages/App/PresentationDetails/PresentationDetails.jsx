import { Button, CustomTab, Profile, VideoPreview } from "components";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "utils/constants";
import Abstract from "./Abstract";
import FullText from "./FullText";
import Statistics from "./Statistics";
import Comments from "./Comments";
import Figures from "./Figures";
import Citations from "./Citations";
import { useDispatch } from "react-redux";
import { setIsCitetion, setIsShare } from "store/globalSlice";

const PresentationDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { eventID, postID, type } = params;
  const handleRedirect = (option) => {
    navigate(`/presentations/${eventID}/${postID}/${option}`);
  };
  return (
    <div className="container bg-feff">
      <div className="shadow cpt-28 cps-28 cpe-28">
        <div className="d-flex justify-content-between">
          <div className="d-flex gap-2">
            <span
              className="pt-1 pointer"
              onClick={() => {
                navigate(`/conference/${eventID}`);
              }}
            >
              <img src={icons.leftArrow} alt="left" />
            </span>
            <span className="">
              <span className="text-24-500 color-3d3d">
                Associations of Pulmonary Function with MRI Brain Volumes: A
                Coordinated Multi-Study Analysis
              </span>
              <span className="fa-center gap-3">
                <Button
                  btnText="Abstract"
                  btnStyle="GD"
                  onClick={() => {}}
                  className="ps-4 pe-4 text-13-400 lh-21 h-32"
                />
                <Button
                  btnText="Full-text available"
                  btnStyle="PO"
                  onClick={() => {}}
                  className="text-13-400 lh-21 h-32"
                />
                <div className="text-14-400 color-5555">26 June 2022</div>
              </span>
            </span>
          </div>
          <div className="d-flex align-items-start pt-2">
            <img src={icons.verticleMore} alt="more" className="d-flex" />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-5">
            <VideoPreview size="lg" />
          </div>
          <div className="col-md-7">
            <div className="text-16-400 color-3d3d mb-3">
              Conference - International Conference on Interdisciplinary
              Approaches to Sustainable Designs of Future Cities (ICIASDFC)
            </div>
            <div className="fa-center gap-3 mb-3">
              <div className="fa-center gap-2">
                <Profile text="Karan R" size="s-18" isRounded />
                <div className="text-14-400 lh-21 color-3434">Karan R</div>
              </div>
              <div className="fa-center gap-2">
                <Profile text="Stephen Barette" size="s-18" isRounded />
                <div className="text-14-400 lh-21 color-3434">
                  Stephen Barette
                </div>
              </div>
              <div className="fa-center gap-2">
                <Profile text="Sourojit Das" size="s-18" isRounded />
                <div className="text-14-400 lh-21 color-3434">Sourojit Das</div>
              </div>
            </div>
            <div className="text-16-400 color-3d3d lh-24 mb-3">
              <span>Publisher -</span>
              <span className="text-16-500 ms-2">Technoarete Publishers</span>
            </div>
            <div className="text-16-400 color-3d3d lh-24 mb-3">
              <span>Session 1 - </span>
              <span className="text-16-500 ms-2">Business Management</span>
            </div>
            <div className="fa-center gap-4 text-14-400 lh-21 color-3d3d mb-3">
              <div>
                DOI -
                <span className="text-14-500 ms-1">
                  10.36647/978-93-92106-02-6
                </span>
              </div>
              <div>
                Proceeding page -
                <span className="text-14-500 ms-1">1 to 5</span>
              </div>
            </div>
            <div className="fa-center gap-5 mb-3">
              <div className="fa-center gap-2">
                <span className="d-flex">
                  <img src={icons.successLike} alt="like" />
                </span>
                <span className="text-14-500 color-1818 lh-21">10</span>
                <span className="text-14-400 color-5555 lh-21">Useful</span>
              </div>
              <div className="fa-center gap-2">
                <span className="d-flex">
                  <img src={icons.successDeslike} alt="like" />
                </span>
                <span className="text-14-500 color-1818 lh-21">20</span>
                <span className="text-14-400 color-5555 lh-21">Contradict</span>
              </div>
              <div className="fa-center gap-2">
                <span className="d-flex">
                  <img src={icons.successSave} alt="like" />
                </span>
                <span className="text-14-400 color-5555 lh-21">Save</span>
              </div>
            </div>
            <div className="fa-center gap-3">
              <Button
                btnText="Dowload Predio"
                btnStyle="SD"
                onClick={() => {}}
                leftIcon={icons.lightDownload}
              />
              <Button
                btnText="Cite this Article"
                btnStyle="SO"
                onClick={() => {
                  dispatch(setIsCitetion(true));
                }}
              />
            </div>
          </div>
        </div>
        <div className="mb-3 mt-3 pb-1">
          <div className="fb-center">
            <CustomTab
              active={type || "abstract"}
              options={[
                {
                  title: "Abstract",
                  activeText: "abstract",
                  onClick: () => {
                    handleRedirect("abstract");
                  },
                },
                {
                  title: "Full-Text",
                  activeText: "full-text",
                  onClick: () => {
                    handleRedirect("full-text");
                  },
                },
                {
                  title: "Statistics",
                  activeText: "statistics",
                  onClick: () => {
                    handleRedirect("statistics");
                  },
                },
                {
                  title: "Comments",
                  activeText: "comments",
                  onClick: () => {
                    handleRedirect("comments");
                  },
                },
                {
                  title: "Figures",
                  activeText: "figures",
                  onClick: () => {
                    handleRedirect("figures");
                  },
                },
                {
                  title: "Citations (20)",
                  activeText: "citations",
                  onClick: () => {
                    handleRedirect("citations");
                  },
                },
              ]}
            />
            <div className="d-flex gap-3">
              <Button
                btnText="Follow"
                btnStyle="PD"
                onClick={() => {}}
                className="ps-4 pe-4"
              />

              <Button
                btnText="Share"
                btnStyle="PO"
                onClick={() => {
                  dispatch(setIsShare(true));
                }}
                className="ps-4 pe-4"
              />
            </div>
          </div>
        </div>
      </div>
      {type === "abstract" && <Abstract />}
      {type === "full-text" && <FullText />}
      {type === "statistics" && <Statistics />}
      {type === "comments" && <Comments />}
      {type === "figures" && <Figures />}
      {type === "citations" && <Citations />}
    </div>
  );
};

export default PresentationDetails;
