import Card from "components/Layout/Card";
import TableV2 from "components/Layout/TableV2/TableV2";
import Button from "components/form/Button";
import { useNavigate } from "react-router-dom";
import { icons } from "utils/constants";
import {
  addToLocalStorage,
  objectToFormData,
  removeFromLocalStorage,
  titleCaseString,
  userTypeByStatus,
  getDataFromLocalStorage,
} from "utils/helpers";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  deleteMentor,
  getMentorSettlementPayment,
  setSingleMentorPaymentDetail,
} from "store/slices";
import DeletePopup from "components/Layout/DeletePopup";

const MentorSettlements = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userType = userTypeByStatus();
  const [mentorId, setMentorId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    mentor_name: "",
    mentor_id: "",
    total_session: "",
    total_mentees: "",
    settled_amount: "",
    pending_amount: "",
    last_settlement_on: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });
  const getPaymentData = async (obj) => {
    setIsLoading(true);
    let formData = objectToFormData(obj);
    const response = await dispatch(getMentorSettlementPayment(formData));
    let resList = [];
    let resResultCount = 0;
    if (response?.data?.result_data) {
      resList = response?.data?.result_data || [];
      resResultCount = response?.data?.result_count || 0;
      removeFromLocalStorage("setViewName");
      // setTableData(response?.data?.result_data || []);
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
    // getPaymentData(searchPayload);
    getPaymentData({ ...searchPayload, ...filterData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "mentor_name",
      title: <div className="text-nowrap color-subtitle-navy">Mentor Name</div>,
    },
    {
      isSearch: true,
      searchInputName: "mentor_id",
      title: <div className="text-nowrap color-subtitle-navy">Mentor ID</div>,
    },
    {
      isSearch: true,
      searchInputName: "total_session",
      title: (
        <div className="text-nowrap color-subtitle-navy">Total Sessions</div>
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
        <div className="text-nowrap color-subtitle-navy">Settled Amount</div>
      ),
    },
    {
      isSearch: true,
      searchInputName: "pending_amount",
      title: (
        <div className="text-center text-nowrap">
          <span className="color-subtitle-navy">Pending Amount</span>
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
      isSearch: true,
      searchInputName: "last_settlement_on",
      isDatePicker: true,
      title: (
        <div className="text-nowrap color-subtitle-navy">
          Last Settlement On
        </div>
      ),
    },

    {
      isSearch: false,
      searchLable: "View/Delete",
      title: <div className="color-subtitle-navy">View</div>,
    },
  ];

  const rowData = [];
  tableData?.forEach((elem) => {
    const {
      mentor_name,
      mentor_id,
      total_session,
      total_mentee,
      settled_amount,
      pending_amount,
      percent,
      last_settlment_on,
    } = elem;
    let percentAfterRemoving = percent?.replace("%", "");
    let obj = [
      {
        value: (
          <div className="text-14-500 text-nowrap">
            {titleCaseString(mentor_name)}
          </div>
        ),
      },
      {
        value: <div className="text-nowrap">{mentor_id}</div>,
      },

      {
        value: total_session,
      },
      {
        value: total_mentee,
      },
      {
        value: <div className="text-nowrap">{`₹ ${settled_amount}`}</div>,
      },
      {
        value: (
          <div className="d-flex gap-2 align-items-center justify-content-center">
            <div className="text-14-500">{`₹ ${pending_amount}`}</div>
            <div>({percentAfterRemoving || "0"}%)</div>
          </div>
        ),
      },
      {
        value: <div className="text-nowrap">{last_settlment_on}</div>,
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
                dispatch(setSingleMentorPaymentDetail(elem));
                addToLocalStorage("setViewName", elem);
                navigate(
                  `/${userType}/mentorship-management/payment/mentor-settlement/details/${mentor_id}`
                );
              }}
            />
            <Button
              btnStyle="light-blue-outline"
              icon={<img src={icons.outline_delete} alt="delete" />}
              isSquare
              onClick={() => {
                setMentorId(mentor_id);
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
      {mentorId && (
        <DeletePopup
          onHide={() => {
            setMentorId(null);
          }}
          handelSuccess={() => {
            setMentorId(null);
            getPaymentData(searchPayload);
          }}
          handelDelete={async () => {
            let formData = objectToFormData({ mentor_id: mentorId });
            const response = await dispatch(deleteMentor(formData));
            return response;
          }}
        />
      )}
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
            {getDataFromLocalStorage("premium_member_percentage")}% platform fee
            for premium members &{" "}
            {getDataFromLocalStorage("free_member_percentage")}% platform fee
            for non-premium members
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

export default MentorSettlements;
