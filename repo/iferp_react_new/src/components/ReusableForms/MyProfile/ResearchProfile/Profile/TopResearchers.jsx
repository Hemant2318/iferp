import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import Button from "components/form/Button/Button";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchResearchStatistics, sendRequests } from "store/slices";
import {
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const TopResearchers = ({ userID, myNetworkData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [topResearch, setTopResearch] = useState([]);
  const [networkData, setNetworkData] = useState({
    followers: [],
    following: [],
    receive_follow_request: [],
    send_follow_request: [],
  });
  const [isLoader, setIsLoader] = useState("");
  const handelSendRequest = async (data) => {
    const { id, alreadySend, alreadyFollow, elem } = data;
    setIsLoader(id);
    const response = await dispatch(
      sendRequests(objectToFormData({ receiver_id: id }))
    );
    if (response?.status === 200) {
      if (!alreadyFollow && !alreadySend) {
        setNetworkData((prev) => {
          return {
            ...prev,
            send_follow_request: [...prev.send_follow_request, elem],
          };
        });
      } else {
        setNetworkData((prev) => {
          let newFollowing = prev.following.filter((o) => o.id !== elem.id);
          let newSendFollowRequest = prev.send_follow_request.filter(
            (o) => o.id !== elem.id
          );
          return {
            ...prev,
            following: newFollowing,
            send_follow_request: newSendFollowRequest,
          };
        });
      }
      setIsLoader("");
    } else {
      setIsLoader("");
    }
  };

  const getTopResearch = async () => {
    const response = await dispatch(
      fetchResearchStatistics(`?user_id=${userID}`)
    );
    setTopResearch(response?.data?.trending_researchers || []);
    setIsPageLoading(false);
  };
  useEffect(() => {
    setNetworkData(myNetworkData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myNetworkData]);

  useEffect(() => {
    getTopResearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let displayData = [];
  if (topResearch.length > 0) {
    displayData = topResearch.filter((_, i) => i <= 9);
  }
  const { send_follow_request, following } = networkData || {};

  return (
    <Card className="unset-br mb-3">
      <div className="d-flex justify-content-between align-items-center cps-16 cpt-22 cpb-22 cpe-16 border-bottom">
        <div className="text-16-500 color-black-olive">Top Researchers</div>
      </div>
      <div className="cps-16 cpe-16 cpt-22 cpb-22">
        {isPageLoading ? (
          <div className="pt-5 pb-5">
            <Loader size="sm" />
          </div>
        ) : topResearch.length === 0 ? (
          <div className="pt-5 pb-5 text-center text-12-400">
            No Top Researchers Found.
          </div>
        ) : (
          displayData.map((elem, index) => {
            const { id, name, description, profile_photo_path } = elem;
            let alreadySend = send_follow_request?.some((o) => o.id === id);
            let alreadyFollow = following?.some((o) => o.id === id);
            return (
              <div
                key={index}
                className={`d-flex align-items-center flex-wrap ${
                  topResearch.length - 1 === index ? "" : "mb-3"
                }`}
              >
                <Profile
                  isRounded
                  text={name}
                  size="s-48"
                  url={profile_photo_path}
                  isS3UserURL
                />
                <div className="ms-3 w-100">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="text-14-500 color-new-car">
                      {titleCaseString(name)}
                    </div>
                    <Button
                      isSquare
                      text={
                        alreadySend || alreadyFollow ? "Unfollow" : "Follow"
                      }
                      btnStyle="primary-outline"
                      className={`h-35 text-14-500 text-nowrap ${
                        alreadySend || alreadyFollow ? "ps-3 pe-3" : "ps-4 pe-4"
                      }`}
                      btnLoading={isLoader === id}
                      onClick={() => {
                        if (getDataFromLocalStorage("id")) {
                          handelSendRequest({
                            id,
                            alreadySend,
                            alreadyFollow,
                            elem,
                          });
                        } else {
                          navigate("/member/login");
                        }
                      }}
                    />
                  </div>
                  <div className="text-13-400 color-black-olive mt-1">
                    {description}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
export default TopResearchers;
