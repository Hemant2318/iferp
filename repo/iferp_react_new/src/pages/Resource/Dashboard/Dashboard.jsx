import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Chart } from "react-google-charts";
import moment from "moment";
import { map } from "lodash";
import Dropdown from "components/form/Dropdown";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import { fetchAllEvents, fetchJournals, getDashboard } from "store/slices";
import {
  getDataFromLocalStorage,
  getYearList,
  objectToFormData,
} from "utils/helpers";
import "./Dashboard.scss";
import Loader from "components/Layout/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { resource_role } = getDataFromLocalStorage();
  const [pageLoading, setPageLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(true);
  const [journalLoading, setJournalLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [journalList, setJournalList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [year, setYear] = useState({
    members_analytic_year: moment().format("YYYY"),
    event_id: "",
    journal_id: "",
  });
  const getReviewerJournals = async () => {
    const response = await dispatch(fetchJournals(objectToFormData()));
    setJournalList(response?.data?.users || []);
    setJournalLoading(false);
  };
  const getReviewerEvents = async () => {
    const response = await dispatch(fetchAllEvents(objectToFormData()));
    setEventList(response?.data?.events || []);
    setEventLoading(false);
  };
  const fetchDashboardData = async (yearData) => {
    let queryParams = new URLSearchParams(yearData).toString();
    const response = await dispatch(getDashboard(`?${queryParams}`));
    setDashboardData(response?.data || {});
    setPageLoading(false);
  };
  useEffect(() => {
    getReviewerEvents();
    getReviewerJournals();
    fetchDashboardData(year);
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
    members_analytics,
    abstract_statistics,
    journal_statistics,
  } = dashboardData;
  const memberAnalyticsData = [
    ["", "Student Members", "Professional Members", "Institutional Members"],
  ];
  map(members_analytics, (val, key) => {
    if (val?.all_students !== undefined) {
      memberAnalyticsData.push([
        `${moment().month(key).format("MMM")} ${year?.members_analytic_year}`,
        val?.all_students,
        val?.all_professionals,
        val?.all_institutions,
      ]);
    }
  });
  const eventData = [
    ["", "", { role: "style" }],
    ["Pending", abstract_statistics?.event_pending, "#00B4CC"],
    ["Plagarised", abstract_statistics?.event_plagiarized, "#00A0E7"],
    ["Accepted", abstract_statistics?.event_accepted, "#1E4CDA"],
    ["Registered", abstract_statistics?.event_registered, "#00B2FF"],
    ["Unregistered", abstract_statistics?.event_un_registered, "#6C56F0"],
    ["Rejected", abstract_statistics?.event_rejected, "#0543FF"],
  ];
  const journalData = [
    ["", "", { role: "style" }],
    ["Pending", journal_statistics?.journal_pending, "#00B4CC"],
    ["Plagarised", journal_statistics?.journal_plagiarized, "#00A0E7"],
    ["Accepted", journal_statistics?.journal_accepted, "#1E4CDA"],
    ["Registered", journal_statistics?.journal_registered, "#00B2FF"],
    ["Unregistered", journal_statistics?.journal_un_registered, "#6C56F0"],
    ["Rejected", journal_statistics?.journal_rejected, "#0543FF"],
  ];
  return (
    <>
      <div className="row" id="resourcse-dashboard-container">
        <div className="text-24-500 color-raisin-black mb-5 text-center">
          {resource_role === "2"
            ? "Conference Co-ordinator Resource"
            : "Membership Resource"}
        </div>
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
                <div className="text-15-500 color-black-olive">
                  Allocated Students
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
                <div className="text-15-500 color-black-olive">
                  Allocated Professionals
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
                <div className="text-15-500 color-black-olive">
                  Allocated Institutions
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
          {pageLoading ? (
            <Card className="cps-30 cpe-30 cpt-80 cpb-80">
              <Loader size="md" />
            </Card>
          ) : (
            <Card className="cps-30 cpe-30 cpt-30 cpb-30">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="text-18-600 color-black-olive">
                  Abstract Statistics
                </div>
                <div>
                  <Dropdown
                    options={eventList}
                    optionValue="event_name"
                    placeholder="Event"
                    value={year?.event_id}
                    isLoading={eventLoading}
                    onChange={(e) => {
                      let oldData = {
                        ...year,
                        event_id: e.target.value,
                      };
                      setYear(oldData);
                      fetchDashboardData(oldData);
                    }}
                  />
                </div>
              </div>
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={eventData}
                options={{
                  tooltip: { isHtml: true },
                  legend: { position: "none" },
                  chartArea: {
                    width: "90%",
                  },
                  width: "100%",
                }}
              />
            </Card>
          )}
        </div>
        <div className="mt-3">
          {pageLoading ? (
            <Card className="cps-30 cpe-30 cpt-80 cpb-80">
              <Loader size="md" />
            </Card>
          ) : (
            <Card className="cps-30 cpe-30 cpt-30 cpb-30">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="text-18-600 color-black-olive">
                  Journal Statistics
                </div>
                <div>
                  <Dropdown
                    options={journalList}
                    placeholder="Journal"
                    optionValue="name"
                    value={year?.journal_id}
                    isLoading={journalLoading}
                    onChange={(e) => {
                      let oldData = {
                        ...year,
                        journal_id: e.target.value,
                      };
                      setYear(oldData);
                      fetchDashboardData(oldData);
                    }}
                  />
                </div>
              </div>
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={journalData}
                options={{
                  tooltip: { isHtml: true },
                  legend: { position: "none" },
                  chartArea: {
                    width: "90%",
                  },
                  width: "100%",
                }}
              />
            </Card>
          )}
        </div>

        <div className="mt-3">
          <Card className="cps-30 cpe-30 cpt-30 cpb-30">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="text-18-600 color-black-olive">
                IFERP Member’s Analytics
              </div>
              <div className="d-flex">
                <Dropdown
                  options={getYearList(10).map((o) => {
                    return { ...o, name: o.id };
                  })}
                  optionValue="name"
                  onChange={(e) => {
                    let oldData = {
                      ...year,
                      members_analytic_year: e.target.value,
                    };
                    setYear(oldData);
                    fetchDashboardData(oldData);
                  }}
                  value={year?.members_analytic_year}
                  placeholder="Year"
                />
              </div>
            </div>
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={memberAnalyticsData}
              options={{
                tooltip: { isHtml: true },
                colors: ["#55C7FA", "#8992e0"],
                legend: { position: "bottom" },
                curveType: "function",
                chartArea: {
                  width: "94%",
                },
                width: "100%",
              }}
            />
          </Card>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
