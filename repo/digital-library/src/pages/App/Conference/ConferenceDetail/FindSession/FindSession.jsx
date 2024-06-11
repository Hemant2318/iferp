import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Back, Loader } from "components";
import { icons } from "utils/constants";
import { getEvent } from "store/globalSlice";

const FindSession = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { eventID } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [sessionList, setSessionList] = useState([]);

  const getPageData = async () => {
    const res = await dispatch(getEvent(eventID));
    let sList = [];
    res?.data?.event_agendas?.forEach((elm) => {
      if (elm?.agenda_sessions?.length > 0) {
        sList.push(...elm.agenda_sessions);
      }
    });
    setSessionList(sList);
    setIsLoading(false);
  };

  useEffect(() => {
    getPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container bg-feff">
      <div className="shadow cpt-28 cps-28 cpe-28 cpb-28">
        <Back>
          <div className="text-28-400 color-3d3d">Find Session</div>
        </Back>
        {isLoading ? (
          <div className="center-flex cpt-100 cpb-100 f-center b-e3e3 mt-3 br-4">
            <Loader size="md" />
          </div>
        ) : sessionList?.length === 0 ? (
          <div className="center-flex cpt-100 cpb-100 f-center b-e3e3 mt-3 br-4">
            No Data Found
          </div>
        ) : (
          <div className="row mt-3">
            {sessionList.map((elm, index) => {
              return (
                <div className="col-md-6 cmb-26" key={index}>
                  <div
                    className="cp-16 border rounded text-18-400 color-3d3d h-100 pointer"
                    onClick={() => {
                      navigate(
                        `/conference/${eventID}/find-session/${elm?.id}`
                      );
                    }}
                  >
                    <div className="fb-center">
                      <div>
                        <span className="me-1">Session {index + 1}:</span>
                        <span>{elm?.name}</span>
                      </div>
                      <div>
                        <img src={icons.roundedArrow} alt="right" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindSession;
