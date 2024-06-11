import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import { journalType, limit } from "utils/constants";
import { getStatus, objectToFormData } from "utils/helpers";
import { exportJournalPaper, fetchJournalPapers } from "store/slices";
import FilterDropdown from "components/Layout/FilterDropdown";

const SubmittedPapers = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    membership_id_or_type: "",
    paper_id_or_title: "",
    journal_name: "",
    journal_type: "",
    author_name: "",
    status: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
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
      title: "Author Name",
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
      isSearch: false,
      searchInputName: "Status",
      title: "Status",
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
    ];
    rowData.push({ data: obj });
  });

  return (
    <Card className="cps-20 cpe-20 cpb-20">
      <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
        <div className="table-title">Submitted Papers</div>
        <div className="d-flex">
          <ExportButton exportAPI={exportJournalPaper} />
          <div className="d-flex ms-3">
            <FilterDropdown
              list={journalType.map((o) => ({ id: o.value, name: o.value }))}
              handelChangeFilter={(e) => {
                console.log(e);
                handelChangeSearch({ ...searchPayload, journal_type: e });
              }}
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
