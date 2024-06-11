import Loader from "components/Layout/Loader";
import { cloneDeep, omit } from "lodash";
import { useEffect, useRef, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useDispatch } from "react-redux";
import { fetchUserType } from "store/slices";
import { limit } from "utils/constants";
import "./ProffetionalDropdown.scss";

const ProffetionalDropdown = ({
  id,
  value,
  placeholder,
  error,
  onChange,
  existingList,
  handelInvite,
}) => {
  const dispatch = useDispatch();
  const myRef = useRef();
  const listRef = useRef();
  const [isMenu, setIsMenu] = useState(false);
  const [memberLoading, setMemberLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [timer, setTimer] = useState("");
  const [userDetails, setUserDetails] = useState({
    userList: [],
    offset: 0,
    limit: limit,
    name: "",
    total: 0,
    user_type: "2",
  });
  const handelSearch = (e) => {
    e.preventDefault();
    const val = e.target.value;
    setSearchText(val);
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      let oldData = cloneDeep({
        ...userDetails,
        offset: 0,
        name: val?.toLowerCase(),
      });
      listRef?.current?.scrollTo(0, 0);
      setUserDetails(oldData);
      getProfiles(oldData, true);
    }, 800);
    setTimer(time);
  };
  const handelScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      let oldData = cloneDeep({
        ...userDetails,
        offset: userDetails.offset + limit,
      });
      setUserDetails(oldData);
      getProfiles(oldData);
    }
  };
  const getProfiles = async (obj, isReset) => {
    let queryParams = new URLSearchParams(
      omit(obj, ["userList", "total"])
    ).toString();
    const response = await dispatch(fetchUserType(queryParams));
    if (response?.status === 200) {
      setUserDetails((prev) => {
        const apiData = response?.data?.user_details || [];
        let newData = isReset ? apiData : [...prev.userList, ...apiData];
        const latestList = newData?.filter((o) => o?.id !== +value);

        return {
          ...prev,
          total: response?.data?.result_count,
          userList: latestList,
        };
      });
    }
    setMemberLoading(false);
  };
  const handleClickOutside = (e) => {
    if (myRef && myRef?.current && !myRef.current.contains(e.target)) {
      setIsMenu(false);
    }
  };
  useEffect(() => {
    getProfiles(userDetails, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const { userList, total } = userDetails;
  const findVal = [...userList, ...existingList]?.find(
    (o) => `${o.id}` === `${value}`
  );
  return (
    <div id="proffetional-dropdown-container" ref={myRef}>
      <div
        className="search-input-block pointer"
        onClick={() => {
          if (!memberLoading) {
            setIsMenu(true);
          }
        }}
      >
        <div className={findVal?.name ? "active-text" : "placeholder-color"}>
          <input
            type="text"
            placeholder={findVal?.name || placeholder}
            onChange={handelSearch}
            value={searchText}
            className={handelInvite ? "elipsis-input" : ""}
          />
        </div>
        {handelInvite && (
          <div
            className="invite-block"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handelInvite({
                value: searchText,
              });
            }}
          >
            Invite
          </div>
        )}
        <div
          className="icon-block"
          onClick={() => {
            if (!memberLoading) {
              setIsMenu(!isMenu);
            }
          }}
        >
          {memberLoading ? (
            <Loader size="sm" />
          ) : (
            <i className="bi bi-chevron-down pointer" />
          )}
        </div>
        {error && (
          <span className="text-13-400 pt-1">
            <span style={{ color: "red" }}>{error}</span>
          </span>
        )}
      </div>
      {isMenu && (
        <div className="search-list-block shadow rounded">
          <div
            className="max-300 overflow-auto iferp-scroll"
            ref={listRef}
            onScroll={(e) => {
              if (userList.length < total) {
                handelScroll(e);
              }
            }}
          >
            <ListGroup>
              {userList?.map((elem, index) => {
                return (
                  <ListGroup.Item
                    key={index}
                    action
                    onClick={(e) => {
                      e.preventDefault();
                      onChange({
                        target: {
                          id: id,
                          value: elem.id,
                          data: elem,
                        },
                      });
                      setIsMenu(false);
                      setSearchText("");
                    }}
                  >
                    {elem?.name}
                  </ListGroup.Item>
                );
              })}
              {searchText && userList.length === 0 && (
                <ListGroup.Item className="text-center text-14-500">
                  User not found, Invite now
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProffetionalDropdown;
