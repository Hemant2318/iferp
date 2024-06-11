import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import Button from "components/form/Button";
import React, { useEffect, useState } from "react";
import { icons, limit } from "utils/constants";
import { objectToFormData, titleCaseString } from "utils/helpers";
import AddDepartmentForm from "./AddDepartmentForm";
import { deleteDepartments, getAllDepartments } from "store/slices";
import { useDispatch } from "react-redux";
import { omit } from "lodash";
import DeleteDepartmentTopicPopup from "components/Layout/DeleteDepartmentTopicPopup";

const AdminDepartments = ({ depList, handleGetList }) => {
  const dispatch = useDispatch();

  const [isAddDepartment, setIsAddDepartment] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDelete, setIsDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPayload, setSearchPayload] = useState({
    search: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const [list, setList] = useState([]);

  const fetchAllDepartments = async (data) => {
    setIsLoading(true);
    const payload = omit(data, ["total"]);
    const response = await dispatch(
      getAllDepartments(objectToFormData(payload))
    );

    setList(response?.data?.data || []);
    setFilterData({
      ...data,
      total: response?.data?.total || 0,
    });
    setIsLoading(false);
  };

  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchAllDepartments(newData);
  };

  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    fetchAllDepartments(newData);
  };

  useEffect(() => {
    fetchAllDepartments({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "search",
      title: "Department Name",
    },

    {
      isSearch: false,
      searchLable: "Edit/Delete",
      title: "Action",
    },
  ];

  const rowData = [];
  list?.forEach((elem) => {
    const { department } = elem;
    let obj = [
      {
        value: <div className="text-start">{titleCaseString(department)}</div>,
      },

      {
        value: (
          <div className="d-flex justify-content-center gap-2">
            <span className="action-icon-buttons ">
              <Button
                btnStyle="light-outline"
                icon={<img src={icons.edit} alt="edit" />}
                isSquare
                onClick={() => {
                  setIsAddDepartment(true);
                  setEditData(elem);
                }}
              />
            </span>
            <span className="action-icon-buttons ">
              <Button
                btnStyle="light-outline"
                icon={<img src={icons.deleteIcon} alt="delete" />}
                isSquare
                onClick={() => {
                  setIsDelete(elem);
                }}
              />
            </span>
          </div>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <div className="admin-departments-container">
      {isDelete && (
        <DeleteDepartmentTopicPopup
          title="Delete Department"
          message={`Are you sure you want to delete this ${titleCaseString(
            isDelete?.department
          )}?`}
          onHide={() => {
            setIsDelete(null);
          }}
          handelSuccess={() => {
            setIsDelete(null);
            fetchAllDepartments({ ...filterData, ...searchPayload });
          }}
          handelDelete={async (data) => {
            const response = await dispatch(
              deleteDepartments(
                isDelete?.id,
                objectToFormData({ assign_department_id: data?.id })
              )
            );
            return response;
          }}
          list={depList}
        />
      )}
      {isAddDepartment && (
        <AddDepartmentForm
          onHide={() => {
            setIsAddDepartment(false);
            setEditData(null);
          }}
          editData={editData}
          handleSuccess={() => {
            fetchAllDepartments({ ...filterData, ...searchPayload });
            handleGetList();
            setIsAddDepartment(false);
            setEditData(null);
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 cpt-28 cpb-28">
          <div className="table-title">All Departments</div>

          <Button
            onClick={() => {
              setIsAddDepartment(true);
            }}
            text="+ Add New Department"
            btnStyle="primary-outline"
            className="h-35 text-14-500"
            isSquare
          />
        </div>

        <Table
          header={header}
          rowData={rowData}
          isLoading={isLoading}
          filterData={filterData}
          changeOffset={handelChangePagination}
          searchInputChange={handelChangeSearch}
          searchPayload={searchPayload}
        />
      </Card>
    </div>
  );
};

export default AdminDepartments;
