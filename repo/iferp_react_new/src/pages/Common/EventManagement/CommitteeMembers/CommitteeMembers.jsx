import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import ExportButton from "components/Layout/ExportButton";
import FilterDropdown from "components/Layout/FilterDropdown";
import {
  generatePreSignedUrl,
  getStatus,
  objectToFormData,
} from "utils/helpers";
import { limit, statusType, icons, profilePath } from "utils/constants";
import {
  deleteCommitteeMembers,
  exportCommitteeMembers,
  fetchCommitteeMembers,
  setRProfileID,
} from "store/slices";
import CommitteeMembersFrom from "./CommitteeMembersFrom";
import ViewCV from "./ViewCV";

const CommitteeMembers = () => {
  const dispatch = useDispatch();
  const { membershipList, comitteeMemberCategoryList } = useSelector(
    (state) => ({
      membershipList: state.global.membershipList,
      comitteeMemberCategoryList: state.global.comitteeMemberCategoryList,
    })
  );
  const [viewFile, setViewFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [userid, setUserid] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    status: "",
    event_name: "",
    designation: "",
    member_name: "",
    member_id_or_type: "",
    committee_member_category: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
    membership_plan_id: "",
  });
  const getComitteeMembers = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchCommitteeMembers(forData));
    setTableList(response?.data?.committee_members || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  const handelChangeFilter = (val) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, membership_plan_id: val, offset: 0 };
    setFilterData(newData);
    getComitteeMembers(newData);
  };
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getComitteeMembers(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getComitteeMembers(newData);
  };
  useEffect(() => {
    getComitteeMembers({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "member_name",
      title: "Name",
    },
    {
      isSearch: true,
      searchInputName: "member_id_or_type",
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "id", value: "name" },
      title: (
        <>
          <div>Member ID</div>
          <div>{"& Type"}</div>
        </>
      ),
    },
    {
      isSearch: true,
      searchInputName: "event_name",
      title: "Conference Name",
    },
    {
      isSearch: true,
      searchInputName: "designation",
      title: "Designation",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: {
        options: comitteeMemberCategoryList,
        key: "id",
        value: "name",
      },
      searchInputName: "committee_member_category",
      title: (
        <>
          <div>Committee Member</div>
          <div>Category</div>
        </>
      ),
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: {
        options: statusType,
        key: "id",
        value: "label",
      },
      searchInputName: "status",
      title: "Status",
    },
    {
      isSearch: false,
      searchLable: "Delete",
      title: "Action",
    },
  ];

  const rowData = [];
  tableList.forEach((elem) => {
    const {
      id,
      member_name,
      member_id,
      member_type,
      event_name,
      designation,
      committee_member_category,
      status,
      photo,
    } = elem;
    let obj = [
      {
        value: (
          <div
            className={member_name ? "pointer color-new-car" : ""}
            onClick={() => {
              if (member_name) {
                dispatch(setRProfileID(id));
              }
            }}
          >
            {member_name || ""}
          </div>
        ),
      },
      {
        value: (
          <span>
            <div>{member_id}</div>
            <div>{member_type}</div>
          </span>
        ),
      },
      {
        value: event_name,
      },
      {
        value: designation,
      },
      {
        value: committee_member_category,
      },
      {
        value: getStatus(status),
      },
      {
        value: (
          <span className="action-icon-buttons gap-2">
            {photo && (
              <Button
                btnStyle="primary-dark"
                icon={<i className="bi bi-eye" />}
                onClick={async () => {
                  const res = await generatePreSignedUrl(photo, profilePath);
                  setViewFile(res);
                }}
                isSquare
              />
            )}
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.edit} alt="edit" />}
              onClick={() => {
                setEditData(elem);
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
    <Card className="cps-20 cpe-20 cpb-20">
      {viewFile && (
        <ViewCV
          file={viewFile}
          onHide={() => {
            setViewFile(null);
          }}
        />
      )}
      {editData && (
        <CommitteeMembersFrom
          onHide={() => {
            setEditData(null);
          }}
          handelSuccess={() => {
            setEditData(null);
            getComitteeMembers({ ...filterData, ...searchPayload });
          }}
          editData={editData}
        />
      )}
      {userid && (
        <DeletePopup
          id={userid}
          onHide={() => {
            setUserid(null);
          }}
          handelSuccess={() => {
            setUserid(null);
            getComitteeMembers({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            const response = await dispatch(deleteCommitteeMembers(userid));
            return response;
          }}
        />
      )}

      <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28 flex-wrap gap-2">
        <div className="table-title">
          Committee Members ({filterData?.total})
        </div>
        <div className="d-flex">
          <ExportButton exportAPI={exportCommitteeMembers} />
          <div className="d-flex ms-3">
            <FilterDropdown
              list={membershipList}
              handelChangeFilter={handelChangeFilter}
            />
          </div>
        </div>
      </div>
      <div className="overflow-auto iferp-scroll">
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
  );
};
export default CommitteeMembers;
