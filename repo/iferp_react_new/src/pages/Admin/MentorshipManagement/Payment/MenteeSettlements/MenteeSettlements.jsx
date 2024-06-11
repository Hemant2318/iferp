import React, { useEffect, useState } from "react";
import TableV2 from "components/Layout/TableV2/TableV2";
import Button from "components/form/Button";
import { useNavigate } from "react-router-dom";
import {
  objectToFormData,
  titleCaseString,
  userTypeByStatus,
} from "utils/helpers";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useDispatch } from "react-redux";
import { getMenteeSettlementPayment } from "store/slices";
import moment from "moment";
import Card from "components/Layout/Card";

const MenteeSettlements = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userType = userTypeByStatus();
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    mentee_name: "",
    mentor_id: "",
    session_name: "",
    mentor_name: "",
    platform_fee: "",
    paid_of_mentor: "",
    paid_on: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });
  const getPaymentData = async (obj) => {
    setIsLoading(true);
    let formData = objectToFormData(obj);
    const response = await dispatch(getMenteeSettlementPayment(formData));
    let resList = [];
    let resResultCount = 0;
    if (response?.data?.mentee_list) {
      resList = response?.data?.mentee_list || [];
      resResultCount = response?.data?.result_count || 0;
      // setTableData(response?.data?.mentee_list || []);
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
    getPaymentData(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getPaymentData(newData);
  };
  useEffect(() => {
    getPaymentData({ ...searchPayload, ...filterData });
    // getPaymentData(searchPayload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "mentee_name",
      title: <div className="text-nowrap color-subtitle-navy">Mentee Name</div>,
    },
    {
      isSearch: true,
      searchInputName: "mentee_id",
      title: <div className="text-nowrap color-subtitle-navy">Mentee ID</div>,
    },
    {
      isSearch: true,
      searchInputName: "session_name",
      title: (
        <div className="text-nowrap color-subtitle-navy">Session Name</div>
      ),
    },
    {
      isSearch: true,
      searchInputName: "mentor_name",
      title: <div className="text-nowrap color-subtitle-navy">Mentor Name</div>,
    },
    {
      isSearch: true,
      searchInputName: "platform_fee",
      title: (
        <div className="text-nowrap color-subtitle-navy">Platform Fee</div>
      ),
    },
    {
      isSearch: true,
      searchInputName: "paid_of_mentor",
      title: (
        <div className="text-nowrap color-subtitle-navy">Paid to Mentor</div>
      ),
    },

    {
      isSearch: true,
      isDatePicker: true,
      searchInputName: "paid_on",
      title: <div className="text-nowrap color-subtitle-navy">Paid On</div>,
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
      name,
      mentor_name,
      mentee_id,
      mentor_fee,
      session_name,
      platform_fee,
      session_percent,
      recevied_on,
      session_id,
    } = elem;
    let percent = session_percent?.replace("%", "");
    let obj = [
      {
        value: (
          <div className="text-14-500 text-nowrap">{titleCaseString(name)}</div>
        ),
      },
      {
        value: <div className="text-nowrap">{mentee_id}</div>,
      },

      {
        value: <div className="text-nowrap">{session_name}</div>,
      },
      {
        value: <div className="text-nowrap">{mentor_name}</div>,
      },
      {
        value: (
          <div className="text-nowrap d-flex gap-2 align-items-center justify-content-center">
            <span className="text-14-500">₹ {platform_fee}</span>
            <span className="text-13-400">({percent || 0}%)</span>
          </div>
        ),
      },
      {
        value: <div className="text-nowrap text-14-500">₹ {mentor_fee}</div>,
      },
      {
        value: (
          <div className="text-nowrap">
            {moment(recevied_on, "YYYY-MM-DD").format("DD MMM YYYY")}
          </div>
        ),
      },
      {
        value: (
          <span className="action-icon-buttons">
            <Button
              text="View more"
              btnStyle="light-blue-outline"
              className="text-14-500 mw-85"
              isSquare
              onClick={() => {
                navigate(
                  `/${userType}/mentorship-management/payment/mentee-settlement/details/${session_id}`
                );
              }}
            />
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <div className="mt-3">
      <ReactTooltip
        style={{
          width: "250px",
          boxShadow: "0 1px 4px 0 #6785A338",
          zIndex: "999",
          backgroundColor: "white",
        }}
        id="my-tooltip-2"
        place="right"
        variant="info"
        content={
          <div className="text-14-400 color-new-car">
            25% platform fee for premium members & 40% platform fee for
            non-premium members
          </div>
        }
      />
      <Card className="overflow-auto">
        <TableV2
          isLoading={isLoading}
          header={header}
          rowData={rowData}
          filterData={filterData}
          searchPayload={searchPayload}
          searchInputChange={handelChangeSearch}
          changeOffset={handelChangePagination}
        />
      </Card>
    </div>
  );
};

export default MenteeSettlements;
