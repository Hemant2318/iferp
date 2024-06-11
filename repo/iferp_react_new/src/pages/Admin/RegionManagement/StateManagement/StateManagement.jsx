import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import Button from "components/form/Button";
import { omit } from "lodash";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteState, fetchCountry, getAllStates } from "store/slices";
import { icons } from "utils/constants";
import { titleCaseString } from "utils/helpers";
import AddState from "./AddState";
import DeletePopup from "components/Layout/DeletePopup";

const StateManagement = () => {
  const dispatch = useDispatch();

  const [searchPayload, setSearchPayload] = useState({
    state: "",
    country: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 100,
  });
  const [stateId, setStateId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isAddState, setIsAddState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stateData, setStateData] = useState([]);

  const fetchAllState = async (obj) => {
    const queryParam = new URLSearchParams(omit(obj, ["total"])).toString();
    const response = await dispatch(getAllStates(queryParam));
    if (response?.status === 200) {
      await dispatch(fetchCountry());
      setStateData(response?.data?.state);
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
    fetchAllState(newData);
  };

  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchAllState(newData);
  };

  useEffect(() => {
    fetchAllState({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log("stateData", stateData);

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
      isSearch: false,
      title: "Action",
      searchLable: "Edit/Delete",
    },
  ];
  const rowData = [];
  stateData?.forEach((elem) => {
    const { id, country_name, state } = elem;
    let obj = [
      {
        value: (
          <div className="text-nowrap">{titleCaseString(country_name)}</div>
        ),
      },
      {
        value: <div className="text-nowrap">{titleCaseString(state)}</div>,
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
                setIsAddState(true);
              }}
              isSquare
            />

            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              isSquare
              onClick={() => {
                setStateId(id);
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
      {stateId && (
        <DeletePopup
          id={stateId}
          onHide={() => {
            setStateId(null);
          }}
          handelSuccess={() => {
            setStateId(null);
            fetchAllState({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let id = { state_id: stateId };
            const response = await dispatch(deleteState(id));
            return response;
          }}
        />
      )}
      {isAddState && (
        <AddState
          editData={editData}
          onHide={() => {
            setIsAddState(false);
            setEditData(null);
          }}
          handelSuccess={() => {
            setIsAddState(false);
            fetchAllState({ ...filterData, ...searchPayload });
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap cpt-28">
          <div className="table-title">All States ({filterData?.total})</div>
          <div className="d-flex flex-wrap gap-3 cmt-28 cpb-28">
            <Button
              isSquare
              text="+ Add State"
              btnStyle="primary-outline"
              className="h-35 text-14-500 text-nowrap"
              onClick={() => {
                setIsAddState(!isAddState);
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

export default StateManagement;
