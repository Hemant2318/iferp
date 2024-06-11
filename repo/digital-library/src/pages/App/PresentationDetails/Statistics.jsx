import { Checkbox, DropdownOption } from "components";
import { Chart } from "react-google-charts";
import { icons } from "utils/constants";
const Statistics = () => {
  let memberChart = [
    ["", "Predio Downloads", "Article Downloads", "Citations", "Shares"],
    ["Jan 2022", 150, 150, 100, 50],
    ["Feb 2022", 300, 250, 150, 100],
    ["Mar 2022", 350, 100, 200, 50],
    ["Apr 2022", 150, 50, 150, 100],
    ["May 2022", 100, 200, 100, 75],
    ["Jun 2022", 150, 100, 100, 50],
    ["Jul 2022", 150, 250, 50, 75],
    ["Aug 2022", 100, 50, 200, 50],
    ["Sep 2022", 50, 100, 250, 100],
    ["Oct 2022", 100, 200, 300, 150],
    ["Nov 2022", 250, 150, 250, 50],
    ["Dec 2022", 50, 300, 300, 100],
  ];

  return (
    <div className="shadow cp-28">
      <div className="b-e3e3 rounded">
        <div className="cps-28 cpe-28 cpt-16 cpb-16 text-15-500 color-3d3d bb-e3e3 fb-center">
          <div>Statistics History</div>
          <DropdownOption
            icons={
              <div className="b-e3e3 rounded ps-2 pe-2 pt-1 pb-1 fa-center gap-2">
                <span>
                  <img src={icons.filter} alt="filter" />
                </span>
                <span className="text-14-400">Monthly</span>
                <span>
                  <img src={icons.downArrow} alt="more" />
                </span>
              </div>
            }
          >
            <div className="cps-10 cpe-10">
              <div className="cps-10 cpe-10 cpt-10 cpb-10 cpe-10 bb-e3e3 text-15-400 color-3d3d text-nowrap pointer">
                Today
              </div>
              <div className="cps-10 cpe-10 cpt-10 cpb-10 cpe-10 bb-e3e3 text-15-400 color-3d3d text-nowrap pointer">
                Monthly
              </div>
              <div className="cps-10 cpe-10 cpt-10 cpb-10 cpe-10 text-15-400 color-3d3d text-nowrap pointer">
                Yearly
              </div>
            </div>
          </DropdownOption>
        </div>
        <div>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={memberChart}
            options={{
              tooltip: { isHtml: true },
              colors: ["#FFB8A6", "00AE65", "#1597EE", "#2C1CED"],
              legend: { position: "none" },
              curveType: "function",
              chartArea: {
                width: "85%",
              },
              width: "100%",
            }}
          />
          <div className="fa-center pb-5 ps-5 pe-3">
            <div className="d-flex flex-wrap gap-5">
              <div className="fa-center">
                <span>
                  <Checkbox checked={true} />
                </span>
                <span className="d-flex p-1 border border-light rounded-circle bg-b8a6" />
                <span className="ms-2 text-15-400 color-3d3d">
                  Predio Downloads (287)
                </span>
              </div>
              <div className="fa-center">
                <span>
                  <Checkbox checked={true} />
                </span>
                <span className="d-flex p-1 border border-light rounded-circle bg-ae65" />
                <span className="ms-2 text-15-400 color-3d3d">
                  Article Downloads (356)
                </span>
              </div>
              <div className="fa-center">
                <span>
                  <Checkbox checked={true} />
                </span>
                <span className="d-flex p-1 border border-light rounded-circle bg-97ee" />
                <span className="ms-2 text-15-400 color-3d3d">
                  Citations (168)
                </span>
              </div>
              <div className="fa-center">
                <span>
                  <Checkbox checked={true} />
                </span>
                <span className="d-flex p-1 border border-light rounded-circle bg-1ced" />
                <span className="ms-2 text-15-400 color-3d3d">
                  Shares (220)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
