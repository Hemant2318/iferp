import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import TableV2 from "components/Layout/TableV2/TableV2";
import Dropdown from "components/form/Dropdown";
import SeachInput from "components/form/SeachInput";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  allPaymentExport,
  menteePaymentList,
  menteePaymentOverview,
} from "store/slices";
import { icons, paymentStatus } from "utils/constants";
import { objectToFormData, titleCaseString } from "utils/helpers";
import ExportButton from "components/Layout/ExportButton";
import DatePicker from "components/form/DatePicker";

const PaymentOverview = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [statusText, setStatusText] = useState("");
  const [paymentOverViewData, setPaymentOverViewData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [paymentListData, setPaymentListData] = useState([]);
  const [timer, setTimer] = useState("");
  const [receiveOnDate, setReceiveOnDate] = useState("");
  const [tableData, setTableData] = useState({
    mentee_name: "",
    session_name: "",
    recevied_on: "",
    payment_amount: "",
    payment_status: "",
    data: [],
    total: "",
    loading: true,
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });
  const [searchPayload, setSearchPayload] = useState({
    mentee_name: "",
    session_name: "",
    recevied_on: "",
    payment_amount: "",
    payment_status: "",
    data: [],
    total: "",
    loading: true,
  });
  const getOverviewData = async () => {
    const response = await dispatch(menteePaymentOverview());
    if (response?.status === 200) {
      setPaymentOverViewData(response?.data || {});
    }
    setIsLoading(false);
  };
  const fetchAllPaymentsList = async (obj) => {
    const payload = omit(obj, ["data", "total", "loading"]);
    const response = await dispatch(
      menteePaymentList(objectToFormData(payload))
    );
    // if (response?.status === 200) {
    //   setTableData((prev) => {
    //     return {
    //       ...prev,
    //       data: response?.data?.payment_list || [],
    //       total: response?.data?.payment_count,
    //       loading: false,
    //     };
    //   });
    // }
    let resList = [];
    let resResultCount = 0;
    if (response?.data?.payment_list) {
      resList = response?.data?.payment_list || [];
      resResultCount = response?.data?.payment_count || 0;
    }
    setPaymentListData(resList);
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
    fetchAllPaymentsList(newData);
  };

  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    // let oldData = { ...searchData };
    setFilterData(newData);
    fetchAllPaymentsList(newData);
  };
  useEffect(() => {
    getOverviewData();
    fetchAllPaymentsList({ ...searchPayload, ...filterData, ...tableData });
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
      payment_status: tableData?.payment_status,
      data: [],
      total: tableData?.data?.length,
      loading: true,
    };
    if (value !== "") {
      let time = timer;
      clearTimeout(time);
      time = setTimeout(() => {
        setTableData(newObj);
        fetchAllPaymentsList({ ...filterData, ...newObj });
      }, 800);
      setTimer(time);
    } else {
      let time = timer;
      clearTimeout(time);
      time = setTimeout(() => {
        setTableData({ ...newObj, payment_status: statusText });
        getOverviewData();
        fetchAllPaymentsList({
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
    getOverviewData();
    fetchAllPaymentsList({ ...filterData, ...tableData, receive_on: value });
  };

  const overviewArray = [
    {
      id: 1,
      icon: icons.totalErning,
      name: "Total Earnings",
      value: paymentOverViewData?.payment_overview,
    },
    {
      id: 2,
      icon: icons.pendingPayment,
      name: "Pending Payment",
      value: paymentOverViewData?.payment_pending,
    },
    {
      id: 3,
      icon: icons.lastMonthEning,
      name: "Last Month Earnings",
      value: paymentOverViewData?.payment_last_month,
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
      title: <div className="text-nowrap">Payment Amount</div>,
    },
    {
      title: <div className="text-nowrap">Payment Status</div>,
    },
    {
      title: "View",
    },
  ];

  const rowData = [];
  paymentListData.length > 0 &&
    paymentListData?.forEach((elem) => {
      const {
        // id,
        name,
        session_name,
        recevied_on,
        payment_amount,
        payment_status,
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
            <div className="text-nowrap">{titleCaseString(session_name)}</div>
          ),
        },
        {
          value: <div className="text-nowrap">{recevied_on}</div>,
        },
        {
          value: (
            <div>
              <div className="text-14-500">{`₹ ${payment_amount}`}</div>
              <div className="text-nowrap">(After 25% Platform fee)</div>
            </div>
          ),
        },
        {
          value: <div className="text-nowrap">{payment_status}</div>,
        },

        {
          value: (
            <span className="action-icon-buttons">
              {payment_status === "Pending" ? (
                "-"
              ) : (
                <>
                  Invoice
                  {/* <Button
                  text="Invoice"
                  btnStyle="primary-outline"
                  className="d-flex gap-2 text-14-500 cps-45 cpe-45"
                  isSquare
                  icon={<img src={icons.downloadPrimary} alt="invoice" />}
                  onClick={() => {
                    // navigate(`/admin/mentorship-management/details/${mentor_name}`);
                  }}
                /> */}
                </>
              )}
            </span>
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
            overviewArray?.map((data, index) => {
              const { icon, name, value } = data;
              return (
                <div className="col-md-4" key={index}>
                  <div className="b-d6e9 rounded cpt-14 cpb-14 cps-18 d-flex align-items-center gap-3">
                    <div className="h-80">
                      <img src={icon} alt="mentors" className="fit-image" />
                    </div>
                    <div>
                      <div className="text-26-600 color-5068 mb-2">{`₹ ${Number(
                        value
                      ).toFixed(2)}`}</div>
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
                fetchAllPaymentsList({ ...filterData, ...newData });
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
          </div>
        </div>
        <div className="overflow-auto">
          <TableV2
            isLoading={isLoading}
            header={header}
            rowData={rowData}
            filterData={filterData}
            searchPayload={searchPayload}
            searchInputChange={handelChangeSearch}
            changeOffset={handelChangePagination}
          />
        </div>
      </Card>
    </div>
  );
};

export default PaymentOverview;
