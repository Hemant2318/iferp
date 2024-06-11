import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import CheckBox from "components/form/CheckBox";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import FilterDropdown from "components/Layout/FilterDropdown";
import ExportButton from "components/Layout/ExportButton";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import { icons } from "utils/constants";
import {
  deleteMembers,
  exportProfile,
  fetchAllProfiles,
  fetchAllResourceProfiles,
} from "store/slices";
import AddMember from "./AddMember";
import ProfileDetail from "./ProfileDetail";

const ProfileManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const userType = getDataFromLocalStorage("user_type");
  const [isLoading, setIsLoading] = useState(true);
  const [userid, setUserid] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [isAddMember, setAddMember] = useState(false);
  const [isDeatils, setDeatils] = useState(false);
  const [editData, setEditData] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    membership_id_or_type: "",
    email: "",
    phoneno: "",
    join_date: "",
    valid_date: "",
    country: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 100,
    membership_plan_ids: "",
    is_non_allocated_resource: "",
  });
  const getProfiles = async (obj) => {
    let forData = objectToFormData(obj);
    let response = null;
    if (userType === "6") {
      response = await dispatch(fetchAllResourceProfiles(forData));
    } else {
      response = await dispatch(fetchAllProfiles(forData));
    }
    let resList = [];
    let resResultCount = 0;
    if (response?.data?.users) {
      resList = response?.data?.users || [];
      resResultCount = response?.data?.result_count || 0;
    }
    setTableList(resList);
    setFilterData({
      ...obj,
      total: resResultCount,
    });
    window.scrollTo(0, 0);
    setIsLoading(false);
  };
  const handelChangeFilter = (val) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, membership_plan_ids: val, offset: 0 };
    setFilterData(newData);
    getProfiles(newData);
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
    if (["0", "6"].includes(userType)) {
      getProfiles({ ...filterData, ...searchPayload });
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: "Name",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "name", value: "name" },
      searchInputName: "membership_id_or_type",
      title: (
        <>
          <div>{"Membership ID"}</div>
          <div>{"& Type"}</div>
        </>
      ),
    },
    {
      isSearch: true,
      searchInputName: "email",
      title: "Email ID",
    },
    {
      isSearch: true,
      searchInputName: "phoneno",
      title: "Phone Number",
    },
    {
      isSearch: true,
      searchInputName: "country",
      title: "Country",
    },
    {
      isSearch: true,
      isDatePicker: true,
      searchInputName: "join_date",
      title: "Join Date",
    },
    {
      isSearch: true,
      isDatePicker: true,
      searchInputName: "valid_date",
      title: "Valid Till",
    },
    {
      isSearch: false,
      searchLable: "Edit/Delete",
      title: "Action",
    },
  ];
  const rowData = [];
  tableList.forEach((elem) => {
    const {
      id,
      email,
      phone,
      memberId,
      memberType,
      join_date,
      valid_till,
      firstName,
      lastName,
      country,
    } = elem;
    let isExpired = valid_till && moment().diff(valid_till, "days") > 0;
    let obj = [
      {
        value: (
          <span
            className="color-new-car pointer "
            onClick={() => {
              setDeatils(true);
              setUserDetail(id);
            }}
          >
            {`${firstName} ${lastName}`}
          </span>
        ),
      },
      {
        value: (
          <span>
            {memberId && <div>{memberId}</div>}
            <div>{memberType}</div>
          </span>
        ),
      },
      {
        value: (
          <div
            style={{
              width: "250px",
              wordBreak: "break-word",
            }}
          >
            {email}
          </div>
        ),
      },
      {
        value: phone,
      },
      {
        value: country || "",
      },
      {
        value: moment(join_date).format("DD.MM.YYYY"),
      },

      {
        value: isExpired
          ? "Expired"
          : valid_till
          ? moment(valid_till).format("DD.MM.YYYY")
          : "",
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
                setAddMember(true);
              }}
              isSquare
            />
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              onClick={() => {
                setUserid(id);
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
    <>
      {userid && (
        <DeletePopup
          id={userid}
          onHide={() => {
            setUserid(null);
          }}
          handelSuccess={() => {
            setUserid(null);
            getProfiles({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ userid: userid });
            const response = await dispatch(deleteMembers(forData));
            return response;
          }}
        />
      )}
      {isAddMember && (
        <AddMember
          editData={editData}
          onHide={() => {
            setAddMember(false);
            setEditData(null);
          }}
          handelSuccess={() => {
            setAddMember(false);
            getProfiles({
              ...filterData,
              ...searchPayload,
            });
          }}
        />
      )}
      {isDeatils && (
        <ProfileDetail
          userID={userDetail}
          onHide={() => {
            setDeatils(false);
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap cpt-28">
          <div className="table-title">All Profiles ({filterData?.total})</div>
          <div className="d-flex flex-wrap gap-3 cmt-28 cpb-28">
            {userType === "0" && (
              <div className="text-14-400 grey-border d-flex align-items-center gap-2 ps-2 pe-2">
                <CheckBox
                  type="PRIMARY-ACTIVE"
                  onClick={() => {
                    setIsLoading(true);
                    let newData = { ...filterData, ...searchPayload };
                    newData = {
                      ...newData,
                      is_non_allocated_resource:
                        filterData.is_non_allocated_resource ? "" : "1",
                    };
                    setFilterData(newData);
                    getProfiles(newData);
                  }}
                  isChecked={filterData.is_non_allocated_resource === "1"}
                />
                <div>Not Allocated Resource</div>
              </div>
            )}
            <ExportButton
              exportAPI={exportProfile}
              payload={objectToFormData({
                ...filterData,
                ...searchPayload,
              })}
            />
            <div>
              <FilterDropdown
                list={membershipList}
                handelChangeFilter={handelChangeFilter}
              />
            </div>
            <Button
              isSquare
              text="+ Add Member"
              btnStyle="primary-outline"
              className="h-35 text-14-500 text-nowrap"
              onClick={() => {
                setAddMember(!isAddMember);
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
export default ProfileManagement;
