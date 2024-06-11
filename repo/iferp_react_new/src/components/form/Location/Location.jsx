import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchState } from "store/slices";
import Dropdown from "../Dropdown";

const Location = ({ type, data }) => {
  const dispatch = useDispatch();
  const { countryList, stateList } = useSelector((state) => ({
    countryList: state.global.countryList,
    stateList: state.global.stateList,
    cityList: state.global.cityList,
  }));
  // console.log("countryList", countryList);
  // console.log("stateList", stateList);
  // console.log("cityList", cityList);
  const [stateLoading, setStateLoading] = useState(false);

  const {
    id,
    placeholder,
    value = "",
    error = "",
    onChange,
    countryId,
    isClearable,
    disabled,
    optionKey,
    optionValue,
    label,
    isRequired,
    labelClass,
  } = data;

  const handelChange = (e) => {
    onChange(e);
  };
  const getStateList = async () => {
    setStateLoading(true);
    // await dispatch(fetchState({ country: countryId }));
    await dispatch(fetchState({ country_id: countryId }));
    setStateLoading(false);
  };

  // const getCityList = async () => {
  //   setCityLoading(true);
  //   await dispatch(
  //     fetchCity({ country: countryId || "", state: stateId || "" })
  //     // fetchCity({ country: countryId || "", state: stateId || "" })
  //   );
  //   setCityLoading(false);
  // };

  useEffect(() => {
    if (type === "state" && countryId) {
      getStateList();
    }
    // if (type === "city" && stateId) {
    //   getCityList();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId]);

  // useEffect(() => {
  //   if (type === "city" && stateId) {
  //     getCityList();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [stateId]);
  return (
    <>
      {type === "country" && (
        <Dropdown
          id={id}
          label={label}
          isRequired={isRequired}
          labelClass={labelClass}
          placeholder={placeholder}
          options={countryList}
          optionKey={optionKey || "id"}
          optionValue={optionValue || "country"}
          value={value}
          error={error}
          onChange={handelChange}
          isClearable={isClearable}
          disabled={disabled}
        />
      )}
      {type === "state" && (
        <Dropdown
          id={id}
          label={label}
          isRequired={isRequired}
          labelClass={labelClass}
          placeholder={placeholder}
          options={stateList}
          optionKey={optionKey || "id"}
          optionValue={optionValue || "state"}
          value={value}
          error={error}
          onChange={handelChange}
          isLoading={stateLoading}
          isClearable={isClearable}
          disabled={disabled || stateLoading}
        />
      )}
      {/* {type === "city" && (
        <Dropdown
          id={id}
          label={label}
          isRequired={isRequired}
          labelClass={labelClass}
          placeholder={placeholder}
          options={cityList}
          optionKey={optionKey || "id"}
          optionValue={optionValue || "city"}
          value={value}
          error={error}
          onChange={handelChange}
          isLoading={cityLoading}
          isClearable={isClearable}
          disabled={disabled || cityLoading}
        />
      )} */}
      {/* {type === "city" && (
        <CreatableCityDropDown
          id={id}
          value={value}
          options={cityList}
          label={label}
          optionKey={optionKey || "id"}
          optionValue={optionValue || "city"}
          isLoading={cityLoading}
          isClearable={isClearable}
          countryId={countryId}
          stateId={stateId}
          error={error}
          placeholder={placeholder}
          onChange={handelChange}
        />
      )} */}
    </>
  );
};
export default Location;
