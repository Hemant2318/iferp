import DeletePopup from "components/Layout/DeletePopup";
import Table from "components/Layout/Table";
import Button from "components/form/Button";
import { omit } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteCity, getAllCities } from "store/slices";
import { icons } from "utils/constants";
import { titleCaseString } from "utils/helpers";
import AddCity from "./AddCity";
import Card from "components/Layout/Card";

const CityManagement = () => {
  const dispatch = useDispatch();
  const [searchPayload, setSearchPayload] = useState({
    state: "",
    country: "",
    city: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 100,
  });
  const [cityID, setCityId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isAddCity, setIsAddCity] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cityData, setCityData] = useState([]);

  const fetchAllCities = async (obj) => {
    const queryParam = new URLSearchParams(omit(obj, ["total"])).toString();
    const response = await dispatch(getAllCities(queryParam));
    if (response?.status === 200) {
      setCityData(response?.data?.city);
      setFilterData({ ...obj, total: response?.data?.result_count });
    }
    setIsLoading(false);
  };

  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    fetchAllCities(newData);
  };

  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchAllCities(newData);
  };

  useEffect(() => {
    fetchAllCities({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      title: "Country Name",
      searchInputName: "country",
    },
    {
      isSearch: true,
      title: "State Name",
      searchInputName: "state",
    },
    {
      isSearch: true,
      title: "City Name",
      searchInputName: "city",
    },
    {
      isSearch: false,
      title: "Action",
      searchLable: "Edit/Delete",
    },
  ];
  const rowData = [];
  cityData?.forEach((elem) => {
    const { id, country, state, city } = elem;
    let obj = [
      {
        value: <div className="text-nowrap">{titleCaseString(country)}</div>,
      },
      {
        value: <div className="text-nowrap">{titleCaseString(state)}</div>,
      },
      {
        value: <div className="text-nowrap">{titleCaseString(city)}</div>,
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
                setIsAddCity(true);
              }}
              isSquare
            />

            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              isSquare
              onClick={() => {
                setCityId(id);
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
      {cityID && (
        <DeletePopup
          id={cityID}
          onHide={() => {
            setCityId(null);
          }}
          handelSuccess={() => {
            setCityId(null);
            fetchAllCities({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let id = { city_id: cityID };
            const response = await dispatch(deleteCity(id));
            return response;
          }}
        />
      )}
      {isAddCity && (
        <AddCity
          editData={editData}
          onHide={() => {
            setIsAddCity(false);
            setEditData(null);
          }}
          handelSuccess={() => {
            setIsAddCity(false);
            fetchAllCities({ ...filterData, ...searchPayload });
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap cpt-28">
          <div className="table-title">All Cities ({filterData?.total})</div>
          <div className="d-flex flex-wrap gap-3 cmt-28 cpb-28">
            <Button
              isSquare
              text="+ Add City"
              btnStyle="primary-outline"
              className="h-35 text-14-500 text-nowrap"
              onClick={() => {
                setIsAddCity(!isAddCity);
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

export default CityManagement;
