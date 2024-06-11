import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import ExportButton from "components/Layout/ExportButton";
import FilterDropdown from "components/Layout/FilterDropdown";
import { limit, icons } from "utils/constants";
import { objectToFormData } from "utils/helpers";
import {
  deleteMembers,
  exportChapterMembers,
  fetchChapterMembers,
} from "store/slices";
import AddMember from "./AddMember";

const ChapterMembers = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [tableLoader, setTableLoader] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    member_id: "",
    member_type: "",
    email: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
    membership_plan_id: "",
    id: params?.chapterId,
  });
  const getChapterMembers = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchChapterMembers(forData));
    setTableList(response?.data?.chapterMembers || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setTableLoader(false);
  };
  const handelChangeFilter = (val) => {
    setTableLoader(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, membership_plan_id: val, offset: 0 };
    setFilterData(newData);
    getChapterMembers(newData);
  };
  const handelChangeSearch = (searchData) => {
    setTableLoader(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getChapterMembers(newData);
  };
  const handelChangePagination = (offset) => {
    setTableLoader(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getChapterMembers(newData);
  };

  useEffect(() => {
    getChapterMembers({ ...filterData, ...searchPayload });
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
      searchInputName: "member_id",
      title: "Member ID",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "name", value: "name" },
      searchInputName: "member_type",
      title: "Member Type",
    },
    {
      isSearch: true,
      searchInputName: "email",
      title: "Email ID",
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
        value: `${elem.firstName} ${elem.lastName}`,
      },
      {
        value: elem.memberId,
      },
      {
        value: elem.memberType,
      },

      {
        value: elem.emailId,
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
              }}
              isSquare
            />
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              onClick={() => {
                setDeleteId(elem.id);
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
      {deleteId && (
        <DeletePopup
          id={deleteId}
          onHide={() => {
            setDeleteId(null);
          }}
          handelSuccess={() => {
            setDeleteId(null);
            getChapterMembers({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ userid: deleteId });
            const response = await dispatch(deleteMembers(forData));
            return response;
          }}
        />
      )}
      {editData && (
        <AddMember
          editData={editData}
          onHide={() => {
            setEditData(null);
          }}
          handelSuccess={(isReload = false) => {
            setEditData(null);
            if (filterData?.total < filterData?.limit || isReload) {
              getChapterMembers({ ...filterData, ...searchPayload });
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
      <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
        <div className="text-18-400 color-black-olive">
          All Members ({filterData.total})
        </div>
        <div className="d-flex">
          <ExportButton
            exportAPI={exportChapterMembers}
            payload={objectToFormData({ id: params?.chapterId })}
          />
          <div className="d-flex ms-2">
            <FilterDropdown
              list={membershipList}
              handelChangeFilter={handelChangeFilter}
            />
          </div>
        </div>
      </div>
      <Table
        isLoading={tableLoader}
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
export default ChapterMembers;
