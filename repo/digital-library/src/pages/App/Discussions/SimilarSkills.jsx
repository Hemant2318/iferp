import Button from "components/inputs/Button";
import Card from "components/layouts/Card";
import Profile from "components/layouts/Profile";
import { useDispatch } from "react-redux";
import {
  getDataFromLocalStorage,
  objectToFormData,
  objectToQueryParams,
  titleCaseString,
} from "../../../utils/helpers/common";
import { useEffect, useState } from "react";
import {
  fetchFollowerOrFollowing,
  fetchMembersSkills,
  fetchRequests,
  sendRequests,
} from "../../../store/globalSlice";
import Loader from "../../../components/layouts/Loader";
import { cloneDeep } from "lodash";

const SimilarSkills = () => {
  const dispatch = useDispatch();
  const userData = getDataFromLocalStorage();
  const [loader, setLoader] = useState(false);
  const [peopleData, setPeopleData] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [list, setList] = useState([]);
  const [sendRequestLoader, setSendRequestLoader] = useState("");

  const handelConnect = async (uId) => {
    setSendRequestLoader(uId);
    let id = uId;
    const response = await dispatch(
      sendRequests(objectToFormData({ receiver_id: id }))
    );

    if (response?.status === 200) {
      let oldList = cloneDeep(requestList);
      if (oldList?.find((o) => `${o?.id}` === `${id}`)) {
        oldList = oldList?.filter((o) => `${o?.id}` !== `${id}`);
      } else {
        oldList = [...oldList, response?.data];
      }
      setRequestList(oldList);
    }
    setSendRequestLoader("");
  };

  const getRequest = async () => {
    const response = await dispatch(fetchRequests({ type: "following" }));
    setRequestList(response?.data?.result);
  };

  const getFollowing = async () => {
    const response = await dispatch(
      fetchFollowerOrFollowing(objectToFormData({ type: "following" }))
    );
    setList(response?.data?.result || []);
  };

  const getMemberSkills = async () => {
    setLoader(true);
    const queryParams = objectToQueryParams({ id: userData?.id });
    const response = await dispatch(fetchMembersSkills(queryParams));
    if (response?.status === 200) {
      setPeopleData(response?.data || []);
    }
    setLoader(false);
  };

  useEffect(() => {
    getMemberSkills();
    getFollowing();
    getRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="cmt-20">
      <div className="text-16-400 lh-24 color-4d4d cps-22 cpt-16 cpb-10">
        People with Similar Skills
      </div>
      <div className="bt-e3e3" />
      {loader ? (
        <div className="d-flex align-items-center justify-content-center h-100 cpt-100 cpb-100">
          <Loader size="sm" />
        </div>
      ) : (
        <>
          <div className="cps-20 cpt-20 cpe-20 cpb-20 d-flex flex-column gap-3">
            {peopleData?.length > 0 ? (
              peopleData?.slice(0, 4)?.map((elm, index) => {
                const {
                  id,
                  first_name,
                  last_name,
                  designation,
                  profile_photo_path,
                } = elm;
                const isSelfUser = id === userData?.id;
                const isExist = requestList?.find((o) => `${o?.id}` === `${id}`)
                  ? true
                  : false;
                const isAlreadyExist = list?.find((o) => `${o?.id}` === `${id}`)
                  ? true
                  : false;

                return (
                  <div
                    className="fa-center gap-2 flex-xl-nowrap flex-wrap"
                    key={index}
                  >
                    <Profile
                      text={`${first_name} ${last_name}`}
                      size="s-66"
                      isS3UserURL
                      url={profile_photo_path}
                      isRounded
                    />
                    <div
                      style={{ minWidth: "1px" }}
                      className="flex-grow-1 d-inline-block"
                    >
                      <div className="text-14-500 lh-21 color-4d4d hover-effect pointer w-100 d-inline-block">
                        {titleCaseString(`${first_name} ${last_name}`)}
                      </div>
                      {designation && (
                        <span className="text-13-400 lh-21 color-5555 d-inline-block text-truncate w-100">
                          {titleCaseString(designation)}
                        </span>
                      )}
                    </div>
                    {/* <Button
                    btnText={"Follow"}
                    btnStyle={"SO"}
                    className="cps-10 cpe-10"
                    onClick={() => {
                      handelSendRequest({
                        id,
                        isExist,
                        elm,
                      });
                    }}
                    btnLoading={isLoader === id}
                  /> */}
                    {isSelfUser ? (
                      ""
                    ) : isAlreadyExist || isExist ? (
                      <Button
                        onClick={() => {}}
                        btnText={
                          isAlreadyExist
                            ? "Connected"
                            : isExist
                            ? "Request Sent"
                            : "Try To Connect"
                        }
                        btnStyle="PSO"
                        className="cps-10 cpe-10"
                        disabled
                      />
                    ) : (
                      <Button
                        btnText={"Follow"}
                        btnStyle={"SO"}
                        className="cps-10 cpe-10 h-35"
                        onClick={() => {
                          handelConnect(id);
                        }}
                        btnLoading={sendRequestLoader === id}
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 cpt-100 cpb-100">
                No Data Found.
              </div>
            )}
          </div>
          {/* {peopleData?.length > 4 && (
            <div className="text-center bg-fbfb pt-2 pb-2 border-top">
              <span className="pointer text-14-400 lh-21 color-5555">
                View all
              </span>
            </div>
          )} */}
        </>
      )}
    </Card>
  );
};

export default SimilarSkills;
