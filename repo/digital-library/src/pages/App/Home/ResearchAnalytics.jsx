import { icons } from "utils/constants";

const ResearchAnalytics = () => {
  return (
    <div className="shadow">
      <div className="text-17-400 lh-24 color-3d3d cps-22 cpt-20 cpb-20">
        Research Analytics
      </div>
      <div className="bt-e3e3" />
      <div className="cps-20 cpe-20 cpt-20 cpb-20">
        <div className="fa-center gap-4 border cp-18 br-10 mb-3">
          <div className="bg-f8ff rounded cps-20 cpe-20 cpt-20 cpb-20">
            <img src={icons.primaryEye} alt="eye" />
          </div>
          <div className="flex-grow-1">
            <div className="text-14-400 lh-21 color-7070">Total Views</div>
            <div className="fb-center">
              <div className="text-22-500 lh-21 color-3d3d">8,862</div>
              <div className="bg-fff8 color-b494 ps-2 pe-2 pt-1 pb-1 rounded fa-center gap-2">
                <span>+30%</span>
                <span className="d-flex">
                  <img src={icons.successArrowUp} alt="arrow-up" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="fa-center gap-4 border cp-18 br-10 mb-3">
          <div className="bg-f0ff rounded cps-20 cpe-20 cpt-20 cpb-20">
            <img src={icons.primaryShare} alt="eye" />
          </div>
          <div className="flex-grow-1">
            <div className="text-14-400 lh-21 color-7070">Total Citations</div>
            <div className="fb-center">
              <div className="text-22-500 lh-21 color-3d3d">5,262</div>
              <div className="bg-fff8 color-b494 ps-2 pe-2 pt-1 pb-1 rounded fa-center gap-2">
                <span>+40%</span>
                <span className="d-flex">
                  <img src={icons.successArrowUp} alt="arrow-up" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="fa-center gap-4 border cp-18 br-10">
          <div className="bg-fff1 rounded cps-20 cpe-20 cpt-20 cpb-20">
            <img src={icons.successDownload} alt="eye" />
          </div>
          <div className="flex-grow-1">
            <div className="text-14-400 lh-21 color-7070">
              Presentations Downloads
            </div>
            <div className="fb-center">
              <div className="text-22-500 lh-21 color-3d3d">436</div>
              <div className="bg-fff8 color-b494 ps-2 pe-2 pt-1 pb-1 rounded fa-center gap-2">
                <span>+44%</span>
                <span className="d-flex">
                  <img src={icons.successArrowUp} alt="arrow-up" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchAnalytics;
