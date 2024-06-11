import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import ExportButton from "components/Layout/ExportButton";
import { limit, adminRoute, icons } from "utils/constants";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import {
  deleteResource,
  exportResources,
  fetchAllResources,
} from "store/slices";
const ResourceManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleRedirect = (id) => {
    navigate(`${adminRoute.resourceManagement}/${id}`);
  };
  const [isLoading, setIsLoading] = useState(true);
  const [resourceId, setResourceId] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    state: "",
    country: "",
    email_id: "",
    resourceid: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const getResources = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchAllResources(forData));
    setTableList(response?.data?.resource_users || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getResources(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getResources(newData);
  };
  useEffect(() => {
    if (["0"].includes(getDataFromLocalStorage("user_type"))) {
      getResources({ ...filterData, ...searchPayload });
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: "Resource Name",
    },
    {
      isSearch: true,
      searchInputName: "resourceid",
      title: "Resource ID",
    },
    {
      isSearch: true,
      searchInputName: "email_id",
      title: "Email ID",
    },
    {
      isSearch: true,
      searchInputName: "state",
      title: (
        <>
          <div>Allocated</div>
          <div>State/Province</div>
        </>
      ),
    },
    {
      isSearch: true,
      searchInputName: "country",
      title: (
        <>
          <div>Allocated</div>
          <div>Country</div>
        </>
      ),
    },

    {
      isSearch: false,
      searchLable: "View/Edit/Delete",
      title: "Action",
    },
  ];
  const rowData = [];
  tableList.forEach((elem) => {
    let obj = [
      {
        value: `${elem.first_name} ${elem.last_name}`,
      },
      {
        value: elem.resource_id,
      },
      {
        value: elem.email,
      },
      {
        value: elem.state_name,
      },
      {
        value: elem.country_name,
      },
      {
        value: (
          <span className="action-icon-buttons">
            <Button
              onClick={() => {
                handleRedirect(elem.id);
              }}
              text="View"
              btnStyle="primary-light"
              className="text-14-500 mw-70 me-2"
              isSquare
            />
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.edit} alt="edit" />}
              className="me-2"
              onClick={() => {
                navigate(
                  `/admin/resource-management/manage-resource/${elem.id}`
                );
              }}
              isSquare
            />
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              onClick={() => {
                setResourceId(elem.id);
              }}
              isSquare
            />
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <div>
      {resourceId && (
        <DeletePopup
          id={resourceId}
          onHide={() => {
            setResourceId(null);
          }}
          handelSuccess={() => {
            setResourceId(null);
            getResources({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ id: resourceId });
            const response = await dispatch(deleteResource(forData));
            return response;
          }}
        />
      )}

      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 cpt-28 cpb-28">
          <div className="table-title">
            Allocated Resources ({filterData?.total})
          </div>
          <div className="d-flex gap-3">
            <ExportButton
              exportAPI={exportResources}
              payload={objectToFormData({
                ...filterData,
                ...searchPayload,
              })}
            />
            <Button
              onClick={() => {
                navigate(
                  "/admin/resource-management/manage-resource/add-resource"
                );
              }}
              text="+ Add Resource"
              btnStyle="primary-outline text-nowrap"
              className="h-35 text-14-500"
              isSquare
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
    </div>
  );
};
export default ResourceManagement;
