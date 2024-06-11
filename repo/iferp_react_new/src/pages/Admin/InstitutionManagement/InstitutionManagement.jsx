import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getInstitutions } from "store/slices";
import { icons, limit } from "utils/constants";
import { objectToFormData, getDataFromLocalStorage } from "utils/helpers";
import MapInstitution from "./MapInstitution";
import InstitutionForm from "./InstitutionForm";
import { useNavigate } from "react-router-dom";

const InstitutionManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [institutionalList, setInstitutionalList] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [isMap, setIsMap] = useState(false);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    country: "",
    state: "",
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
    fetchInstitutionList(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchInstitutionList(newData);
  };
  const fetchInstitutionList = async (obj) => {
    let payload = objectToFormData({
      id: getDataFromLocalStorage("id"),
      ...obj,
    });
    const response = await dispatch(getInstitutions(payload));
    setInstitutionalList(response?.data?.institutions || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  useEffect(() => {
    if (["0"].includes(getDataFromLocalStorage("user_type"))) {
      fetchInstitutionList({ ...filterData, ...searchPayload });
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: <div className="text-start">Institution Name</div>,
    },
    {
      title: "Country",
      isSearch: true,
      searchInputName: "country",
    },
    {
      title: "State/Province",
      isSearch: true,
      searchInputName: "state",
    },
    {
      title: "Action",
      searchLable: "Edit",
    },
  ];
  const rowData = [];

  institutionalList.forEach((elem) => {
    const { name, country, state } = elem;
    let obj = [
      {
        value: <div className="text-start">{name}</div>,
      },
      {
        value: country,
      },
      {
        value: state || "",
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
        <MapInstitution
          editData={editData}
          onHide={() => {
            setIsMap(false);
            setEditData(null);
          }}
          handelSuccess={() => {
            setIsMap(false);
            setEditData(null);
            fetchInstitutionList({ ...filterData, ...searchPayload });
          }}
        />
      )}
      {isAdd && (
        <InstitutionForm
          handelSuccess={() => {
            setIsAdd(false);
            setEditData(null);
            fetchInstitutionList({ ...filterData, ...searchPayload });
          }}
          editData={editData}
          onHide={() => {
            setIsAdd(false);
            setEditData(null);
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap cpt-28 gap-2 mb-3">
          <div className="table-title">All Institution</div>

          <Button
            isSquare
            text="+ Add Institution"
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
export default InstitutionManagement;
