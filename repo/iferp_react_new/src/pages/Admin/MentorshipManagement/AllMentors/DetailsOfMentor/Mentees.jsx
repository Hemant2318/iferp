import TableV2 from "components/Layout/TableV2/TableV2";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { icons, menteesStatus } from "utils/constants";
import {
  objectToFormData,
  titleCaseString,
  userTypeByStatus,
} from "utils/helpers";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { omit } from "lodash";
import { sessionMenteesList } from "store/slices";
import SeachInput from "components/form/SeachInput";

const Mentees = () => {
  const memberType = userTypeByStatus();
  const { vId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [statusText, setStatusText] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [timer, setTimer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { mentorSessionID } = useSelector((state) => ({
    mentorSessionID: state.mentorshipManagement.mentorSessionID,
  }));
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });
  const [tableData, setTableData] = useState({
    status: "",
    name: "",
    session_id: vId ? vId : mentorSessionID,
    data: [],
    loading: true,
    total: "",
  });

  const fetchTableData = async (obj) => {
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
    fetchTableData(newData);
  };
  const handleSearch = (e) => {
    let value = e?.target?.value;
    setSearchText(value);
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      let newData = { ...tableData, name: value, loading: true };
      setTableData(newData);
      fetchTableData(newData);
    }, 800);
    setTimer(time);
  };

  useEffect(() => {
    fetchTableData({ ...tableData, ...filterData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorSessionID]);

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
  tableData.length > 0 &&
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
            <div
              className={`${
                status === "Rejected" && "hover-text"
              } text-14-500 text-nowrap`}
            >
              <span data-tooltip-id={status === "Rejected" && "my-tooltip-2"}>
                {status}
              </span>
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
                  navigate(
                    `/${memberType}/mentorship-management/mentor/mentees/details/${id}`
                  );
                }}
              />
            </div>
          ),
        },
      ];
      rowData.push({ data: obj });
    });
  return (
    <div id="mentors-mentees-container" className="cps-20 cpe-20 cpb-20">
      <ReactTooltip
        style={{ width: "220px" }}
        id="my-tooltip-2"
        place="left"
        variant="info"
        className="bg-white"
        content={
          <div>
            <div className="text-14-500 color-dark-blue">Remarks</div>
            <div className="text-14-400 color-dark-blue">
              Sorry not available for one month{" "}
            </div>
          </div>
        }
      />
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
                ...tableData,
                status,
                loading: true,
              };
              if (status === 0 && is_approve !== undefined) {
                newData.is_approve = is_approve;
              }
              setTableData(newData);
              fetchTableData(newData);
            }}
            isRounded
          />
          <SeachInput
            isRounded
            placeholder="Search"
            value={searchText}
            onChange={handleSearch}
          />
          {/* <Button
            className="d-flex gap-2"
            btnStyle="light-blue-outline"
            text="Export"
            icon={<img src={icons.payment_export} alt="export" />}
          /> */}
        </div>
      </div>

      <div className="overflow-auto">
        <TableV2
          isLoading={isLoading}
          header={header}
          rowData={rowData}
          // isLoading={tableData?.loading}
          filterData={filterData}
          changeOffset={handelChangePagination}
        />
      </div>
    </div>
  );
};

export default Mentees;
