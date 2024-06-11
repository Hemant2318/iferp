import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { omit } from "lodash";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Table from "components/Layout/Table";
import DeletePopup from "components/Layout/DeletePopup";
import ExportButton from "components/Layout/ExportButton";
import { icons, limit } from "utils/constants";
import {
  deleteAllocatedReviewerAbstracts,
  fetchReviewrDetails,
} from "store/slices";
import AllocateProject from "./AllocateProject";

const ReviewerDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { memberType, moduleType, reviewerId } = params;
  let eventId = localStorage.eventId || "";
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [paperId, setPaperId] = useState(null);
  const [userData, setUserData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [isAllocatePopup, setIsAllocatePopup] = useState(false);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    status: "",
    paper_id_title: "",
    conference_name: "",
    member_id_or_type: "",
  });
  const [filterData, setFilterData] = useState({
    user_id: reviewerId,
    limit: limit,
    offset: 0,
    total: 0,
    event_id: eventId || "",
  });
  const handelChangeSearch = (searchData) => {
    setLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getPaperDetails(newData);
  };
  const handelChangePagination = (offset) => {
    setLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getPaperDetails(newData);
  };
  const handleRedirect = () => {
    navigate(-1);
  };
  const getPaperDetails = async (obj) => {
    let queryParams = new URLSearchParams(omit(obj, ["total"])).toString();
    const response = await dispatch(fetchReviewrDetails(queryParams));
    setTableList(response?.data?.allocated_details || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setUserData(response?.data?.user_details || {});
    setLoading(false);
  };
  useEffect(() => {
    getPaperDetails({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: "Author",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "id", value: "name" },
      searchInputName: "member_id_or_type",
      title: (
        <>
          <div>Member ID</div>
          <div>{"& Type"}</div>
        </>
      ),
    },
    {
      isSearch: true,
      searchInputName: "paper_id_title",
      title: "Paper ID & Paper Title",
    },
    {
      isSearch: true,
      searchInputName: "conference_name",
      title: "Conference Name",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: {
        options: [
          { id: "0", name: "Pending" },
          { id: "1", name: "Paper Submitted" },
          { id: "2", name: "Plagiarized" },
          { id: "3", name: "Reviewed" },
          { id: "4", name: "Accepted" },
          { id: "5", name: "Registration Done" },
        ],
        key: "id",
        value: "name",
      },
      searchInputName: "status",
      title: "Status",
    },
    {
      isSearch: false,
      searchLable: "Delete",
      title: "Action",
    },
  ];
  if (eventId) {
    header = header.filter((_, i) => i !== 3);
  }
  const rowData = [];
  tableList.forEach((elem) => {
    const {
      author,
      member_id,
      paper_id_title,
      event_name,
      status_format,
      abstract_paper_id,
    } = elem;
    let obj = [
      {
        value: author,
      },
      {
        value: member_id,
      },
      {
        value: (
          <span
            onClick={() => {
              let module = moduleType || "event-management";
              navigate(
                `/${memberType}/${module}/submitted-papers/${abstract_paper_id}`
              );
            }}
            className="pointer color-new-car"
          >
            {paper_id_title}
          </span>
        ),
      },
      {
        value: event_name,
      },
      {
        value: status_format,
      },
      {
        value: (
          <span className="action-icon-buttons">
            <Button
              btnStyle="light-outline"
              icon={<img src={icons.deleteIcon} alt="delete" />}
              onClick={() => {
                setPaperId(elem.id);
              }}
              isSquare
            />
          </span>
        ),
      },
    ];
    if (eventId) {
      obj = obj.filter((_, i) => i !== 3);
    }
    rowData.push({ data: obj });
  });
  const { name, member_id, email_id, phone_number } = userData;
  return (
    <div id="common-paper-container">
      {isAllocatePopup && (
        <AllocateProject
          eventId={eventId}
          editData={userData}
          onHide={() => {
            setIsAllocatePopup(false);
          }}
          handelSuccess={() => {
            getPaperDetails({ ...filterData, ...searchPayload });
            setIsAllocatePopup(false);
          }}
        />
      )}
      {paperId && (
        <DeletePopup
          id={paperId}
          onHide={() => {
            setPaperId(null);
          }}
          handelSuccess={() => {
            setPaperId(null);
            getPaperDetails({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            const response = await dispatch(
              deleteAllocatedReviewerAbstracts(paperId)
            );
            return response;
          }}
        />
      )}
      <Card className="cps-24 cpe-24 cpt-20 cpb-20 mb-3">
        {isLoading ? (
          <div className="pt-5 pb-5">
            <Loader size="md" />
          </div>
        ) : (
          <div className="row">
            <div className="cpt-12 cpb-20 d-flex align-items-center cmb-12 ">
              <span className="d-flex" onClick={handleRedirect}>
                <img
                  src={icons.leftArrow}
                  alt="back"
                  className="h-21 me-3 pointer"
                />
              </span>
              <span className="text-20-500 color-black-olive">{name}</span>
            </div>
            <div className="row cmb-20">
              <div className="col-md-3 text-16-400 color-black-olive">
                Member ID
              </div>
              <div className="col-md-9 text-16-500 color-black-olive">
                {member_id}
              </div>
            </div>
            <div className="row cmb-20">
              <div className="col-md-3 text-16-400 color-black-olive">
                Email ID
              </div>
              <div className="col-md-9 text-16-500 color-black-olive">
                {email_id}
              </div>
            </div>
            <div className="row cmb-20">
              <div className="col-md-3 text-16-400 color-black-olive">
                Phone Number
              </div>
              <div className="col-md-9 text-16-500 color-black-olive">
                {phone_number}
              </div>
            </div>

            <div className="d-flex">
              <Button
                isSquare
                text="+ Allocate Project"
                btnStyle="primary-light"
                className="text-15-500 h-35"
                onClick={() => {
                  setIsAllocatePopup(true);
                }}
              />
            </div>
          </div>
        )}
      </Card>
      {!isLoading && (
        <Card className="cps-20 cpe-20 cpb-20">
          <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
            <div className="text-18-400 color-black-olive">
              Submitted Abstracts ({filterData?.total})
            </div>
            <div className="d-flex">
              <ExportButton
                exportAPI={fetchReviewrDetails}
                payload={`user_id=${reviewerId}&export_status=1&event_id=${
                  eventId || ""
                }`}
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
      )}
    </div>
  );
};
export default ReviewerDetails;
