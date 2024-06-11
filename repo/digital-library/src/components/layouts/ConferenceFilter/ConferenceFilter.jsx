import moment from "moment";
import { useSelector } from "react-redux";
import MultiRangeSlider from "multi-range-slider-react";
import { Checkbox } from "components";
import { icons } from "utils/constants";
import "./ConferenceFilter.scss";

const startYear = "2000";
const endYear = `${moment().format("YYYY")}`;
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ConferenceFilter = ({ pageData, setPageData, handleClose }) => {
  const reduxData = useSelector((state) => state.global);
  const { countryList } = reduxData || {};
  const handleChange = (type, val) => {
    const copyData = JSON.parse(JSON.stringify(pageData));
    switch (type) {
      case "country":
        var newCountry = copyData.country;
        if (newCountry?.includes(val)) {
          newCountry = newCountry?.filter((o) => o !== val);
        } else {
          newCountry.push(val);
        }
        copyData.country = newCountry;
        break;
      case "month":
        var newMonth = copyData.month;
        if (newMonth?.includes(val)) {
          newMonth = newMonth?.filter((o) => o !== val);
        } else {
          newMonth.push(val);
        }
        copyData.month = newMonth;
        break;
      default:
        // Nothing
        break;
    }
    setPageData(copyData);
  };
  const handleChangeYear = (e) => {
    const copyData = JSON.parse(JSON.stringify(pageData));
    copyData.yearOne = `${e?.minValue}-01-01`;
    copyData.yearTwo = `${e?.maxValue}-01-01`;
    if (
      copyData.yearOne !== pageData.yearOne ||
      copyData.yearTwo !== pageData.yearTwo
    ) {
      setPageData(copyData);
      handleClose();
    }
  };
  const { country, month, yearOne, yearTwo } = pageData;

  return (
    <>
      <div className="fb-center shadow cp-12">
        <div className="fa-center gap-2">
          <span className="text-18-400 lh-27 color-4d4d ">Filter</span>
          <span>
            <img src={icons.filter} alt="filter" />
          </span>
        </div>
        <div
          className="fa-center gap-2 pointer"
          onClick={() => {
            setPageData({
              page: 1,
              limit: 5,
              month: [],
              country: [],
              yearTwo: "",
              yearOne: "",
            });
            handleClose();
          }}
        >
          <span>
            <img src={icons.refresh} alt="filter" />
          </span>
          <span className="text-13-400 lh-19 color-7070 ">Clear</span>
        </div>
      </div>
      {countryList?.length > 0 && (
        <div className="fb-center shadow cp-12 mt-3 pt-3 ">
          <div className="fb-center w-100">
            <span className="text-15-500 lh-22 color-2121">
              Conference By Country
            </span>
            {/* <span>
              <img src={icons.greySearch} alt="search" />
            </span> */}
          </div>
          <div className="d-flex flex-column gap-2 mt-3 country-list-container w-100 sp-scroll">
            {countryList.map((elm, index) => {
              return (
                <div key={index}>
                  <Checkbox
                    label={elm.country}
                    checked={country.includes(elm.country)}
                    onClick={() => {
                      handleChange("country", elm.country);
                      handleClose();
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="fb-center shadow cp-12 mt-3 pt-3">
        <div className="fb-center w-100">
          <span className="text-15-500 lh-22 color-2121">
            Conference By Year
          </span>
        </div>
        <div className="d-flex flex-column gap-2 mt-3 w-100">
          <div className="ps-2 pe-2">
            <MultiRangeSlider
              step={1}
              min={startYear}
              max={endYear}
              minValue={
                yearOne
                  ? moment(yearOne, "YYYY-MM-DD").format("YYYY")
                  : startYear
              }
              maxValue={
                yearTwo ? moment(yearTwo, "YYYY-MM-DD").format("YYYY") : endYear
              }
              labels={[startYear, endYear]}
              onChange={handleChangeYear}
            />
          </div>
          {}
        </div>
      </div>
      <div className="fb-center shadow cp-12 mt-3 pt-3">
        <div className="fb-center w-100">
          <span className="text-15-500 lh-22 color-2121">
            Conference By Month
          </span>
        </div>
        <div className="d-flex flex-column gap-2 mt-3">
          {months.map((elm, index) => {
            let num = index < 10 ? `0${index + 1}` : `${index + 1}`;
            return (
              <div key={index}>
                <Checkbox
                  label={elm}
                  checked={month.includes(num)}
                  onClick={() => {
                    handleChange("month", num);
                    handleClose();
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ConferenceFilter;
