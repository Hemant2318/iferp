import Card from "components/Layout/Card";
import TableV2 from "components/Layout/TableV2/TableV2";
import Button from "components/form/Button";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "utils/constants";
import {
  getDataFromLocalStorage,
  getFromLocalStorage,
  objectToQueryParams,
  titleCaseString,
  userTypeByStatus,
} from "utils/helpers";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleMentorPayment,
  setSingleMentorPaymentDetail,
} from "store/slices";

const MentorSettlementDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const memberType = userTypeByStatus();
  const sType = "session";
  const { singleMentorPaymentDetail } = useSelector((state) => ({
    singleMentorPaymentDetail:
      state.mentorshipManagement.singleMentorPaymentDetail,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    mentor_id: id,
    session_name: "",
    session_added_on: "",
    total_mentees: "",
    pending_amount: "",
    settled_amount: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });

  const fetchData = async (obj) => {
    let formData = objectToQueryParams(obj);
    const response = await dispatch(getSingleMentorPayment(formData));
    // if (response?.status === 200) {
    //   setTableData(response?.data?.result_data || []);
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
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    fetchData(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchData(newData);
  };
  useEffect(() => {
    fetchData({ ...searchPayload, ...filterData });
    // fetchData(searchPayload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "session_name",
      title: (
        <div className="text-nowrap color-subtitle-navy">Session Name</div>
      ),
    },
    {
      isSearch: true,
      isDatePicker: true,
      searchInputName: "session_added_on",
      title: (
        <div className="text-nowrap color-subtitle-navy">Session Added On</div>
      ),
    },
    {
      isSearch: true,
      searchInputName: "total_mentees",
      title: (
        <div className="text-nowrap color-subtitle-navy">Total Mentees</div>
      ),
    },
    {
      isSearch: true,
      searchInputName: "settled_amount",
      title: (
        <div className="text-nowrap color-subtitle-navy">Earned Amount</div>
      ),
    },
    {
      isSearch: true,
      searchInputName: "pending_amount",
      title: (
        <div className="text-center text-nowrap">
          <span className="text-nowrap color-subtitle-navy">
            Pending Amount
          </span>
          <div className="text-nowrap d-flex gap-2 align-items-center justify-content-center color-dark-navy-blue text-13-400">
            (After platform fee){" "}
            <img
              src={icons.infoCircle}
              alt="info"
              data-tooltip-id="my-tooltip-2"
              className="pointer"
            />
          </div>
        </div>
      ),
    },
    {
      isSearch: false,
      searchLable: "View",
      title: <div className="color-subtitle-navy">View</div>,
    },
  ];

  const rowData = [];
  tableData?.forEach((elem) => {
    const {
      id,
      session_name,
      session_added_on,
      total_mentee,
      settled_amount,
      pending_amount,
    } = elem;
    let obj = [
      {
        value: (
          <div className="text-14-500 text-nowrap">
            {titleCaseString(session_name)}
          </div>
        ),
      },
      {
        value: session_added_on,
      },
      {
        value: <div className="text-nowrap">{total_mentee}</div>,
      },
      {
        value: `₹ ${settled_amount}`,
      },
      {
        value: `₹ ${pending_amount}`,
      },

      {
        value: (
          <span className="action-icon-buttons">
            <Button
              text="View"
              btnStyle="light-blue-outline"
              className="text-14-500 mw-70 me-2"
              isSquare
              onClick={() => {
                navigate(
                  `/${memberType}/mentorship-management/payment/mentor-settlement/details/${sType}/detail/${id}`
                );
              }}
            />

            <Button
              btnStyle="light-blue-outline"
              icon={<img src={icons.outline_delete} alt="delete" />}
              isSquare
              // onClick={() => {
              //   setMentorId(mentor_id);
              // }}
            />
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  const { mentor_name } = getFromLocalStorage("setViewName");
  return (
    <div id="mentor-settlement-details-container">
      <ReactTooltip
        style={{
          width: "250px",
          boxShadow: "0 1px 4px 0 #6785A338",
          zIndex: "999",
          backgroundColor: "white",
        }}
        id="my-tooltip-2"
        place="bottom"
        variant="info"
        content={
          <div className="text-14-400 color-new-car">
            {getDataFromLocalStorage("premium_member_percentage")}% platform fee
            for premium members &{" "}
            {getDataFromLocalStorage("free_member_percentage")}% platform fee
            for non-premium members
          </div>
        }
      />
      <Card className="d-flex align-items-center unset-br cps-15 cpt-15 cpe-15 cpb-15 cmb-20">
        <span
          className="d-flex"
          onClick={() => {
            dispatch(setSingleMentorPaymentDetail({}));
            navigate(-1);
          }}
        >
          <img
            src={icons.leftArrow}
            alt="back"
            className="h-21 me-3 pointer color-dark-blue"
          />
        </span>
        <div className="text-16-500-19 color-dark-blue">
          {titleCaseString(
            singleMentorPaymentDetail?.mentor_name || mentor_name
          )}
        </div>
      </Card>

      <div className="overflow-auto">
        <TableV2
          header={header}
          rowData={rowData}
          isLoading={isLoading}
          filterData={filterData}
          searchPayload={searchPayload}
          searchInputChange={handelChangeSearch}
          changeOffset={handelChangePagination}
        />
      </div>
    </div>
  );
};

export default MentorSettlementDetails;
