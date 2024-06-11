import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUniversity } from "store/slices";
import { icons, limit } from "utils/constants";
import MapUniversity from "./MapUniversity";
import UniversityForm from "./UniversityForm";
import { getDataFromLocalStorage } from "utils/helpers";
import { useNavigate } from "react-router-dom";

const UniversityManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [universityList, setUniversityList] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [isMap, setIsMap] = useState(false);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    country: "",
    state_province: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    fetchUniversityList(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchUniversityList(newData);
  };
  const fetchUniversityList = async (obj) => {
    const queryParams = new URLSearchParams(obj).toString();
    let response = await dispatch(getUniversity(queryParams));
    setUniversityList(response?.data?.universities || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  useEffect(() => {
    if (["0"].includes(getDataFromLocalStorage("user_type"))) {
      fetchUniversityList({ ...filterData, ...searchPayload });
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: <div className="text-start">University Name</div>,
    },
    {
      title: "Country",
      isSearch: true,
      searchInputName: "country",
    },
    {
      title: "State/Province",
      isSearch: true,
      searchInputName: "state_province",
    },
    {
      title: "Action",
      searchLable: "Edit",
    },
  ];
  const rowData = [];

  universityList.forEach((elem) => {
    const { name, country, state_province } = elem;
    let obj = [
      {
        value: <div className="text-start">{name}</div>,
      },
      {
        value: country,
      },
      {
        value: state_province || "",
      },
      {
        value: (
          <div className="d-flex justify-content-center gap-2">
            <span>
              <Button
                btnStyle="primary-dark"
                text="Map"
                className="h-auto pt-1 pb-1 text-12-500"
                onClick={() => {
                  setEditData(elem);
                  setIsMap(true);
                }}
                isSquare
              />
            </span>
            <span className="action-icon-buttons ">
              <Button
                btnStyle="light-outline"
                icon={<img src={icons.edit} alt="edit" />}
                onClick={() => {
                  setEditData(elem);
                  setIsAdd(true);
                }}
                isSquare
              />
            </span>
          </div>
        ),
      },
    ];
    rowData.push({ data: obj });
  });

  return (
    <>
      {isMap && (
        <MapUniversity
          editData={editData}
          onHide={() => {
            setIsMap(false);
            setEditData(null);
          }}
          handelSuccess={() => {
            setIsMap(false);
            setEditData(null);
            fetchUniversityList({ ...filterData, ...searchPayload });
          }}
        />
      )}
      {isAdd && (
        <UniversityForm
          handelSuccess={() => {
            setIsAdd(false);
            setEditData(null);
            fetchUniversityList({ ...filterData, ...searchPayload });
          }}
          editData={editData}
          onHide={() => {
            setIsAdd(false);
            setEditData(null);
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap cpt-28 mb-3">
          <div className="table-title">All University</div>

          <Button
            isSquare
            text="+ Add University"
            btnStyle="primary-outline"
            className="h-35 text-14-500 text-nowrap"
            onClick={() => {
              setIsAdd(!isAdd);
            }}
          />
        </div>
        <Table
          isLoading={isLoading}
          header={header}
          rowData={rowData}
          filterData={filterData}
          searchPayload={searchPayload}
          searchInputChange={handelChangeSearch}
          changeOffset={handelChangePagination}
        />
      </Card>
    </>
  );
};
export default UniversityManagement;
