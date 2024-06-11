import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Button from "components/form/Button";
import Card from "components/Layout/Card";

const Scores = () => {
  return (
    <div>
      <Card className="cps-26 cpe-26 cpt-34 cpb-34 d-flex align-items-center mb-3">
        <div>
          <div className="text-18-400 color-black-olive mb-3">RI Score</div>
          <div className="text-40-500 color-black-olive">32.36</div>
        </div>
        <div className="vr cms-50 cme-50" />
        <div>
          <div className="text-16-400 color-black-olive mb-3">
            Score Breakdown:
          </div>
          <div className="row d-flex flex-column">
            <div className="col-md-12 d-flex justify-content-between">
              <div className="text-15-500 color-black-olive">80%</div>
              <div className="text-14-400 color-black-olive">Publications</div>
            </div>
            <div className="col-md-12 d-flex justify-content-between">
              <div className="text-15-500 color-black-olive">4%</div>
              <div className="text-14-400 color-black-olive">Questions</div>
            </div>
            <div className="col-md-12 d-flex justify-content-between">
              <div className="text-15-500 color-black-olive">10%</div>
              <div className="text-14-400 color-black-olive">Answers</div>
            </div>
            <div className="col-md-12 d-flex justify-content-between">
              <div className="text-15-500 color-black-olive">18%</div>
              <div className="text-14-400 color-black-olive">Followers</div>
            </div>
          </div>
        </div>
        <div className="vr cms-50 cme-50" />
        <div className="d-flex align-items-center flex-grow-1">
          <div style={{ height: "100px", width: "100px" }} className="cme-50">
            <CircularProgressbar
              value={65}
              text="65%"
              styles={buildStyles({
                pathColor: "#1741C1",
                textColor: "#000",
                trailColor: "#e7e7e8",
              })}
            />
          </div>
          <div>
            <div className="text-16-500 color-black-olive mb-3">
              Percentile:
            </div>
            <div className="text-15-400 color-black-olive w-75">
              Steve James’s score is higher than 65% of all Research Interest
              member’s scores
            </div>
          </div>
        </div>
      </Card>
      <Card className="cps-26 cpe-26 cpt-34 cpb-34 d-flex align-items-center">
        <div>
          <div className="text-18-400 color-black-olive mb-3">h-index</div>
          <div className="text-34-500 color-black-olive">28</div>
        </div>
        <div className="vr cms-50 cme-50" />
        <div>
          <div className="text-18-400 color-black-olive mb-3">h-index</div>
          <div className="text-34-500 color-black-olive mb-3">27</div>
          <div className="text-33-400 color-black-olive">
            excluding self-citations
          </div>
        </div>

        <div className="vr cms-50 cme-50" />
        <div className="d-flex align-items-center flex-grow-1">
          <div>
            <div className="text-14-400 color-black-olive mb-2">
              Top h cited research:
            </div>
            <div className="text-14-500 color-raisin-black">
              Ultra-Wideband Textile Antenna for Wearable Microwave Medical
              Imaging Applications
            </div>
            <div className="d-flex align-items-center gap-3 mt-2">
              <div className="text-13-400 color-black-olive pt-1 pb-1 ps-2 pe-2 bg-new-car-light">
                Article
              </div>
              <div className="text-13-400 color-black-olive">February 2020</div>
              <div className="text-13-400 color-black-olive">
                IEEE Transactions on Antennas and Propagation
              </div>
            </div>
            <div className="d-flex align-items-center gap-3 mt-2">
              <Button
                text="Follow"
                btnStyle="primary-outline"
                className="h-35 cps-20 cpe-20 text-15-500"
              />

              <div className="text-14-400 color-new-car">View more</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default Scores;
