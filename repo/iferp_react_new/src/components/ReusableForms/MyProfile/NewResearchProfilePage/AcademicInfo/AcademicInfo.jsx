import React, { useState } from "react";
import { titleCaseString } from "utils/helpers";
import Profile from "components/Layout/Profile";
import { useSelector } from "react-redux";
import Button from "components/form/Button";
import { icons } from "utils/constants";
import PreviewEditDetails from "components/Layout/GlobalProfilePreviewPopup/PreviewEditDetails";
import "./AcademicInfo.scss";

const AcademicInfo = ({
  isEdit,
  fetchDetails,
  isPreviewOnDashboard,
  setIsEditData,
  isEditData,
}) => {
  const { rProfileData, researchProfile, userDetails } = useSelector(
    (state) => ({
      rProfileData: state.global.rProfileData,
      researchProfile: state.student.researchProfile,
      userDetails: state.student.userDetails,
    })
  );

  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [formType, setFormType] = useState(null);

  const { affiliations, current_journal_roles, achievements, publication } =
    isEdit ? researchProfile : rProfileData || {};
  const { professional_details = {} } = userDetails;
  const memberTypeId = userDetails?.user_type;
  const {
    institution_name,
    department,
    designation,
    address,
    professional_experience,
    industry_experience,
    country_name,
    state_name,
  } = professional_details;

  return (
    <div className="academic-info-container">
      {formType && (
        <PreviewEditDetails
          formType={formType}
          onHide={() => {
            setFormType(null);
            setIsFieldEmpty(false);
          }}
          fetchDetails={fetchDetails}
          isFieldEmpty={isFieldEmpty}
        />
      )}

      {/*Experience */}
      <div className="academic-experience-block">
        <div
          className={`${
            isEdit ? "d-flex align-items-center justify-content-between" : ""
          } cmb-10`}
        >
          <div className="text-18-500 color-5068 ">Experience</div>
          {affiliations?.length > 0 && isEdit && (
            <div className="cmb-20">
              <Button
                isSquare
                text="Edit"
                onClick={() => {
                  setFormType(1);
                }}
                btnStyle="primary-outline"
                className="h-45 btn-round-premium"
                icon={
                  <img src={icons.primaryEdit} alt="edit" className="me-2" />
                }
              />
            </div>
          )}
        </div>

        {/* Current experience */}
        {memberTypeId === "2" && (
          <>
            <div className="text-18-500 color-5068 cmb-10">
              Current Experience
            </div>
            <div className="row cmb-30">
              <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30 text-nowrap">
                Institution
              </div>
              <div className="col-md-10 col-sm-8 cmb-30">
                <span className="red-round-block lh-40">
                  {titleCaseString(institution_name)}
                </span>
              </div>
              <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30 text-nowrap">
                Department
              </div>
              <div className="col-md-10 col-sm-8 cmb-30">
                <span className="red-round-block">
                  {titleCaseString(department)}
                </span>
              </div>
              <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30 text-nowrap">
                Designation
              </div>
              <div className="col-md-10 col-sm-8 cmb-30">
                {designation ? (
                  <span className="red-round-block">
                    {titleCaseString(designation)}
                  </span>
                ) : (
                  <span className="cps-5">-</span>
                )}
              </div>
              <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30 text-nowrap">
                Professional Experience
              </div>
              <div className="col-md-10 col-sm-8 cmb-15">
                {professional_experience ? (
                  <span className="red-round-block">
                    {titleCaseString(professional_experience)}
                  </span>
                ) : (
                  <span className="cps-5">-</span>
                )}
              </div>
              <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30 text-nowrap">
                Industry Experience
              </div>
              <div className="col-md-10 col-sm-8 cmb-30">
                {industry_experience ? (
                  <span className="red-round-block">
                    {titleCaseString(industry_experience)}
                  </span>
                ) : (
                  <span className="cps-5">-</span>
                )}
              </div>
              <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-15 text-nowrap">
                Address
              </div>
              <div className="col-md-10 col-sm-8 cmb-15">
                {address || country_name || state_name ? (
                  <span className="red-round-block">
                    {`${address ? `${address},` : ""} ${
                      state_name && country_name
                        ? `${state_name}, ${country_name}`
                        : ""
                    }`}
                  </span>
                ) : (
                  <span className="cps-5">-</span>
                )}
              </div>
            </div>
          </>
        )}

        {/* Academic experience */}
        {affiliations?.length > 0 && (
          <div className="text-18-500 color-5068 cmb-10">Past Experience</div>
        )}

        {affiliations?.length > 0 ? (
          affiliations?.map((elem, index) => {
            const { institution, country_name, department, position } = elem;
            return (
              <React.Fragment key={index}>
                <div className="row cmb-30">
                  <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30 text-nowrap">
                    Institution
                  </div>
                  <div className="col-md-10 col-sm-8 cmb-30">
                    <span className="red-round-block lh-40">
                      {titleCaseString(institution)}
                    </span>
                  </div>
                  <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30 text-nowrap">
                    Department
                  </div>
                  <div className="col-md-10 col-sm-8 cmb-30">
                    <span className="red-round-block">
                      {titleCaseString(department)}
                    </span>
                  </div>
                  <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30 text-nowrap">
                    Position
                  </div>
                  <div className="col-md-10 col-sm-8 cmb-30">
                    <span className="red-round-block">
                      {titleCaseString(position)}
                    </span>
                  </div>
                  <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-15 text-nowrap">
                    Country
                  </div>
                  <div className="col-md-10 col-sm-8 cmb-15">
                    <span className="red-round-block">
                      {titleCaseString(country_name)}
                    </span>
                  </div>
                </div>
                {affiliations?.length - 1 !== index && (
                  <div className="card-border-bottom cmb-15"></div>
                )}
              </React.Fragment>
            );
          })
        ) : (
          <>
            {isEdit ? (
              <div
                className="center-flex flex-column mt-3 pointer cpb-20"
                onClick={() => {
                  setFormType(1);
                }}
              >
                <div>
                  <img src={icons.affiliations} alt="affiliations" />
                </div>
                <div className="text-15-500 color-black-olive mt-1 mb-1">
                  <u className="hover-effect">
                    Add additional academic experience
                  </u>
                </div>
                <div className="text-14-400 color-subtitle-navy text-center">
                  Add your current and past academic experience to give a
                  complete picture of where you've worked
                </div>
              </div>
            ) : (
              <div className="text-15-500 color-4b4b cmt-10">
                Experience has not added by the user!
              </div>
            )}
          </>
        )}
      </div>
      <div className="card-border-bottom cmb-15"></div>

      {/* Publications */}
      <div className="publication-block">
        <div
          className={`${
            isEdit ? "d-flex align-items-center justify-content-between" : ""
          } `}
        >
          {(isEdit ? publication?.length > 0 : publication?.length === 0) && (
            <div className="text-18-500 color-5068 cmb-10">Publications</div>
          )}
          {publication?.length > 0 && isEdit && (
            <div className="cmb-20">
              <Button
                isSquare
                text="Edit"
                onClick={() => {
                  setFormType(2);
                }}
                btnStyle="primary-outline"
                className="h-45 btn-round-premium"
                icon={
                  <img src={icons.primaryEdit} alt="edit" className="me-2" />
                }
              />
            </div>
          )}
        </div>
        {publication?.length > 0 ? (
          publication?.map((elem, index) => {
            const {
              authors,
              co_authors,
              paper_title,
              no_of_pages,
              issn,
              publication_link,
              author_details,
            } = elem;
            const { name, profile_photo } = author_details || {};
            const isAnyCoAuthor = co_authors?.some((o) => o?.user_id);
            return (
              <React.Fragment key={index}>
                <div className="text-18-500 color-5068 cmb-10">{`Publication ${
                  index + 1
                }`}</div>
                <div className="row">
                  {authors && (
                    <>
                      <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30">
                        Author
                      </div>
                      <div className="col-md-10 col-sm-8 cmb-30">
                        <div className="d-flex align-items-center gap-2">
                          <Profile
                            size="s-18"
                            text={name}
                            isRounded
                            url={profile_photo}
                            isS3UserURL
                          />
                          <span>{name}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {isAnyCoAuthor && (
                    <>
                      <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30">
                        Co-Authors
                      </div>
                      <div className="col-md-10 col-sm-8 d-flex gap-3 cmb-30">
                        {co_authors?.map((el, ind) => {
                          return (
                            <span className="d-flex" key={ind}>
                              <span className="d-flex align-items-center gap-2">
                                <Profile
                                  size="s-18"
                                  text={el?.name || "U"}
                                  url={el?.profile_photo}
                                  isRounded
                                  isS3UserURL
                                />
                                <span>{el?.name}</span>
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                  {paper_title && (
                    <>
                      <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30">
                        Paper Title
                      </div>
                      <div className="col-md-10 col-sm-8 cmb-30">
                        <span className="red-round-block lh-40">
                          {paper_title}
                        </span>
                      </div>
                    </>
                  )}
                  {no_of_pages && (
                    <>
                      <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30">
                        No.of Pages
                      </div>
                      <div className="col-md-10 col-sm-8 cmb-30">
                        <span className="red-round-block">{no_of_pages}</span>
                      </div>
                    </>
                  )}
                  {issn && (
                    <>
                      <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30">
                        ISSN/ISBN
                      </div>
                      <div className="col-md-10 col-sm-8 cmb-30">
                        <span className="red-round-block"> {issn}</span>
                      </div>
                    </>
                  )}
                  {publication_link && (
                    <>
                      <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30">
                        Publication Link
                      </div>
                      <div className="col-md-10 col-sm-8">
                        <span className="red-round-block lh-40">
                          {publication_link}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </React.Fragment>
            );
          })
        ) : isEdit ? (
          <div
            className="center-flex flex-column mt-3 pointer cpb-20"
            onClick={() => {
              setFormType(2);
            }}
          >
            <div>
              <img src={icons.myPublication} alt="affiliations" />
            </div>
            <div className="text-15-500 color-black-olive mt-1 mb-1">
              <u className="hover-effect">Add your Publications</u>
            </div>
            <div className="text-14-400 color-subtitle-navy text-center">
              Add information about your publications
            </div>
          </div>
        ) : (
          <div className="text-15-500 color-4b4b cmt-10 cpb-10">
            Publication has not added by the user!
          </div>
        )}
      </div>
      <div className="card-border-bottom cmb-15"></div>

      {/* Current Journal Roles */}
      <div className="journal-block">
        <div
          className={`${
            isEdit ? "d-flex align-items-center justify-content-between" : ""
          } cmb-10`}
        >
          <div className="text-18-500 color-5068 cmb-10">
            Current Journal Roles
          </div>
          {current_journal_roles?.length > 0 && isEdit && (
            <div className="cmb-20">
              <Button
                isSquare
                text="Edit"
                onClick={() => {
                  setFormType(3);
                }}
                btnStyle="primary-outline"
                className="h-45 btn-round-premium"
                icon={
                  <img src={icons.primaryEdit} alt="edit" className="me-2" />
                }
              />
            </div>
          )}
        </div>
        {current_journal_roles?.length > 0 ? (
          current_journal_roles?.map((elem, index) => {
            const { journals, role } = elem;
            return (
              <div className="row" key={index}>
                <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30">{`Role ${
                  index + 1
                }`}</div>
                <div className="col-md-10 col-sm-8 cmb-30">
                  <span className="red-round-block">
                    {titleCaseString(role)}
                  </span>
                </div>
                <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30">
                  Journal Name
                </div>
                <div className="col-md-10 col-sm-8 cmb-30">
                  <span className="red-round-block lh-40">
                    {titleCaseString(journals)}
                  </span>
                </div>
              </div>
            );
          })
        ) : isEdit ? (
          <div
            className="center-flex flex-column mt-3 cpb-20 pointer"
            onClick={() => {
              setFormType(3);
              setIsFieldEmpty(true);
            }}
          >
            <div>
              <img src={icons.journalRole} alt="affiliations" />
            </div>
            <div className="text-15-500 color-black-olive mt-1 mb-1">
              <u className="hover-effect">Add your current journal roles </u>
            </div>
            <div className="text-14-400 color-subtitle-navy text-center">
              Let others know about any work you do for scientific journals.
            </div>
          </div>
        ) : (
          <div className="text-15-500 color-4b4b cmt-10 cpb-10">
            Current Journal Roles has not added by the user!
          </div>
        )}
      </div>
      <div className="card-border-bottom cmb-15"></div>

      {/* Achievements */}
      <div className="achievement-block">
        <div
          className={`${
            isEdit ? "d-flex align-items-center justify-content-between" : ""
          } cmb-10`}
        >
          <div className="text-18-500 color-5068 cmb-10">Achievements</div>

          {achievements?.length > 0 && isEdit && (
            <div className="cmb-20">
              <Button
                isSquare
                text="Edit"
                onClick={() => {
                  setFormType(4);
                }}
                btnStyle="primary-outline"
                className="h-45 btn-round-premium"
                icon={
                  <img src={icons.primaryEdit} alt="edit" className="me-2" />
                }
              />
            </div>
          )}
        </div>
        {achievements?.length > 0 ? (
          achievements?.map((elem, index) => {
            const { award_name, event_name, category } = elem;
            return (
              <div className="row" key={index}>
                <div className="col-md-2  col-sm-4 text-16-500 color-4453 cmb-30">
                  {`Award Name ${index + 1}`}
                </div>
                <div className="col-md-10 col-sm-8 cmb-30">
                  <span className="red-round-block lh-40">
                    {titleCaseString(award_name)}
                  </span>
                </div>
                <div className="col-md-2  col-sm-4 text-16-500 color-4453 cmb-30">
                  Event Name
                </div>
                <div className="col-md-10 col-sm-8 cmb-30">
                  <span className="red-round-block lh-40">
                    {titleCaseString(event_name)}
                  </span>
                </div>

                <div className="col-md-2 col-sm-4 text-16-500 color-4453 cmb-30">
                  Category
                </div>
                <div className="col-md-10 col-sm-8">
                  <span className="red-round-block">
                    {titleCaseString(category)}
                  </span>
                </div>
              </div>
            );
          })
        ) : isEdit ? (
          <div
            className="center-flex flex-column mt-3 pointer"
            onClick={() => {
              setFormType(4);
              setIsFieldEmpty(true);
            }}
          >
            <div>
              <img src={icons.achivment} alt="affiliations" />
            </div>
            <div className="text-15-500 color-black-olive mt-1 mb-1">
              <u className="hover-effect">Add your Achievements</u>
            </div>
            <div className="text-14-400 color-subtitle-navy text-center">
              Add information about your studies so that others can understand
              your research and background.
            </div>
          </div>
        ) : (
          <div className="text-15-500 color-4b4b cmt-10 cpb-10">
            Achievements has not added by the user!
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicInfo;
