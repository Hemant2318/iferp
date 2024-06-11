import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Loader, Profile } from "components";
import { icons } from "utils/constants";
import {
  sendRequests,
  fetchUserNetwork,
  fetchResearchStatistics,
} from "store/globalSlice";
import {
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const TopResearchers = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { networkData } = reduxData || {};
  const { send_follow_request, following } = networkData;
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [topResearch, setTopResearch] = useState([]);
  const [isLoader, setIsLoader] = useState("");

  const getTopResearch = async () => {
    const response = await dispatch(
      fetchResearchStatistics(`?user_id=${getDataFromLocalStorage("id")}`)
    );
    setTopResearch(response?.data?.trending_researchers || []);
    setIsPageLoading(false);
  };
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
  useEffect(() => {
    getTopResearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let displayData = [];
  if (topResearch?.length > 0) {
    displayData = topResearch?.filter((_, i) => i <= 30);
  }

  return (
    <div className="container bg-feff top-researchers">
      <div className="row">
        <div className="cp-20 text-18-500 lh-21 color-2121">
          Top Researchers
          {`${topResearch?.length > 0 ? ` (${topResearch?.length})` : ""}`}
        </div>
      </div>
      <div className="row mt-2">
        {isPageLoading ? (
          <div className="cpt-150 cpb-150">
            <Loader size="lg" />
          </div>
        ) : topResearch?.length === 0 ? (
          <div className="pt-5 pb-5 text-center text-12-400">
            No Top Researchers Found.
          </div>
        ) : (
          displayData?.map((elm, index) => {
            const {
              id,
              name,
              profile_photo_path,
              degree_name,
              designation,
              total_presentation,
            } = elm;
            const isExist = send_follow_request?.find(
              (o) => `${o?.id}` === `${id}`
            )
              ? true
              : false;
            const isAlreadyFollow = following.find(
              (o) => `${o?.id}` === `${id}`
            )
              ? true
              : false;

            return (
              <div className="col-md-6 cmb-26 h-100" key={index}>
                <div className="cp-20 shadow">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="">
                        <Profile
                          text={name}
                          url={profile_photo_path}
                          size="s-160"
                          isS3UserURL
                        />
                      </div>
                      {/* <Profile url={icons.principal} /> */}
                    </div>
                    <div className="col-md-8 flex-column">
                      <div className="text-18-500 color-2d2d">{name}</div>
                      <div className="text-14-400 color-3d3d mt-1">
                        {titleCaseString(degree_name)}
                      </div>
                      <div className="text-14-400 color-3d3d mt-1">
                        {titleCaseString(designation)}
                      </div>
                      <div className="text-15-400 color-3d3d mt-2">
                        <img src={icons.videoIcon} alt="video-icon" />{" "}
                        {total_presentation} Presentations
                      </div>
                      <div className="d-flex gap-4 mt-4">
                        <div className="d-flex align-items-end">
                          <Button
                            btnText={
                              isAlreadyFollow
                                ? "Unfollow"
                                : isExist
                                ? "Cancel"
                                : "Follow"
                            }
                            btnStyle="SD"
                            btnLoading={isLoader === id}
                            className="text-15-500 lh-21 h-32 cps-40 cpe-40"
                            onClick={() => {
                              handelSendRequest(id);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* {topResearch.length > 10 && (
        <div className="row">
          <div className="fj-center mt-4">
            <Button
              btnText="View all"
              btnStyle="SD"
              onClick={() => {}}
              rightIcon={icons.rightSuccess}
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default TopResearchers;
