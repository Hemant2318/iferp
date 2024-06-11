import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep, omit } from "lodash";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import ExportButton from "components/Layout/ExportButton";
import { limit, icons, reportPath } from "utils/constants";
import { downloadFile, generatePreSignedUrl, getStatus } from "utils/helpers";
import { deleteActivityReport, getInstituteActivityReport } from "store/slices";
import ActivityReportForm from "./ActivityReportForm";

const ActivityReport = () => {
  const dispatch = useDispatch();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [deleteID, setDeleteID] = useState("");
  const [editData, setEditData] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    status: "",
    event_name: "",
    institution_name: "",
    membership_id_or_type: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const fetchInstituteActivityReport = async (obj) => {
    let queryParams = new URLSearchParams(omit(obj, ["total"])).toString();
    const response = await dispatch(getInstituteActivityReport(queryParams));
    setTableList(response?.data?.activity_reports || {});
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
    fetchInstituteActivityReport(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchInstituteActivityReport(newData);
  };
  useEffect(() => {
    fetchInstituteActivityReport({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "institution_name",
      title: "Institution’s Name",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "name", value: "name" },
      searchInputName: "membership_id_or_type",
      title: (
        <div>
          <div className="text-nowrap">Member ID &</div>
          <div className="text-nowrap">Member Type</div>
        </div>
      ),
    },
    {
      isSearch: true,
      searchInputName: "event_name",
      title: "Event Name",
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
  tableList?.forEach((elem) => {
    let obj = [
      {
        value: elem.institution_name,
      },
      {
        value: elem.member_id_type,
      },
      {
        value: elem.event_name,
      },
      {
        value: getStatus(elem.status),
      },
      {
        value: (
          <span className="action-icon-buttons gap-2">
            <Button
              btnStyle="primary-light"
              text="View"
              className={`h-35 mw-80 text-14-500 ${
                elem?.report ? "" : "d-none"
              }`}
              onClick={async () => {
                let result = await generatePreSignedUrl(
                  elem.report,
                  reportPath
                );
                dispatch(downloadFile(result));
              }}
              isSquare
            />
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
                setDeleteID(elem.id);
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
      {deleteID && (
        <DeletePopup
          id={deleteID}
          title="Delete Activity Report"
          message="Are you sure you want to delete this report?"
          onHide={() => {
            setDeleteID(null);
          }}
          handelSuccess={() => {
            setDeleteID(null);
            fetchInstituteActivityReport({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            const response = await dispatch(deleteActivityReport(deleteID));
            return response;
          }}
        />
      )}
      {editData && (
        <ActivityReportForm
          onHide={() => {
            setEditData(null);
          }}
          editData={editData}
          handelSuccess={(statusValue) => {
            let oldData = cloneDeep(tableList);
            oldData = oldData.map((elm) => {
              return {
                ...elm,
                status: elm.id === editData.id ? statusValue : elm.status,
              };
            });
            setTableList(oldData);
            setEditData(null);
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
          <div className="table-title">Institutions ({filterData.total})</div>
          <div className="d-flex">
            <ExportButton
              exportAPI={getInstituteActivityReport}
              payload="export_status=1"
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
export default ActivityReport;
