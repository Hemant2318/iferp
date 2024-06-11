import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import DeletePopup from "components/Layout/DeletePopup";
import { icons, limit } from "utils/constants";
import {
  getDataFromLocalStorage,
  getStatus,
  getUserType,
  objectToFormData,
} from "utils/helpers";
import {
  careerdDeleteOrStatusUpdate,
  exportCareerEventMembers,
  fetchCareerEventMembers,
  sendMessage,
} from "store/slices";
import CareerEventMemberFrom from "./CareerEventMemberFrom";

const CareerEventMembers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  console.log("CareerEventMembers ~ params:", params);
  const [isBtnLoading, setBtnLoading] = useState("");
  const [editData, setEditData] = useState(null);
  const [title, setTitle] = useState("");
  const handleRedirect = () => {
    navigate(-1);
  };
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [userid, setUserid] = useState(null);
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
    career_id: params.careerId,
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
    setTitle(response?.data?.career_category || "");
    setTableList(response?.data?.applied_details || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  const updateCareer = async (data) => {
    const payloadObj = {
      career_id: params.careerId,
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
    console.log("reciever:", reciever);
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
    if (localStorage.careerUserID) {
      localStorage.removeItem("careerUserID");
    }
    getCareerEvents({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const acess = {
    isHideTableExtraField: !["0", "6"].includes(
      getDataFromLocalStorage("user_type")
    ),
  };
  let header = [
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
      searchInputName: "email_id",
      title: "Email ID",
    },
    {
      isSearch: false,
      searchLable: "",
      title: "Status",
    },
    {
      isSearch: false,
      searchLable: "view/Edit/Delete",
      title: "Action",
    },
  ];
  const rowData = [];
  const isViewButton = [
    "2",
    "3",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
  ].includes(params?.careerId);
  tableList.forEach((elem) => {
    let obj = [
      {
        value: elem.member_name,
      },
      {
        value: elem.member_id,
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
            {isViewButton && (
              <Button
                btnStyle="primary-light"
                className="cps-40 cpe-40 me-2"
                text="View"
                onClick={() => {
                  const userType = getUserType();
                  localStorage.careerUserID = elem?.user_id;
                  navigate(
                    `/${userType}/career-management/applied-career-support/${params?.careerId}/${elem?.id}`
                  );
                }}
                isSquare
              />
            )}
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
                  if (params.careerId === "6") {
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
    if (params?.careerId === "7") {
      obj.splice(3, 0, {
        value: elem.event_name,
      });
    }
    if (acess.isHideTableExtraField) {
      obj.pop();
      obj.pop();
    }
    rowData.push({ data: obj });
  });

  if (acess.isHideTableExtraField) {
    header.pop();
    header.pop();
  }
  if (params?.careerId === "7") {
    header.splice(3, 0, {
      isSearch: true,
      searchInputName: "event_name",
      title: "Event Name",
    });
  }
  // console.log(tableList);
  return (
    <div>
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
      <Card className="cps-20 cpe-20 cpb-20">
        {!isLoading && (
          <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
            <div className="d-flex align-items-center">
              <span className="d-flex" onClick={handleRedirect}>
                <img
                  src={icons.leftArrow}
                  alt="back"
                  className="h-21 me-3 pointer"
                />
              </span>
              <span className="text-18-500 color-black-olive">
                {title} ({filterData?.total})
              </span>
            </div>
            <div className="d-flex">
              <ExportButton
                exportAPI={exportCareerEventMembers}
                payload={objectToFormData({
                  career_id: params.careerId,
                  user_id: params?.eventId || "",
                  career_event_id:
                    params?.eventId && params?.eventId !== "members"
                      ? params?.eventId
                      : "",
                })}
              />
            </div>
          </div>
        )}
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
export default CareerEventMembers;
