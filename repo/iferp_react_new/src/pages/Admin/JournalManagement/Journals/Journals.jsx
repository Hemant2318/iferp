import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Card from "components/Layout/Card";
import Button from "components/form/Button";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import { icons, journalsPath, limit } from "utils/constants";
import { combineArrayS3, objectToFormData } from "utils/helpers";
import { deleteJournal, fetchJournals } from "store/slices";
import AddJournal from "./AddJournal";

const Journals = () => {
  const dispatch = useDispatch();
  const [journalId, setJournalid] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddJournal, setAddJournal] = useState(false);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    journal_name: "",
    journal_type: "",
    issn: "",
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
    getJournals(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getJournals(newData);
  };
  const getJournals = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchJournals(forData));
    const newList = await combineArrayS3(
      response?.data?.users,
      "logo",
      journalsPath
    );
    setTableList(newList || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    getJournals({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      title: "Journal Name",
      searchInputName: "journal_name",
    },
    {
      isSearch: true,
      title: "Journal Type",
      searchInputName: "journal_type",
    },
    {
      isSearch: true,
      title: "ISSN",
      searchInputName: "issn",
    },
    {
      isSearch: false,
      title: "Journal Logo",
      searchLable: "",
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
        value: elem.name,
      },
      {
        value: elem.type,
      },
      {
        value: elem.issn,
      },
      {
        value: (
          <span>
            <img
              src={elem.s3File}
              alt="img"
              style={{ height: "96px", width: "96px" }}
              onError={(e) => {
                e.target.src = icons.noImage;
              }}
            />
          </span>
        ),
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
                setAddJournal(true);
              }}
              isSquare
            />
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              onClick={() => {
                setJournalid(elem.id);
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
      {journalId && (
        <DeletePopup
          id={journalId}
          onHide={() => {
            setJournalid(null);
          }}
          handelSuccess={() => {
            setIsLoading(true);
            setJournalid(null);
            getJournals({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ id: journalId });
            const response = await dispatch(deleteJournal(forData));
            return response;
          }}
        />
      )}
      {isAddJournal && (
        <AddJournal
          editData={editData}
          onHide={() => {
            setEditData(null);
            setAddJournal(false);
          }}
          handelSuccess={(isReload = false) => {
            setAddJournal(false);
            setEditData(null);
            if (filterData?.total < filterData?.limit || isReload) {
              setIsLoading(true);
              getJournals({ ...filterData, ...searchPayload });
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
        <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
          <div className="table-title">All Journals ({filterData.total})</div>
          <div className="d-flex">
            <Button
              onClick={() => {
                setAddJournal(!isAddJournal);
              }}
              text="+ Add Journal"
              btnStyle="primary-outline"
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
    </>
  );
};
export default Journals;
