import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "components/form/Button";
import ExportButton from "components/Layout/ExportButton";
import Table from "components/Layout/Table";
import Card from "components/Layout/Card";
import { limit, institutionalRoute } from "utils/constants";
import { downloadFile } from "utils/helpers";
import { getFundsAndGrants } from "store/slices";

const FundsAndGrants = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const statusType = {
    "pending-requests": 0,
    "accepted-proposals": 1,
    "rejected-proposals": 2,
  };
  const status = statusType[params?.type];
  const [tableList, setTableList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    title: "",
    department: "",
    membership_id: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const handleRedirect = (type) => {
    navigate(`${institutionalRoute.fundsAndGrants}/${type}`);
  };
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    fetchFundsAndGrants(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchFundsAndGrants(newData);
  };
  const fetchFundsAndGrants = async (obj) => {
    let queryParams = new URLSearchParams({
      ...obj,
      status: status,
    }).toString();
    const response = await dispatch(getFundsAndGrants(queryParams));
    setTableList(response?.data?.details || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  useEffect(() => {
    setIsLoading(true);
    fetchFundsAndGrants({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.type]);
  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: "Name",
    },
    {
      isSearch: true,
      searchInputName: "membership_id",
      title: "Member ID",
    },
    {
      isSearch: true,
      searchInputName: "department",
      title: "Department",
    },
    {
      isSearch: true,
      searchInputName: "title",
      title: "Title/Idea of the Project",
    },
    {
      isSearch: false,
      searchLable: "Download",
      title: "Action",
    },
  ];
  const rowData = [];
  tableList.forEach((elem) => {
    let obj = [
      {
        value: elem.name,
      },
      {
        value: elem.member_id,
      },
      {
        value: elem.department_name,
      },
      {
        value: elem.title_of_the_project,
      },
      {
        value: (
          <div className="center-flex">
            <Button
              btnStyle="primary-outline"
              text="Download"
              className="h-35 text-14-500"
              onClick={() => {
                dispatch(downloadFile(elem.project_proposal));
              }}
              isSquare
            />
          </div>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <Card className="cps-34 cpe-34 cpb-20 cpt-26">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Tabs
            defaultActiveKey={params?.type}
            id="uncontrolled-tab-example"
            className="mb-3 gap-4"
          >
            <Tab
              eventKey="accepted-proposals"
              title="Accepted Proposals"
              onEnter={() => {
                handleRedirect("accepted-proposals");
              }}
            />

            <Tab
              eventKey="rejected-proposals"
              title="Rejected Proposals"
              onEnter={() => {
                handleRedirect("rejected-proposals");
              }}
            />
            <Tab
              eventKey="pending-requests"
              title="Pending Requests"
              onEnter={() => {
                handleRedirect("pending-requests");
              }}
            />
          </Tabs>
        </div>
        <div>
          <ExportButton
            exportAPI={getFundsAndGrants}
            payload={`export_status=1&&status=${status}`}
          />
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
export default FundsAndGrants;
