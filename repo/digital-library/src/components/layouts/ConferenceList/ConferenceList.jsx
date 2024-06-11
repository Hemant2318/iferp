import moment from "moment";
import { ceil } from "lodash";
import { useNavigate } from "react-router-dom";
import { icons } from "utils/constants";
import { titleCaseString } from "utils/helpers";

const ConferenceList = ({
  title,
  limit,
  eventList,
  activePage,
  totalCount,
  getPageNumber,
}) => {
  const navigate = useNavigate();
  const handlePagination = (type, data) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    let newPage = data?.activePage;
    switch (type) {
      case "next":
        newPage = data?.activePage + 1;
        break;
      case "prev":
        newPage = data?.activePage - 1;
        break;
      case "page":
        newPage = data?.page;
        break;
      default:
        break;
    }
    getPageNumber(newPage);
    // const oldData = JSON.parse(JSON.stringify(pageData));
    // oldData.page = newPage;
    // oldData.isLoading = true;
    // setPageData(oldData);
    // getPageData(oldData);
  };
  const totalPage = ceil(totalCount / limit);
  let page1 = activePage;
  let page2 = activePage + 1;
  let page3 = activePage + 2;
  if (activePage >= totalPage - 2) {
    page1 = totalPage - 2 <= 0 ? 1 : totalPage - 2;
    page2 = totalPage - 1 <= 1 ? 2 : totalPage - 1;
    page3 = totalPage - 0 <= 2 ? 3 : totalPage - 0;
  }
  return (
    <div className="shadow cps-28 cpe-28 cpt-30 cpb-15 conference-list">
      <div className="fb-center cmb-30 gap-3">
        <div className="text-20-500 color-1919 lh-30">{title}</div>
      </div>
      {eventList?.length === 0 ? (
        <div className="text-center cpt-100 cpb-100">No Records Found</div>
      ) : (
        eventList?.map((el, index) => {
          const isLast = eventList?.length - 1 !== index;
          return (
            <div className="row mb-4 gy-3" key={index}>
              <div className="col-md-3 h-100">
                <div className="w-100" style={{ height: "122px" }}>
                  <img src={el?.s3File} alt="poster" className="child-image" />
                </div>
              </div>
              <div className="col-md-9 ">
                <div
                  className="mb-3 text-18-500 color-2121 lh-26 hover-effect pointer"
                  onClick={() => {
                    navigate(`/conference/${el?.id}`);
                  }}
                >
                  {titleCaseString(el?.event_name)}
                </div>
                {el?.organizer_name && (
                  <div className="text-16-400 color-3d3d lh-24 mb-3">
                    <span>Organizer -</span>
                    <span className="text-16-500 ms-2">
                      {titleCaseString(el?.organizer_name)}
                    </span>
                  </div>
                )}
                <div className="fa-center gap-4">
                  <div className="fa-center gap-2">
                    <span>
                      <img src={icons.successLocation} alt="map" />
                    </span>
                    <span className="text-16-400 lh-24 color-3d3d">
                      {el?.get_city?.city}{" "}
                      {el?.city === null || el?.get_city === null ? "" : ","}{" "}
                      {isNaN(+el?.country)
                        ? el?.country
                        : el?.get_country?.country}
                    </span>
                  </div>
                  <div className="fa-center gap-2">
                    <span>
                      <img src={icons.successCalendar} alt="calender" />
                    </span>
                    <span className="text-16-400 lh-24 color-3d3d">
                      {moment(el?.event_start_date, "YYYY-MM-DD").format(
                        "DD MMMM YYYY"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {isLast && <div className="bb-e1e1 pt-4" />}
            </div>
          );
        })
      )}
      {totalPage > 1 && (
        <div className="f-center footer-block">
          <div className="f-center gap-2 flex-nowrap">
            <div
              className={`icon-btn ps-2 pe-3 ${
                activePage !== 1 ? "active-icon-btn" : "opacity-75"
              }`}
              onClick={() => {
                if (activePage !== 1) {
                  handlePagination("prev", {
                    activePage: activePage,
                  });
                }
              }}
            >
              <span className="d-flex">
                <img
                  src={activePage !== 1 ? icons.lp : icons.lp}
                  className="fit-image"
                />
              </span>
              <span>Prev</span>
            </div>
            <div
              className={`page-btn ${
                activePage === page1 ? "active-page-btn" : ""
              }`}
              onClick={() => {
                handlePagination("page", { page: page1 });
              }}
            >
              {page1}
            </div>
            <div
              className={`page-btn ${
                activePage === page2 ? "active-page-btn" : ""
              }`}
              onClick={() => {
                handlePagination("page", { page: page2 });
              }}
            >
              {page2}
            </div>
            <div
              className={`page-btn ${
                activePage === page3 ? "active-page-btn" : ""
              } ${totalPage > 2 ? "" : "d-none"}`}
              onClick={() => {
                handlePagination("page", { page: page3 });
              }}
            >
              {page3}
            </div>
            <div
              className={`icon-btn ps-3 pe-2 ${
                activePage !== totalPage ? "active-icon-btn" : "opacity-75"
              }`}
              onClick={() => {
                if (activePage !== totalPage) {
                  handlePagination("next", {
                    activePage: activePage,
                  });
                }
              }}
            >
              <span>Next</span>
              <span className="d-flex">
                <img
                  src={activePage !== totalPage ? icons.rp : icons.rp}
                  className="fit-image"
                />
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConferenceList;
