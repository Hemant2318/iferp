import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Chart } from "react-google-charts";
import moment from "moment";
import { forEach } from "lodash";
import Dropdown from "components/form/Dropdown";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import { icons } from "utils/constants";
import { getDashboard } from "store/slices";
import { getDataFromLocalStorage, getYearList } from "utils/helpers";
import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [year, setYear] = useState({
    memberYear: moment().format("YYYY"),
    countryWiseYear: moment().format("YYYY"),
  });
  const fetchDashboardData = async (yearData) => {
    const response = await dispatch(
      getDashboard(
        `?year=${yearData?.memberYear}&country_wise_year=${yearData?.countryWiseYear}`
      )
    );
    setDashboardData(response?.data || {});
    setIsLoading(false);
  };
  useEffect(() => {
    if (["0"].includes(getDataFromLocalStorage("user_type"))) {
      fetchDashboardData(year);
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    institution_diamond_members = 0,
    institution_silver_members = 0,
    institution_gold_members = 0,
    institution_members = 0,
    professional_free_members = 0,
    professional_members = 0,
    professional_premium_members = 0,
    student_members = 0,
    student_free_members = 0,
    student_premium_members = 0,
    chart_by_year = {},
    county_wise_member = {},
    top_rated_institutions = [],
  } = dashboardData;

  let memberChart = [
    ["", "Student Members", "Professional Members", "Institutional Members"],
  ];

  forEach(chart_by_year, (val, key) => {
    memberChart.push([
      `${moment()
        .month(key - 1)
        .format("MMM")} ${year?.memberYear}`,
      val?.student_members,
      val?.professional_members,
      val?.institution_members,
    ]);
  });

  let countryChart = [
    ["", "Student Members", "Professional Members", "Institutional Members"],
  ];

  forEach(county_wise_member, (val, key) => {
    if (+key < 10) {
      countryChart.push([
        val.country_name,
        val?.student_members,
        val?.professional_members,
        val?.institution_members,
      ]);
    }
  });
  return (
    <>
      <div className="row" id="admin-dashboard-container">
        <div className="col-md-4 mb-2">
          <Card className="border dashboard-card">
            <div className="center-flex border-b cpt-16 cpb-16">
              <div className="card-profile">
                <img src={icons.studentMember} alt="img" />
              </div>
              <div className="text-start cps-16">
                <div className="text-20-600 color-raisin-black">
                  {student_members}
                </div>
                <div className="text-15-500 color-black-olive font-poppins">
                  Student Members
                </div>
              </div>
            </div>
            <div className="col-md-12 d-flex">
              <div className="col-md-6 col-6 border-r cpt-16 cpb-16 text-center">
                <div className="text-16-500 color-raisin-black">
                  {student_premium_members}
                </div>
                <div className="text-13-400 color-black-olive pt-1">
                  Premium
                </div>
              </div>
              <div className="col-md-6 col-6 cpt-16 cpb-16 text-center">
                <div className="text-16-500 color-raisin-black">
                  {student_free_members}
                </div>
                <div className="text-13-400 color-black-olive pt-1">Free</div>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-md-4 mb-2">
          <Card className="border dashboard-card">
            <div className="center-flex border-b cpt-16 cpb-16">
              <div className="card-profile">
                <img src={icons.management} alt="img" />
              </div>
              <div className="text-start cps-16">
                <div className="text-20-600 color-raisin-black">
                  {professional_members}
                </div>
                <div className="text-15-500 color-black-olive font-poppins">
                  Professional Members
                </div>
              </div>
            </div>
            <div className="col-md-12 d-flex">
              <div className="col-md-6 col-6 border-r cpt-16 cpb-16 text-center">
                <div className="text-16-500 color-raisin-black">
                  {professional_premium_members}
                </div>
                <div className="text-13-400 color-black-olive pt-1">
                  Premium
                </div>
              </div>
              <div className="col-md-6 col-6 cpt-16 cpb-16 text-center">
                <div className="text-16-500 color-raisin-black">
                  {professional_free_members}
                </div>
                <div className="text-13-400 color-black-olive pt-1">Free</div>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-md-4 mb-2">
          <Card className="border dashboard-card">
            <div className="center-flex border-b cpt-16 cpb-16">
              <div className="card-profile">
                <img src={icons.institute} alt="img" />
              </div>
              <div className="text-start cps-16">
                <div className="text-20-600 color-raisin-black">
                  {institution_members}
                </div>
                <div className="text-15-500 color-black-olive font-poppins">
                  Institutional Members
                </div>
              </div>
            </div>
            <div className="col-md-12 d-flex">
              <div className="col-md-4 col-4 border-r cpt-16 cpb-16 text-center">
                <div className="text-16-500 color-raisin-black">
                  {institution_silver_members}
                </div>
                <div className="text-13-400 color-black-olive pt-1">Silver</div>
              </div>
              <div className="col-md-4 col-4 border-r cpt-16 cpb-16 text-center">
                <div className="text-16-500 color-raisin-black">
                  {institution_gold_members}
                </div>
                <div className="text-13-400 color-black-olive pt-1">Gold</div>
              </div>
              <div className="col-md-4 col-4 cpt-16 cpb-16 text-center">
                <div className="text-16-500 color-raisin-black">
                  {institution_diamond_members}
                </div>
                <div className="text-13-400 color-black-olive pt-1">
                  Diamond
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-3">
          {isLoading ? (
            <Card className="cpt-80 cpb-80 center-flex">
              <Loader size="md" />
            </Card>
          ) : (
            <Card className="cps-30 cpe-30 cpt-30 cpb-30">
              <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-2">
                <div className="text-18-600 title-text text-nowrap">
                  IFERP Member’s Analytics
                </div>
                <div className="d-flex">
                  <Dropdown
                    options={getYearList(10).map((o) => {
                      return { ...o, name: o.id };
                    })}
                    optionValue="name"
                    onChange={(e) => {
                      let oldData = { ...year, memberYear: e.target.value };
                      setYear(oldData);
                      fetchDashboardData(oldData);
                    }}
                    value={year?.memberYear}
                    placeholder="Year"
                  />
                </div>
              </div>
              <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={memberChart}
                options={{
                  tooltip: { isHtml: true },
                  colors: ["#2479E0", "#55C7FA", "#8992e0"],
                  legend: { position: "bottom" },
                  curveType: "function",
                  chartArea: {
                    width: "80%",
                  },
                  width: "100%",
                }}
              />
            </Card>
          )}
        </div>
        <div className="col-md-8 mt-3">
          {isLoading ? (
            <Card className="cpt-80 cpb-80 center-flex h-100">
              <Loader size="md" />
            </Card>
          ) : (
            <Card className="cps-30 cpe-30 cpt-30 cpb-30 h-100">
              <div className="d-flex justify-content-between align-items-center text-wrap gap-2 mb-4">
                <div className="text-18-600 title-text text-nowrap">
                  Country Wise Analytics
                </div>
                <div>
                  <Dropdown
                    options={getYearList(10).map((o) => {
                      return { ...o, name: o.id };
                    })}
                    optionValue="name"
                    onChange={(e) => {
                      let oldData = {
                        ...year,
                        countryWiseYear: e.target.value,
                      };
                      setYear(oldData);
                      fetchDashboardData(oldData);
                    }}
                    value={year?.countryWiseYear}
                    placeholder="Year"
                  />
                </div>
              </div>
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={countryChart}
                options={{
                  tooltip: { isHtml: true },
                  colors: ["#224BC8", "#796AD2", "#3BACDF"],
                  legend: { position: "bottom" },
                  curveType: "function",
                  chartArea: {
                    width: "80%",
                  },
                  width: "100%",
                }}
              />
            </Card>
          )}
        </div>
        <div className="col-md-4 mt-3">
          <Card className="cps-30 cpe-30 cpt-30 cpb-30 h-100">
            <div className="text-18-600 title-text">Top Rated Institutions</div>
            <div className="rated-list-container">
              {top_rated_institutions.map((elm, index) => {
                return (
                  <div
                    className={`rated-list-block ${index >= 3 ? "d-none" : ""}`}
                    key={index}
                  >
                    <div className="text-15-600 color-raisin-black">
                      {elm?.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
