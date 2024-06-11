import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "components/form/Button";
import FilterDropdown from "components/Layout/FilterDropdown";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import { icons } from "utils/constants";
import { limit } from "utils/constants";
import { getEventDate, getUserType, objectToFormData } from "utils/helpers";
import { deleteEvent, fetchAllEvents } from "store/slices";

const Events = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { moduleType } = params;
  const { eventTypeList } = useSelector((state) => ({
    eventTypeList: state.global.eventTypeList,
  }));
  const memberType = getUserType();
  const [isLoading, setIsLoading] = useState(true);
  const [eventId, setEventId] = useState(null);
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
  const handelChangeFilter = (val) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, event_by_filter: val, offset: 0 };
    setFilterData(newData);
    getEvents(newData);
  };
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
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
  useEffect(() => {
    let newFilterData = filterData;
    let newSearchPayload = searchPayload;
    if (localStorage.filterData) {
      newFilterData = JSON.parse(localStorage.filterData);
      setSearchPayload(newFilterData);
      localStorage.removeItem("filterData");
    }
    if (localStorage.searchPayload) {
      newSearchPayload = JSON.parse(localStorage.searchPayload);
      setFilterData(newSearchPayload);
      localStorage.removeItem("searchPayload");
    }

    getEvents({ ...newFilterData, ...newSearchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleRedirect = (url) => {
    navigate(url);
  };
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
    {
      isSearch: false,
      searchLable: "Edit/Delete",
      title: "Action",
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
            className="pointer color-new-car"
            onClick={() => {
              localStorage.filterData = JSON.stringify(filterData);
              localStorage.searchPayload = JSON.stringify(searchPayload);
              handleRedirect(
                `/${memberType}/${moduleType}/event-details/${elem.id}/conference-details`
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

      {
        value: (
          <span className="action-icon-buttons">
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.edit} alt="edit" />}
              className="me-2"
              onClick={() => {
                handleRedirect(
                  `/${memberType}/${moduleType}/events/${elem.id}`
                );
              }}
              isSquare
            />
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              onClick={() => {
                setEventId(elem.id);
              }}
              isSquare
            />
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <Card className="cps-20 cpe-20 cpb-20">
      {eventId && (
        <DeletePopup
          id={eventId}
          onHide={() => {
            setEventId(null);
          }}
          handelSuccess={() => {
            setEventId(null);
            getEvents({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ eventid: eventId });
            const response = await dispatch(deleteEvent(forData));
            return response;
          }}
        />
      )}
      <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
        <div className="table-title">IFERP Events</div>
        <div className="d-flex">
          <div className="d-flex me-3">
            <FilterDropdown
              isHideAll
              list={[
                { id: "1", name: "IFERP Events" },
                { id: "2", name: "Self Driven Events" },
              ]}
              handelChangeFilter={handelChangeFilter}
            />
          </div>

          <Button
            onClick={() => {
              handleRedirect(`/${memberType}/${moduleType}/events/add-event`);
            }}
            text="+ Add Event"
            btnStyle="primary-outline"
            className="h-35 text-14-500"
            isSquare
          />
        </div>
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
  );
};
export default Events;
