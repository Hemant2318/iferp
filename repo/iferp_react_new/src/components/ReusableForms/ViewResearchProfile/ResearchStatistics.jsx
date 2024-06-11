import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import Card from "components/Layout/Card";
import { fetchResearchStatistics, setRProfileID } from "store/slices";
import { useDispatch } from "react-redux";
import moment from "moment";
import Dropdown from "components/form/Dropdown";
import {
  getDataFromLocalStorage,
  getYearList,
  titleCaseString,
} from "utils/helpers";
import Profile from "components/Layout/Profile";
import Loader from "components/Layout/Loader";
import RequestHandleLayout from "components/Layout/RequestHandleLayout";

const ResearchStatistics = ({ userID, isMyProfile }) => {
  const dispatch = useDispatch();

  // const [isLoader, setIsLoader] = useState("");
  // const [requestList, setRequestList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [params, setParams] = useState({
    chart_year: moment().format("YYYY"),
    statistics_year: moment().format("YYYY"),
    user_id: userID,
  });
  // const handelSendRequest = async (id) => {
  //   setIsLoader(id);
  //   const response = await dispatch(
  //     sendRequests(objectToFormData({ receiver_id: id }))
  //   );
  //   if (response?.status === 200) {
  //     let oldList = cloneDeep(requestList);
  //     if (oldList.find((o) => `${o.id}` === `${id}`)) {
  //       oldList = oldList.filter((o) => `${o.id}` !== `${id}`);
  //     } else {
  //       oldList = [...oldList, response?.data];
  //     }
  //     setRequestList(oldList);
  //   }
  //   setIsLoader("");
  // };
  // const getRequest = async () => {
  //   const response = await dispatch(fetchRequests({ type: "following" }));
  //   setRequestList(response?.data?.result);
  // };
  const getResearchStatistics = async (object) => {
    setIsLoading(true);
    let queryParams = new URLSearchParams(object).toString();
    const response = await dispatch(fetchResearchStatistics(`?${queryParams}`));
    setDetails(response?.data || {});
    setIsLoading(false);
  };
  useEffect(() => {
    getResearchStatistics(params);
    // if (isMyProfile) {
    //   getRequest();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    chart = {},
    tabs = {},
    statistics_history = {},
    research_interest = {},
    trending_researchers = [],
  } = details;

  const {
    total_ri_score,
    conference_papers,
    published_research,
    reads,
    shares,
    // citations,
    // "h-index": hIndex,
  } = research_interest;
  const {
    questions = {},
    others = {},
    research_articles = {},
    conference_papers: conferencePapers = {},
    published_research: publishedResearch = {},
  } = chart;
  const data = [
    [
      "",
      "Research Articles",
      "Conference Papers",
      "Publications",
      "Questions",
      "Others",
    ],
  ];
  const lineData = [["", "Reads", "Likes"]];
  Array(12)
    .fill()
    .forEach((_, i) => {
      let index = i + 1;
      data.push([
        `${moment().month(i).format("MMM")}`,
        research_articles[index] || 0,
        conferencePapers[index] || 0,
        publishedResearch[index] || 0,
        questions[index] || 0,
        others[index] || 0,
      ]);
      lineData.push([
        `${moment().month(i).format("MMM")}`,
        statistics_history[index]?.reads || 0,
        statistics_history[index]?.likes || 0,
      ]);
    });
  const options = {
    colors: ["#274AC1", "#58C9EC", "#8479FF", "#274AC1", "#58C9EC"],
    // legend: { position: "none" },
    legend: { position: "bottom" },
    curveType: "function",
    chartArea: {
      width: "94%",
    },
    width: "100%",
  };
  const testArray = [
    {
      key: "Research Articles",
      data: [
        {
          key: "Total Articles",
          value: tabs?.research_articles?.total_articles,
        },
        { key: "Total Views", value: tabs?.research_articles?.total_views },
        { key: "Likes", value: tabs?.research_articles?.total_likes },
        { key: "Shares", value: tabs?.research_articles?.total_shares },
      ],
    },
    {
      key: "Conference Papers",
      data: [
        {
          key: "Total Papers",
          value: tabs?.conference_papers?.total_articles,
        },
        { key: "Total Views", value: tabs?.conference_papers?.total_views },
        { key: "Likes", value: tabs?.conference_papers?.total_likes },
        { key: "Shares", value: tabs?.conference_papers?.total_shares },
      ],
    },
    {
      key: "Publication",
      data: [
        {
          key: "Total Publication",
          value: tabs?.published_research?.total_articles,
        },
        { key: "Total Views", value: tabs?.published_research?.total_views },
        { key: "Likes", value: tabs?.published_research?.total_likes },
        { key: "Shares", value: tabs?.published_research?.total_shares },
      ],
    },
    // {
    //   key: "Projects",
    //   data: [
    //     {
    //       key: "Total Papers",
    //       value: tabs?.others?.total_articles,
    //     },
    //     { key: "Total Views", value: tabs?.others?.total_views },
    //     { key: "Likes", value: tabs?.others?.total_likes },
    //     { key: "Shares", value: tabs?.others?.total_shares },
    //   ],
    // },
    {
      key: "Question & Answers",
      data: [
        {
          key: "Total Question & Answers",
          value: tabs?.questions?.total_articles,
        },
        { key: "Total Views", value: tabs?.questions?.total_views },
        { key: "Likes", value: tabs?.questions?.total_likes },
        { key: "Shares", value: tabs?.questions?.total_shares },
      ],
    },
  ];

  return (
    <div className="row">
      {isLoading ? (
        <Card className="cpt-125 cpb-125">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          <div className="col-md-4 d-flex">
            <Card className="cps-22 cpe-22 cpt-22 cpb-22">
              <div className="d-flex align-items-center justify-content-between">
                <div className="text-18-500 color-blac-olive">
                  Research Interest
                </div>
                {/* <div>
                  <div className="color-new-car text-13-400 pointer">
                    <i className="bi bi-share me-2" />
                    Share
                  </div>
                </div> */}
              </div>
              <div className="d-flex flex-wrap cmt-22">
                <div className="col-md-9 text-15-500 color-black-olive cmb-22">
                  Total Research Score
                </div>
                <div className="col-md-3 text-center text-15-500 color-raisin-black cmb-22">
                  {total_ri_score}
                </div>
                <div className="col-md-9 text-15-500 color-black-olive cmb-22">
                  Conferences
                </div>
                <div className="col-md-3 text-center text-15-500 color-raisin-black cmb-22">
                  {conference_papers}
                </div>
                <div className="col-md-9 text-15-500 color-black-olive cmb-22">
                  Publications
                </div>
                <div className="col-md-3 text-center text-15-500 color-raisin-black cmb-22">
                  {published_research}
                </div>
                <div className="col-md-9 text-15-500 color-black-olive cmb-22">
                  Reads
                </div>
                <div className="col-md-3 text-center text-15-500 color-raisin-black cmb-22">
                  {reads}
                </div>
                <div className="col-md-9 text-15-500 color-black-olive cmb-22">
                  Recommends
                </div>
                <div className="col-md-3 text-center text-15-500 color-raisin-black cmb-22">
                  0
                </div>
                <div className="col-md-9 text-15-500 color-black-olive cmb-22">
                  Shares
                </div>
                <div className="col-md-3 text-center text-15-500 color-raisin-black cmb-22">
                  {shares}
                </div>
                {/* <div className="border-bottom col-md-12 cmb-22" />
                <div className="col-md-9 text-15-500 color-black-olive cmb-22">
                  Citations
                </div>
                <div className="col-md-3 text-center text-15-500 color-raisin-black cmb-22">
                  {citations}
                </div>
                <div className="col-md-9 text-15-500 color-black-olive">
                  h-index
                </div>
                <div className="col-md-3 text-center text-15-500 color-raisin-black">
                  {hIndex}
                </div> */}
              </div>
            </Card>
          </div>
          <div className="col-md-8 d-flez">
            <Card className="cps-22 cpe-22 cpt-22 cpb-22 col-md-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="text-18-600 color-black-olive">Overview</div>
                <div>
                  <Dropdown
                    placeholder="Year"
                    value={params?.chart_year}
                    optionValue="name"
                    options={getYearList(10).map((o) => {
                      return { ...o, name: o.id };
                    })}
                    onChange={(e) => {
                      let oldData = { ...params, chart_year: e.target.value };
                      setParams(oldData);
                      getResearchStatistics(oldData);
                    }}
                  />
                </div>
              </div>
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="320px"
                data={data}
                options={options}
              />
            </Card>
          </div>
          <div className="col-md-12 mt-3">
            <Card className="cps-22 cpe-22 cpt-22">
              <div className="col-md-12 d-flex flex-wrap">
                {testArray.map((elem, index) => {
                  return (
                    <div
                      className="col-md-6 col-sm-12 cmb-22 d-flex flex-column ps-1 pe-1"
                      key={index}
                    >
                      <div className="d-flex align-items-center justify-content-between bg-light-primary cps-20 cpe-20 cpt-14 cpb-14">
                        <div className="text-18-500 color-new-car">
                          {elem.key}
                        </div>
                      </div>
                      <div className="d-flex flex-wrap cps-20 cpe-20 cpt-22 border-end border-start border-bottom flex-grow-1">
                        {elem.data.map((childElem, childIndex) => {
                          return (
                            <React.Fragment key={childIndex}>
                              <div className="col-md-4 col-sm-6 col-6 cmb-24">
                                {childElem.key}
                              </div>
                              <div className="col-md-2 col-sm-6 col-6 cmb-24">
                                {childElem.value}
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
          {isMyProfile && (
            <div className="mt-3">
              <Card className="cps-22 cpe-22 cpt-22 cpb-22">
                <div className="d-flex align-items-center justify-content-between cmb-24">
                  <div className="text-18-500 color-black-olive">
                    Trending Researchers
                  </div>
                </div>
                {trending_researchers?.map((elem, index) => {
                  const {
                    id,
                    name,
                    profile_photo_path,
                    description,
                    user_type,
                  } = elem;
                  /* const isExist = requestList.find((o) => `${o.id}` === `${id}`)
                    ? true
                    : false; */
                  let isHide = false;
                  if (getDataFromLocalStorage("id") === id) {
                    isHide = true;
                  }
                  const isReasearchProfile = ["2", "5"].includes(user_type);
                  return (
                    <div
                      className={`d-flex align-items-center border w-100 cps-22 cpe-22 cpt-16 cpb-16 cmb-22 ${
                        isHide ? "d-none" : ""
                      }`}
                      key={index}
                    >
                      <div className="col-md-10 d-flex align-items-center">
                        <Profile
                          isRounded
                          text={name}
                          url={profile_photo_path}
                          size="s-48"
                          isS3UserURL
                        />
                        <div className="flex-grow-1 ms-3">
                          <div
                            // className="text-16-500 color-raisin-black"
                            className={`text-16-500 ${
                              isReasearchProfile
                                ? "color-title-navy pointer hover-effect"
                                : "color-raisin-black"
                            }`}
                            onClick={() => {
                              if (isReasearchProfile) {
                                dispatch(setRProfileID());
                                setTimeout(() => {
                                  dispatch(setRProfileID(id));
                                }, 100);
                              }
                            }}
                          >
                            {titleCaseString(elem.name)}
                          </div>
                          {description && (
                            <div className="text-14-400 mt-2">
                              {description}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-2 d-flex justify-content-end">
                        <RequestHandleLayout receiverId={id} newSendRequest />
                        {/* <Button
                          isSquare
                          text={isExist ? "Cancel" : "Follow"}
                          btnStyle={
                            isExist ? "primary-light" : "primary-outline"
                          }
                          className="h-35 cps-20 cpe-20"
                          btnLoading={isLoader === id}
                          onClick={() => {
                            handelSendRequest(id);
                          }}
                        /> */}
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
          )}
          <div className="mt-3">
            <Card className="cps-30 cpe-30 cpt-30 cpb-30">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="text-18-600 color-black-olive">
                  Statistics History
                </div>
                <div>
                  <Dropdown
                    placeholder="Year"
                    value={params?.statistics_year}
                    optionValue="name"
                    options={getYearList(10).map((o) => {
                      return { ...o, name: o.id };
                    })}
                    onChange={(e) => {
                      let oldData = {
                        ...params,
                        statistics_year: e.target.value,
                      };
                      setParams(oldData);
                      getResearchStatistics(oldData);
                    }}
                  />
                </div>
              </div>
              <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={lineData}
                options={{
                  colors: ["#4809F2", "#1597EE"],
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
        </>
      )}
    </div>
  );
};
export default ResearchStatistics;
