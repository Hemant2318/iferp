import moment from "moment";
import React, { useEffect, useState } from "react";
import Button from "components/form/Button";
import { useDispatch } from "react-redux";
import {
  getmentorApprovalsList,
  mentorAcceptReject,
  setRProfileID,
} from "store/slices";
import { objectToFormData, titleCaseString } from "utils/helpers";
import { icons } from "utils/constants";
import TableV2 from "components/Layout/TableV2";
import EditStatusPopup from "../EditStatusPopup";

function MentorApprovals() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [mentorList, setMentorList] = useState([]);
  const [isFeedback, setIsFeedback] = useState(false);
  const [mentorDataUpadate, setMentorDataUpadate] = useState(true);
  const [mentorEditData, setMentorEditData] = useState();
  const [searchPayload, setSearchPayload] = useState({
    mentor_name: "",
    membership_type: "",
    mentor_id: "",
    name: "",
    set_on: "",
    status: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });
  const fetchMentorApprovalsList = async (obj) => {
    setIsLoading(true);
    let formData = objectToFormData(obj);
    const response = await dispatch(getmentorApprovalsList(formData));
    let resList = [];
    let resResultCount = 0;
    if (response?.data?.session_list) {
      resList = response?.data?.session_list || [];
      resResultCount = response?.data?.result_count || 0;
      // setMentorList(response?.data?.session_list || []);
    }
    setMentorList(resList);
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
    fetchMentorApprovalsList(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchMentorApprovalsList(newData);
  };
  useEffect(() => {
    fetchMentorApprovalsList({ ...searchPayload, ...filterData });
    setMentorDataUpadate(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorDataUpadate]);

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
      isDatePicker: true,
      searchInputName: "set_on",
      title: "Sent On",
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
  mentorList?.forEach((elem) => {
    const { name, mentor_id, status, membership_type, set_on } = elem;
    let obj = [
      {
        value: (
          <div
            className="text-14-500 text-nowrap pointer"
            onClick={() => {
              dispatch(setRProfileID(mentor_id));
            }}
          >
            {titleCaseString(name)}
          </div>
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
          <div className="text-nowrap">
            {moment(set_on).format("DD MMM YYYY")}
          </div>
        ),
      },
      {
        value: <div className="text-nowrap">{titleCaseString(status)}</div>,
      },
      {
        value: (
          <span className="action-icon-buttons">
            {status !== "Approved" && status !== "Rejected" ? (
              <>
                <Button
                  text="Approve"
                  btnStyle="mentor-approve-btn"
                  className="text-14-500 mw-70 me-2 "
                  isSquare
                  onClick={async () => {
                    let formData = objectToFormData({
                      mentor_id: mentor_id,
                      status: 1,
                    });
                    const response = await dispatch(
                      mentorAcceptReject(formData)
                    );
                    if (response?.status === 200) {
                      fetchMentorApprovalsList();
                    }
                    return response;
                  }}
                />
                <Button
                  text="Reject"
                  btnStyle="reject-mentor-approve-btn"
                  className="text-14-500 mw-70 me-2"
                  isSquare
                  // icon={<img src={icons.outline_delete} alt="delete" />}
                  onClick={async () => {
                    let formData = objectToFormData({
                      mentor_id: mentor_id,
                      status: 2,
                    });
                    const response = await dispatch(
                      mentorAcceptReject(formData)
                    );
                    if (response?.status === 200) {
                      fetchMentorApprovalsList();
                    }
                    return response;
                  }}
                />
              </>
            ) : (
              <Button
                text="Edit Status"
                btnStyle="approved-mentor-approve-btn"
                className="text-14-500 mw-115 me-2"
                isSquare
                icon={<img src={icons.edit} alt="edit" className="me-2" />}
                onClick={() => {
                  setMentorEditData(elem);
                  setIsFeedback(true);
                }}
              />
            )}
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <div id="all-mentors-container">
      {/* {mentorId && (
        <DeletePopup
          onHide={() => {
            setMentorId(null);
          }}
          handelSuccess={() => {
            setMentorId(null);
            fetchAllMentors(searchPayload);
          }}
          handelDelete={async () => {
            let formData = objectToFormData({ mentor_id: mentorId });
            const response = await dispatch(deleteMentor(formData));
            return response;
          }}
        />
      )} */}
      {/* <div className="text-16-500 color-text-navy mt-4 cmb-10 cps-10">
        All Mentors ({tableData?.result_count})
      </div> */}
      {isFeedback && (
        <EditStatusPopup
          setIsFeedback={setIsFeedback}
          mentorEditData={mentorEditData}
          setMentorDataUpadate={setMentorDataUpadate}
        />
      )}
      <div className="overflow-auto w-100">
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

export default MentorApprovals;
