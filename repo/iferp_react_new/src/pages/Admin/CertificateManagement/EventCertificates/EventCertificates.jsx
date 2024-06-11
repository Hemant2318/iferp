import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import {
  getDataFromLocalStorage,
  objectToFormData,
  getEventDate,
  getUserType,
} from "utils/helpers";
import { limit } from "utils/constants";
import { fetchAllEvents } from "store/slices";
import { useNavigate } from "react-router-dom";

const EventCertificates = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { eventTypeList } = useSelector((state) => ({
    eventTypeList: state.global.eventTypeList,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    event_name: "",
    event_type: "",
    membership_id_or_type: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
    event_by_filter: "",
  });
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    console.log("newData", newData);
    setFilterData(newData);
    getEvents(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getEvents(newData);
  };
  const getEvents = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchAllEvents(forData));
    setTableList(response?.data?.events || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  useEffect(() => {
    if (["0", "6"].includes(getDataFromLocalStorage("user_type"))) {
      getEvents({ ...filterData, ...searchPayload });
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: eventTypeList, key: "id", value: "name" },
      searchInputName: "event_type",
      title: "Event Type",
    },
    {
      isSearch: true,
      searchInputName: "event_name",
      title: "Event Name",
    },
    {
      isSearch: true,
      isDatePicker: true,
      searchInputName: "date",
      title: "Date & Venue",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: {
        options: [
          { name: "Upcoming" },
          { name: "Ongoing" },
          { name: "Completed" },
        ],
        key: "name",
        value: "name",
      },
      searchInputName: "status",
      title: "Status",
    },
  ];
  const rowData = [];
  tableList.forEach((elem) => {
    let obj = [
      {
        value: elem.event_type,
      },
      {
        value: (
          <div
            className="pointer color-new-car hover-effect"
            onClick={() => {
              navigate(
                `/${getUserType()}/certificate-management/event-certificates/${
                  elem.id
                }`
              );
            }}
          >
            {elem.event_name}
          </div>
        ),
      },
      {
        value: (
          <span>
            <div>{getEventDate(elem.start_date, elem.end_date)}</div>
            {elem?.country_name && (
              <div>{`${elem?.city_name ? `${elem?.city_name},` : ""} ${
                elem?.country_name
              }`}</div>
            )}
          </span>
        ),
      },
      {
        value: elem?.status,
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <div>
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
          <div className="table-title">All Events ({filterData?.total})</div>
        </div>
        <Table
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
export default EventCertificates;
