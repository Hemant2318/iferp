import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";
import SeachInput from "components/form/SeachInput";
import Loader from "components/Layout/Loader";
import { fetchGlobalSearch } from "store/slices";
import { membershipType } from "utils/constants";
import { getDataFromLocalStorage, titleCaseString } from "utils/helpers";
import "./GlobalSearch.scss";

const GlobalSearch = ({ placeholder }) => {
  const myRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false);
  const [isNoData, setIsNoData] = useState(false);
  // const [isSearch, setIsSearch] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [searchText, setsearchText] = useState("");
  const [timer, setTimer] = useState("");
  const userData = getDataFromLocalStorage();
  const { user_type: userType } = userData;
  const findType = membershipType.find((o) => o.id === userType)?.type;
  const handelSearchChange = (e) => {
    setIsNoData(false);
    const value = titleCaseString(e.target.value);
    if (!value) {
      setSearchData([]);
    }
    setsearchText(value);
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      if (value) {
        setIsLoader(true);
        fetchSearchData(value);
      }
    }, 800);
    setTimer(time);
  };
  const fetchSearchData = async (searchValue) => {
    const response = await dispatch(
      fetchGlobalSearch(`?search=${searchValue}`)
    );
    const resData = response?.data?.search_result || [];
    setSearchData(resData);
    setIsNoData(resData.length === 0);
    setIsLoader(false);
  };
  const handelClick = (elem) => {
    if (userType === "0") {
      let redirectObj = {
        event: `/${findType}/event-management/event-details/${elem.searched_id}/conference-details`,
        event_abstract: `/${findType}/event-management/submitted-papers/${elem.searched_id}`,
        journal: `/${findType}/journal-management/journals`,
        journal_abstract: `/${findType}/journal-management/submitted-papers/${elem.searched_id}`,
      };
      let url = redirectObj[elem?.type];
      if (url) {
        navigate(url);
      }
    } else {
      let redirectObj = {
        event: `/${findType}/conferences-and-events/event-details/${elem.searched_id}/conference-details`,
        event_abstract: `/${findType}/my-profile/my-events`,
        journal: `/${findType}/publications`,
        journal_abstract: `/${findType}/publications/submit-paper`,
      };
      let url = redirectObj[elem?.type];
      if (url) {
        navigate(url);
      }
    }
    setsearchText("");
    setSearchData([]);
  };
  const handleClickOutside = (e) => {
    if (myRef.current && !myRef.current.contains(e.target)) {
      // setIsSearch(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  return (
    <div
      id="global-search-container"
      ref={myRef}
      className={searchData.length > 0 ? "search-available" : ""}
    >
      <SeachInput
        placeholder={placeholder || "Search here"}
        value={searchText}
        onChange={handelSearchChange}
        isLoading={isLoader}
      />
      {searchData.length > 0 ? (
        <div className="box-shadow search-suggetion-container">
          {isLoader ? (
            <div className="text-center cps-10 cpe-10 cpt-12 cpb-12">
              <Loader size="sm" />
            </div>
          ) : !searchText ? (
            <div className="text-center text-14-400 color-black-olive text-truncate cps-10 cpe-10 cpt-10 cpb-10">
              Type something
            </div>
          ) : searchData.length > 0 ? (
            <ListGroup variant="flush" className="iferp-scroll">
              {searchData.map((elem, index) => {
                let newText = elem.searched_title;
                searchText?.split(" ")?.forEach((sText) => {
                  if (sText) {
                    var reg = new RegExp("(" + sText + ")", "gi");
                    newText = newText.replace(
                      reg,
                      "<span className='text-danger text-14-500'>$1</span>"
                    );
                  }
                });
                return (
                  <ListGroup.Item
                    key={index}
                    className="text-14-400 color-black-olive search-list-item"
                    onClick={() => {
                      handelClick(elem);
                    }}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: newText,
                      }}
                    />
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          ) : (
            <div className="text-center text-14-400 text-truncate cps-10 cpe-10 cpt-10 cpb-10">
              <span>No result found for</span>
              <span className="text-14-500 color-new-car ms-1">
                {searchText}
              </span>
            </div>
          )}
        </div>
      ) : isNoData ? (
        <div className="box-shadow search-suggetion-container">
          <div className="text-14-400 text-center pt-3 pb-3">
            No result found!
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default GlobalSearch;
