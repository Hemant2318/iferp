import moment from "moment";
import React, { useEffect, useState } from "react";
import Button from "components/form/Button";
import { objectToFormData, titleCaseString } from "utils/helpers";
import { icons } from "utils/constants";
import TableV2 from "components/Layout/TableV2";
import EditStatusPopup from "../EditStatusPopup";
import {
  getsessionApprovalsList,
  mentorSessionDetails,
  sessionAcceptReject,
  setMySessionData,
} from "store/slices";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
function SessionApprovals() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isFeedback, setIsFeedback] = useState(false);
  const [sessionList, setSessionList] = useState();
  const [sessionEditData, setSessionEditData] = useState();
  const [sessionDataUpadate, setSessionDataUpadate] = useState(true);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    mentor_id: "",
    membership_type: "",
    added_on: "",
    session_name: "",
    status: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });
  const fetchSessionApprovalsList = async (obj) => {
    setIsLoading(true);
    let formData = objectToFormData(obj);
    const response = await dispatch(getsessionApprovalsList(formData));
    let resList = [];
    let resResultCount = 0;
    if (response?.data?.session_list) {
      resList = response?.data?.session_list || [];
      resResultCount = response?.data?.result_count || 0;
      // setSessionList(response?.data?.session_list || []);
    }
    setSessionList(resList);
    setFilterData({
      ...obj,
      total: resResultCount,
    });
    window.scrollTo(0, 0);
    setIsLoading(false);
  };
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    // let oldData = { ...searchData };
    setFilterData(newData);
    fetchSessionApprovalsList(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchSessionApprovalsList(newData);
  };
  useEffect(() => {
    fetchSessionApprovalsList({ ...searchPayload, ...filterData });
    setSessionDataUpadate(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionDataUpadate]);

  const upDateSessionDetails = async (sesisonId, mentorId) => {
    const response = await dispatch(
      mentorSessionDetails(
        objectToFormData({ id: sesisonId, mentor_id: mentorId })
      )
    );
    if (response?.status === 200) {
      dispatch(setMySessionData(response?.data));
      navigate(`/professional/mentorship/mentor/update-session-details`);
      // console.log("response", response?.data);
    }
  };
  const header = [
    {
      isSearch: true,
      searchInputName: "mentor_name",
      title: <div className="text-nowrap">Mentor Name</div>,
    },
    {
      isSearch: true,
      searchInputName: "mentor_id",
      title: <div className="text-nowrap">Mentor ID</div>,
    },
    {
      isSearch: true,
      searchInputName: "membership_type",
      title: "Membership Type",
    },
    {
      isSearch: true,
      searchInputName: "session_name",
      title: "Session Name",
    },
    {
      isSearch: true,
      isDatePicker: true,
      searchInputName: "added_on",
      title: "Added On",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: {
        options: [
          { id: "0", label: "Pending" },
          { id: "1", label: "Approved" },
          { id: "2", label: "Rejected" },
        ],
        key: "id",
        value: "label",
      },
      searchInputName: "status",
      title: <div className="text-nowrap">Status</div>,
    },
    {
      isSearch: false,
      searchLable: "View/Delete",
      title: "Approve / Edit / Reject",
    },
  ];
  const rowData = [];
  sessionList?.forEach((elem) => {
    const {
      id,
      name,
      mentor_id,
      status,
      membership_type,
      session_name,
      added_on,
    } = elem;
    let obj = [
      {
        value: (
          <div className="text-14-500 text-nowrap">{titleCaseString(name)}</div>
        ),
      },
      {
        value: mentor_id,
      },
      {
        value: (
          <div className="text-nowrap">{titleCaseString(membership_type)}</div>
        ),
      },
      {
        value: (
          <div className="text-nowrap">{titleCaseString(session_name)}</div>
        ),
      },
      {
        value: (
          <div className="text-nowrap">
            {moment(added_on).format("DD MMM YYYY")}
          </div>
        ),
      },
      {
        value: <div className="text-nowrap">{titleCaseString(status)}</div>,
      },
      {
        value: (
          <span className="action-icon-buttons">
            {status === "Pending" && (
              <Button
                text="Approve"
                btnStyle="mentor-approve-btn"
                className="text-14-500 mw-70"
                isSquare
                onClick={async () => {
                  let formData = objectToFormData({
                    session_id: id,
                    status: 1,
                  });
                  const response = await dispatch(
                    sessionAcceptReject(formData)
                  );
                  if (response?.status === 200) {
                    fetchSessionApprovalsList();
                  }
                  return response;
                }}
              />
            )}
            {status === "Approved" && (
              <Button
                text="Edit"
                btnStyle="approved-mentor-approve-btn "
                className="text-14-500 mw-70"
                isSquare
                icon={<img src={icons.edit} alt="edit" className="me-2" />}
                onClick={() => {
                  setSessionEditData(elem);
                  setIsFeedback(true);
                }}
              />
            )}
            {/* {status === "Rejected" && ( */}
            <Button
              text="View"
              btnStyle="color-dark-navy-blue"
              className="text-14-500 mw-70 me-2"
              isSquare
              // onClick={() => {
              //   setMentorId(mentor_id);
              // }}
              onClick={() => {
                upDateSessionDetails(id, mentor_id);
              }}
            />
            {/* )} */}
          </span>
        ),
      },
    ];
    rowData?.push({ data: obj });
  });
  return (
    <div id="all-mentors-container">
      {isFeedback && (
        <EditStatusPopup
          sessionEditData={sessionEditData}
          setIsFeedback={setIsFeedback}
          setSessionDataUpadate={setSessionDataUpadate}
        />
      )}
      <div className="overflow-auto">
        <TableV2
          isLoading={isLoading}
          header={header}
          rowData={rowData}
          filterData={filterData}
          searchPayload={searchPayload}
          searchInputChange={handelChangeSearch}
          changeOffset={handelChangePagination}
        />
      </div>
    </div>
  );
}

export default SessionApprovals;
