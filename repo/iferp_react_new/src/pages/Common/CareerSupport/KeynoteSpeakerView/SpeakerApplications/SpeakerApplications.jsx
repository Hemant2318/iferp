import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import Button from "components/form/Button";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAppliedCareer } from "store/slices";
import { limit } from "utils/constants";
import { getStatus, objectToFormData, titleCaseString } from "utils/helpers";

const SpeakerApplications = () => {
  const dispatch = useDispatch();

  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mySpeakerApplication, setMySpeakerApplication] = useState([]);

  const navigate = useNavigate();

  const getBecomeData = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchAppliedCareer(forData));
    if (response?.data?.career_details) {
      const newData = response?.data?.career_details?.filter(
        (o) => o?.career_id === 6
      );
      setMySpeakerApplication(newData || []);
    }
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    getBecomeData({ ...filterData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const dummyData = [
  //   {
  //     id: 1,
  //     conference_name:
  //       "A guest lecture on how to file a patent aims to provide participants with a concise understanding of the patent",
  //     session_name: "Nanotechnology",
  //     submitted_on: "14.08.23",
  //     status: "Pending",
  //   },
  //   {
  //     id: 2,
  //     conference_name:
  //       "International Conference on Multidisciplinary Approaches in Technology and Social Development (ICMATSD)",
  //     session_name: "Social Science & Humanities",
  //     submitted_on: "20.07.23",
  //     status: "Accepted",
  //   },
  //   {
  //     id: 3,
  //     conference_name:
  //       "International Conference on Advances in Computer Engineering, Communication Systems and (ICACECSBD)",
  //     session_name: "Nanotechnology",
  //     submitted_on: "20.07.23",
  //     status: "Accepted",
  //   },
  //   {
  //     id: 4,
  //     conference_name:
  //       "4th International Conference on Multidisciplinary and Current Educational Research (ICMCER-2023)",
  //     session_name: "Artificial Intelligence",
  //     submitted_on: "08.05.23",
  //     status: "Accepted",
  //   },
  //   {
  //     id: 5,
  //     conference_name:
  //       "6th International Conference on Multi-Disciplinary Research Studies and Education (ICMDRSE-2023)",
  //     session_name: "Machine Learning",
  //     submitted_on: "08.05.23",
  //     status: "Rejected",
  //   },
  // ];

  const header = [
    {
      isSearch: false,
      title: "Conference Name",
    },
    {
      isSearch: false,
      title: "Session Name",
    },
    {
      title: "Submitted on",
    },
    {
      isSearch: false,
      title: "Status",
    },
    {
      isSearch: false,
      title: "Action",
    },
  ];

  let rowData = [];
  mySpeakerApplication?.forEach((elem) => {
    let obj = [
      {
        value: titleCaseString(elem.activity_name),
      },
      {
        value: titleCaseString(elem.spk_session_name),
      },
      {
        value: elem.created_at,
      },
      {
        value: getStatus(elem.status),
      },
      {
        value: (
          <span className="action-icon-buttons gap-2">
            <Button
              onClick={() => {
                navigate(
                  `/professional/career-support/applied-career-support/keynote-speaker/speaker-applications/${elem.id}`
                );
              }}
              text="View"
              btnStyle="primary-outline"
              className="text-14-500 mw-70 me-2"
              isSquare
            />
            {elem.status === "1" && !elem?.welcome_messages && (
              <Button
                isSquare
                text="Upload"
                btnStyle="unset-primary"
                className="me-2"
                onClick={() => {
                  navigate(
                    `/professional/career-support/applied-career-support/keynote-speaker/speaker-applications/${elem.id}`
                  );
                }}
              />
            )}
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <div id="speaker-application-container">
      <Card className="cps-20 cpe-20 cmb-20 cpt-20 cpb-20">
        <div className="overflow-auto">
          <Table header={header} rowData={rowData} isLoading={isLoading} />
        </div>
      </Card>
    </div>
  );
};

export default SpeakerApplications;
