import React, { useState } from "react";
import Button from "components/form/Button";
import { icons } from "utils/constants";
import { useSelector } from "react-redux";
import moment from "moment";
import { getDataFromLocalStorage, titleCaseString } from "utils/helpers";
import PreviewCareerInfoPopup from "components/Layout/PreviewCareerInfoPopup";
import "./CareerObjectivesInfo.scss";

const CareerObjectivesInfo = ({
  setConnectModel,
  isLoginUser,
  userID,
  isSelfUser,
  isExist,
  isAlreadyExist,
  isConnectLoader,
  handelConnect,
  isEdit,
  fetchDetails,
}) => {
  const { rProfileData, researchProfile } = useSelector((state) => ({
    rProfileData: state.global.rProfileData,
    researchProfile: state.student.researchProfile,
  }));
  const [editInfo, setEditInfo] = useState(false);

  const data = getDataFromLocalStorage();
  const { about, educational_details, profile_details } = isEdit
    ? researchProfile
    : rProfileData || {};
  const { first_name, last_name, area_of_interest, mentor_status, speaker_id } =
    profile_details || {};

  const education = [];
  if (typeof educational_details === "object") {
    if (educational_details?.ug_course_name) {
      education.push(
        `UG - ${educational_details?.ug_course_name}, ${
          educational_details?.ug_department_name
        } (${moment(educational_details?.ug_year_of_completion).format(
          "YYYY"
        )})`
      );
    }

    if (educational_details?.pg_course_name !== "") {
      education.push(
        `PG - ${educational_details?.pg_course_name}, ${
          educational_details?.pg_department_name
        } (${moment(educational_details?.pg_year_of_completion).format(
          "YYYY"
        )})`
      );
    }

    if (educational_details?.phd_course_name !== "") {
      education.push(
        `Ph.D - ${educational_details?.phd_course_name}, ${
          educational_details?.phd_department_name
        } (${moment(educational_details?.phd_year_of_completion).format(
          "YYYY"
        )})`
      );
    }
  }
  return (
    <div className="career-objectives-info-container">
      {editInfo && (
        <PreviewCareerInfoPopup
          onHide={() => {
            setEditInfo(false);
          }}
          fetchDetails={fetchDetails}
        />
      )}
      <div className="d-flex align-items-center justify-content-between cmb-20 flex-wrap">
        <div className="d-flex align-items-center gap-3">
          {first_name && (
            <div className="text-24-600 color-4b4b">{`${first_name} ${last_name}`}</div>
          )}
        </div>
        <div className="d-flex align-items-center gap-3 flex-wrap cmt-10">
          {isEdit && (
            <div className="cmb-20">
              <Button
                isSquare
                text="Edit"
                onClick={() => {
                  setEditInfo(true);
                }}
                btnStyle="primary-outline"
                className="h-45 btn-round-premium"
                icon={
                  <img src={icons.primaryEdit} alt="edit" className="me-2" />
                }
              />
            </div>
          )}
          {speaker_id && (
            <div className="d-flex justify-content-center cmb-20 color-a31a text-14-500">
              <span className="speaker-outline br-4 d-flex gap-2 align-items-center justify-content-center p-2">
                <img src={icons.speakerIcon} alt="user" />
                Speaker
              </span>
            </div>
          )}
          {mentor_status === "Accepted" && (
            <div className="d-flex justify-content-center cmb-20 color-2796 text-14-500">
              <span className="mentor-outline br-4 d-flex gap-2 align-items-center justify-content-center p-2">
                <img src={icons.mentorIcon} alt="user" />
                Mentor
              </span>
            </div>
          )}
          {(isLoginUser ? +userID !== data?.id : !isLoginUser) &&
            (isSelfUser ? (
              ""
            ) : isAlreadyExist || isExist ? (
              <Button
                onClick={() => {}}
                text={
                  isAlreadyExist
                    ? "Connected"
                    : isExist
                    ? "Request Sent"
                    : "Try To Connect"
                }
                btnStyle={
                  speaker_id ? "follow-dark-orange" : "follow-dark-green"
                }
                icon={<img src={icons.userIcon} alt="user" />}
                className="btn-round-premium gap-2 text-14-500 cmb-20"
                btnLoading={isConnectLoader}
                disabled
              />
            ) : (
              <Button
                onClick={() => {
                  if (!isLoginUser) {
                    setConnectModel(true);
                    return;
                  }
                  handelConnect();
                }}
                text="Follow"
                btnStyle={
                  speaker_id ? "follow-dark-orange" : "follow-dark-green"
                }
                icon={<img src={icons.userIcon} alt="user" />}
                className="btn-round-premium gap-2 text-14-500 cmb-20"
                btnLoading={isConnectLoader}
              />
            ))}
        </div>
      </div>
      {/* {about?.id || area_of_interest ? ( */}
      <>
        {about?.id && (
          <div className="bg-f3fb p-3 br-10 cmb-20">
            <div className="text-15-500 color-5068">Career Objective</div>
            <div className="text-14-400 color-4b4b">
              {titleCaseString(about?.introduction)}
            </div>
          </div>
        )}

        {/* {about?.id && ( */}
        <div className="row cmb-20">
          <div className="text-16-500 color-5068 col-md-2">Disciplines</div>
          <div className="d-flex flex-wrap gap-3 col-md-10">
            {about?.disciplines ? (
              about?.disciplines?.split(",")?.map((elem, index) => {
                return (
                  <span
                    className="red-round-block text-16-24 color-4b4b"
                    key={index}
                  >
                    {elem}
                  </span>
                );
              })
            ) : (
              <div className="d-flex align-items-center text-15-500 color-4b4b">
                Disciplines has not added by the user!
              </div>
            )}
          </div>
        </div>
        {/* )} */}
        {/* {area_of_interest && ( */}
        <div className="row cmb-20">
          <div className="text-16-500 color-5068 col-md-2">
            Skills & Expertise
          </div>
          <div className="d-flex flex-wrap gap-3 col-md-10">
            {area_of_interest ? (
              area_of_interest?.split(",")?.map((elem, index) => {
                return (
                  <span
                    className="red-round-block text-16-24 color-4b4b"
                    key={index}
                  >
                    {elem}
                  </span>
                );
              })
            ) : (
              <div className="d-flex align-items-center text-15-500 color-4b4b">
                Skills & Expertise has not added by the user!
              </div>
            )}
          </div>
        </div>
        {/* )} */}

        {/* {about?.id && ( */}
        <div className="row cmb-20">
          <div className="text-16-500 color-5068 col-md-2">Languages</div>
          <div className="d-flex flex-wrap gap-3 col-md-10">
            {about?.languages ? (
              about?.languages?.split(",")?.map((elem, index) => {
                return (
                  <span
                    className="red-round-block text-16-24 color-4b4b"
                    key={index}
                  >
                    {elem}
                  </span>
                );
              })
            ) : (
              <div className="d-flex align-items-center text-15-500 color-4b4b">
                Languages has not added by the user!
              </div>
            )}
          </div>
        </div>
        {/* )} */}
        {/* {typeof educational_details === "object" && ( */}
        <div className="row cmb-20">
          <div className="text-16-500 color-5068 col-md-2">Education</div>
          <div className="d-flex flex-wrap gap-3 col-md-10">
            {education ? (
              education.map((elem, index) => {
                return (
                  <span
                    className="red-round-block text-16-24 color-4b4b"
                    key={index}
                  >
                    {elem}
                  </span>
                );
              })
            ) : (
              <div className="d-flex align-items-center text-15-500 color-4b4b">
                Education has not added by the user!
              </div>
            )}
          </div>
        </div>
        {/* )} */}
      </>
      {/* ) : (
        <div className="cpt-300 cpb-300 text-center d-flex align-items-center justify-content-center">
          No Records Found.
        </div>
      )} */}
    </div>
  );
};

export default CareerObjectivesInfo;
