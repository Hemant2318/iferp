import { useEffect, useRef, useState } from "react";
import { cloneDeep, omit, unionBy } from "lodash";
import { useDispatch } from "react-redux";
import { getInstitutions } from "store/slices";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import "./InstitutionDropdown.scss";

const InstitutionDropdown = ({
  id,
  value,
  error,
  onChange,
  existingList,
  isClearable,
}) => {
  const dispatch = useDispatch();
  const myRef = useRef();
  const listRef = useRef();
  const [timer, setTimer] = useState("");
  const [isMenu, setIsMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState({
    list: [],
    name: "",
    total: 0,
    offset: 0,
    limit: 20,
    isLoading: true,
  });
  const handleItem = (e, elm) => {
    e.preventDefault();
    e.stopPropagation();
    onChange({
      target: {
        id: id,
        value: elm.id,
        data: elm,
      },
    });
    setSearchText("");
    setIsMenu(false);
  };
  const handelScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      let oldData = cloneDeep({
        ...data,
        offset: data.offset + 20,
      });
      setData(oldData);
      fetchInstitutionList(oldData);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.value;
    setSearchText(val);
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      let oldData = cloneDeep({
        ...data,
        offset: 0,
        name: val?.toLowerCase(),
      });
      listRef?.current?.scrollTo(0, 0);
      setData(oldData);
      fetchInstitutionList(oldData, true);
    }, 800);
    setTimer(time);
    // let oldData = cloneDeep(data);
    // oldData = { ...oldData, name: e.target.value, isLoading: true };
    // setData(oldData);
  };
  const fetchInstitutionList = async (obj, isReset) => {
    let payload = objectToFormData(
      omit({ ...obj, id: getDataFromLocalStorage("id") }, [
        "list",
        "total",
        "isLoading",
      ])
    );
    const response = await dispatch(getInstitutions(payload));
    setData((prev) => {
      let resData = response?.data?.institutions || [];
      let listData = isReset ? resData : [...prev.list, ...resData];
      return {
        ...prev,
        list: listData,
        total: response?.data?.result_count || 0,
        isLoading: false,
      };
    });
  };
  const handleClickOutside = (e) => {
    if (myRef && myRef?.current && !myRef.current.contains(e.target)) {
      setIsMenu(false);
    }
  };
  useEffect(() => {
    fetchInstitutionList(data, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const { list, total } = data;
  const newDisplayList = unionBy(
    [{ id: 1772, name: "Other" }, ...existingList],
    list,
    "id"
  );
  const findVal = newDisplayList?.find((o) => +o.id === +value);
  const { name } = findVal || {};
  return (
    <div id="institution-dropdown-container">
      <div
        className={`institution-input-block ${
          name ? "remove-placeholder-color" : ""
        }`}
        ref={myRef}
        onClick={() => {
          setIsMenu(true);
        }}
      >
        <input
          type="text"
          value={searchText}
          placeholder={name || "Select Institution"}
          onChange={handleSearch}
        />
        {isClearable && name && (
          <i
            className="bi bi-x close-con"
            onClick={(e) => {
              handleItem(e, { id: "" });
            }}
          />
        )}
        {(!isClearable || !name) && (
          <i className="bi bi-chevron-down icon-con" />
        )}
        {isMenu && (
          <div
            className="institute-list iferp-scroll"
            ref={listRef}
            onScroll={(e) => {
              if (list.length < total) {
                handelScroll(e);
              }
            }}
          >
            {newDisplayList?.map((el, index) => {
              return (
                <div
                  key={index}
                  className="institute-item"
                  onClick={(e) => {
                    handleItem(e, el);
                  }}
                >
                  {el.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {error && (
        <span className="text-13-400 pt-1">
          <span style={{ color: "red" }}>{error}</span>
        </span>
      )}
    </div>
  );
};

export default InstitutionDropdown;
