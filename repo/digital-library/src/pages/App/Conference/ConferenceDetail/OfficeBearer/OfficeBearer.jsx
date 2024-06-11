import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Back, Loader, Profile } from "components";
import { objectToFormData, getDataFromLocalStorage } from "utils/helpers";
import {
  sendRequests,
  fetchUserNetwork,
  fetchUserEventDetails,
} from "store/globalSlice";

const OfficeBearer = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { eventID } = params;
  const reduxData = useSelector((state) => state.global);
  const { networkData } = reduxData || {};
  const { send_follow_request, following } = networkData;
  const [communityList, setCommunity] = useState([]);
  const [isLoader, setIsLoader] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);

  const fetchEventCommunity = async () => {
    const res = await dispatch(
      fetchUserEventDetails({
        event_id: eventID,
        user_id: getDataFromLocalStorage("id"),
      })
    );
    setCommunity(res?.data?.committee_members || []);
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
    fetchEventCommunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container bg-feff">
      <div className="shadow cpt-28 cps-28 cpe-28 cpb-28">
        <Back>
          <div className="text-28-400 color-3d3d">Office Bearer</div>
        </Back>
        {isPageLoading ? (
          <div className="center-flex cpt-100 cpb-100 f-center b-e3e3 mt-3 br-4">
            <Loader size="md" />
          </div>
        ) : communityList?.length === 0 ? (
          <div className="center-flex cpt-100 cpb-100 f-center b-e3e3 mt-3 br-4">
            No Data Found
          </div>
        ) : (
          <div className="row mt-3">
            {communityList?.map((elm, index) => {
              const {
                member_id,
                member_name,
                designation,
                committee_member_category_name,
                institution,
                country_name,
                photo,
              } = elm;
              const isExist = send_follow_request.find(
                (o) => `${o.id}` === `${member_id}`
              )
                ? true
                : false;
              const isAlreadyFollow = following.find(
                (o) => `${o.id}` === `${member_id}`
              )
                ? true
                : false;
              return (
                <div className="col-md-6 mb-3 d-flex flex-column" key={index}>
                  <div className="text-18-500 mb-2">
                    {committee_member_category_name}
                  </div>
                  <div className="cp-26 b-e3e3 d-flex gap-3 flex-grow-1">
                    <div>
                      <Profile
                        isS3UserURL
                        size="s-173"
                        text={member_name}
                        url={photo}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex flex-column h-100">
                        <div className="text-18-600 color-b8e3">
                          {member_name}
                        </div>
                        <div className="text-15-500 color-3d3d mt-1">
                          {designation}
                        </div>
                        <div className="text-14-400 color-3d3d mt-1">
                          {institution}
                        </div>
                        <div className="text-14-400 color-3d3d">
                          {country_name}
                        </div>
                        <div className="flex-grow-1 d-flex align-items-end mt-2">
                          <Button
                            btnText={
                              isExist
                                ? "Cancel"
                                : isAlreadyFollow
                                ? "Unfollow"
                                : "Follow"
                            }
                            btnStyle={!isAlreadyFollow ? "SO" : "GO"}
                            onClick={() => {
                              handelSendRequest(member_id);
                            }}
                            className="cps-40 cpe-40"
                            btnLoading={isLoader === member_id}
                          />
                        </div>
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

export default OfficeBearer;
