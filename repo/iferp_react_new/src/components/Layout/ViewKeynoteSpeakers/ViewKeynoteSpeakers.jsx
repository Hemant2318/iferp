import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Profile from "components/Layout/Profile";
import { getDataFromLocalStorage } from "utils/helpers";
import { inviteEventMemeber, showSuccess, throwError } from "store/slices";

const ViewKeynoteSpeakers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { memberType, moduleType } = params;
  const { eventData } = useSelector((state) => ({
    eventData: state.global.eventData,
  }));
  const { speaker_details = [] } = eventData;
  const [inviteLoader, setinviteLoader] = useState("");
  const handleInvite = async (id, emailID) => {
    setinviteLoader(id);
    const response = await dispatch(
      inviteEventMemeber({
        id: params?.eventId,
        email: emailID,
        type: 3,
      })
    );
    if (response?.status === 200) {
      dispatch(showSuccess("Invitation send successfully"));
    }
    setinviteLoader("");
  };
  const handelRedirect = (e) => {
    navigate(`/${memberType}/${moduleType}/speaker/${e}`);
  };
  const access = {
    isInvite: ["0"].includes(getDataFromLocalStorage("user_type")),
  };
  return (
    <>
      {speaker_details.length === 0 ? (
        <div className="d-flex justify-content-center text-14-400 cpb-20">
          No Data Found
        </div>
      ) : (
        <div className="row">
          {speaker_details.map((childElem, childIndex) => {
            const {
              id,
              name,
              new_user_name,
              photo,
              designation,
              institution,
              is_email,
              email_id,
            } = childElem;
            return (
              <div
                className="committee-members-card-container col-md-3 cmb-20"
                key={childIndex}
              >
                <div
                  className="shadow-block d-flex flex-column h-100 pointer"
                  onClick={() => {
                    if (new_user_name) {
                      dispatch(
                        throwError({
                          message: "Speaker not register yet!",
                        })
                      );
                      return;
                    }
                    handelRedirect(id);
                  }}
                >
                  <div className="image-block center-flex">
                    <Profile
                      isS3UserURL
                      text={name || new_user_name}
                      url={photo}
                      size="s-163"
                    />
                  </div>
                  <div className="text-16-600 color-new-car cmt-20 hover-effect">
                    {name || new_user_name}
                  </div>
                  <div className="text-16-500 color-black-olive cmt-12 color-subtitle-navy">
                    {designation}
                  </div>
                  <div className="text-16-400 color-black-olive cmt-12 color-subtitle-navy">
                    {institution}
                  </div>
                  {access?.isInvite && is_email && (
                    <div>
                      <div className="text-10-400 text-danger mt-1">
                        Not Registered
                      </div>
                      <div className="center-flex mt-1">
                        <Button
                          btnStyle="primary-outline"
                          className="h-auto cps-16 cpe-16 text-nowrap text-14-400"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleInvite(id, email_id);
                          }}
                          text="Resend Invite"
                          btnLoading={inviteLoader === id}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
export default ViewKeynoteSpeakers;
