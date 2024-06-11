import React, { useState, useEffect } from "react";
import Card from "components/Layout/Card";
import TableV2 from "components/Layout/TableV2";
import { titleCaseString } from "utils/helpers";
import Button from "components/form/Button";
import { useDispatch } from "react-redux";
import { fetchPendingPayments } from "store/slices";
import Loader from "components/Layout/Loader";
import { objectToFormData } from "utils/helpers";
import moment from "moment";

const PaidOuts = ({ setSession, startDate, endDate }) => {
  let sDate = "";
  let eDate = "";
  if (startDate !== undefined) {
    if (startDate) {
      sDate = moment(startDate).format("YYYY-MM-DD");
    }
  }
  if (endDate !== undefined) {
    if (endDate) {
      eDate = moment(endDate).format("YYYY-MM-DD");
    }
  }

  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });

  const [searchPayload, setSearchPayload] = useState({
    bank_status: 1,
    mentor_name: "",
    mentor_id: "",
    session_name: "",
    amount_received: "",
    plaftform_fee: "",
    pending_amount: "",
    start_date: "",
    end_date: "",
  });

  const handelChangeSearch = (searchData) => {
    let newSearchData = { ...searchData, start_date: sDate, end_date: eDate };
    setLoader(true);
    let newData = filterData;
    setSearchPayload(newSearchData);
    setSession(newSearchData);
    newData = { ...newData, ...newSearchData, offset: 0 };
    setFilterData(newData);
    // getProfiles(newData);
    fetchPendingPaymentsData(newData);
  };

  // const getProfiles = async (obj) => {
  //   let forData = objectToFormData(obj);
  //   let resResultCount = 0;
  //   const response = await dispatch(fetchPendingPayments(forData));
  //   resResultCount = response?.data?.result_count || 0;
  //   setData(response?.data?.bank_transfre || []);
  //   setFilterData({
  //     ...obj,
  //     // total: response?.data?.result_count || 0,
  //     total: resResultCount,
  //   });
  //   setLoader(false);
  // };

  const fetchPendingPaymentsData = async (obj) => {
    setLoader(true);
    let resResultCount = 0;
    const payload = objectToFormData({
      ...obj,
      start_date: sDate,
      end_date: eDate,
    });
    const response = await dispatch(fetchPendingPayments(payload));
    resResultCount = response?.data?.result_count || 0;
    setData(response?.data?.bank_transfre);
    setSession({ ...searchPayload, start_date: sDate, end_date: eDate });
    setFilterData({
      ...obj,
      total: resResultCount,
    });
    setLoader(false);
  };

  const handelChangePagination = (offset) => {
    setLoader(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    // getProfiles(newData);
    fetchPendingPaymentsData(newData);
  };

  useEffect(() => {
    fetchPendingPaymentsData({ ...searchPayload, ...filterData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // getProfiles({ ...searchPayload, ...filterData });
    fetchPendingPaymentsData({ ...searchPayload, ...filterData, offset: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sDate, eDate]);

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
      searchInputName: "session_name",
      title: (
        <div className="text-nowrap color-subtitle-navy">Session Name</div>
      ),
    },
    {
      isSearch: true,
      searchInputName: "amount_received",
      title: (
        <div className="text-nowrap color-subtitle-navy">Amount Received</div>
      ),
    },
    {
      isSearch: true,
      searchInputName: "plaftform_fee",
      title: (
        <div className="text-nowrap color-subtitle-navy">Platform Fee</div>
      ),
    },
    {
      isSearch: true,
      searchInputName: "pending_amount",
      title: (
        <div className="text-nowrap color-subtitle-navy">
          Pending Settlements
        </div>
      ),
    },
    {
      isSearch: false,
      title: (
        <div className="text-nowrap color-subtitle-navy">Settlement Month</div>
      ),
    },

    {
      isSearch: false,
      title: <div className="color-subtitle-navy">View</div>,
    },
  ];

  const rowData = [];
  data?.forEach((elem, index) => {
    const {
      mentor_name,
      mentor_id,
      session_name,
      payment_amount,
      platform_fee,
      pending_amount,
      session_percent,
      settlement_month,
    } = elem;
    let percent = session_percent?.replace("%", "");
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
        value: <div className="text-nowrap">{session_name}</div>,
      },
      {
        value: (
          <div className="text-nowrap text-14-500 color-dark-navy-blue">
            ₹ {payment_amount}
          </div>
        ),
      },
      {
        value: (
          <div className="text-nowrap d-flex gap-2 align-items-center justify-content-center">
            <span className="text-14-500 color-dark-navy-blue">
              ₹ {platform_fee}
            </span>
            <span className="text-13-400 color-dark-navy-blue">
              ({percent}%)
            </span>
          </div>
        ),
      },
      {
        value: (
          <div className="text-nowrap text-14-500 color-dark-navy-blue">
            ₹ {pending_amount}
          </div>
        ),
      },
      {
        value: (
          <div className="text-nowrap text-14-400 color-dark-navy-blue">
            {settlement_month}
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
              // onClick={() => {
              //   navigate(
              //     `/${userType}/mentorship-management/payment/mentee-settlement/details/${id}`
              //   );
              // }}
            />
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });

  return (
    <div className="mt-3">
      {loader ? (
        <Card>
          <Loader size="sm" />
        </Card>
      ) : (
        <Card>
          <TableV2
            header={header}
            rowData={rowData}
            filterData={filterData}
            searchPayload={searchPayload}
            searchInputChange={handelChangeSearch}
            changeOffset={handelChangePagination}
          />
        </Card>
      )}
    </div>
  );
};

export default PaidOuts;
