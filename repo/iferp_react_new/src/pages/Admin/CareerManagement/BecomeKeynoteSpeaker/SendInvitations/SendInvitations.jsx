import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import Button from "components/form/Button";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInviteSpeakers } from "store/slices";
import { getUserType, titleCaseString } from "utils/helpers";

const SendInvitations = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [speakerList, setSpeakerList] = useState({ loading: true, data: [] });
  const getInviteSpeakerList = async () => {
    const response = await dispatch(fetchInviteSpeakers());
    setSpeakerList((prev) => {
      return {
        ...prev,
        data: response?.data || [],
        loading: false,
      };
    });
  };

  useEffect(() => {
    getInviteSpeakerList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const dummyData = [
  //   {
  //     id: 1,
  //     member_name: "Sonia K",
  //     memberId: "53424",
  //     event_name:
  //       "2nd Asia Pacific Conference on Educational Research, Social Science and Humanities (APCERSSH 2023)",
  //     session_name: "Nano Technology",
  //     status: "Accepted",
  //   },
  //   {
  //     id: 2,
  //     member_name: "Karthick M",
  //     memberId: "53424",
  //     event_name:
  //       "2nd Asia Pacific Conference on Educational Research, Social Science and Humanities (APCERSSH 2023)",
  //     session_name: "Nano Technology",
  //     status: "Accepted",
  //   },
  //   {
  //     id: 3,
  //     member_name: "Sonia K",
  //     memberId: "53424",
  //     event_name:
  //       "2nd Asia Pacific Conference on Educational Research, Social Science and Humanities (APCERSSH 2023)",
  //     session_name: "Nano Technology",
  //     status: "Accepted",
  //   },
  //   {
  //     id: 4,
  //     member_name: "Sonia K",
  //     memberId: "53424",
  //     event_name:
  //       "2nd Asia Pacific Conference on Educational Research, Social Science and Humanities (APCERSSH 2023)",
  //     session_name: "Nano Technology",
  //     status: "Accepted",
  //   },
  //   {
  //     id: 5,
  //     member_name: "Sonia K",
  //     memberId: "53424",
  //     event_name:
  //       "2nd Asia Pacific Conference on Educational Research, Social Science and Humanities (APCERSSH 2023)",
  //     session_name: "Nano Technology",
  //     status: "Accepted",
  //   },
  // ];
  const header = [
    {
      title: "Member Name",
    },
    {
      title: "Member ID",
    },
    {
      title: "Conference Name",
    },
    {
      title: "Session Name",
    },
    {
      title: "Status",
    },
    {
      title: "Action",
    },
  ];
  let rowData = [];
  speakerList.data?.forEach((elem) => {
    let obj = [
      {
        value: titleCaseString(elem?.member_name || elem?.invite_user_name),
      },
      {
        value: titleCaseString(elem?.memberId),
      },
      {
        value: elem?.event_name,
      },
      {
        value: titleCaseString(elem?.session_name),
      },
      {
        value: elem?.status,
      },
      {
        value: (
          <span className="action-icon-buttons">
            <Button
              onClick={() => {
                const userType = getUserType();
                navigate(
                  `/${userType}/career-management/keynote-speaker/sent-invitation/${elem?.id}`
                );
              }}
              text="View"
              btnStyle="primary-outline"
              className="text-14-500 mw-70 me-2"
              isSquare
            />
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <div id="send-invitation-container">
      <Card className="cps-20 cpe-20 cmb-20 cpt-20">
        <div className="overflow-auto">
          <Table
            header={header}
            rowData={rowData}
            isLoading={speakerList.loading}
          />
        </div>
      </Card>
    </div>
  );
};

export default SendInvitations;
