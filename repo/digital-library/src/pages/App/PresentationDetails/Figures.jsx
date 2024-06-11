import { Button } from "components";
import { icons } from "utils/constants";

const Figures = () => {
  // testFigure
  return (
    <div className="shadow">
      <div className="cps-28 cpt-16 cpb-16 text-22-500 color-3d3d bb-e3e3">
        Figures (3)
      </div>
      <div className="cps-26 cpe-26 cpb-26 cpt-26">
        <div className="b-e3e3 rounded cps-26 cpe-26 cpb-26 cpt-26 row">
          <div className="fa-center gap-2 text-18-400 color-3d3d">
            <div>Figure 1: </div>
            <div className="text-18-500">
              The probability distribution function of uniform distribution
            </div>
          </div>
          <div
            className="mt-2 col-md-6 col-12"
            style={{
              height: "300px",
            }}
          >
            <img src={icons.testFigure} alt="figure" className="fit-image" />
          </div>
        </div>
      </div>
      <div className="f-center pt-2 pb-4">
        <Button
          btnText="Dowload Figures"
          btnStyle="SD"
          onClick={() => {}}
          leftIcon={icons.lightDownload}
        />
      </div>
    </div>
  );
};

export default Figures;
