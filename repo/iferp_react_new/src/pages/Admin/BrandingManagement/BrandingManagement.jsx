import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import { icons, limit } from "utils/constants";
import {
  getDataFromLocalStorage,
  getUserType,
  objectToFormData,
} from "utils/helpers";
import { deleteBranding, fetchAllBranding } from "store/slices";
import BrandingManagementForm from "./BrandingManagementForm";

const BrandingManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [isForm, setIsForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userid, setUserid] = useState(null);
  const [editData, setEditData] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    category: "",
    description: "",
    member_category: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const getProfiles = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchAllBranding(forData));
    setTableList(response?.data?.brandingCategory || []);
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
    getProfiles(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getProfiles(newData);
  };
  useEffect(() => {
    if (["0", "6"].includes(getDataFromLocalStorage("user_type"))) {
      getProfiles({ ...filterData, ...searchPayload });
    } else {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleRedirect = (id) => {
    const userType = getUserType();
    navigate(`/${userType}/branding-management/${id}`);
  };
  const header = [
    {
      isSearch: true,
      searchInputName: "category",
      title: "Branding Category",
    },
    {
      isSearch: true,
      searchInputName: "description",
      title: "Branding Description",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "name", value: "name" },
      searchInputName: "member_category",
      title: "Member Category",
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
        value: elem.category,
      },
      {
        value: elem.description,
      },
      {
        value: elem.memberCategory,
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
              isSquare
              btnStyle="light-outline"
              icon={<img src={icons.edit} alt="edit" />}
              className="me-2"
              onClick={() => {
                setEditData(elem);
                setIsForm(true);
              }}
            />
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              onClick={() => {
                setUserid(elem.id);
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
    <div id="career-management-container">
      {userid && (
        <DeletePopup
          onHide={() => {
            setUserid(null);
            setEditData(null);
          }}
          handelSuccess={() => {
            setUserid(null);
            setEditData(null);
            getProfiles({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            const response = await dispatch(deleteBranding(userid));
            return response;
          }}
        />
      )}
      {isForm && (
        <BrandingManagementForm
          editData={editData}
          onHide={() => {
            setIsForm(false);
            setEditData(null);
          }}
          handelSuccess={(isReload = false) => {
            setIsForm(false);
            if (filterData?.total < filterData?.limit || isReload) {
              getProfiles({
                ...filterData,
                ...searchPayload,
              });
            } else {
              setFilterData({
                ...filterData,
                ...searchPayload,
                total: filterData.total + 1,
              });
            }
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 cpt-28 cpb-28">
          <div className="table-title">
            Branding Management ({filterData?.total})
          </div>

          <Button
            onClick={() => {
              setIsForm(true);
            }}
            text="+ Add Branding Category"
            btnStyle="primary-outline"
            className="h-35 text-14-500 text-nowrap"
            isSquare
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
    </div>
  );
};
export default BrandingManagement;
