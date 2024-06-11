import React, { useEffect, useState } from "react";
import { objectToFormData, titleCaseString, getUserType } from "utils/helpers";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import TableV2 from "components/Layout/TableV2/TableV2";
import { icons, menteesStatus } from "utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { omit } from "lodash";
import { sessionMenteesList } from "store/slices";
import SeachInput from "components/form/SeachInput";
import { useNavigate } from "react-router-dom";

const MMentees = () => {
  const dispatch = useDispatch();
  const memberType = getUserType();
  const navigate = useNavigate();
  const { mySessionID } = useSelector((state) => ({
    mySessionID: state.mentorship.mySessionID,
  }));
  const [statusText, setStatusText] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [timer, setTimer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState({
    status: "",
    name: "",
    session_id: mySessionID?.id,
    data: [],
    loading: true,
    total: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });
  const getTableData = async (obj) => {
    const payload = omit(obj, ["data", "loading", "total"]);
    const response = await dispatch(
      sessionMenteesList(objectToFormData(payload))
    );
    // if (response?.status === 200) {
    //   setTableData((prev) => {
    //     return {
    //       ...prev,
    //       data: response?.data?.session_mentee_list || [],
    //       loading: false,
    //       total: response?.data?.result_count,
    //     };
    //   });
    // }
    let resList = [];
    let resResultCount = 0;
    if (response?.data?.session_mentee_list) {
      resList = response?.data?.session_mentee_list || [];
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
    getTableData(newData);
  };
  const handleSearch = (e) => {
    let value = e?.target?.value;
    setSearchText(value);
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      let newData = { ...tableData, name: value, loading: true };
      setTableData(newData);
      getTableData(newData);
    }, 800);
    setTimer(time);
  };

  useEffect(() => {
    getTableData({ ...tableData, ...filterData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      title: <div className="text-nowrap">Mentee Name</div>,
    },
    {
      title: <div className="text-nowrap">Paid On</div>,
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
  tableData?.length > 0 &&
    tableData?.forEach((elem) => {
      const { id, name, submitted_on, schedule_on, status } = elem;
      let obj = [
        {
          value: (
            <div className="text-14-500 text-nowrap">
              {titleCaseString(name)}
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
            <div className="text-14-500 text-nowrap hover-text">{status}</div>
          ),
        },
        {
          value: (
            <div className="text-14-500 d-flex justify-content-center">
              {/* what to do on view more */}
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
    <div id="m-mentees-container">
      <div className="d-flex justify-content-between align-items-center cmb-20">
        <div className="color-text-navy text-16-500-25">
          All Mentees ({filterData?.total})
        </div>
        <div className="d-flex gap-2 align-items-center">
          <div className="d-flex gap-2 align-items-center text-15-400 color-text-navy">
            <img src={icons.filterIcon} alt="filter" />
            Filter
          </div>
          <Dropdown
            value={statusText}
            options={menteesStatus}
            optionValue="value"
            optionKey="value"
            placeholder="Status"
            onChange={(e) => {
              setStatusText(e?.target?.value);
              const { status, is_approve } = e?.target?.data?.id || {};
              let newData = {
                status,
                loading: true,
                session_id: mySessionID?.id,
              };
              if (status === 0 && is_approve !== undefined) {
                newData.is_approve = is_approve;
              }
              setTableData(newData);
              getTableData(newData);
            }}
            isRounded
          />
          <SeachInput
            placeholder="Search"
            value={searchText}
            onChange={handleSearch}
            isRounded
          />
        </div>
      </div>

      <div className="overflow-auto">
        <TableV2
          isLoading={isLoading}
          header={header}
          rowData={rowData}
          filterData={filterData}
          changeOffset={handelChangePagination}
        />
      </div>
    </div>
  );
};

export default MMentees;
