import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import SaveDate from "components/Layout/SaveDate";
import { chapterMemberPath, icons } from "utils/constants";
import {
  combineArrayS3,
  getDataFromLocalStorage,
  objectToFormData,
} from "utils/helpers";
import { deleteEvent, getChaptersEventsPeople } from "store/slices";
import { adminRoute } from "utils/constants";
import DeletePopup from "components/Layout/DeletePopup";

const EventAndPeople = ({ setTitle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { memberType, chapterId, type } = params;
  const [eventId, setEventId] = useState(null);
  const [viewData, setViewData] = useState({
    chaptersEvents: [],
    chaptersPeoples: [],
  });
  const userType = getDataFromLocalStorage("user_type");
  const [tableLoader, setTableLoader] = useState(true);

  const fetchChapterEventsAndPeople = async () => {
    let forData = objectToFormData({ id: chapterId });
    const response = await dispatch(getChaptersEventsPeople(forData));
    if (response?.status === 200 && response?.data) {
      const { chaptersEvents, chaptersPeoples } = response?.data;
      const res = await combineArrayS3(
        chaptersPeoples,
        "profilePhoto",
        chapterMemberPath
      );
      setViewData({
        chaptersEvents: chaptersEvents,
        chaptersPeoples: res,
      });
      setTitle(response?.data?.name);
    }
    setTableLoader(false);
  };

  const handleRedirect = (id) => {
    navigate(
      `/${memberType}/chapters-groups/chapters/${chapterId}/${type}/${id}`
    );
  };

  useEffect(() => {
    fetchChapterEventsAndPeople();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { chaptersPeoples, chaptersEvents } = viewData;
  const header = [
    {
      title: "Event Name",
    },
    {
      title: "Date",
    },
    {
      title: "Location",
    },
    {
      title: "Action",
    },
  ];
  const rowData = [];
  chaptersEvents.forEach((elem) => {
    let obj = [
      {
        value: (
          <span
            className="color-new-car pointer hover-effect"
            onClick={() => {
              localStorage.prevRoute = window.location.pathname;
              navigate(
                `/${memberType}/chapters-groups/event-details/${elem.id}/conference-details`
              );
            }}
          >
            {elem.name}
          </span>
        ),
      },
      {
        value: (
          <>
            <div>{elem.date}</div>
            {userType !== "0" && (
              <div className="color-new-car text-13-400 pointer mt-1 text-nowrap ps-2 pe-2 center-flex">
                <SaveDate eventID={elem.id} />
              </div>
            )}
          </>
        ),
      },
      {
        value: elem.location,
      },
      {
        value: (
          <span className="action-icon-buttons">
            {userType !== "0" ? (
              <Button
                text="Register"
                btnStyle="primary-outline"
                className="me-2 btn-view"
                onClick={() => {
                  localStorage.isRedirectToRegister = 1;
                  localStorage.prevRoute = window.location.pathname;
                  navigate(
                    `/${memberType}/chapters-groups/event-details/${elem.id}/conference-details`
                  );
                }}
                isRounded
              />
            ) : (
              <div className="center-flex gap-2">
                <Button
                  text="View"
                  btnStyle="primary-light"
                  className="cps-40 cpe-40"
                  onClick={() => {
                    localStorage.prevRoute = window.location.pathname;
                    navigate(
                      `/${memberType}/chapters-groups/event-details/${elem.id}/conference-details`
                    );
                  }}
                  isSquare
                />
                <Button
                  btnStyle="light-outline"
                  icon={<img src={icons.edit} alt="edit" />}
                  className="me-2"
                  onClick={() => {
                    navigate(`${adminRoute.eventManagement}/events/${elem.id}`);
                  }}
                  isSquare
                />
                <Button
                  btnStyle="light-outline"
                  icon={<img src={icons.deleteIcon} alt="delete" />}
                  onClick={() => {
                    setEventId(elem.id);
                  }}
                  isSquare
                />
              </div>
            )}
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });

  return (
    <Card className="cps-20 cpe-20 cpb-20">
      {eventId && (
        <DeletePopup
          id={eventId}
          onHide={() => {
            setEventId(null);
          }}
          handelSuccess={() => {
            setEventId(null);
            fetchChapterEventsAndPeople();
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ eventid: eventId });
            const response = await dispatch(deleteEvent(forData));
            return response;
          }}
        />
      )}
      <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
        <div className="text-20-500 color-title-navy font-poppins">
          Chapter Events
        </div>
      </div>
      <Table
        isLoading={tableLoader}
        header={header}
        rowData={rowData}
        hidePagination
      />
      <div>
        {chaptersPeoples.length > 0 && (
          <div className="text-20-500 color-title-navy font-poppins cmt-30">
            Our People
          </div>
        )}
        <div className="row cmt-30">
          {chaptersPeoples.map((elem, index) => {
            return (
              <div
                className="our-people-card-container col-md-4 cmb-20"
                key={index}
              >
                <div className="text-18-500 color-subtitle-navy">
                  {elem.memberCategory || "Chairperson"}
                </div>
                <div className="shadow-block">
                  <div
                    className="image-block center-flex"
                    style={{
                      minHeight: "195px",
                    }}
                  >
                    <img
                      src={elem?.s3File}
                      alt="user"
                      className="fit-image fill"
                    />
                  </div>
                  <div
                    className="text-16-600 color-new-car cmt-20 pointer hover-user-name"
                    onClick={() => {
                      handleRedirect(elem?.id);
                    }}
                  >
                    {elem?.name}
                  </div>
                  <div className="text-16-500 color-subtitle-navy cmt-12">
                    {elem?.designation}
                  </div>
                  <div className="text-16-400 color-subtitle-navy cmt-12">
                    {elem?.institutionName}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
export default EventAndPeople;
