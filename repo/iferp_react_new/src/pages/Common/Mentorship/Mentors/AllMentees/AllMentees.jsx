import React, { useEffect, useState } from "react";
import {
  getDataFromLocalStorage,
  getUserType,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import TableV2 from "components/Layout/TableV2/TableV2";
import Button from "components/form/Button";
import { useNavigate } from "react-router-dom";
import { icons, myseduleStatus } from "utils/constants";
import Dropdown from "components/form/Dropdown";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useDispatch } from "react-redux";
import { omit } from "lodash";
import {
  fetchAllMentees,
  fetchProfile,
  getPaymentType,
  throwError,
} from "store/slices";

const AllMentees = ({ tabType }) => {
  let {
    mentor_status,
    account_holder_name,
    beneficiary_bank_name,
    stripe_connect_status,
  } = getDataFromLocalStorage();
  const memberType = getUserType();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [statusText, setStatusText] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [tooltipContent, setTooltipContent] = useState(null);

  const [tableData, setTableData] = useState({
    status: "Accepted",
    is_approve: "",
    schedule_approve: "",
    data: [],
    loading: true,
    total: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });
  const getAllMentees = async (obj) => {
    setIsLoading(true);
    const payload = omit(obj, ["data", "loading", "total"]);
    const response = await dispatch(fetchAllMentees(objectToFormData(payload)));
    // if (response?.status === 200) {
    //   setTableData((prev) => {
    //     return {
    //       ...prev,
    //       data: response?.data?.result_data || [],
    //       loading: false,
    //       total: response?.data?.result_count,
    //     };
    //   });
    // }
    let resList = [];
    let resResultCount = 0;
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
    getAllMentees(newData);
  };
  const getProfileData = async () => {
    const response = await dispatch(fetchProfile());
    if (response?.status === 200) {
      setProfileData(response?.data);
    }
  };

  useEffect(() => {
    getAllMentees({ ...tableData, ...filterData });
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
  tableData?.length > 0 &&
    tableData?.forEach((elem) => {
      const {
        id,
        name,
        session_name,
        submitted_on,
        schedule_on,
        status,
        rejection,
      } = elem;
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
                (status === "Rejected" && "hover-text color-1515") ||
                (status === "Accepted" && "color-9959") ||
                (status === "Pending" && "color-a500")
              } text-14-500 text-nowrap`}
            >
              <span
                data-tooltip-id={status === "Rejected" && "my-tooltip-2"}
                onMouseEnter={() => {
                  if (status === "Rejected" && rejection) {
                    setTooltipContent(rejection);
                  } else {
                    setTooltipContent(null);
                  }
                }}
                onMouseLeave={() => {
                  setTooltipContent(null);
                }}
              >
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
      <div className="d-flex justify-content-between align-items-center cmb-20 user-all-mentees-container flex-wrap">
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
                {titleCaseString(tooltipContent)}
              </div>
            </div>
          }
        />
        <div className="color-text-navy text-16-500-25">
          All Mentees {`(${filterData?.total})`}
        </div>
        <div className="d-flex gap-2 align-items-center">
          <div className="d-flex gap-2 align-items-center text-15-400 color-text-navy">
            <img src={icons.filterIcon} alt="filter" />
            {/* Filter */}
          </div>
          <Dropdown
            // options={menteesStatus}
            options={myseduleStatus}
            value={statusText}
            placeholder="Filter Status"
            optionValue="value"
            optionKey="value"
            onChange={(e) => {
              setStatusText(e?.target?.value);
              const { status, is_approve } = e?.target?.data?.id || {};
              let newData = {
                // ...tableData,
                is_approve,
                status,
                loading: true,
              };
              // if (status === 0 && is_approve !== undefined) {
              //   newData.is_approve = is_approve;
              // }
              setTableData(newData);
              getAllMentees(newData);
            }}
            isRounded
          />
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
            // disabled={
            //   profileData?.stripe_connect_status == 1 ||
            //   profileData?.account_number ||
            //   profileData?.beneficiary_bank_account
            //     ? false
            //     : true
            // }
          />
        </div>
      </div>
      {(account_holder_name !== "" ||
        beneficiary_bank_name !== "" ||
        stripe_connect_status !== "") &&
        mentor_status === "Accept" && (
          <div className="overflow-auto all-menteed">
            <TableV2
              isLoading={isLoading}
              header={header}
              rowData={rowData}
              filterData={filterData}
              changeOffset={handelChangePagination}
            />
          </div>
        )}
      {mentor_status === "Pending" && (
        <div className="text-center">
          <img src={icons.waitingadminApproval} className="mb-3" alt="type" />
          <p className="fs-4 fw-bold">Waiting for Admin’s Approval</p>
          <p>
            Your mentor account is under verification. It takes 1-2 business
            days
          </p>
        </div>
      )}
      {account_holder_name === "" &&
        beneficiary_bank_name === "" &&
        stripe_connect_status !== "1" &&
        mentor_status === "Accept" && (
          <div className="text-center">
            <img src={icons.approved} className="mb-3" alt="type" />
            <p className="fs-4 fw-bold">Mentor Account has been Approved</p>
            <p>Your mentor account has been verified. Start mentoring now!</p>
            <div className="d-flex justify-content-center w-100 m-auto">
              <Button
                text="Add Payment Details"
                btnStyle="primary-dark"
                className="rounded-pill"
                onClick={() => {
                  dispatch(getPaymentType("payment-account-details"));
                  tabType("payment");
                }}
              />
            </div>
          </div>
        )}
    </>
  );
};

export default AllMentees;
