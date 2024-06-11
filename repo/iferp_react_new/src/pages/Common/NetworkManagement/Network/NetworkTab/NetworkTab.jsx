import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import ChatProfile from "components/Layout/ChatProfile";
import Following from "./Following";
import SentRequests from "./SentRequests";
import NewRequests from "./NewRequests";
import Followers from "./Followers";
import { useEffect } from "react";
import { getDataFromLocalStorage } from "utils/helpers";
import { fetchUserNetwork } from "store/slices";

const NetworkTab = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const { memberType, cType } = params;
  // const { myNetworkDetails } = useSelector((state) => ({
  //   myNetworkDetails: state.global.myNetworkDetails,
  // }));
  const reduxData = useSelector((state) => state.global);
  const { networkListData } = reduxData || {};
  const { followers, following } = networkListData;
  const data = getDataFromLocalStorage();
  const redirectToChat = (groupID) => {
    localStorage.redirectChat = groupID;
    navigate(`/${params?.memberType}/network-management/network/chat/message`);
  };
  const redirect = (optionType) => {
    navigate(`/${memberType}/network-management/network/network/${optionType}`);
  };

  // const { followers, followings } = myNetworkDetails;

  const activeClass = "p-2 bg-new-car color-white text-16-500 text-nowrap";
  const inActiveClass = "p-2 color-black-olive text-16-500 pointer text-nowrap";

  //new code
  const fetchList = async () => {
    await dispatch(fetchUserNetwork(`?user_id=${data?.id}`));
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="row w-100 cmt-26">
      <div
        className={
          cType === "follower" || cType === "following"
            ? ""
            : "col-md-8 col-12 mb-3"
        }
      >
        <Card className="d-flex align-items-center justify-content-between p-1 unset-br mb-3">
          <div className="d-flex align-items-center flex-wrap gap-3">
            <div
              className={cType === "new-requests" ? activeClass : inActiveClass}
              onClick={() => {
                redirect("new-requests");
              }}
            >
              New Requests
            </div>
            <div
              className={
                cType === "sent-requests" ? activeClass : inActiveClass
              }
              onClick={() => {
                redirect("sent-requests");
              }}
            >
              Sent Requests
            </div>
            <div
              className={cType === "follower" ? activeClass : inActiveClass}
              onClick={() => {
                redirect("follower");
              }}
            >
              Followers ({followers?.length || 0})
            </div>
            <div
              className={cType === "following" ? activeClass : inActiveClass}
              onClick={() => {
                redirect("following");
              }}
            >
              Following ({following?.length || 0})
            </div>
          </div>
        </Card>
        {cType === "new-requests" && <NewRequests />}
        {cType === "sent-requests" && <SentRequests />}
        {cType === "follower" && <Followers redirectToChat={redirectToChat} />}
        {cType === "following" && <Following redirectToChat={redirectToChat} />}
      </div>
      {(cType === "new-requests" || cType === "sent-requests") && (
        <div className="col-md-4 col-12 mb-3">
          <ChatProfile />
        </div>
      )}
    </div>
  );
};
export default NetworkTab;
