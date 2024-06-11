import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import { icons, limit } from "utils/constants";
import { deleteEventParticipants, getEventParticipants } from "store/slices";
import { objectToFormData, titleCaseString } from "utils/helpers";
import { useParams } from "react-router-dom";
import Button from "components/form/Button/Button";
import ParticipantsForm from "./ParticipantsForm";
import DeletePopup from "components/Layout/DeletePopup/DeletePopup";
import AbstractSubmission from "./AbstractSubmission";

const Participants = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { eventId } = params;
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [abstractData, setAbstractData] = useState(null);
  const [userID, setUserID] = useState("");
  const [oldData, setOldData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdd, setIsAdd] = useState(false);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    email_id: "",
    member_id: "",
    phone_number: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
    event_id: eventId,
  });
  const getParticipants = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(getEventParticipants(forData));
    setTableList(response?.data?.events_registered_members || []);
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
    getParticipants(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getParticipants(newData);
  };
  useEffect(() => {
    getParticipants({ ...filterData, ...searchPayload });
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
      searchInputName: "join_as",
      title: "Join As",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "id", value: "name" },
      searchInputName: "member_id",
      title: "Membership Type",
    },
    {
      isSearch: true,
      searchInputName: "email_id",
      title: "Email ID",
    },
    {
      isSearch: true,
      searchInputName: "phone_number",
      title: "Phone Number",
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
        value: elem?.name,
      },
      {
        value: titleCaseString(elem?.join_as),
      },
      {
        value: elem.member_type,
      },
      {
        value: elem.email_id,
      },
      {
        value: elem.phone_number,
      },
      {
        value: (
          <>
            <span
              className={
                elem.user_id && elem.join_as === "presenter" ? "" : "d-none"
              }
            >
              <Button
                btnStyle="primary-dark"
                text="Submit Abstarct"
                className="me-2 h-35 text-14-400 text-nowrap"
                onClick={() => {
                  setAbstractData(elem);
                }}
              />
            </span>
            <span className="action-icon-buttons mt-2">
              <Button
                btnStyle="light-outline"
                icon={<img src={icons.edit} alt="edit" />}
                className="me-2"
                onClick={() => {
                  setOldData(elem);
                  setIsAdd(true);
                }}
                isSquare
              />
              <Button
                btnStyle="light-outline"
                icon={<img src={icons.deleteIcon} alt="delete" />}
                onClick={() => {
                  setUserID(elem?.id);
                }}
                isSquare
              />
            </span>
          </>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <>
      {isAdd && (
        <ParticipantsForm
          oldData={oldData}
          onHide={() => {
            setIsAdd(false);
            setOldData(null);
          }}
          getParticipants={() => {
            getParticipants({ ...filterData, ...searchPayload });
            setOldData(null);
          }}
        />
      )}
      {userID && (
        <DeletePopup
          onHide={() => {
            setUserID(null);
          }}
          handelSuccess={() => {
            setUserID(null);
            getParticipants({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ id: userID });
            const response = await dispatch(deleteEventParticipants(forData));
            return response;
          }}
        />
      )}
      {abstractData && (
        <AbstractSubmission
          eventId={eventId}
          data={abstractData}
          onHide={() => {
            setAbstractData(null);
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20 mt-3">
        <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
          <div className="table-title">
            All Participants ({filterData?.total})
          </div>
          <div className="d-flex gap-2">
            <ExportButton
              exportAPI={getEventParticipants}
              payload={objectToFormData({
                event_id: eventId,
                export_status: 1,
              })}
            />
            <Button
              isSquare
              text="+ Add Participants"
              btnStyle="primary-outline"
              className="h-35 text-14-500 text-nowrap"
              onClick={() => {
                setIsAdd(true);
              }}
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
export default Participants;
