import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getTopConference } from "store/globalSlice";
import { combineArrayS3 } from "utils/helpers";
import { posterPath } from "utils/constants";
import { ConferenceFilter, ConferenceList, Loader, Card } from "components";
import { icons } from "../../../utils/constants/icons";
import { Offcanvas } from "react-bootstrap";
import "./Conference.scss";

const Conference = () => {
  const dispatch = useDispatch();
  const [pageData, setPageData] = useState({
    page: 1,
    limit: 5,
    month: [],
    country: [],
    yearTwo: "",
    yearOne: "",
  });
  const [timer, setTimer] = useState("");
  const [conference, setConference] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [show, setShow] = useState(false);

  const getConference = async (fData) => {
    const { country, month, page, limit, yearOne, yearTwo } = fData;
    let formData = new FormData();
    formData.append("page", page);
    formData.append("limit", limit);
    formData.append("yearOne", yearOne);
    formData.append("yearTwo", yearTwo);
    country.forEach((o) => formData.append("country[]", o));
    month.forEach((o) => formData.append("month[]", o));
    const response = await dispatch(getTopConference(formData));
    const total = response?.data?.total_count || 0;
    let resList = [];
    if (response?.data?.result?.length > 0) {
      resList = await combineArrayS3(
        response?.data?.result,
        "poster_path",
        posterPath
      );
    }
    setConference(resList);
    setTotalCount(total);
    setIsLoading(false);
  };
  const getPageNumber = (page) => {
    setIsLoading(true);
    setPageData((prev) => {
      return { ...prev, page: page };
    });
  };
  const handleUpdatePageData = (newPageData) => {
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      setIsLoading(true);
      getConference(newPageData);
    }, 800);
    setTimer(time);
  };

  useEffect(() => {
    handleUpdatePageData(pageData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageData]);

  return (
    <>
      <div className="container bg-feff">
        <div className="row">
          {isLoading ? (
            <Card className="cpt-100 cpb-100">
              <Loader size="md" />
            </Card>
          ) : (
            <>
              <div className="col-md-3 cmb-20 ">
                <div className="d-flex d-md-none justify-content-end ">
                  <div
                    className="fa-center gap-2 shadow cp-12 pointer"
                    onClick={() => {
                      setShow(true);
                    }}
                  >
                    <span className="text-18-400 lh-27 color-4d4d ">
                      Filter
                    </span>
                    <span>
                      <img src={icons.filter} alt="filter" />
                    </span>
                  </div>
                </div>

                <Offcanvas
                  placement="start"
                  responsive="md"
                  show={show}
                  onHide={() => {
                    setShow(false);
                  }}
                >
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body className="flex-column">
                    <ConferenceFilter
                      pageData={pageData}
                      setPageData={setPageData}
                      handleClose={() => {
                        setShow(false);
                      }}
                    />
                  </Offcanvas.Body>
                </Offcanvas>
                {/* <ConferenceFilter
                  pageData={pageData}
                  setPageData={setPageData}
                /> */}
              </div>
              <div className="col-md-9">
                <ConferenceList
                  limit={pageData.limit}
                  eventList={conference}
                  totalCount={totalCount}
                  activePage={pageData.page}
                  getPageNumber={getPageNumber}
                  title={
                    <>
                      Top Conferences Proceedings{" "}
                      <span className="text-20-400">({totalCount})</span>
                    </>
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Conference;
