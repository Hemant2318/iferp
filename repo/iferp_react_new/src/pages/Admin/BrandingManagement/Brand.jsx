import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ExportButton from "components/Layout/ExportButton";
import Button from "components/form/Button";
import { icons } from "utils/constants";
import Table from "components/Layout/Table";
import Card from "components/Layout/Card";
import DeletePopup from "components/Layout/DeletePopup";
import { limit } from "utils/constants";
import { getStatus, getUserType, objectToFormData } from "utils/helpers";
import {
  deleteBrandingApplied,
  editBrandingAppliedStatus,
  fetchAllBrandingApplied,
} from "store/slices";
import BrandForm from "./BrandForm";

const Brand = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [statusLoader, setStatusLoader] = useState("");
  const [userid, setUserid] = useState(null);
  const [editData, setEditData] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    id: params.brandId,
    organization_name: "",
    member_id: "",
    member_type: "",
    status: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    title: "",
    limit: limit,
  });
  const getProfiles = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchAllBrandingApplied(forData));
    setTableList(response?.data?.branding_details || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
      title: response?.data?.brand_category_name || "",
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
    getProfiles({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRedirect = (url = "") => {
    const userType = getUserType();
    navigate(`/${userType}/branding-management${url}`);
  };
  const header = [
    {
      isSearch: true,
      searchInputName: "organization_name",
      title: "Organization Name",
    },
    {
      isSearch: true,
      searchInputName: "member_id",
      title: "Member ID",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "id", value: "name" },
      searchInputName: "member_type",
      title: "Member Type",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: {
        options: [
          { id: "0", name: "Pending" },
          { id: "1", name: "Accepted" },
          { id: "2", name: "Rejected" },
        ],
        key: "id",
        value: "name",
      },
      searchInputName: "status",
      title: "Status",
    },
    {
      isSearch: false,
      searchLable: "Edit/Delete",
      title: "Action",
    },
  ];

  const rowData = [];
  tableList.forEach((elem) => {
    let obj = [
      {
        value: elem.organization_name,
      },
      {
        value: elem.member_id,
      },
      {
        value: elem.member_type,
      },
      {
        value: getStatus(elem.status),
      },
      {
        value:
          elem.status === "0" ? (
            <span className="action-icon-buttons">
              <Button
                onClick={async () => {
                  setStatusLoader(elem.id);
                  let forData = objectToFormData({
                    status: 1,
                    id: params.brandId,
                    brand_detail_id: elem.id,
                  });
                  const response = await dispatch(
                    editBrandingAppliedStatus(forData)
                  );
                  if (response?.status === 200) {
                    getProfiles({ ...filterData, ...searchPayload });
                  }
                  setStatusLoader("");
                }}
                text={statusLoader === elem.id ? "" : "Accept"}
                btnStyle="primary-dark"
                className="text-14-500 mw-70 me-2"
                btnLoading={statusLoader === elem.id}
                isSquare
              />
              <Button
                onClick={() => {
                  handleRedirect(`/${params.brandId}/${elem.id}`);
                }}
                text="View"
                btnStyle="primary-light"
                className="text-14-500 mw-70 me-2"
                isSquare
              />
            </span>
          ) : (
            <span className="action-icon-buttons">
              <Button
                onClick={() => {
                  handleRedirect(`/${params.brandId}/${elem.id}`);
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
            const response = await dispatch(
              deleteBrandingApplied(
                objectToFormData({
                  id: params.brandId,
                  brand_detail_id: userid,
                })
              )
            );
            return response;
          }}
        />
      )}
      {editData && (
        <BrandForm
          editData={editData}
          payload={{ id: params.brandId, brand_detail_id: editData.id }}
          onHide={() => {
            setEditData(null);
          }}
          handelSuccess={() => {
            setEditData(null);
            getProfiles({ ...filterData, ...searchPayload });
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20 cpt-20">
        {!isLoading && (
          <div className="cpt-12 cpb-12 d-flex align-items-center justify-content-between cmb-12">
            <div className="d-flex align-items-center">
              <span
                className="d-flex"
                onClick={() => {
                  handleRedirect();
                }}
              >
                <img
                  src={icons.leftArrow}
                  alt="back"
                  className="h-21 me-3 pointer"
                />
              </span>
              <span className="text-18-500 color-black-olive">
                {filterData.title}
              </span>
            </div>
            <ExportButton
              exportAPI={fetchAllBrandingApplied}
              payload={objectToFormData({
                id: params.brandId,
                export_status: 1,
              })}
            />
          </div>
        )}
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
export default Brand;
