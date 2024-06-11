import Card from "components/Layout/Card";
import TableV2 from "components/Layout/TableV2";
import Button from "components/form/Button";
import SeachInput from "components/form/SeachInput";
import { advertisement, icons, limit } from "utils/constants";
import AddNewsNotification from "./AddNewsNotification";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteSingleAdvertisement,
  fetchNewsNotificationList,
} from "store/slices";
import { generatePreSignedUrl, objectToFormData } from "utils/helpers";
import DeletePopup from "components/Layout/DeletePopup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { omit } from "lodash";
import moment from "moment";

const NewsNotifications = () => {
  const dispatch = useDispatch();
  const [newsId, setNewsId] = useState();
  const [endDate, setEndDate] = useState();
  const [startDate, setStartDate] = useState();
  const [editData, setEditData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [timer, setTimer] = useState("");

  const [isAddNewsNotification, setIsAddNewsNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState({
    startDate: "",
    endDate: "",
    search: "",
    data: [],
    total: 0,
    offset: 0,
    limit: limit,
  });

  const getNewsList = async (obj) => {
    setIsLoading(true);
    const payload = omit(obj, ["data", "total"]);
    const formData = objectToFormData(payload);
    const response = await dispatch(fetchNewsNotificationList(formData));
    if (response?.status === 200) {
      if (response?.data) {
        const newList = response?.data?.advertise_data?.map(async (elem) => {
          let ImageURL = "";
          if (elem?.image) {
            ImageURL = await generatePreSignedUrl(elem?.image, advertisement);
          }
          return {
            ...elem,
            newsImageURL: ImageURL,
          };
        });
        const result = await Promise.all(newList);
        setTableData((prev) => {
          return {
            ...prev,
            data: result || [],
            total: response?.data?.count || 0,
          };
        });
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (range) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);
    setIsLoading(true);
    const oldData = {
      ...tableData,
      startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
      endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : "",
    };
    setTableData(oldData);
    getNewsList(oldData);
  };

  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...tableData, offset: offset };
    setTableData(newData);
    getNewsList(newData);
  };

  const handleSearch = (e) => {
    let value = e?.target?.value?.toLowerCase();
    setSearchText(value);
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      setIsLoading(true);
      let newData = { ...tableData, search: value };
      setTableData(newData);
      getNewsList(newData);
    }, 800);
    setTimer(time);
  };

  useEffect(() => {
    getNewsList(tableData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(tableData?.data);

  const header = [
    {
      title: "News Image",
    },
    {
      title: "Submitted On",
    },
    {
      title: "Website URL",
    },
    {
      title: "View",
    },
  ];

  const rowData = [];
  tableData?.data?.forEach((elem) => {
    let obj = [
      {
        value: (
          <div className="d-flex align-items-center justify-content-center">
            <div
              className=""
              style={{
                width: "40px",
                height: "60px",
              }}
            >
              <img
                src={elem?.newsImageURL}
                alt="im"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
              />
            </div>
          </div>
        ),
      },
      {
        value: (
          <div className="text-nowrap">
            {elem?.date ? moment(elem?.date).format("DD MMM YYYY") : "-"}
          </div>
        ),
      },
      {
        value: (
          <div className="text-nowrap">
            {elem?.website_url ? elem?.website_url : "-"}
          </div>
        ),
      },
      {
        value: (
          <div className="d-flex justify-content-center gap-3">
            <Button
              text="Edit"
              btnStyle="edit-blue-outline"
              className="d-flex gap-2 btn-round-premium h-35"
              icon={<img src={icons.newsEdit} alt="edit" />}
              onClick={() => {
                setEditData(elem);
                setIsAddNewsNotification(true);
              }}
              isSquare
            />
            <Button
              btnStyle="danger-delete"
              className="btn-round-premium h-35"
              icon={<img src={icons.redDelete} alt="delete" />}
              onClick={() => {
                setNewsId(elem?.id);
              }}
              isSquare
            />
          </div>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <div id="news-notifications-container">
      {newsId && (
        <DeletePopup
          id={newsId}
          onHide={() => {
            setNewsId(null);
          }}
          handelSuccess={() => {
            setNewsId(null);
            getNewsList(tableData);
          }}
          handelDelete={async () => {
            const response = await dispatch(deleteSingleAdvertisement(newsId));
            return response;
          }}
        />
      )}
      {isAddNewsNotification && (
        <AddNewsNotification
          editData={editData}
          onHide={() => {
            setIsAddNewsNotification(false);
            setEditData(null);
          }}
          handleSuccess={() => {
            getNewsList(tableData);
            setIsAddNewsNotification(false);
            setEditData(null);
          }}
        />
      )}
      <div className="cps-20 cpe-20 cpb-20 cpt-20">
        <div className="cpt-12 cpb-12 d-flex align-items-center justify-content-between cmb-12 flex-wrap">
          <div className="table-title">
            All News & Notifications ({tableData?.total})
          </div>
          <div className="d-flex gap-3 align-items-center">
            <SeachInput
              placeholder="Search"
              onChange={handleSearch}
              value={searchText}
            />
            <div id="date-picker-container">
              <div className="input-container">
                <DatePicker
                  selected=""
                  onChange={handleDateRangeChange}
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Select Date Range"
                  selectsRange
                  isClearable={startDate || endDate ? true : false}
                />
                <span className={`calender-icon w-fit`}>
                  <img src={icons.calendar} alt="calender" />
                </span>
              </div>
            </div>
            <Button
              icon={
                <i
                  className="bi bi-plus-circle"
                  style={{ fontSize: "15px" }}
                ></i>
              }
              text="Add News"
              btnStyle="primary-outline"
              className="h-39 text-14-500 text-nowrap gap-2 align-items-center"
              isSquare
              onClick={() => {
                setIsAddNewsNotification(true);
              }}
            />
          </div>
        </div>
      </div>
      <Card>
        <TableV2
          header={header}
          rowData={rowData}
          isLoading={isLoading}
          filterData={tableData}
          changeOffset={handelChangePagination}
        />
      </Card>
    </div>
  );
};

export default NewsNotifications;
