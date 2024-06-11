import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Back, Button, Profile, Loader } from "components";
import { icons, agendaPath } from "utils/constants";
import {
  objectToFormData,
  generatePreSignedUrl,
  downloadFile,
} from "utils/helpers";
import { fetchUserNetwork, sendRequests, getSession } from "store/globalSlice";
import "./FindSessionDetails.scss";

const FindSessionDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { sessionID } = params;
  const reduxData = useSelector((state) => state.global);
  const { networkData } = reduxData || {};
  const { send_follow_request, following } = networkData;
  const [isLoader, setIsLoader] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [sessionData, setSessionData] = useState({});

  const handelSendRequest = async (id) => {
    setIsLoader(id);
    const response = await dispatch(
      sendRequests(objectToFormData({ receiver_id: id }))
    );
    if (response?.status === 200) {
      dispatch(fetchUserNetwork());
    }
    setIsLoader("");
  };

  const getPageData = async () => {
    const res = await dispatch(getSession(sessionID));
    setSessionData(res?.data || {});
    setIsPageLoading(false);
  };

  useEffect(() => {
    getPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    name,
    transcription,
    description,
    speaker_details,
    date,
    session_time,
  } = sessionData;

  let sessionDateTime = "";
  if (date && session_time) {
    sessionDateTime = moment(
      `${date} ${session_time}`,
      "YYYY-MM-DD hh:mm:ss"
    ).format("DD MMM, YYYY hh:mm A");
  }

  return (
    <div className="container bg-feff">
      {isPageLoading ? (
        <div className="center-flex cpt-100 cpb-100 f-center b-e3e3 mt-3 br-4">
          <Loader size="md" />
        </div>
      ) : !name ? (
        <div className="center-flex cpt-100 cpb-100 f-center b-e3e3 mt-3 br-4">
          No Data Found
        </div>
      ) : (
        <div
          id="findSession-details-container"
          className="shadow cpt-28 cps-28 cpe-28"
        >
          <div className="fb-center">
            <Back>
              <div>
                <div className="text-28-400 color-3d3d">Session: {name}</div>
                <div className="text-12-400 color-abab">{sessionDateTime}</div>
              </div>
            </Back>

            {transcription && (
              <Button
                btnStyle="SO"
                btnText="View Transcription"
                className="h-32 text-14-400"
                onClick={async () => {
                  const res = await generatePreSignedUrl(
                    transcription,
                    agendaPath
                  );
                  dispatch(downloadFile(res, transcription));
                }}
              />
            )}
          </div>

          <div
            className="cp-16 border rounded text-18-400 color-3d3d h-100 pointer mt-3"
            onClick={() => {}}
          >
            <div className="d-flex align-items-center gap-3">
              <div className="left-indicator">
                <img src={icons.primaryIndicator} alt="right" />
              </div>
              <div className="text-16-400">{description}</div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="text-22-500 color-3d3d mb-2">Session Speaker</div>
            {speaker_details?.map((elm, index) => {
              const isExist = send_follow_request.find(
                (o) => `${o.id}` === `${elm?.user_id}`
              )
                ? true
                : false;
              const isAlreadyFollow = following.find(
                (o) => `${o.id}` === `${elm?.user_id}`
              )
                ? true
                : false;
              if (elm?.user_id !== "") {
                return (
                  <div className="col-md-6 cmb-26" key={index}>
                    <div className="cp-10 border rounded">
                      <div className="row">
                        <div className="col-md-4 h-100">
                          <div className="w-100">
                            <Profile
                              text={elm?.name}
                              url={elm?.photo}
                              size="s-162"
                              isS3UserURL={true}
                            />
                          </div>
                        </div>
                        <div className="col-md-8 d-flex flex-column">
                          <div className="text-18-600 color-b8e3">
                            {elm?.name}
                          </div>
                          <div className="text-15-500 color-3d3d mt-1">
                            {elm?.designation}
                          </div>
                          <div className="text-14-400 color-3d3d mt-1">
                            {elm?.institution}
                          </div>
                          <div className="mt-2 flex-grow-1 d-flex align-items-end">
                            <Button
                              btnText={
                                isExist
                                  ? "Cancel"
                                  : isAlreadyFollow
                                  ? "Unfollow"
                                  : "Follow"
                              }
                              btnStyle={!isAlreadyFollow ? "SO" : "GO"}
                              className={`h-32 text-13-400 ${
                                isExist ? "" : "ps-4 pe-4"
                              }`}
                              onClick={() => {
                                handelSendRequest(elm?.user_id);
                              }}
                              btnLoading={isLoader === elm?.user_id}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindSessionDetails;
