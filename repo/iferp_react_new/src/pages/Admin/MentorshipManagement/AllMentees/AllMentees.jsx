import TableV2 from "components/Layout/TableV2/TableV2";
import Button from "components/form/Button";
import ProfileDetail from "pages/Common/ProfileManagement/ProfileDetail";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllMenteesList, setSingleMenteeDetails } from "store/slices";
import {
  addToLocalStorage,
  objectToFormData,
  titleCaseString,
  userTypeByStatus,
} from "utils/helpers";

const AllMentees = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const memberType = userTypeByStatus();
  const [isLoading, setIsLoading] = useState(true);
  const [userDetail, setUserDetail] = useState(null);
  const [isDeatils, setDeatils] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    mentee_id: "",
    mentee_name: "",
    membership_type: "",
    email: "",
    become_mentee: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });

  const fetchMenteesList = async (obj) => {
    const formData = objectToFormData(obj);
    const response = await dispatch(getAllMenteesList(formData));
    let resList = [];
    let resResultCount = 0;
    if (response?.data?.result_data) {
      resList = response?.data?.result_data || [];
      resResultCount = response?.data?.result_count || 0;
    }
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
    fetchMenteesList(newData);
  };

  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchMenteesList(newData);
  };

  useEffect(() => {
    fetchMenteesList({ ...searchPayload, ...filterData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "mentee_name",
      title: <div className="text-nowrap">Mentees Name</div>,
    },
    {
      isSearch: true,
      searchInputName: "mentee_id",
      title: <div className="text-nowrap">Mentees ID</div>,
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
      title: <div className="text-nowrap">Sessions</div>,
    },
    {
      isSearch: false,
      searchLable: "View",
      title: <div className="color-subtitle-navy">View</div>,
    },
  ];

  const rowData = [];
  tableData?.forEach((elem) => {
    const { id, mentee_name, mentee_id, member_type, email_id, session } = elem;
    let obj = [
      {
        value: (
          <span
            className="color-new-car pointer "
            onClick={() => {
              setDeatils(true);
              setUserDetail(mentee_id);
            }}
          >
            {`${titleCaseString(mentee_name)}`}
          </span>

          // <div className="text-14-500 text-nowrap">
          //   {titleCaseString(mentee_name)}
          // </div>
        ),
      },
      {
        value: mentee_id,
      },
      {
        value: (
          <div className="text-nowrap">{titleCaseString(member_type)}</div>
        ),
      },
      {
        value: email_id,
      },
      {
        value: session,
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
                dispatch(setSingleMenteeDetails(elem));
                addToLocalStorage("setViewName", elem);
                navigate(
                  `/${memberType}/mentorship-management/mentees/details/${id}`
                );
              }}
            />

            {/* <Button
              btnStyle="light-blue-outline"
              icon={<img src={icons.outline_delete} alt="delete" />}
              isSquare
              // onClick={() => {
              //   setMentorId(mentor_id);
              // }}
            /> */}
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <div id="all-mentees-container">
      <div className="text-16-500 color-text-navy mt-4 cmb-10 cps-10">
        All Mentees ({filterData?.total})
      </div>
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

export default AllMentees;
