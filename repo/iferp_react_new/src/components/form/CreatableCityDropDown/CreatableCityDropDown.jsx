import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCity } from "store/slices";
import { unionBy } from "lodash";
import { useParams } from "react-router-dom";
import "./CreatableCityDropDown.scss";

const CreatableCityDropDown = ({
  id,
  error,
  onChange,
  isClearable,
  value,
  countryId,
  stateId,
  disabled,
}) => {
  const dispatch = useDispatch();
  const myRef = useRef();
  const listRef = useRef();
  const { moduleType } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { cityList } = useSelector((state) => ({
    cityList: state?.global?.cityList,
  }));
  const newDisplayList = unionBy(
    moduleType === "event-management"
      ? [...cityList]
      : [
          {
            id: "586",
            city: "Other",
            country_id: countryId,
            state_id: stateId,
          },
          //   ...existingList,
          ...cityList,
        ],
    "id"
  );
  // const [newCityList, setNewCityList] = useState(newDisplayList);
  const [newCityList, setNewCityList] = useState();
  // const getCityList = async () => {
  //   await dispatch(
  //     fetchCity({ country: countryId || "", state: stateId || "" })
  //   );
  // };

  const [data, setData] = useState({
    city: "",
  });

  const handleItem = (e, elm) => {
    // console.log("e", e.target);
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
    setIsMenuOpen(false);
  };

  //   const handelScroll = (e) => {
  //     const bottom =
  //       e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
  //     if (bottom) {
  //       let oldData = cloneDeep({
  //         ...data,
  //         offset: data.offset + 20,
  //       });
  //       setData(oldData);
  //       fetchCityList(oldData);
  //     }
  //   };

  const handleSearch = (e) => {
    e?.preventDefault();
    const val = e?.target?.value;
    setSearchText(val);
    let time = "";
    clearTimeout(time);
    time = setTimeout(() => {
      //   let oldData = cloneDeep({
      //     ...data,
      //     city: val?.toLowerCase(),
      //   });
      //   console.log("🚀 ~ time=setTimeout ~ oldData:", oldData);
      //   listRef?.current?.scrollTo(0, 0);
      //   setData(oldData);
      //   fetchCityList(oldData, true);
      const filteredCountries = newDisplayList?.filter((country) =>
        country?.city?.toLowerCase()?.includes(val?.toLowerCase())
      );
      const updatedCityList =
        moduleType === "event-management"
          ? [...filteredCountries]
          : [
              {
                id: "586",
                city: "Other",
                country_id: countryId,
                state_id: stateId,
              },
              ...filteredCountries,
            ];

      setNewCityList(updatedCityList);
    }, 800);
    // let oldData = cloneDeep(data);
    // oldData = { ...oldData, name: e.target.value, isLoading: true };
    // setData(oldData);
  };

  const handleClickOutside = (e) => {
    if (myRef && myRef?.current && !myRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  const fetchCityList = async (obj, isReset) => {
    const queryParams = {
      country: countryId || "",
      state: stateId || "",
    };
    if (!disabled) {
      let response = await dispatch(fetchCity(queryParams));
      setData((prev) => {
        let resData = response?.data?.city || [];
        let listData = isReset ? resData : [...prev.list, ...resData];
        return {
          ...prev,
          list: listData,
        };
      });
    }
  };
  // useEffect(() => {
  //   if (!disabled) getCityList();
  //   setNewCityList(newDisplayList);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [stateId, countryId]);

  useEffect(() => {
    if (stateId || countryId) {
      fetchCityList({}, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId, countryId]);

  useEffect(() => {
    fetchCityList(data, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const findVal = newDisplayList?.find((o) => +o.id === +value);
  const { city } = findVal || {};
  // console.log("searchText", searchText);
  // console.log("newDisplayList", newDisplayList);
  // console.log("newCityList", newCityList);
  const newList = searchText ? newCityList : newDisplayList;
  return (
    <div id="creatable-city-dropDown-container">
      <div
        className={`city-input-block ${city ? "remove-placeholder-color" : ""}`}
        ref={myRef}
        onClick={() => {
          setIsMenuOpen(true);
        }}
      >
        <input
          type="text"
          value={searchText}
          placeholder={city || "Select City*"}
          onChange={handleSearch}
          disabled={disabled}
        />
        {isClearable && city && (
          <i
            className="bi bi-x close-con"
            onClick={(e) => {
              handleItem(e, { id: "" });
            }}
          />
        )}
        {(!isClearable || !city) && (
          <i className="bi bi-chevron-down icon-con" />
        )}
        {isMenuOpen && (
          <div
            className="city-list iferp-scroll"
            ref={listRef}
            // onScroll={(e) => {
            //   if (newDisplayList?.length < total) {
            //     handelScroll(e);
            //   }
            // }}
          >
            {newList?.map((el, index) => {
              return (
                <div
                  key={index}
                  className="city-item"
                  onClick={(e) => {
                    handleItem(e, el);
                  }}
                >
                  {el?.city}
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

export default CreatableCityDropDown;
