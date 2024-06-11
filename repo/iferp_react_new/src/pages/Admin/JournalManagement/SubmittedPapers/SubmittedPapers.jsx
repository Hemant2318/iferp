import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import ExportButton from "components/Layout/ExportButton";
import FilterDropdown from "components/Layout/FilterDropdown";
import { icons, limit } from "utils/constants";
import { getStatus, objectToFormData } from "utils/helpers";
import {
  deleteJournalPaper,
  exportJournalPaper,
  fetchJournalPapers,
} from "store/slices";
import SubmittedPapersForm from "./SubmittedPapersFormV2";

const SubmittedPapers = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paperId, setPaperId] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    author_name: "",
    journal_name: "",
    journal_type: "",
    paper_id_or_title: "",
    membership_id_or_type: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
    membership_plan_id: "",
  });

  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getJournalPapers(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getJournalPapers(newData);
  };
  const handelChangeFilter = (val) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, membership_plan_id: val, offset: 0 };
    setFilterData(newData);
    getJournalPapers(newData);
  };
  const getJournalPapers = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchJournalPapers(forData));
    setTableList(response?.data?.papers || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    getJournalPapers({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRedirect = (paperId) => {
    navigate(
      `/${params?.memberType}/journal-management/submitted-papers/${paperId}`
    );
  };

  const header = [
    {
      isSearch: true,
      searchInputName: "author_name",
      title: "Author",
    },
    {
      isSearch: true,
      searchInputName: "membership_id_or_type",
      title: (
        <>
          <div>Member ID</div>
          <div>{"& Type"}</div>
        </>
      ),
    },
    {
      isSearch: true,
      searchInputName: "paper_id_or_title",
      title: "Paper ID & Paper Title",
    },
    {
      isSearch: true,
      searchInputName: "journal_name",
      title: "Journal Name",
    },
    {
      isSearch: true,
      searchInputName: "journal_type",
      title: "Journal Type",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: {
        options: [
          // { id: "0", name: "Pending" },
          // { id: "1", name: "Paper Submitted" },
          // { id: "2", name: "Plagiarized" },
          // { id: "3", name: "Reviewed" },
          // { id: "4", name: "Accepted" },
          // { id: "5", name: "Registration Done" },
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
            <div>{elem.membership}</div>
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
            <span className="color-new-car">{elem.paper_id}</span>
            {" - "}
            <span>{elem.title}</span>
          </span>
        ),
      },
      {
        value: elem.journalName,
      },
      {
        value: elem.journalType,
      },
      {
        value: getStatus(elem.status),
      },
      {
        value: (
          <span className="action-icon-buttons">
            {/* <Button
              btnStyle="light-outline"
              icon={<img src={icons.edit} alt="edit" />}
              className="me-2"
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
    rowData.push({ data: obj });
  });
  return (
    <Card className="cps-20 cpe-20 cpb-20">
      {paperId && (
        <DeletePopup
          id={paperId}
          onHide={() => {
            setPaperId(null);
          }}
          handelSuccess={() => {
            setIsLoading(true);
            setPaperId(null);
            getJournalPapers({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ paperid: paperId });
            const response = await dispatch(deleteJournalPaper(forData));
            return response;
          }}
        />
      )}
      {editData && (
        <SubmittedPapersForm
          editData={editData}
          onHide={() => {
            setEditData(null);
          }}
          handelSuccess={() => {
            setEditData(null);
            getJournalPapers({ ...filterData, ...searchPayload });
          }}
        />
      )}
      <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
        <div className="table-title">
          Submitted Papers ({filterData?.total})
        </div>
        <div className="d-flex">
          <ExportButton exportAPI={exportJournalPaper} />
          <div className="d-flex ms-3">
            <FilterDropdown
              list={membershipList}
              handelChangeFilter={handelChangeFilter}
            />
          </div>
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
