import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import { fetchMyDetails } from "store/slices";
import { getDataFromLocalStorage } from "utils/helpers";
import Feedback from "./Feedback";
import Network from "./Network";
import NetworkList from "./NetworkList";

const NetworkManagement = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { memberType, type, pType } = params;
  const navigate = useNavigate();
  const getMyDetails = async () => {
    await dispatch(fetchMyDetails());
  };
  useEffect(() => {
    getMyDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pType]);

  const activeClass = "p-2 bg-new-car color-white text-16-500";
  const inActiveClass = "p-2 color-black-olive text-16-500 pointer";
  const userType = getDataFromLocalStorage("user_type");

  return (
    <>
      {["0", "6"].includes(userType) && (
        <Card className="d-flex align-items-center flex-wrap gap-3 p-1 unset-br mb-4">
          {userType === "0" && (
            <div
              className={type === "network-list" ? activeClass : inActiveClass}
              onClick={() => {
                navigate(`/${memberType}/network-management/network-list`);
              }}
            >
              Network Management
            </div>
          )}
          <div
            className={type === "network" ? activeClass : inActiveClass}
            onClick={() => {
              navigate(
                `/${memberType}/network-management/network/posts/discover-posts`
              );
            }}
          >
            {`${
              userType === "0" ? "Admin " : userType === "6" ? "Resource " : ""
            }Network`}
          </div>
          <div
            className={type === "feedback" ? activeClass : inActiveClass}
            onClick={() => {
              navigate(`/${memberType}/network-management/feedback`);
            }}
          >
            Feedback
          </div>
        </Card>
      )}
      {type === "network-list" && <NetworkList />}
      {type === "network" && <Network />}
      {type === "feedback" && <Feedback />}
    </>
  );
};
export default NetworkManagement;
