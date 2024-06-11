import DeletePopup from "components/Layout/DeletePopup";
import TableV2 from "components/Layout/TableV2/TableV2";
import Button from "components/form/Button";
import moment from "moment";
import ProfileDetail from "pages/Common/ProfileManagement/ProfileDetail";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteMentor,
  getAllMentorsList,
  setSingleMentorProfileData,
} from "store/slices";
import {
  addToLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const AllMentors = () => {
  const [isDeatils, setDeatils] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mentorId, setMentorId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    mentor_name: "",
    mentor_id: "",
    membership_type: "",
    email: "",
    becom_mentor: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });
  const [mentorDataUpadate, setMentorDataUpadate] = useState(true);

  const fetchAllMentors = async (obj) => {
    setIsLoading(true);
    const formData = objectToFormData(obj);
    const response = await dispatch(getAllMentorsList(formData));
    let resList = [];
    let resResultCount = 0;
    if (response?.status === 200 && response?.data?.result_data) {
      resList = response?.data?.result_data || [];
      resResultCount = response?.data?.result_count || 0;
      // setTableData(response?.data || []);
      // setIsLoading(false);
    }
    // console.log("response-resList", resList);
    setTableData(resList);
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
    setFilterData(newData);
    fetchAllMentors(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchAllMentors(newData);
  };
  useEffect(() => {
    fetchAllMentors({ ...searchPayload, ...filterData });
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
      searchInputName: "email",
      title: "Email ID",
    },
    {
      isSearch: true,
      searchInputName: "total_session",
      title: <div className="text-nowrap">Total Sessions</div>,
    },
    {
      isSearch: true,
      isDatePicker: true,
      searchInputName: "becom_mentor",
      title: <div className="text-nowrap">Became Mentor On</div>,
    },

    {
      isSearch: false,
      searchLable: "View",
      title: "View",
    },
  ];

  const rowData = [];
  tableData?.forEach((elem) => {
    const {
      name,
      mentor_id,
      membership_type,
      email_id,
      total_session,
      become_mentor,
    } = elem;
    let obj = [
      {
        value: (
          <span
            className="color-new-car pointer "
            onClick={() => {
              setDeatils(true);
              setUserDetail(mentor_id);
            }}
          >
            {`${titleCaseString(name)}`}
            {/* <div className="text-14-500 text-nowrap">{titleCaseString(name)}</div> */}
          </span>
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
        value: <div className="text-nowrap">{email_id}</div>,
      },
      {
        value: total_session,
      },
      {
        value: (
          <div className="text-nowrap">
            {moment(become_mentor).format("DD MMM YYYY")}
          </div>
        ),
      },
      {
        value: (
          <span className="action-icon-buttons">
            <Button
              text="View"
              btnStyle="light-blue-outline"
              className="text-14-500 mw-70 me-2"
              isSquare
              onClick={() => {
                dispatch(setSingleMentorProfileData(elem));
                addToLocalStorage("setViewName", elem);
                navigate(`/admin/mentorship-management/details/${mentor_id}`);
              }}
            />

            {/* <Button
              btnStyle="light-blue-outline"
              icon={<img src={icons.outline_delete} alt="delete" />}
              isSquare
              onClick={() => {
                setMentorId(mentor_id);
              }}
            /> */}
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });

  return (
    <div id="all-mentors-container">
      {mentorId && (
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
      )}
      <div className="text-16-500 color-text-navy mt-4 cmb-10 cps-10">
        All Mentors ({filterData?.total})
      </div>
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
      {isDeatils && (
        <ProfileDetail
          userID={userDetail}
          onHide={() => {
            setDeatils(false);
          }}
        />
      )}
    </div>
  );
};

export default AllMentors;
