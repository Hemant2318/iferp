import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import FilterDropdown from "components/Layout/FilterDropdown";
import { icons, limit } from "utils/constants";
import {
  getDataFromLocalStorage,
  getStatus,
  objectToFormData,
} from "utils/helpers";
import {
  exportSubmittedAbstracts,
  fetchSubmittedAbstracts,
} from "store/slices";

const SubmittedPapers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    author_name: "",
    membership_id_or_type: "",
    abstract_id_or_title: "",
    conference: "",
    status: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
    membership_plan_id: "",
  });
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getEventAbstarcts(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getEventAbstarcts(newData);
  };
  const handelChangeFilter = (val) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, membership_plan_id: val, offset: 0 };
    setFilterData(newData);
    getEventAbstarcts(newData);
  };
  const getEventAbstarcts = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchSubmittedAbstracts(forData));
    setTableList(response?.data?.abstracts || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  useEffect(() => {
    getEventAbstarcts({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "author_name",
      title: "Author",
    },
    {
      isSearch: true,
      searchInputName: "abstract_id_or_title",
      title: "Paper Title",
    },
    {
      isSearch: true,
      searchInputName: "conference",
      title: "Conference",
    },
    {
      searchLable: "Paper Status",
      title: "Status",
    },
  ];
  const rowData = [];

  tableList.forEach((elem) => {
    let obj = [
      {
        value: elem.authorName,
      },
      {
        value: (
          <span>
            <span>{elem.paperId}</span>
            {" - "}
            <span>{elem.paperTitle}</span>
          </span>
        ),
      },
      {
        value: elem.conference,
      },
      {
        value: (
          <div className="text-13-500">{getStatus(elem.submitted_status)}</div>
        ),
      },
    ];
    rowData.push({ data: obj });
  });

  return (
    <Card className="cps-20 cpe-20 cpb-20">
      <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
        <div className="text-18-400 color-black-olive d-flex align-items-center">
          <span
            className="d-flex"
            onClick={() => {
              navigate(-1);
            }}
          >
            <img
              src={icons.leftArrow}
              alt="back"
              className="h-21 me-3 pointer"
            />
          </span>
          <span>Submitted Abstracts</span>
        </div>
        <div className="d-flex">
          <ExportButton exportAPI={exportSubmittedAbstracts} />
          {getDataFromLocalStorage("user_type") === "3" && (
            <div className="d-flex ms-2">
              <FilterDropdown
                list={[
                  {
                    id: "Accepted",
                    name: "Accepted",
                  },
                  {
                    id: "Submitted",
                    name: "Submitted",
                  },
                  {
                    id: "Registered",
                    name: "Registered",
                  },
                  {
                    id: "Finished",
                    name: "Finished",
                  },
                ]}
                handelChangeFilter={handelChangeFilter}
              />
            </div>
          )}
        </div>
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
  );
};
export default SubmittedPapers;
