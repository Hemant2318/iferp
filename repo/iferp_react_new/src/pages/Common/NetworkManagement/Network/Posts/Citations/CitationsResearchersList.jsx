import React, { useState } from "react";
import { Card } from "react-bootstrap";
import {
  fetchFollowerOrFollowing,
  fetchRequests,
  fetchTopCitations,
  sendRequests,
  setRProfileID,
  throwError,
  throwSuccess,
} from "store/slices";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import Profile from "components/Layout/Profile";
import { cloneDeep } from "lodash";

function CitationsResearchersList({ postID, setConnectModel }) {
  const [citationList, setCitationList] = useState([]);
  const [isConnectLoader, setIsConnectLoader] = useState("");
  const [requestList, setRequestList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const dispatch = useDispatch();

  const getCitationList = async () => {
    const response = await dispatch(
      fetchTopCitations(objectToFormData({ post_id: postID }))
    );
    if (response?.data) {
      setCitationList(response?.data);
    }
  };

  const handelSendRequest = async (id) => {
    if (!getDataFromLocalStorage("id") && setConnectModel) {
      setConnectModel(true);
      return;
    }
    setIsConnectLoader(id);
    const response = await dispatch(
      sendRequests(objectToFormData({ receiver_id: id }))
    );
    if (response?.status === 200) {
      dispatch(throwSuccess(response?.message));
      let oldList = cloneDeep(requestList);
      if (oldList?.find((o) => `${o.id}` === `${id}`)) {
        oldList = oldList?.filter((o) => `${o.id}` !== `${id}`);
      } else {
        oldList = [...oldList, response?.data];
      }
      setRequestList(oldList);
      setIsConnectLoader("");
    } else {
      dispatch(throwError(response?.message));
    }
    setIsConnectLoader("");
  };

  const getRequest = async () => {
    const response = await dispatch(fetchRequests({ type: "following" }));
    setRequestList(response?.data?.result);
  };

  const getFollowing = async () => {
    const response = await dispatch(
      fetchFollowerOrFollowing(objectToFormData({ type: "following" }))
    );
    setFollowingList(response?.data?.result || []);
  };

  useEffect(() => {
    getRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citationList]);

  useEffect(() => {
    getCitationList();
    getFollowing();
    getRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Card className="mt-2 border-0">
        <div className="cpt-16 cps-24 cpb-16 border-bottom text-16-400">
          Top Citing Researchers
        </div>
        <div id="custom-card-container">
          {citationList?.length === 0 ? (
            <div className="cps-8 cpe-8 cpt-8 cpb-12 d-flex justify-content-center color-dark-silver">
              No Records Found.
            </div>
          ) : (
            citationList?.map((elm, index) => {
              const {
                citation_count,
                profile,
                name,
                university,
                user_id,
                user_type,
              } = elm;
              const isAlreadyFollow = followingList?.find(
                (o) => `${o.id}` === `${user_id}`
              )
                ? true
                : false;
              const isExist = requestList?.find(
                (o) => `${o.id}` === `${user_id}`
              )
                ? true
                : false;
              const isReasearchProfile = ["2", "5"].includes(user_type);

              return (
                <>
                  <div className="cps-8 cpe-8 cpt-8 cpb-12">
                    <div class="request-block p-2">
                      <div class="text-14-400 color-3765 mt-1 mb-2">
                        {citation_count} Citations
                      </div>
                      <div class="d-flex justify-content-between align-items-center flex-wrap">
                        <div class="d-flex align-items-center left-block mb-3">
                          <Profile
                            isRounded
                            isS3UserURL
                            text={name}
                            size="s-52"
                            url={profile}
                          />
                          <div class="user-details-block ms-3 ">
                            <div
                              class="text-15-400 text-truncate d-inline-block w-100 color-new-car pointer"
                              onClick={() => {
                                if (isReasearchProfile) {
                                  dispatch(setRProfileID(user_id));
                                }
                              }}
                            >
                              {name}
                            </div>
                            <div class="text-14-400 color-black-olive mt-1">
                              {university}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="button-container">
                        <button
                          type="button"
                          btnLoading={isConnectLoader === user_id}
                          class="btn w-70 d-flex align-items-center justify-content-center primary-outline btn-square h-auto text-nowrap text-14-400"
                          onClick={() => handelSendRequest(user_id)}
                        >
                          {isExist
                            ? "Cancel"
                            : isAlreadyFollow
                            ? "Unfollow"
                            : "Follow"}
                        </button>
                      </div>
                    </div>
                  </div>
                  {citationList?.length > 1 &&
                    index !== citationList?.length - 1 && (
                      <div className="border-bottom text-16-400"></div>
                    )}
                </>
              );
            })
          )}
        </div>
      </Card>
    </>
  );
}

export default CitationsResearchersList;
