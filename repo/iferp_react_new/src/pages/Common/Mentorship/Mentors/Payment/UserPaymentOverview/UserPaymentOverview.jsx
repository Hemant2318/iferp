import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import TableV2 from "components/Layout/TableV2/TableV2";
import DatePicker from "components/form/DatePicker";
import Dropdown from "components/form/Dropdown";
import SeachInput from "components/form/SeachInput";
import { omit } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  menteePaymentList,
  menteePaymentOverview,
  allPaymentExport,
} from "store/slices";
import { icons, limit, paymentStatus } from "utils/constants";
import {
  INRtoUSD,
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import ExportButton from "components/Layout/ExportButton";

const UserPaymentOverview = () => {
  const authUserDetails = getDataFromLocalStorage();
  const { personal_details = {}, exchange_rate } = authUserDetails;
  const isNational = personal_details?.country_name === "India";
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [overviewData, setOverviewData] = useState({});
  const [statusText, setStatusText] = useState("");
  const [searchText, setSearchText] = useState("");
  // const [paymentListData, setPaymentListData] = useState([]);
  const [timer, setTimer] = useState("");
  const [receiveOnDate, setReceiveOnDate] = useState("");

  const [tableData, setTableData] = useState({
    mentee_name: "",
    session_name: "",
    receive_on: "",
    payment_amount: "",
    payment_status: "",
    data: [],
    total: "",
    loading: true,
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const getData = async () => {
    const response = await dispatch(menteePaymentOverview());
    if (response?.status === 200) {
      setOverviewData(response?.data || {});
    }
    setIsLoading(false);
  };

  const fetchTableData = async (obj) => {
    const payload = omit(obj, ["data", "total", "loading"]);
    const response = await dispatch(
      menteePaymentList(objectToFormData(payload))
    );
    let resList = [];
    let resResultCount = 0;
    if (response?.data?.payment_list) {
      resList = response?.data?.payment_list || [];
      resResultCount = response?.data?.payment_count || 0;
    }
    setTableData((prev) => {
      return {
        ...prev,
        data: resList,
        loading: false,
      };
    });
    // setPaymentListData(resList)
    setFilterData({
      ...obj,
      total: resResultCount,
    });
    window.scrollTo(0, 0);
    setIsLoading(false);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...tableData };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchTableData(newData);
  };

  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    // fetchTableData(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    // let oldData = { ...searchData };
    setFilterData(newData);
    fetchTableData(newData);
  };
  useEffect(() => {
    getData();
    fetchTableData({ ...filterData, ...tableData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    let value = e?.target?.value?.toLowerCase();
    setSearchText(value);
    let newObj = {
      mentee_name: value,
      session_name: "",
      receive_on: receiveOnDate,
      payment_amount: "",
      payment_status: tableData?.payment_status || "",
      data: [],
      total: 0,
      loading: true,
    };
    if (value !== "") {
      let time = timer;
      clearTimeout(time);
      time = setTimeout(() => {
        setTableData(newObj);
        fetchTableData({ ...filterData, ...newObj });
      }, 800);
      setTimer(time);
    } else {
      let time = timer;
      clearTimeout(time);
      time = setTimeout(() => {
        setTableData({ ...newObj, receive_on: statusText });
        getData();
        fetchTableData({
          ...filterData,
          ...newObj,
          payment_status: statusText,
        });
      }, 800);
      setTimer(time);
    }
  };

  const searchDateWise = (e) => {
    let value = e?.target?.value?.toLowerCase();
    setReceiveOnDate(value);
    setTableData({ ...tableData, receive_on: value });
    getData();
    fetchTableData({ ...filterData, ...tableData, receive_on: value });
  };

  const paymentArray = [
    {
      id: 1,
      icon: icons.totalErning,
      name: "Total Earnings",
      value: overviewData?.payment_overview,
    },
    {
      id: 2,
      icon: icons.pendingPayment,
      name: "Pending Payment",
      value: overviewData?.payment_pending,
    },
    {
      id: 3,
      icon: icons.lastMonthEning,
      name: "Last Month Earnings",
      value: overviewData?.payment_last_month,
    },
  ];

  const header = [
    {
      title: <div className="text-nowrap">Mentee Name</div>,
    },
    {
      title: <div className="text-nowrap">Session Name</div>,
    },
    {
      title: <div className="text-nowrap">Received On</div>,
    },
    {
      title: (
        <div>
          <div className="text-nowrap">Payment Amount</div>
          {/* <div className="text-nowrap color-text-blue text-12-400">
            (Inclusive platform fee 30%)
          </div> */}
        </div>
      ),
    },
    {
      title: <div className="text-nowrap">Payment Status</div>,
    },
    {
      title: <div className="text-nowrap">Action</div>,
    },
  ];

  const rowData = [];

  tableData?.data?.length > 0 &&
    tableData?.data?.forEach((elem) => {
      const {
        // id,
        name,
        session_name,
        recevied_on,
        payment_amount,
        payment_status,
      } = elem;
      const price = INRtoUSD(payment_amount, exchange_rate);
      const newPrice = parseFloat(price?.toFixed(2));
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
            <div className="text-nowrap">{titleCaseString(session_name)}</div>
          ),
        },
        {
          value: <div className="text-nowrap">{recevied_on}</div>,
        },
        {
          value: (
            <div className="text-nowrap">
              {isNational ? `₹ ${payment_amount}` : `$ ${newPrice}`}
            </div>
          ),
        },
        {
          value: <div className="text-nowrap">{payment_status}</div>,
        },
        {
          value: (
            <div className="d-flex justify-content-center">
              {/* <Button
                text="Invoice"
                btnStyle="primary-outline"
                icon={<img src={icons.downloadPrimary} alt="delete" />}
                className="d-flex gap-2"
              /> */}
              Invoice
            </div>
          ),
        },
      ];
      rowData.push({ data: obj });
    });
  return (
    <div className="mt-3">
      <Card className="cps-24 cpe-24 cpt-24 cpb-24 mb-3">
        <div className="row">
          {isLoading ? (
            <div className="cpt-80 cpb-80">
              <Loader size="sm" />
            </div>
          ) : (
            paymentArray?.map((elem, index) => {
              const { icon, name, value } = elem;
              const price = INRtoUSD(value, exchange_rate);
              const newPrice = parseFloat(price?.toFixed(2));
              return (
                <div className="col-md-4" key={index}>
                  <div className="b-d6e9 rounded cpt-14 cpb-14 cps-18 d-flex align-items-center gap-3">
                    <div className="h-80">
                      <img src={icon} alt="mentors" className="fit-image" />
                    </div>
                    <div>
                      <div className="text-26-600 color-5068 mb-2">
                        {isNational ? `₹ ${value}` : `$ ${newPrice}`}
                      </div>
                      <div className="text-15-400 color-5068">{name}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
      <Card>
        <div className="mt-4 mb-4 cmb-10 cps-20 cpe-20 cpt-20 d-flex align-items-center justify-content-between flex-wrap">
          <div className="text-16-500 color-text-navy">
            All Payments ({filterData?.total})
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="text-15-500 color-text-navy text-nowrap me-2">
              <i className="bi bi-funnel me-1" />
              Filter
            </div>
            <Dropdown
              options={paymentStatus}
              value={statusText}
              placeholder="Payment Status"
              optionValue="label"
              optionKey="id"
              onChange={(e) => {
                setStatusText(e?.target?.value);
                let newData = {
                  ...tableData,
                  payment_status: e?.target?.data?.id,
                  loading: true,
                };
                setTableData(newData);
                fetchTableData({ ...filterData, ...newData });
              }}
              isRounded
            />
            <SeachInput
              placeholder="Search"
              value={searchText}
              onChange={handleSearch}
              isRounded
            />
            <DatePicker
              placeholder="Select Date Range"
              onChange={(e) => searchDateWise(e)}
              value={receiveOnDate}
            />
            <div className="d-flex align-items-center">
              <ExportButton
                exportAPI={allPaymentExport}
                payload={objectToFormData({
                  payment_status: statusText,
                  mentee_name: searchText,
                  receive_on: receiveOnDate,
                })}
              />
            </div>
            {/* <Button
              className="d-flex gap-2 h-45"
              btnStyle="light-blue-outline"
              text="Export"
              icon={<img src={icons.payment_export} alt="export" />}
            /> */}
          </div>
        </div>
        <div className="overflow-auto">
          <TableV2
            isLoading={tableData?.loading}
            header={header}
            rowData={rowData}
            filterData={filterData}
            tableBorderTop
            searchInputChange={handelChangeSearch}
            changeOffset={handelChangePagination}
          />
        </div>
      </Card>
    </div>
  );
};

export default UserPaymentOverview;
