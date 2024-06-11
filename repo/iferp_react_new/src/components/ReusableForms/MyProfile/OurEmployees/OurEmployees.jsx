import Button from "components/form/Button";
import Card from "components/Layout/Card";
import ExportButton from "components/Layout/ExportButton";
import Table from "components/Layout/Table";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCorporateEmployees } from "store/slices";
import { limit } from "utils/constants";
import AddEmployee from "./AddEmployee";

const OurEmployees = () => {
  const dispatch = useDispatch();
  const [isAddEmployee, setIsAddEmployee] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    member_id: "",
    email_id: "",
    phone_number: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const [tableList, setTableList] = useState([
    {
      name: "Aayra M",
      member_id: "12802",
      email_id: "aayra289@gmail.com",
      phone_number: "9876543210",
    },
  ]);
  const getEmployees = async (obj) => {
    let queryParams = new URLSearchParams(omit(obj, ["total"])).toString();
    const response = await dispatch(fetchCorporateEmployees(queryParams));
    setTableList(response?.data?.employees || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  useEffect(() => {
    getEmployees({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getEmployees(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getEmployees(newData);
  };

  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: "Name",
    },
    {
      isSearch: true,
      searchInputName: "member_id",
      title: "Member ID",
    },
    {
      isSearch: true,
      searchInputName: "email_id",
      title: "Email ID",
    },
    {
      isSearch: true,
      searchInputName: "phone_number",
      title: "Contact Number",
    },
  ];
  const rowData = [];
  tableList.forEach((elem) => {
    const { first_name, last_name, member_id, email_id, phone_number } = elem;

    let obj = [
      {
        value: `${first_name} ${last_name}`,
      },
      {
        value: member_id,
      },
      {
        value: email_id,
      },
      {
        value: phone_number,
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <Card className="cps-20 cpe-20 cpb-20">
      {isAddEmployee && (
        <AddEmployee
          onHide={() => {
            setIsAddEmployee(false);
          }}
          handelSuccess={() => {
            setIsAddEmployee(false);
            getEmployees({
              ...filterData,
              ...searchPayload,
            });
          }}
        />
      )}
      <div className="d-flex justify-content-between align-items-center flex-wrap cpt-28">
        <div className="text-18-400 color-black-olive cpb-28">
          All Employees ({filterData?.total})
        </div>
        <div className="d-flex gap-3 cpb-28">
          <ExportButton
            exportAPI={fetchCorporateEmployees}
            payload="export_status=1"
          />

          <Button
            isSquare
            text="+ Add Member"
            btnStyle="primary-outline"
            className="h-35 text-14-500 text-nowrap"
            onClick={() => {
              setIsAddEmployee(!isAddEmployee);
            }}
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
export default OurEmployees;
