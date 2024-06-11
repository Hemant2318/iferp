import Card from "components/Layout/Card";
import Dropdown from "components/form/Dropdown";
import Chart from "react-google-charts";
import { icons } from "utils/constants";
import {
  getMonthAndYearList,
  getYearList,
  objectToFormData,
} from "utils/helpers";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchMentorAnalysis,
  fetchPaymentAnalytics,
  fetchPaymentReport,
} from "store/slices";
import Loader from "components/Layout/Loader";
import { omit } from "lodash";
import moment from "moment";

const PaymentReport = () => {
  const dispatch = useDispatch();
  const [paymentHeaderData, setPaymentHeaderData] = useState({});
  const [mentorAnalysisData, setMentorAnalysisData] = useState({
    year: moment().format("YYYY"),
    data: [],
    loading: true,
  });

  const [paymentAnalyticsData, setPaymentAnalyticsData] = useState({
    month_year: moment().format("MM/YYYY"),
    data: [],
    loading: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  const getPaymentReport = async () => {
    const response = await dispatch(fetchPaymentReport());
    if (response?.status === 200) {
      setPaymentHeaderData(response?.data || {});
    }
    setIsLoading(false);
  };

  const getMentorAnalysis = async (obj) => {
    const payload = omit(obj, ["data", "loading"]);
    const formData = objectToFormData(payload);
    const response = await dispatch(fetchMentorAnalysis(formData));
    if (response?.status === 200) {
      setMentorAnalysisData((prev) => {
        return {
          ...prev,
          data: response?.data || [],
          loading: false,
        };
      });
    }
  };
  const getPaymentAnalytic = async (obj) => {
    const payload = omit(obj, ["data", "loading"]);
    const formData = objectToFormData(payload);
    const response = await dispatch(fetchPaymentAnalytics(formData));
    if (response?.status === 200) {
      setPaymentAnalyticsData((prev) => {
        return {
          ...prev,
          data: response?.data || {},
          loading: false,
        };
      });
    }
  };

  useEffect(() => {
    getPaymentReport();
    getMentorAnalysis(mentorAnalysisData);
    getPaymentAnalytic(paymentAnalyticsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { mentee_amount, mentor_amount, plarform_fee } =
    paymentAnalyticsData?.data;
  // const mentee_amount = 10;
  // const mentor_amount = 0;
  // const plarform_fee = 0;

  const paymentHeader = [
    {
      id: 1,
      icon: icons.mentors,
      name: "Mentors",
      value: paymentHeaderData?.total_mentor,
    },
    {
      id: 2,
      icon: icons.mentees,
      name: "Mentees",
      value: paymentHeaderData?.total_mentees,
    },
    {
      id: 3,
      icon: icons.sessions,
      name: "Sessions",
      value: paymentHeaderData?.total_session,
    },
    {
      id: 4,
      icon: icons.revenue,
      name: "Revenue Earned",
      value: paymentHeaderData?.total_payment,
    },
  ];

  const paymentChart = [["", "Mentors", "Mentees", "Revenue Generated"]];
  if (!mentorAnalysisData?.loading && mentorAnalysisData?.data?.length > 0) {
    mentorAnalysisData?.data?.forEach((val) => {
      paymentChart.push([
        `${moment(val?.month_name, "MMMM").format("MMM")} ${
          mentorAnalysisData?.year
        }`,
        val?.monthly_mantor || 0,
        val?.monthly_mentee || 0,
        val?.monthly_payment || 0,
      ]);
    });
  } else {
    paymentChart.push([
      `${moment().format("MMM")} ${mentorAnalysisData?.year}`,
      0,
      0,
      0,
    ]);
  }

  return (
    <div>
      <Card className="cps-24 cpe-24 cpt-24 cpb-24">
        <div className="row">
          {isLoading ? (
            <div className="cpt-80 cpb-80">
              <Loader size="md" />
            </div>
          ) : (
            paymentHeader?.map((elem, index) => {
              const { name, icon, value } = elem;
              return (
                <div className="col-md-3" key={index}>
                  <div className="b-d6e9 rounded cpt-14 cpb-14 cps-18 d-flex align-items-center gap-3">
                    <div className="h-80">
                      <img src={icon} alt="mentors" className="fit-image" />
                    </div>
                    <div>
                      <div className="text-26-600 color-5068 mb-2">{value}</div>
                      <div className="text-16-400 color-5068">{name}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
      <div className="row cmt-18">
        <div className="col-md-8">
          {mentorAnalysisData?.loading ? (
            <Card className="cpt-80 cpb-80 center-flex h-100">
              <Loader size="md" />
            </Card>
          ) : (
            <Card className="cps-30 cpe-30 cpt-30 cpb-30">
              {!mentorAnalysisData?.loading &&
              mentorAnalysisData?.data?.length === 0 ? (
                <div className="d-flex flex-column">
                  <div className="text-18-600 title-text text-nowrap cmb-50">
                    Mentor Analysis
                  </div>

                  <div className="text-center cpt-50 cpb-50">No Data Found</div>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-2">
                    <div className="text-18-600 title-text text-nowrap">
                      Mentor Analysis
                    </div>
                    <div className="d-flex">
                      <Dropdown
                        options={getYearList(10).map((o) => {
                          return { ...o, name: o.id };
                        })}
                        optionValue="name"
                        onChange={(e) => {
                          let oldValue = {
                            ...mentorAnalysisData,
                            year: e?.target.value,
                            loading: true,
                          };
                          setMentorAnalysisData(oldValue);
                          getMentorAnalysis(oldValue);
                        }}
                        value={mentorAnalysisData?.year}
                        placeholder="Year"
                      />
                    </div>
                  </div>
                  <Chart
                    chartType="LineChart"
                    width="100%"
                    height="400px"
                    data={paymentChart}
                    options={{
                      animation: {
                        startup: true /* Need to add this for animations */,
                        duration: 1000,
                        easing: "out",
                      },
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
                </>
              )}
            </Card>
          )}
        </div>

        <div className="col-md-4">
          {paymentAnalyticsData?.loading ? (
            <Card className="cpt-80 cpb-80 center-flex h-100">
              <Loader size="md" />
            </Card>
          ) : (
            <Card className="cps-30 cpe-30 cpt-30 cpb-30 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="text-18-600 title-text">Payment Analytics</div>
                {(parseInt(mentee_amount) !== 0 ||
                  parseInt(mentor_amount) !== 0 ||
                  parseInt(plarform_fee) !== 0) && (
                  <div>
                    <Dropdown
                      options={getMonthAndYearList(10).map((o) => {
                        return { ...o, id: o?.id, value: o?.value };
                      })}
                      optionValue="value"
                      onChange={(e) => {
                        let oldValue = {
                          ...paymentAnalyticsData,
                          month_year: e?.target.value,
                        };
                        setPaymentAnalyticsData(oldValue);
                        getPaymentAnalytic(oldValue);
                      }}
                      value={paymentAnalyticsData?.month_year}
                      placeholder="Year"
                    />
                  </div>
                )}
              </div>
              {parseInt(mentee_amount) === 0 ||
              parseInt(mentor_amount) === 0 ||
              parseInt(plarform_fee) === 0 ? (
                <div className="text-center cpt-50 cpb-50">No data found</div>
              ) : (
                <Chart
                  chartType="PieChart"
                  width="100%"
                  height="400px"
                  data={[
                    ["Task", "Hours per Day"],
                    ["Mentees", parseInt(mentee_amount)],
                    ["Mentors", parseInt(mentor_amount)],
                    ["Platform Fee", parseInt(plarform_fee)],
                  ]}
                  options={{
                    tooltip: { isHtml: true },
                    colors: ["#60DBFF", "#5A93FF", "#FDC137"],
                    legend: { position: "bottom" },
                    curveType: "function",
                    chartArea: {
                      width: "98%",
                    },
                    width: "100%",
                    pieHole: 0.4,
                  }}
                />
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentReport;
