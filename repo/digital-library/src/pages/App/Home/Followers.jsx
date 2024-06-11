import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Profile, Loader } from "components";
import { fetchUserNetwork, sendRequests } from "store/globalSlice";
import {
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const Followers = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { networkData } = reduxData || {};
  const { send_follow_request, followers, following } = networkData;
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoader, setIsLoader] = useState("");

  const handelSendRequest = async (data) => {
    const { id } = data;
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
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="shadow mt-4">
      <div className="text-17-400 lh-24 color-3d3d cps-22 cpt-20 cpb-20">
        Followers {`${followers?.length > 0 ? `(${followers?.length})` : ""}`}
      </div>
      <div className="bt-e3e3" />
      <div className="cps-20 cpt-20 cpe-20 cpb-20 d-flex flex-column gap-3">
        {isPageLoading ? (
          <div className="pt-5 pb-5">
            <Loader size="md" />
          </div>
        ) : followers?.length === 0 ? (
          <div className="center-flex d-flex align-items-center justify-content-center">
            No Records Found
          </div>
        ) : (
          followers?.slice(0, 4)?.map((elem, index) => {
            const { id, name, state, country, profile_photo_path } = elem;
            const isExist = send_follow_request?.find((o) => o?.id === id)
              ? true
              : false;
            const isAlreadyFollow = following?.find((o) => o?.id === id)
              ? true
              : false;
            const isHide = id === getDataFromLocalStorage("id");

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
                      {titleCaseString(name)}
                    </div>
                    <div className="text-13-400 lh-21 color-5555">
                      {state && country ? `${state}, ${country}` : ""}
                    </div>
                  </div>
                </div>
                {!isHide && (
                  <div>
                    <Button
                      btnText={
                        isExist
                          ? "Cancel"
                          : isAlreadyFollow
                          ? "Unfollow"
                          : "Follow"
                      }
                      btnStyle={!isAlreadyFollow ? "SO" : "GO"}
                      className={`h-38 ${
                        isAlreadyFollow ? "ps-3 pe-3" : "ps-4 pe-4"
                      }`}
                      onClick={() => {
                        handelSendRequest({
                          id,
                          isExist,
                          elem,
                        });
                      }}
                      btnLoading={isLoader === id}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Followers;
