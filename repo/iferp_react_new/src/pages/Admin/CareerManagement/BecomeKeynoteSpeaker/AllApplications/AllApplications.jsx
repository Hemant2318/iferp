import Card from "components/Layout/Card";
import ExportButton from "components/Layout/ExportButton";
import Table from "components/Layout/Table";
import Button from "components/form/Button";
import React from "react";
import { useState } from "react";
import { icons, limit } from "utils/constants";
import {
  getDataFromLocalStorage,
  getStatus,
  getUserType,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import SentInvitationForm from "./SentInvitationForm";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  careerdDeleteOrStatusUpdate,
  exportCareerEventMembers,
  fetchCareerEventMembers,
  sendMessage,
} from "store/slices";
import { useEffect } from "react";
import DeletePopup from "components/Layout/DeletePopup";
import CareerEventMemberFrom from "../../CareerEventMembers/CareerEventMemberFrom";

const AllApplications = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [userid, setUserid] = useState(null);
  const [isBtnLoading, setBtnLoading] = useState("");

  const [editData, setEditData] = useState(null);
  const [isInvitation, setIsInvitation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    member_name: "",
    member_id: "",
    member_type: "",
    email_id: "",
    event_name: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
    career_id: params.uId,
    career_event_id:
      params?.eventId && params?.eventId !== "members" ? params?.eventId : "",
  });
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getCareerEvents(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getCareerEvents(newData);
  };
  const getCareerEvents = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchCareerEventMembers(forData));
    setTableList(response?.data?.applied_details || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  const updateCareer = async (data) => {
    const payloadObj = {
      career_id: params.uId,
      ...data,
    };
    if (params.eventId !== "members") {
      payloadObj.career_events_details_id = params.eventId;
    }
    let forData = objectToFormData(payloadObj);
    const response = await dispatch(careerdDeleteOrStatusUpdate(forData));
    if (response?.status === 200 && data.type === "update") {
      getCareerEvents({ ...filterData, ...searchPayload });
      setEditData(null);
      setBtnLoading("");
    }
    return response;
  };

  const sendSpeakerMessage = async (reciever) => {
    setBtnLoading(true);
    const payloadData = {
      sender_id: getDataFromLocalStorage("id"),
      receiver_id: reciever.user_id,
      subject: "Upload the required documents",
      description: `<p>Dear ${reciever.member_name},</p><p>Congratulations you are selected to participate as Speaker in the upcomng ICERT Conference to be held on 29.07.22.&nbsp;</p><p>Kindly upload the required documents to move your application forward. Here are the list of documents to upload,</p><ol><li>Presentation Topic</li><li>Passport Photo</li><li>Video of any previous event</li><li>Photos of previous Events</li><li>Certificates if any</li><li>Awards if any</li></ol>`,
      is_speaker_view: "1",
    };
    await dispatch(sendMessage(payloadData));
  };
  useEffect(() => {
    // if (localStorage.careerUserID) {
    //   localStorage.removeItem("careerUserID");
    // }
    getCareerEvents({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const dummyData = [
  //   {
  //     member_name: "John Dave",
  //     member_id: "PROF-95796214",
  //     member_type: "Professional Premium",
  //     email: "john@mailinator.com",
  //     status: "Accepted",
  //   },
  //   {
  //     member_name: "Steve Brooke",
  //     member_id: "PROF-87496043",
  //     member_type: "Professional Free",
  //     email: "steve@mailinator.com",
  //     status: "Accepted",
  //   },
  // ];
  const header = [
    {
      isSearch: true,
      searchInputName: "member_name",
      title: "Member Name",
    },
    {
      isSearch: true,
      searchInputName: "member_id",
      title: "Member ID",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "id", value: "name" },
      searchInputName: "member_type",
      title: "Member Type",
    },
    {
      isSearch: true,
      searchLable: "email",
      title: "Email",
    },
    {
      isSearch: false,
      searchLable: "",
      title: "Status",
    },
    {
      isSearch: false,
      searchLable: "View/Edit/Delete",
      title: "Action",
    },
  ];
  let rowData = [];
  tableList?.forEach((elem) => {
    let obj = [
      {
        value: titleCaseString(elem.member_name),
      },
      {
        value: titleCaseString(elem.member_id),
      },
      {
        value: elem.member_type,
      },
      {
        value: elem.email_id,
      },
      {
        value: getStatus(elem.status),
      },
      {
        value: (
          <span className="action-icon-buttons">
            <Button
              text="View"
              btnStyle="primary-light"
              className="text-14-500 mw-70 me-2"
              isSquare
              onClick={() => {
                const userType = getUserType();
                localStorage.careerUserID = elem?.user_id;
                navigate(
                  `/${userType}/career-management/applied-career-support/${params?.uId}/${elem?.id}`
                );
              }}
            />
            {elem.status === "0" ? (
              <Button
                isSquare
                text={isBtnLoading === elem.id ? "" : "Accept"}
                btnStyle="primary-light"
                className="cps-40 cpe-40"
                onClick={() => {
                  setBtnLoading(elem.id);
                  updateCareer({
                    career_applied_id: elem.id,
                    status: "1",
                    type: "update",
                  });
                  if (params.uId === "6") {
                    sendSpeakerMessage(elem);
                  }
                }}
                btnLoading={isBtnLoading === elem.id}
              />
            ) : (
              <>
                <Button
                  btnStyle="light-outline"
                  icon={<img src={icons.edit} alt="edit" />}
                  className="me-2"
                  onClick={() => {
                    setEditData(elem);
                  }}
                  isSquare
                />
                <Button
                  btnStyle="light-outline"
                  icon={<img src={icons.deleteIcon} alt="delete" />}
                  onClick={() => {
                    setUserid({
                      career_applied_id: elem.id,
                      type: "delete",
                    });
                  }}
                  isSquare
                />
              </>
            )}
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <div id="all-application-container">
      {userid && (
        <DeletePopup
          onHide={() => {
            setUserid(null);
          }}
          handelSuccess={() => {
            setUserid(null);
            getCareerEvents({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            await updateCareer(userid);
            return { status: 200 };
          }}
        />
      )}
      {editData && (
        <CareerEventMemberFrom
          onHide={() => {
            setEditData(null);
          }}
          editData={editData}
          onSave={updateCareer}
        />
      )}
      {isInvitation && (
        <SentInvitationForm
          onHide={() => {
            setIsInvitation(null);
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cmb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 cpt-28 cpb-28">
          <div className="table-title">
            Become a Keynote Speaker ({filterData?.total})
          </div>
          <div className="d-flex flex-wrap gap-3">
            <Button
              onClick={() => {
                setIsInvitation(true);
              }}
              text="Send Invitation"
              btnStyle="primary-dark"
              className="h-35 text-14-500"
              isSquare
            />
            <ExportButton
              exportAPI={exportCareerEventMembers}
              payload={objectToFormData({
                career_id: params.uId,
                user_id: params?.eventId || "",
                career_event_id:
                  params?.eventId && params?.eventId !== "members"
                    ? params?.eventId
                    : "",
              })}
            />
          </div>
        </div>
        <div className="overflow-auto">
          <Table
            isLoading={isLoading}
            header={header}
            rowData={rowData}
            filterData={filterData}
            searchPayload={searchPayload}
            searchInputChange={handelChangeSearch}
            changeOffset={handelChangePagination}
          />
        </div>
      </Card>
    </div>
  );
};

export default AllApplications;
