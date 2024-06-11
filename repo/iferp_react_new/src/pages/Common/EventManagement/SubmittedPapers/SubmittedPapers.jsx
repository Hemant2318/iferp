import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import Button from "components/form/Button";
import { icons } from "utils/constants";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import FilterDropdown from "components/Layout/FilterDropdown";
import DeletePopup from "components/Layout/DeletePopup";
import { limit } from "utils/constants";
import { getStatus, objectToFormData } from "utils/helpers";
import {
  deleteSubmittedAbstract,
  exportSubmittedAbstracts,
  fetchSubmittedAbstracts,
} from "store/slices";
import SubmittedPapersForm from "./SubmittedPapersForm";

const SubmittedPapers = ({ eventId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { memberType, moduleType } = params;
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [paperId, setPaperId] = useState(null);
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
    event_id: eventId || "",
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

  const handleRedirect = (paperId) => {
    let newModuleType = "";

    if (!moduleType && window.location.pathname.includes("my-profile")) {
      newModuleType = "my-profile";
    } else {
      newModuleType = moduleType;
    }
    navigate(`/${memberType}/${newModuleType}/submitted-papers/${paperId}`);
  };
  let header = [
    {
      isSearch: true,
      searchInputName: "author_name",
      title: "Author",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "name", value: "name" },
      searchInputName: "member_id_or_type",
      title: (
        <>
          <div>Member ID</div>
          <div>{"& Type"}</div>
        </>
      ),
    },
    {
      isSearch: true,
      searchInputName: "abstract_id_or_title",
      title: "Paper ID & Paper Title",
    },
    {
      isSearch: true,
      searchInputName: "conference",
      title: "Conference Name",
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
      searchLable: "View/Delete",
      title: "Action",
    },
  ];
  if (eventId) {
    header = header.filter((_, i) => i !== 3);
  }
  const rowData = [];
  tableList.forEach((elem) => {
    let obj = [
      {
        value: (
          <span className="text-14-500 color-new-car">{elem.authorName}</span>
        ),
      },
      {
        value: (
          <span>
            <div>{elem.memberId}</div>
            <div>{elem.membershipCategory}</div>
          </span>
        ),
      },
      {
        value: (
          <span
            onClick={() => {
              handleRedirect(elem.id);
            }}
            className="pointer"
          >
            <span className="color-new-car">{elem.paperId}</span>
            {" - "}
            <span>{elem.paperTitle}</span>
          </span>
        ),
      },
      {
        value: elem.conference,
      },
      {
        value: getStatus(elem.submitted_status),
      },
      {
        value: (
          <span className="action-icon-buttons gap-2">
            {/* <Button
              btnStyle="light-outline"
              icon={<img src={icons.edit} alt="edit" />}
              onClick={() => {
                setEditData(elem);
              }}
              isSquare
            /> */}
            <Button
              text="View"
              onClick={() => {
                handleRedirect(elem.id);
              }}
              btnStyle="primary-light"
              className="text-14-500 mw-70 me-2"
              isSquare
            />

            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              onClick={() => {
                setPaperId(elem.id);
              }}
              isSquare
            />
          </span>
        ),
      },
    ];
    if (eventId) {
      obj = obj.filter((_, i) => i !== 3);
    }
    rowData.push({ data: obj });
  });
  const access = {
    isFilter: !window.location.pathname.includes("my-projects"),
  };
  return (
    <Card className="cps-20 cpe-20 cpb-20">
      {editData && (
        <SubmittedPapersForm
          onHide={() => {
            setEditData(null);
          }}
          handelSuccess={() => {
            setEditData(null);
            getEventAbstarcts({ ...filterData, ...searchPayload });
          }}
          editData={editData}
        />
      )}
      {paperId && (
        <DeletePopup
          id={paperId}
          onHide={() => {
            setPaperId(null);
          }}
          handelSuccess={() => {
            setIsLoading(true);
            setPaperId(null);
            getEventAbstarcts({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ id: paperId });
            const response = await dispatch(deleteSubmittedAbstract(forData));
            return response;
          }}
        />
      )}

      <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28 flex-wrap gap-2">
        <div className="table-title">
          Submitted Abstracts ({filterData?.total})
        </div>
        <div className="d-flex">
          <ExportButton
            exportAPI={exportSubmittedAbstracts}
            payload={eventId ? objectToFormData({ event_id: eventId }) : ""}
          />
          {access?.isFilter && (
            <div className="d-flex ms-3">
              <FilterDropdown
                list={membershipList}
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
