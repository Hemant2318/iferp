import Card from "components/Layout/Card";
import DeletePopup from "components/Layout/DeletePopup";
import Table from "components/Layout/Table";
import Button from "components/form/Button";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteCountry, getAllCountries } from "store/slices";
import { icons } from "utils/constants";
import { titleCaseString } from "utils/helpers";
import AddCountry from "./AddCountry";
import { omit } from "lodash";

const CountryManagement = () => {
  const dispatch = useDispatch();
  const [searchPayload, setSearchPayload] = useState({
    country: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 100,
  });
  const [countryId, setCountryId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isAddCountry, setIsAddCountry] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [countryData, setCountryData] = useState([]);

  const fetchAllCountries = async (obj) => {
    const queryParam = new URLSearchParams(omit(obj, ["total"])).toString();
    const response = await dispatch(getAllCountries(queryParam));
    if (response?.status === 200) {
      setCountryData(response?.data?.country);
      setFilterData({ ...obj, total: response?.data?.result_count || 0 });
    }
    setIsLoading(false);
  };

  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    fetchAllCountries(newData);
  };

  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchAllCountries(newData);
  };

  useEffect(() => {
    fetchAllCountries({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      title: "Country Name",
      searchInputName: "country",
    },
    {
      isSearch: false,
      title: "Action",
      searchLable: "Edit/Delete",
    },
  ];
  const rowData = [];
  countryData?.forEach((elem) => {
    const { id, country } = elem;
    let obj = [
      {
        value: <div className="text-nowrap">{titleCaseString(country)}</div>,
      },
      {
        value: (
          <span className="action-icon-buttons">
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.edit} alt="edit" />}
              className="me-2"
              onClick={() => {
                setEditData(elem);
                setIsAddCountry(true);
              }}
              isSquare
            />

            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              isSquare
              onClick={() => {
                setCountryId(id);
              }}
            />
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });

  return (
    <>
      {countryId && (
        <DeletePopup
          id={countryId}
          onHide={() => {
            setCountryId(null);
          }}
          handelSuccess={() => {
            setCountryId(null);
            fetchAllCountries({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let id = { country_id: countryId };
            const response = await dispatch(deleteCountry(id));
            return response;
          }}
        />
      )}
      {isAddCountry && (
        <AddCountry
          editData={editData}
          onHide={() => {
            setIsAddCountry(false);
            setEditData(null);
          }}
          handelSuccess={() => {
            setIsAddCountry(false);
            fetchAllCountries({ ...filterData, ...searchPayload });
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap cpt-28">
          <div className="table-title">All Countries ({filterData?.total})</div>
          <div className="d-flex flex-wrap gap-3 cmt-28 cpb-28">
            <Button
              isSquare
              text="+ Add Country"
              btnStyle="primary-outline"
              className="h-35 text-14-500 text-nowrap"
              onClick={() => {
                setIsAddCountry(!isAddCountry);
              }}
            />
          </div>
        </div>
        <div className="w-100 overflow-auto">
          <Table
            isLoading={isLoading}
            header={header}
            rowData={rowData}
            filterData={filterData}
            searchPayload={searchPayload}
            searchInputChange={handelChangeSearch}
            changeOffset={handelChangePagination}
          />
        </div>
      </Card>
    </>
  );
};

export default CountryManagement;
