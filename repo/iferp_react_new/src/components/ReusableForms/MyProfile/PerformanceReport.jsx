import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Chart } from "react-google-charts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import moment from "moment";
import Dropdown from "components/form/Dropdown";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Table from "components/Layout/Table";
import { getYearList } from "utils/helpers";
import { getPerformanceReport } from "store/slices";

const PerformanceReport = () => {
  const dispatch = useDispatch();
  const [year, setYear] = useState(moment().format("YYYY"));

  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const fetchDashboardData = async (yearData) => {
    const response = await dispatch(getPerformanceReport(yearData));
    setDashboardData(response?.data || {});
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDashboardData(year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    iferp_events_percentage,
    self_driven_events_percentage,
    total_score_percentage,
    iferp_weighage,
    activity_score,
    percentage_weighage,
  } = dashboardData || {};
  const { iferp_activities, self_driven_activities } = iferp_weighage || {};
  const {
    iferp_activities: iferpActivities,
    self_driven_activities: selfDrivenActivities,
  } = activity_score || {};
  const data = [
    ["", "IFERP Driven", "Self Driven"],
    [
      "Quarter 1",
      percentage_weighage?.data?.iferp?.quarter1,
      percentage_weighage?.data?.self_driven?.quarter1,
    ],
    [
      "Quarter 2",
      percentage_weighage?.data?.iferp?.quarter2,
      percentage_weighage?.data?.self_driven?.quarter2,
    ],
    [
      "Quarter 3",
      percentage_weighage?.data?.iferp?.quarter3,
      percentage_weighage?.data?.self_driven?.quarter3,
    ],
    [
      "Quarter 4",
      percentage_weighage?.data?.iferp?.quarter4,
      percentage_weighage?.data?.self_driven?.quarter4,
    ],
  ];

  const options = {
    tooltip: { isHtml: true },
    series: [{ color: "#2148C0" }],
    curveType: "function",
    legend: { position: "none" },
    chartArea: {
      width: "90%",
    },
    width: "100%",
  };
  const activityData = [
    {
      activity_type: "IFERP Activities",
      submit_activities: iferpActivities?.submitted_activities,
      approved_activities: iferpActivities?.approved_activities,
      score_prescribe: "40",
      max_score_prescribe: "50",
      iferp_scrore: "-",
    },
    {
      activity_type: "Self Driven Activities",
      submit_activities: selfDrivenActivities?.submitted_activities,
      approved_activities: selfDrivenActivities?.approved_activities,
      score_prescribe: "40",
      max_score_prescribe: "50",
      iferp_scrore: "-",
    },
  ];
  const activityHeader = [
    {
      title: "Activity Type",
    },
    {
      title: (
        <>
          <div>Submitted</div>
          <div>Activities</div>
        </>
      ),
    },
    {
      title: "Approved Activities",
    },
    {
      title: (
        <>
          <div>Score Prescribed</div>
          <div>(For minimum Activities)</div>
        </>
      ),
    },
    {
      title: "IFERP Score",
    },
  ];
  const activityRowData = [];
  activityData?.forEach((elem) => {
    let obj = [
      {
        value: elem.activity_type,
      },
      {
        value: elem.submit_activities,
      },
      {
        value: elem.approved_activities,
      },
      {
        value: (
          <>
            <div>{elem.score_prescribe}</div>
            <div>{`(Maximum value - ${elem.max_score_prescribe})`}</div>
          </>
        ),
      },
      {
        value: elem.iferp_scrore,
      },
    ];
    activityRowData.push({ data: obj });
  });
  const iferpData = [
    {
      activity_type: "IFERP Activities",
      weightage: iferp_activities?.weightage_in_percentage,
      q1: iferp_activities?.q1,
      q2: iferp_activities?.q2,
      q3: iferp_activities?.q3,
      q4: iferp_activities?.q4,
      total_scrore: "-",
    },
    {
      activity_type: "Self Driven Activities",
      weightage: self_driven_activities?.weightage_in_percentage,
      q1: self_driven_activities?.q1,
      q2: self_driven_activities?.q2,
      q3: self_driven_activities?.q3,
      q4: self_driven_activities?.q4,
      total_scrore: "-",
    },
  ];
  const iferpHeader = [
    {
      title: "Activity Type",
    },
    {
      title: "Weightage in %",
    },
    {
      title: "Q1",
    },
    {
      title: "Q2",
    },
    {
      title: "Q3",
    },
    {
      title: "Q4",
    },

    {
      title: "Total Score",
    },
  ];
  const iferpRowData = [];
  iferpData?.forEach((elem) => {
    let obj = [
      {
        value: elem.activity_type,
      },
      {
        value: elem.weightage,
      },
      {
        value: elem.q1,
      },
      {
        value: elem.q2,
      },
      {
        value: elem.q3,
      },
      {
        value: elem.q4,
      },

      {
        value: elem.total_scrore,
      },
    ];
    iferpRowData.push({ data: obj });
  });
  return (
    <Card className="performance-report-container cps-34 cpe-34 cpt-34 cpb-12">
      {isLoading ? (
        <div className="cpt-80 cpb-125">
          <Loader size="md" />
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-md-9 h-100 border pt-3 rounded cmb-34">
              <div className="h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="text-18-600 title-text">
                    IFERP Member’s Analytics
                  </div>
                  <div>
                    <Dropdown
                      options={getYearList(10).map((o) => {
                        return { ...o, name: o.id };
                      })}
                      optionValue="name"
                      onChange={(e) => {
                        setYear(e.target.value);
                        fetchDashboardData(e.target.value);
                      }}
                      value={year}
                      placeholder="Year"
                    />
                  </div>
                </div>
                <Chart
                  chartType="AreaChart"
                  width="100%"
                  height="400px"
                  data={data}
                  options={options}
                />
              </div>
            </div>
            <div className="col-md-3 cmb-34">
              <div className="score-bloack h-100">
                <div className="text-18-600 title-text">IFERP Score</div>
                <div className="d-flex flex-column align-items-center flex-wrap">
                  <div className="d-flex flex-column align-items-center">
                    <div className="counter-area-block cmt-24">
                      <CircularProgressbar
                        value={iferp_events_percentage}
                        text={`${iferp_events_percentage}%`}
                        styles={buildStyles({
                          pathColor: "#199BD4",
                          textColor: "#000",
                          trailColor: "#C2EDFF",
                        })}
                      />
                    </div>
                    <div className="text-13-500 color-black-olive cmt-12 text-center">
                      IFERP Events
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <div className="counter-area-block cmt-24">
                      <CircularProgressbar
                        value={self_driven_events_percentage}
                        text={`${self_driven_events_percentage}%`}
                        styles={buildStyles({
                          pathColor: "#199BD4",
                          textColor: "#000",
                          trailColor: "#C2EDFF",
                        })}
                      />
                    </div>
                    <div className="text-13-500 color-black-olive cmt-12 text-center">
                      Self-Driven Events
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <div className="counter-area-block cmt-24">
                      <CircularProgressbar
                        value={total_score_percentage}
                        text={`${total_score_percentage}%`}
                        styles={buildStyles({
                          pathColor: "#199BD4",
                          textColor: "#000",
                          trailColor: "#C2EDFF",
                        })}
                      />
                    </div>
                    <div className="text-13-500 color-black-olive cmt-12 text-center">
                      Total Score
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-16-600 title-text mb-3">Activity Score</div>
          <Table header={activityHeader} rowData={activityRowData} />
          <div className="text-16-600 title-text mt-5 mb-3">
            IFERP Weightage
          </div>
          <Table header={iferpHeader} rowData={iferpRowData} />
        </>
      )}
    </Card>
  );
};
export default PerformanceReport;
