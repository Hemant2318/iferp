import TableV2 from "components/Layout/TableV2/TableV2";
import Button from "components/form/Button";
import { omit } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllMentees, fetchProfile, throwError } from "store/slices";
import { icons } from "utils/constants";
import { getUserType, objectToFormData, titleCaseString } from "utils/helpers";

const UpcommingMeeting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const memberType = getUserType();
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });
  const [tableData, setTableData] = useState({
    date: moment().format("YYYY-MM-DD"),
    data: [],
    loading: true,
    total: "",
  });

  const getAllUpcomingList = async (obj) => {
    setIsLoading(true);
    const payload = omit(obj, ["data", "loading", "total"]);
    const response = await dispatch(fetchAllMentees(objectToFormData(payload)));
    let resList = [];
    let resResultCount = 0;
    // if (response?.status === 200) {
    //   setTableData((prev) => {
    //     return {
    //       ...prev,
    //       data: response?.data?.result_data,
    //       total: response?.data?.result_count,
    //       loading: false,
    //     };
    //   });
    // }
    if (response?.data?.result_data) {
      resList = response?.data?.result_data || [];
      resResultCount = response?.data?.result_count || 0;
    }
    setTableData(resList);
    setFilterData({
      ...obj,
      total: resResultCount,
    });
    window.scrollTo(0, 0);
    setIsLoading(false);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getAllUpcomingList(newData);
  };

  const getProfileData = async () => {
    const response = await dispatch(fetchProfile());
    if (response?.status === 200) {
      setProfileData(response?.data);
    }
  };

  useEffect(() => {
    getAllUpcomingList({ ...tableData, ...filterData });
    getProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      title: <div className="text-nowrap">Mentee Name</div>,
    },
    {
      title: <div className="text-nowrap">Session Name</div>,
    },
    {
      title: <div className="text-nowrap">Submitted On</div>,
    },
    {
      title: <div className="text-nowrap">Scheduled On</div>,
    },
    {
      title: "Status",
    },
    {
      title: "View",
    },
  ];

  const rowData = [];
  tableData.length > 0 &&
    tableData?.forEach((elem) => {
      const { id, session_name, name, submitted_on, schedule_on, status } =
        elem;
      let obj = [
        {
          value: (
            <div className="text-14-500 text-nowrap">
              {titleCaseString(name)}
            </div>
          ),
        },
        {
          value: (
            <div className="text-14-500 text-nowrap">
              {titleCaseString(session_name)}
            </div>
          ),
        },
        {
          value: <div className="text-14-500 text-nowrap">{submitted_on}</div>,
        },
        {
          value: <div className="text-14-500 text-nowrap">{schedule_on}</div>,
        },
        {
          value: (
            <div
              className={`${
                status === "Rejected" && "color-danger hover-text"
              } text-14-500 text-nowrap`}
            >
              {status}
            </div>
          ),
        },
        {
          value: (
            <div className="text-14-500 d-flex justify-content-center">
              <Button
                text="View more"
                isSquare
                btnStyle="light-blue-outline h-35"
                className="text-14-500"
                onClick={() => {
                  navigate(`/${memberType}/mentorship/mentor/details/${id}`);
                }}
              />
            </div>
          ),
        },
      ];
      rowData.push({ data: obj });
    });
  return (
    <>
      <div className="d-flex justify-content-between align-items-center cmb-20">
        <div className="color-text-navy text-16-500-25">
          Upcoming Meetings ({filterData?.total})
        </div>
        <div className="d-flex gap-2 align-items-center">
          {/* <div className="d-flex gap-2 align-items-center text-15-400 color-text-navy">
            <img src={icons.filterIcon} alt="filter" />
            Filter
          </div>
          <Dropdown options={[]} value="" placeholder="Status" /> */}
          <Button
            text="Add Session"
            btnStyle="primary-outline"
            icon={<img src={icons.addRound} alt="add" />}
            className="d-flex gap-2 text-nowrap"
            onClick={() => {
              profileData?.stripe_connect_status === "1" ||
              profileData?.account_number ||
              profileData?.beneficiary_bank_account ||
              profileData?.mentor_status === "1"
                ? navigate("/professional/mentorship/mentor/add-new-session")
                : profileData?.mentor_status !== "1"
                ? dispatch(
                    throwError({
                      message:
                        "After becoming mentor and add payment account details, You can add the session.",
                    })
                  )
                : dispatch(
                    throwError({ message: "Add Payment Account Details" })
                  );
            }}
            // disabled={(profileData?.stripe_connect_status === '1' || profileData?.account_number || profileData?.beneficiary_bank_account) ? false : true}
          />
        </div>
      </div>
      <div className="overflow-auto all-menteed">
        <TableV2
          isLoading={isLoading}
          header={header}
          rowData={rowData}
          filterData={filterData}
          changeOffset={handelChangePagination}
        />
      </div>
    </>
  );
};

export default UpcommingMeeting;
