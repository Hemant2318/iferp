import Card from "components/Layout/Card";
import Button from "components/form/Button";
import React, { useState } from "react";
import {
  getDataFromLocalStorage,
  objectToFormData,
  storeLocalStorageData,
} from "utils/helpers";
import TextInput from "components/form/TextInput";
import { icons } from "utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  storeUserData,
  throwError,
  throwSuccess,
  updateCurrency,
} from "store/slices";

const Setting = () => {
  const exchangeRate = getDataFromLocalStorage("exchange_rate");
  console.log("exnchangeRate", exchangeRate);

  const { userData } = useSelector((state) => ({
    userData: state.auth.userData,
  }));
  const dispatch = useDispatch();
  const [isAddCurrency, setIsAddCurrency] = useState(false);
  const [rate, setRate] = useState(exchangeRate);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRateChange = (e) => {
    const value = e.target.value;

    if (value) {
      setRate(value);
      setError(false);
    } else {
      setRate("");
      setError("Please enter value.");
    }
  };

  const handleUpdate = async (val) => {
    setIsLoading(true);
    const response = await dispatch(
      updateCurrency(objectToFormData({ exchange_rate: val }))
    );
    if (response?.status === 200) {
      const updatedUserData = {
        ...userData,
        exchange_rate: response?.data?.exchange_rate,
      };
      storeLocalStorageData(updatedUserData);
      dispatch(storeUserData(updatedUserData));
      setIsAddCurrency(false);
      dispatch(throwSuccess(response?.message));
    } else {
      dispatch(throwError(response?.message));
    }
    setIsLoading(false);
  };

  return (
    <div id="setting-container">
      <Card className="cps-20 cpe-20 cpb-20 cpt-20">
        <h1 className="text-26-500 color-title-navy">USD Rate</h1>
        <form
          className="currency-conversion-block d-flex align-items-center gap-3 cmt-50"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleUpdate(rate);
            }
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <TextInput
              id="exchange_rate"
              placeholder="Enter Amount"
              disabled={!isAddCurrency}
              value={rate}
              onChange={handleRateChange}
              error={error}
            />
          </div>
          <div
            className={`d-flex gap-3 align-items-center ${error && "cmb-23"}`}
          >
            {isAddCurrency ? (
              <Button
                isSquare
                text="Update"
                btnStyle="primary-outline"
                className="d-flex gap-2 h-40 text-14-500 text-nowrap"
                onClick={() => {
                  if (!error) {
                    handleUpdate(rate);
                  }
                }}
                btnLoading={isLoading}
              />
            ) : (
              <Button
                isSquare
                text="Edit"
                btnStyle="primary-outline"
                className="d-flex gap-2 h-40 text-14-500 text-nowrap"
                onClick={() => {
                  setIsAddCurrency(true);
                }}
                icon={<img src={icons.primaryEditPen} alt="edit" />}
              />
            )}
            {isAddCurrency && (
              <Button
                isSquare
                text="Cancel"
                btnStyle="light-outline"
                className=" h-40 text-14-500 text-nowrap"
                onClick={() => {
                  setIsAddCurrency(false);
                  setRate(exchangeRate);
                  setError(false);
                }}
              />
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Setting;
