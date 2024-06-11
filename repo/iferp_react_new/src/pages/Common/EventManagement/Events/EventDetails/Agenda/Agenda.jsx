import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { filter, includes, lowerCase } from "lodash";
import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import moment from "moment";
import Card from "components/Layout/Card";
import Button from "components/form/Button";
import SeachInput from "components/form/SeachInput";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import FilterDropdown from "components/Layout/FilterDropdown";
import { addMyInterestSessions } from "store/slices";
import {
  downloadFile,
  generatePreSignedUrl,
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import SessionForm from "./SessionForm";
import { agendaPath } from "utils/constants";

const Agenda = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { memberType, moduleType, eventId } = params;
  const { agendaList, speakerList, eventData } = useSelector((state) => ({
    eventData: state.global.eventData,
    agendaList: state.global.eventData?.event_agendas || [],
    speakerList: state.global.eventData?.speaker_details || [],
  }));
  const [isMyInterest, setIsMyInterest] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({
    searchText: "",
    date: "all",
    times: "",
  });
  const [sessionId, setSessionId] = useState("");
  const [displayList, setDisplayList] = useState([]);

  const filterDays = (type) => {
    setFilterData({ ...filterData, date: type });
    filterDisplayList({ ...filterData, date: type });
  };
  const handelChangeFilter = (e) => {
    setFilterData({ ...filterData, times: e });
    filterDisplayList({ ...filterData, times: e });
  };
  const filterDisplayList = (filterFlags) => {
    const dropFilter = filterFlags.times.split(",");
    let newList = [];
    agendaList.forEach((e) => {
      let sessionArray = [];
      if (e.agenda_sessions.length > 0) {
        e.agenda_sessions.forEach((y) => {
          let keyVal = `${moment(y.date).format("DD MMM")} - ${moment(
            y.session_time,
            "hh:mm:ss"
          ).format("hh:mm A")}`;
          if (y.date === filterFlags.date || filterFlags.date === "all") {
            if (
              (filterFlags.times && dropFilter.includes(keyVal)) ||
              !filterFlags.times
            ) {
              if (
                (filterFlags.searchText &&
                  lowerCase(y.name).includes(
                    lowerCase(filterFlags.searchText)
                  )) ||
                !filterFlags.searchText
              ) {
                sessionArray.push(y);
              }
            }
          }
        });
      }
      let childObject = { ...e, agenda_sessions: sessionArray };
      newList.push(childObject);
    });
    setDisplayList(newList);
    setLoading(false);
  };
  const handelAddEditMyInterest = async (aIndex, sIndex) => {
    const oldData = cloneDeep(displayList[aIndex].agenda_sessions[sIndex]);
    const response = await dispatch(
      addMyInterestSessions(
        objectToFormData({
          user_id: getDataFromLocalStorage("id"),
          session_id: oldData.id,
        })
      )
    );
    if (response?.status === 200) {
      const oldDisplayArray = cloneDeep(displayList);
      oldDisplayArray[aIndex].agenda_sessions[sIndex].is_interested =
        oldData.is_interested === 0 ? 1 : 0;
      setDisplayList(oldDisplayArray);
    }
  };

  let filterOptions = [];
  agendaList.forEach((e) => {
    e?.agenda_sessions.forEach((y) => {
      if (y.date === filterData.date || filterData.date === "all") {
        let keyVal = `${moment(y.date).format("DD MMM")} - ${moment(
          y.session_time,
          "hh:mm:ss"
        ).format("hh:mm A")}`;
        filterOptions.push({
          id: keyVal,
          name: keyVal,
        });
      }
    });
  });

  useEffect(() => {
    setDisplayList(agendaList);
    filterDisplayList(filterData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agendaList]);

  let count = 0;
  let myInterestCount = 0;
  displayList.forEach((e) => {
    e?.agenda_sessions.forEach((y) => {
      if (y.is_interested) {
        myInterestCount++;
      }
      count++;
    });
  });
  const activeDays = "color-new-car primary-underline";
  const inactiveDays = "color-black-olive pointer";

  const userType = getDataFromLocalStorage("user_type");
  const access = {
    isAdmin: userType === "0",
  };
  const { virtual_platform_link } = eventData || {};
  return (
    <>
      {isLoading ? (
        <Card className="cpt-80 cpb-80">
          <Loader size="md" />
        </Card>
      ) : (
        <Card className="cmt-12 cps-16 cpe-16 cpt-24 cpb-24 fadeInUp">
          {sessionId && (
            <SessionForm
              onHide={() => {
                setSessionId("");
              }}
              sessionId={sessionId}
            />
          )}

          <div className="row">
            <div className="col-md-8">
              <div className="row w-100 d-flex align-items-center">
                <div className="col-md-9 mb-2">
                  <SeachInput
                    placeholder="Search here"
                    value={filterData.searchText}
                    onChange={(e) => {
                      setFilterData({
                        ...filterData,
                        searchText: titleCaseString(e.target.value),
                      });
                      filterDisplayList({
                        ...filterData,
                        searchText: titleCaseString(e.target.value),
                      });
                    }}
                  />
                </div>
                <div className="col-md-3 mb-2">
                  <FilterDropdown
                    label={`${
                      !filterData.times
                        ? 0
                        : (filterData.times.match(/,/g) || []).length + 1
                    } Sessions`}
                    list={filterOptions}
                    handelChangeFilter={handelChangeFilter}
                  />
                </div>
              </div>
              <div></div>
              <div></div>
            </div>
            {access.isAdmin && (
              <div className="col-md-4 d-flex align-items-center justify-content-end gap-2">
                <Button
                  onClick={() => {
                    setSessionId("+1");
                  }}
                  text="+ Add Session"
                  btnStyle="primary-outline"
                  className="h-35 text-14-500"
                  isSquare
                />
              </div>
            )}
          </div>
          <div className="d-flex justify-content-between align-items-end cmt-24">
            <div className="d-flex align-items-end">
              <div
                className={`text-16-400 me-3 ${
                  filterData.date === "all" ? activeDays : inactiveDays
                }`}
                onClick={() => {
                  filterDays("all");
                }}
              >
                All Days
              </div>
              {agendaList.map((elem, index) => {
                return (
                  <div
                    onClick={() => {
                      filterDays(elem?.date);
                    }}
                    className={`text-16-400 me-3 ${
                      elem?.agenda_sessions.length > 0 ? "" : "d-none"
                    } ${
                      filterData.date === elem?.date ? activeDays : inactiveDays
                    }`}
                    key={index}
                  >{`Day ${index + 1}`}</div>
                );
              })}
            </div>
            <div className="text-14-400 d-flex gap-4 cmt-12">
              <div>
                <div
                  className={
                    isMyInterest
                      ? "color-black-olive pointer"
                      : "color-new-car primary-underline"
                  }
                  onClick={() => {
                    if (isMyInterest) {
                      setIsMyInterest(false);
                    }
                  }}
                >
                  <i className="bi bi-journal-bookmark-fill me-2" />
                  All Sessions ({count})
                </div>
              </div>

              {!access.isAdmin && (
                <div
                  className={
                    isMyInterest
                      ? "color-new-car primary-underline"
                      : "color-black-olive pointer"
                  }
                  onClick={() => {
                    if (!isMyInterest) {
                      setIsMyInterest(true);
                    }
                  }}
                >
                  <i className="bi bi-star me-2" />
                  My Interests ({myInterestCount})
                </div>
              )}
            </div>
          </div>
          {displayList.map((elem, index) => {
            const hideElement =
              elem?.agenda_sessions.length > 0
                ? elem.date === filterData.date || filterData.date === "all"
                  ? ""
                  : "d-none"
                : "d-none";
            return (
              <div key={index} className={hideElement}>
                <div className="cmt-22 cmb-12">
                  <span className="color-black-olive text-14-400 me-2">
                    {moment(elem?.date).format("ddd")}
                  </span>
                  <span className="color-black-olive text-14-500">
                    {moment(elem?.date).format("MMM DD")}
                  </span>
                </div>
                <div>
                  {elem?.agenda_sessions.map((sElem, sIndex) => {
                    const { is_interested } = sElem;
                    const sessionSpeakerList = filter(speakerList, (o) =>
                      includes(sElem?.speaker_id, o.id)
                    );
                    return (
                      <div
                        className={`aganda-session-container cmb-24 ${
                          isMyInterest ? (is_interested ? "" : "d-none") : ""
                        }`}
                        key={sIndex}
                      >
                        <div className="left-block mt-2">
                          {moment(sElem.session_time, "hh:mm:ss").format(
                            "hh:mm A"
                          )}
                        </div>
                        <div className="right-block">
                          {!access.isAdmin && (
                            <div
                              className="star-block pointer"
                              onClick={() => {
                                handelAddEditMyInterest(index, sIndex);
                              }}
                            >
                              <i
                                className={
                                  is_interested
                                    ? "bi bi-star-fill"
                                    : "bi bi-star"
                                }
                              />
                            </div>
                          )}
                          <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div
                              className="text-16-500 color-raisin-black pointer mt-2"
                              onClick={() => {
                                navigate(
                                  `/${memberType}/${moduleType}/event-details/${eventId}/session/${sElem.id}`
                                );
                              }}
                            >
                              {sElem?.name}
                            </div>
                            {access.isAdmin && (
                              <Button
                                onClick={() => {
                                  setSessionId(sElem.id);
                                }}
                                text="Edit"
                                btnStyle="light-outline"
                                className="h-35 text-14-500 cps-16 cpe-16"
                                icon={<i className="bi bi-pencil me-2" />}
                                isSquare
                              />
                            )}
                          </div>

                          {virtual_platform_link && (
                            <div className="d-flex cmt-12 cmb-22">
                              <Button
                                icon={
                                  <i className="bi bi-camera-video me-3 text-24-500" />
                                }
                                text="Join Session"
                                btnStyle="primary-dark"
                                className="cps-20 cpe-20"
                                onClick={() => {
                                  window.open(virtual_platform_link, "_blank");
                                }}
                              />
                            </div>
                          )}
                          <div className="color-black-olive text-14-400">
                            {sElem?.description}
                          </div>
                          <div
                            className="text-14-400 color-new-car pointer cmt-16 cmb-22"
                            onClick={async () => {
                              const res = await generatePreSignedUrl(
                                sElem?.transcription,
                                agendaPath
                              );
                              dispatch(downloadFile(res));
                            }}
                          >
                            Please click here to view the transcription
                          </div>
                          <div className="row">
                            {sessionSpeakerList.map(
                              (spreakerElem, speakerIndex) => {
                                return (
                                  <div
                                    className="col-md-4 mb-2 d-flex pointer"
                                    key={speakerIndex}
                                    onClick={() => {
                                      navigate(
                                        `/${memberType}/${moduleType}/speaker/${spreakerElem?.id}`
                                      );
                                    }}
                                  >
                                    <div className="me-2">
                                      <Profile
                                        isRounded
                                        isS3UserURL
                                        text={spreakerElem?.name}
                                        url={spreakerElem?.photo}
                                        size="s-68"
                                      />
                                    </div>
                                    <div>
                                      <div className="text-15-500 color-new-car pointer">
                                        {spreakerElem?.name}
                                      </div>
                                      <div className="text-13-400 color-black-olive mt-1 mb-1">
                                        {spreakerElem?.designation}
                                      </div>
                                      <div className="text-13-400 color-black-olive">
                                        {spreakerElem?.institution}
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </>
  );
};
export default Agenda;
