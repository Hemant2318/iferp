import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { cloneDeep } from "lodash";
import moment from "moment";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import { agendaPath, icons } from "utils/constants";
import { addMyInterestSessions, getSession } from "store/slices";
import {
  downloadFile,
  generatePreSignedUrl,
  getDataFromLocalStorage,
  objectToFormData,
} from "utils/helpers";
import SessionForm from "../SessionForm";
import "./SessionDetails.scss";

const SessionDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { memberType, moduleType, sessionId: paramsSessionId } = params;
  const [isLoading, setLoading] = useState(true);
  const [session, setSession] = useState({});
  const [sessionId, setSessionId] = useState("");
  const fetchSessionDetails = async () => {
    const response = await dispatch(getSession(paramsSessionId));
    let data = {};
    if (response?.data) {
      data = response.data;
    }
    setSession(data);
    setLoading(false);
  };
  const handelAddEditMyInterest = async () => {
    const oldData = cloneDeep(session);
    const response = await dispatch(
      addMyInterestSessions(
        objectToFormData({
          user_id: getDataFromLocalStorage("id"),
          session_id: oldData.id,
        })
      )
    );
    if (response?.status === 200) {
      setSession({
        ...oldData,
        is_interested: oldData.is_interested === 0 ? 1 : 0,
      });
    }
  };

  useEffect(() => {
    fetchSessionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    session_time,
    name,
    description,
    is_interested,
    speaker_details,
    transcription,
  } = session;

  const userType = getDataFromLocalStorage("user_type");
  const access = {
    isAdmin: userType === "0",
  };

  return (
    <div id="session-details-container">
      {sessionId && (
        <SessionForm
          handelSuccess={fetchSessionDetails}
          onHide={() => {
            setSessionId("");
          }}
          sessionId={sessionId}
        />
      )}
      {isLoading ? (
        <Card className="cpt-80 cpb-80">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          <Card className="unset-br cpe-26 cps-26 pt-4 pb-4 fadeInUp">
            <div className="w-100 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span
                  className="d-flex"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  <img
                    src={icons.leftArrow}
                    alt="back"
                    className="h-21 me-4 pointer"
                  />
                </span>
                <div className="color-black-olive text-16-400">
                  <i
                    className={`bi bi-star${
                      is_interested ? "-fill" : ""
                    } me-2 pointer`}
                    onClick={() => {
                      handelAddEditMyInterest();
                    }}
                  />
                  Interested
                </div>
                {/* {!access.isAdmin && (
                  <>
                    <div className="vr ms-3 me-3" />
                    <div className="color-black-olive text-16-400 pointer">
                      <i className="bi bi-share me-2" />
                      Share
                    </div>
                  </>
                )} */}
              </div>
              {access.isAdmin && (
                <Button
                  onClick={() => {
                    setSessionId(+paramsSessionId);
                  }}
                  text="Edit"
                  btnStyle="light-outline"
                  className="h-35 text-14-500 cps-20 cpe-20"
                  icon={<i className="bi bi-pencil me-2" />}
                  isSquare
                />
              )}
            </div>
            <div className="color-black-olive text-14-400 cmt-30 cmb-26">
              {moment(session_time, "hh:mm:ss").format("hh:mm a")}
            </div>
            <div className="color-raisin-black text-22-500 cmb-16">{name}</div>
            <div className="color-black-olive text-14-400 mb-3">
              {description}
            </div>
            <div
              className="color-new-car text-14-400 pointer"
              onClick={async () => {
                const res = await generatePreSignedUrl(
                  transcription,
                  agendaPath
                );
                dispatch(downloadFile(res));
              }}
            >
              <u>Please click here to view the transcription</u>
            </div>
          </Card>
          <Card className="unset-br cpe-26 cps-26 pt-5 pb-4 mt-3 fadeInUp">
            <div className="color-raisin-black text-20-500">Speakers</div>
            <div className="d-flex">
              {speaker_details &&
                speaker_details.map((elem, index) => {
                  return (
                    <div
                      className="committee-members-card-container col-md-3 cmb-20"
                      key={index}
                    >
                      <div
                        className="shadow-block pointer"
                        onClick={() => {
                          navigate(
                            `/${memberType}/${moduleType}/speaker/${elem.id}`
                          );
                        }}
                      >
                        <div className="image-block center-flex">
                          <Profile
                            isS3UserURL
                            text={elem.name}
                            url={elem.photo}
                            size="s-163"
                          />
                        </div>
                        <div className="text-16-600 color-new-car cmt-20 pointer">
                          {elem.name}
                        </div>
                        <div className="text-16-500 color-black-olive cmt-12">
                          {elem.designation}
                        </div>
                        <div className="text-16-400 color-black-olive cmt-12">
                          {elem.institution}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
export default SessionDetails;
