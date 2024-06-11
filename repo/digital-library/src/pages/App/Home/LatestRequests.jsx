import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Profile, Loader } from "components";
import { acceptRequests, fetchUserNetwork } from "store/globalSlice";
import { objectToFormData } from "utils/helpers";

const LatestRequests = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { networkData } = reduxData || {};
  const { receive_follow_request } = networkData;
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [btnLoader, setBtnLoader] = useState("");

  const handelRequest = async (id, type) => {
    setBtnLoader(`${id}-${type}`);
    const response = await dispatch(
      acceptRequests(objectToFormData({ sender_id: id, status: type }))
    );
    if (response?.status === 200) {
      dispatch(fetchUserNetwork());
    }
    setBtnLoader("");
  };

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="shadow">
      <div className="text-17-400 lh-24 color-3d3d cps-22 cpt-20 cpb-20">
        Latest Requests{" "}
        {receive_follow_request?.length > 0 &&
          `(${receive_follow_request?.length})`}
      </div>
      <div className="bt-e3e3" />
      <div className="cps-20 cpt-20 cpe-20 cpb-20 d-flex flex-column gap-3">
        {isPageLoading ? (
          <div className="pt-5 pb-5">
            <Loader size="md" />
          </div>
        ) : receive_follow_request?.length === 0 ? (
          <div className="center-flex d-flex align-items-center justify-content-center">
            No Records Found
          </div>
        ) : (
          receive_follow_request?.slice(0, 4)?.map((elm, index) => {
            const { id, name, state, country, profile_photo_path } = elm;
            return (
              <div className="fa-center gap-2" key={index}>
                <Profile
                  text={name}
                  url={profile_photo_path}
                  size="s-66"
                  isRounded
                  isS3UserURL={true}
                />
                <div className="fb-center flex-grow-1">
                  <div>
                    <div className="text-15-500 lh-21 color-4d4d hover-effect pointer">
                      {name}
                    </div>
                    <div className="text-13-400 lh-21 color-5555">
                      {state}, {country}
                    </div>
                  </div>
                </div>
                <div>
                  <Button
                    btnText="Accept"
                    btnStyle="SO"
                    className="h-38"
                    onClick={() => {
                      handelRequest(id, "1");
                    }}
                    btnLoading={`${id}-1` === btnLoader}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* {receive_follow_request?.length > 4 && (
        <div className="text-center bg-f0f0 pt-2 pb-2">
          <span className="pointer text-14-400 lh-21 color-5555">View all</span>
        </div>
      )} */}
    </div>
  );
};

export default LatestRequests;
