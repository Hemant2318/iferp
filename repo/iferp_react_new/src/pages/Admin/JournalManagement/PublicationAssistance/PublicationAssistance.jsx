import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import ExportButton from "components/Layout/ExportButton";
import { fetchPublicationAssistance } from "store/slices";
import {
  downloadFile,
  generatePreSignedUrl,
  objectToFormData,
} from "utils/helpers";
import {
  icons,
  asistanceType,
  journalType,
  limit,
  publicationAssistancePath,
} from "utils/constants";

const PublicationAssistance = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [pId, setPId] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    member_id: "",
    journal_type: "",
    assistance_type: "",
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
    getData(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getData(newData);
  };
  const getData = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchPublicationAssistance(forData));
    setTableList(response?.data?.details || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    getData({ ...filterData, ...searchPayload });
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
      dropdownOptions: { options: asistanceType, key: "id", value: "value" },
      searchInputName: "assistance_type",
      title: "Assistance Type",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: journalType, key: "value", value: "value" },
      searchInputName: "journal_type",
      title: "Journal Type",
    },
    {
      isSearch: false,
      searchInputName: "Document",
      title: "Document",
    },
    {
      isSearch: false,
      searchLable: "Delete",
      title: "Action",
    },
  ];
  const rowData = [];

  tableList.forEach((elem) => {
    const aType = elem.assistance_type
      .replace(/ - \$ /g, "")
      .replace(/[0-9]/g, "")
      .replace(",", ", ");

    let obj = [
      {
        value: <span className="text-14-500 color-new-car">{elem.name}</span>,
      },
      {
        value: elem.member_id,
      },
      {
        value: aType,
      },
      {
        value: elem.journal_type,
      },
      {
        value: (
          <div
            className="color-new-car pointer text-14-400"
            onClick={async (e) => {
              e.preventDefault();
              if (elem.file) {
                let downloadFileURL = await generatePreSignedUrl(
                  elem.file,
                  publicationAssistancePath
                );
                dispatch(downloadFile(downloadFileURL));
              }
            }}
          >
            Download
          </div>
        ),
      },
      {
        value: (
          <span className="action-icon-buttons">
            <Button
              btnStyle="light-outline"
              icon={
                <img src={icons.deleteIcon} alt="delete" className="me-1" />
              }
              text="Delete"
              onClick={() => {
                setPId(elem.id);
              }}
              className="mw-80 ps-3 pe-3"
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
      {pId && (
        <DeletePopup
          id={pId}
          onHide={() => {
            setPId(null);
          }}
          handelSuccess={() => {
            setIsLoading(true);
            setPId(null);
            getData({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({
              id: pId,
              delete_status: 1,
            });
            const response = await dispatch(
              fetchPublicationAssistance(forData)
            );
            return response;
          }}
        />
      )}

      <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
        <div className="table-title">
          Publication Assistance ({filterData?.total})
        </div>
        <div className="d-flex">
          <ExportButton
            exportAPI={fetchPublicationAssistance}
            payload={objectToFormData({ export_status: 1 })}
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
  );
};
export default PublicationAssistance;
