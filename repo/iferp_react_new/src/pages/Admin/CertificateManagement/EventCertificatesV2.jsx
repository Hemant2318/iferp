// EventCertificatesV2
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "components/form/Button";
import ExportButton from "components/Layout/ExportButton";
import UploadCertificate from "components/form/UploadCertificate";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import {
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import { limit, icons } from "utils/constants";
import {
  editEventCertificate,
  exportEventsCertificate,
  fetchEventsRegisteredMembers,
} from "store/slices";
import { useNavigate } from "react-router-dom";

const EventCertificatesV2 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { membershipList, eventTypeList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
    eventTypeList: state.global.eventTypeList,
  }));
  const [docId, setDocId] = useState(null);
  const [id, setId] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    event_type: "",
    event_name: "",
    participatedAs: "",
    membership_id_or_type: "",
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
    getProfiles(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getProfiles(newData);
  };
  const getProfiles = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchEventsRegisteredMembers(forData));
    setTableList(response?.data?.registeredMembers || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  useEffect(() => {
    if (["0", "6"].includes(getDataFromLocalStorage("user_type"))) {
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
      isSearchDropdown: true,
      dropdownOptions: { options: eventTypeList, key: "id", value: "name" },
      searchInputName: "event_type",
      title: "Event Type",
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
        options: [{ value: "Listener" }, { value: "Presenter" }],
        key: "value",
        value: "value",
      },
      searchInputName: "participatedAs",
      title: "Participated As",
    },
    {
      isSearch: false,
      searchLable: "Edit/Delete",
      title: "Action",
    },
  ];
  const rowData = [];
  tableList.forEach((elem, index) => {
    let obj = [
      {
        value: `${elem.firstName} ${elem.lastName}`,
      },
      {
        value: (
          <span>
            <div>{elem.memberId}</div>
            <div>{elem.memberType}</div>
          </span>
        ),
      },
      {
        value: elem.eventType,
      },
      {
        value: elem.eventName,
      },
      {
        value: titleCaseString(elem.participatedAs),
      },
      {
        value:
          elem?.certificates.length === 0 ? (
            <Button
              onClick={() => {
                setDocId({ event_id: elem.eventId, user_id: elem.id });
              }}
              btnStyle="primary-light"
              icon={
                <img
                  src={icons.imageUpload}
                  alt="edit"
                  className="h-21 me-2 primary-image"
                />
              }
              className="me-2 text-14-500"
              text="Upload"
              isSquare
            />
          ) : (
            <span className="action-icon-buttons">
              <Button
                btnStyle="light-outline"
                icon={<img src={icons.edit} alt="edit" />}
                onClick={() => {
                  setDocId({
                    event_id: elem.eventId,
                    user_id: elem.id,
                    oldData: elem.certificates,
                  });
                }}
                className="me-2"
                isSquare
              />
              <Button
                btnStyle="light-outline"
                icon={<img src={icons.deleteIcon} alt="delete" />}
                onClick={() => {
                  setId({ event_id: elem.eventId, user_id: elem.id });
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
    <div>
      {id && (
        <DeletePopup
          title="Delete Certificate"
          message="Are you sure you want to delete the certificate from this record?"
          onHide={() => {
            setId(null);
          }}
          handelSuccess={() => {
            setId(null);
            getProfiles({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({
              ...id,
              certificate: JSON.stringify([]),
            });
            const response = await dispatch(editEventCertificate(forData));
            return response;
          }}
        />
      )}
      {docId && (
        <UploadCertificate
          oldData={docId.oldData || []}
          onHide={() => {
            setDocId(null);
          }}
          handelSuccess={() => {
            setDocId(null);
            getProfiles({ ...filterData, ...searchPayload });
          }}
          onSave={async (certificateList) => {
            let forData = objectToFormData({
              ...docId,
              certificate: JSON.stringify(certificateList),
            });
            const response = await dispatch(editEventCertificate(forData));
            return response;
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
          <div className="table-title">
            All Participants ({filterData?.total})
          </div>
          <div className="d-flex">
            <ExportButton
              exportAPI={exportEventsCertificate}
              payload={objectToFormData({ type: 2 })}
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
    </div>
  );
};
export default EventCertificatesV2;
