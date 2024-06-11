import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Table from "components/Layout/Table";
import Button from "components/form/Button";
import UploadCertificate from "components/form/UploadCertificate/UploadCertificate";
import Card from "components/Layout/Card";
import FilterDropdown from "components/Layout/FilterDropdown";
import { getActivityReport, uploadActivityReport } from "store/slices";
import {
  downloadFile,
  generatePreSignedUrl,
  getYearList,
  objectToFormData,
} from "utils/helpers";
import Dropdown from "components/form/Dropdown";
import { reportPath } from "utils/constants";

const ActivityReports = () => {
  const dispatch = useDispatch();
  const [docId, setDocId] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [tableLoading, setTableLoading] = useState([]);
  const [filter, setFilter] = useState({ year: "2023", event_type: "" });

  const fetchActivityReport = async (obj) => {
    let queryParams = new URLSearchParams(obj).toString();
    const response = await dispatch(getActivityReport(queryParams));
    setTableList(response?.data || []);
    setTableLoading(false);
  };
  useEffect(() => {
    fetchActivityReport(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: false,
      title: "Event Name",
    },
    {
      isSearch: false,
      title: "Report",
    },
    {
      isSearch: false,
      title: "Status",
    },
    {
      isSearch: false,
      title: "Action",
    },
  ];
  const rowData = [];
  tableList.forEach((elem) => {
    let obj = [
      {
        value: elem.event_name,
      },
      {
        value: (
          <div className="center-flex text-nowrap">
            <Button
              btnStyle={elem.report ? "primary-light" : "primary-outline"}
              icon={<i className="bi bi-upload me-2 text-14-500" />}
              text={elem.report ? "Re-Upload" : "Upload"}
              className={
                elem.report
                  ? "h-35 text-14-500"
                  : "h-35 text-14-500 cps-22 cpe-22"
              }
              onClick={() => {
                setDocId(elem);
              }}
              isSquare
            />
          </div>
        ),
      },
      {
        value: elem.status,
      },
      {
        value: elem.report ? (
          <div className="center-flex gap-3">
            <Button
              btnStyle="primary-dark"
              text="View"
              className="h-35 text-14-500"
              onClick={async () => {
                let result = await generatePreSignedUrl(
                  elem.report,
                  reportPath
                );
                dispatch(downloadFile(result));
              }}
              isSquare
            />
          </div>
        ) : (
          "-"
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <Card className="cps-34 cpe-34 cpb-20 cpt-26">
      {docId && (
        <UploadCertificate
          isSingle={true}
          title="Activity Report"
          oldData={docId?.report ? [{ id: "", certificate: docId.report }] : []}
          onHide={() => {
            setDocId(null);
          }}
          handelSuccess={() => {
            fetchActivityReport();
            setDocId(null);
          }}
          onSave={async (certificateList) => {
            let forData = objectToFormData({
              id: docId.id,
              report: certificateList[0].certificate,
            });
            const response = await dispatch(uploadActivityReport(forData));
            return response;
          }}
        />
      )}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="table-title">Our Event Reports</div>
        <div className="d-flex gap-3">
          <div>
            <Dropdown
              options={getYearList(10).map((o) => {
                return { ...o, name: o.id };
              })}
              optionValue="name"
              onChange={(e) => {
                const newData = { ...filter, year: e.target.value };
                setFilter(newData);
                fetchActivityReport(newData);
              }}
              value={filter?.year}
              placeholder="Year"
            />
          </div>
          <div className="d-flex">
            <FilterDropdown
              className="h-45"
              list={[
                { id: "iferp_events", name: "IFERP Events" },
                { id: "self_driven_events", name: "Self Driven Events" },
              ]}
              handelChangeFilter={(e) => {
                const value =
                  e === "iferp_events,self_driven_events" ||
                  e === "self_driven_events,iferp_events"
                    ? ""
                    : e;
                const newData = { ...filter, event_type: value };
                setFilter(newData);
                fetchActivityReport(newData);
              }}
              isHideAll
            />
          </div>
        </div>
      </div>
      <Table isLoading={tableLoading} header={header} rowData={rowData} />
    </Card>
  );
};
export default ActivityReports;
