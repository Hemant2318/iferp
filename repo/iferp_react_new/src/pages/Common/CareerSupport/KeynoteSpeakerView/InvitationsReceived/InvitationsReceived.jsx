import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import Button from "components/form/Button";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInviteSpeakers } from "store/slices";
import { getUserType, titleCaseString } from "utils/helpers";

const InvitationsReceived = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [receivedInvitationData, setReceivedInvitationData] = useState({
    loading: true,
    data: [],
  });

  const receivedInvitationList = async () => {
    const response = await dispatch(fetchInviteSpeakers());
    if (response?.status === 200) {
      setReceivedInvitationData((prev) => {
        return {
          ...prev,
          data: response?.data || [],
          loading: false,
        };
      });
    }
  };

  useEffect(() => {
    receivedInvitationList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const dummyData = [
  //   {
  //     id: 1,
  //     conference_name:
  //       "A guest lecture on how to file a patent aims to provide participants with a concise understanding of the patent filing process",
  //     received_on: "14.08.23",
  //     status: "Pending",
  //   },
  //   {
  //     id: 2,
  //     conference_name:
  //       "International Conference on Multidisciplinary Approaches in Technology and Social Development (ICMATSD)",
  //     received_on: "20.07.23",
  //     status: "Accepted",
  //   },
  //   {
  //     id: 3,
  //     conference_name:
  //       "International Conference on Advances in Computer Engineering, Communication Systems and Business Development (ICACECSBD-2023)",
  //     received_on: "20.07.23",
  //     status: "Accepted",
  //   },
  //   {
  //     id: 4,
  //     conference_name:
  //       "4th International Conference on Multidisciplinary and Current Educational Research (ICMCER-2023)",
  //     received_on: "08.05.23",
  //     status: "Accepted",
  //   },
  //   {
  //     id: 5,
  //     conference_name:
  //       "6th International Conference on Multi-Disciplinary Research Studies and Education (ICMDRSE-2023)",
  //     received_on: "08.05.23",
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
      title: "Received on",
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
  receivedInvitationData?.data?.forEach((elem) => {
    let obj = [
      {
        value: titleCaseString(elem?.event_name),
      },
      {
        value: elem?.received_on,
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
                  `/${userType}/career-support/applied-career-support/keynote-speaker/invitation-received/${elem?.id}`
                );
              }}
              text="View Invitation"
              btnStyle="primary-outline"
              className="text-14-500 mw-115"
              isSquare
            />
          </span>
        ),
      },
    ];
    rowData?.push({ data: obj });
  });
  return (
    <div id="invitation-received-container">
      <Card className="cps-20 cpe-20 cmb-20 cpt-20 cpb-20">
        <div className="overflow-auto">
          <Table header={header} rowData={rowData} />
        </div>
      </Card>
    </div>
  );
};

export default InvitationsReceived;
