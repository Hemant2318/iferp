import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import Button from "components/form/Button/Button";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { sendRequests, setRProfileID } from "store/slices";
import {
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const Followers = ({ myNetworkData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { memberType } = params;
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoader, setIsLoader] = useState("");
  const [networkData, setNetworkData] = useState({
    followers: [],
    following: [],
    receive_follow_request: [],
    send_follow_request: [],
  });
  const handelSendRequest = async (data) => {
    const { id, isExist, elem } = data;
    setIsLoader(id);
    const response = await dispatch(
      sendRequests(objectToFormData({ receiver_id: id }))
    );
    if (response?.status === 200) {
      if (isExist) {
        setNetworkData((prev) => {
          let newSendFollowRequest = prev.send_follow_request.filter(
            (o) => o.id !== elem.id
          );

          return {
            ...prev,
            send_follow_request: newSendFollowRequest,
          };
        });
      } else {
        setNetworkData((prev) => {
          return {
            ...prev,
            send_follow_request: [...prev.send_follow_request, elem],
          };
        });
      }
      setIsLoader("");
    } else {
      setIsLoader("");
    }
  };
  const handelRedirect = () => {
    navigate(`/${memberType}/network-management/network/network/follower`);
  };
  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setNetworkData(myNetworkData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myNetworkData]);

  const { send_follow_request, followers, following } = networkData || {};

  return (
    <Card className="unset-br">
      <div className="d-flex justify-content-between align-items-center cps-16 cpt-22 cpb-22 cpe-16 border-bottom">
        <div className="text-16-500 color-black-olive">
          Followers ({followers.length})
        </div>
      </div>
      <div className="cps-16 cpe-16 cpt-22 cpb-22">
        {isPageLoading ? (
          <div className="pt-5 pb-5">
            <Loader size="sm" />
          </div>
        ) : followers.length === 0 ? (
          <div className="pt-5 pb-5 text-center text-12-400">
            No Followers Found.
          </div>
        ) : (
          followers.map((elem, index) => {
            const { id, name, state, profile_photo_path, user_type } = elem;
            const isReasearchProfile = ["2", "5"].includes(user_type);
            const isExist = send_follow_request.find((o) => o.id === id)
              ? true
              : false;
            const isAlreadyFollow = following.find((o) => o.id === id)
              ? true
              : false;
            const isHide = id === getDataFromLocalStorage("id");
            return (
              <div
                key={index}
                className={`d-flex align-items-center ${
                  followers.length - 1 === index ? "" : "mb-3"
                }`}
              >
                <Profile
                  isRounded
                  text={name}
                  size="s-48"
                  url={profile_photo_path}
                />
                <div className="ms-3 w-100">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div
                      className={`text-14-500 ${
                        isReasearchProfile
                          ? "color-new-car pointer"
                          : "color-raisin-black"
                      }`}
                      onClick={() => {
                        if (isReasearchProfile) {
                          dispatch(setRProfileID(id));
                        }
                      }}
                    >
                      {titleCaseString(name)}
                    </div>
                    {!isHide && (
                      <Button
                        isSquare
                        text={
                          isExist
                            ? "Cancel"
                            : isAlreadyFollow
                            ? "Unfollow"
                            : "Follow"
                        }
                        btnStyle="primary-outline"
                        className={`h-35 text-14-500 text-nowrap ${
                          isAlreadyFollow ? "ps-3 pe-3" : "ps-4 pe-4"
                        }`}
                        btnLoading={isLoader === id}
                        onClick={() => {
                          handelSendRequest({
                            id,
                            isExist,
                            elem,
                          });
                        }}
                      />
                    )}
                  </div>
                  <div className="text-13-400 color-black-olive mt-1">
                    {state}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {followers.length > 0 && (
        <div
          className="center-flex border-top bg-platinum text-14-400 cpt-12 cpb-12 pointer"
          onClick={handelRedirect}
        >
          View all
        </div>
      )}
    </Card>
  );
};
export default Followers;
