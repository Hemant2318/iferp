import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "components/Layout/Profile";
import Button from "components/form/Button";
import { inviteEventMemeber, showSuccess, throwError } from "store/slices";
import { convertOCMToType, getDataFromLocalStorage } from "utils/helpers";

const ViewCommitteeMembers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { memberType, moduleType } = params;
  const { eventData, comitteeMemberCategoryList } = useSelector((state) => ({
    eventData: state.global.eventData,
    comitteeMemberCategoryList: state.global.comitteeMemberCategoryList,
  }));
  const [inviteLoader, setinviteLoader] = useState("");
  const handleInvite = async (id, emailID) => {
    setinviteLoader(id);
    const response = await dispatch(
      inviteEventMemeber({
        id: params?.eventId,
        email: emailID,
        type: 2,
      })
    );
    if (response?.status === 200) {
      dispatch(showSuccess("Invitation send successfully"));
    }
    setinviteLoader("");
  };
  const handelRedirect = (e) => {
    navigate(`/${memberType}/${moduleType}/committee-member/${e}`);
  };
  const { committee_members = [] } = eventData;
  const access = {
    isInvite: ["0"].includes(getDataFromLocalStorage("user_type")),
  };
  return (
    <>
      {committee_members.length === 0 ? (
        <div className="d-flex justify-content-center text-14-400 cpb-20 cmt-24">
          No Data Found
        </div>
      ) : (
        convertOCMToType(comitteeMemberCategoryList, committee_members).map(
          (elem, index) => {
            return (
              <React.Fragment key={index}>
                <div
                  className={`text-18-500 color-new-car cmt-12 cpb-20 cps-18 cpe-18 ${
                    elem.data.length === 0 ? "d-none" : ""
                  }`}
                >
                  {elem.name}
                  <div className="row">
                    {elem.data.map((childElem, childIndex) => {
                      const {
                        id,
                        member_name,
                        new_user_name,
                        photo,
                        designation,
                        institution,
                        is_email,
                        email_id,
                      } = childElem;
                      let displayName = member_name || new_user_name || "";
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
                                    message: "Member not register yet!",
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
                                text={displayName}
                                url={photo}
                                size="s-163"
                              />
                            </div>
                            <div className="text-16-600 color-new-car cmt-20 hover-effect">
                              {displayName}
                            </div>
                            <div className="text-16-500 color-black-olive cmt-12 text-uppercase color-subtitle-navy">
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
                </div>
              </React.Fragment>
            );
          }
        )
      )}
    </>
  );
};
export default ViewCommitteeMembers;
