import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Modal from "components/Layout/Modal";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "store/slices";
import { getCountryCode, objectToFormData } from "utils/helpers";

const ProfileDetail = ({ onHide, userID }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const fetchPersonalEductionDetails = async () => {
    setLoader(true);
    const payload = objectToFormData({ user_id: userID });
    const response = await dispatch(fetchUserProfile(payload));
    setData(response?.data);
    setLoader(false);
  };
  useEffect(() => {
    fetchPersonalEductionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    first_name,
    last_name,
    email_id,
    country_code,
    phone_number,
    user_type,
    personal_details = {},
    educational_details = {},
    institution_details = {},
    admin_details = {},
    company_details = {},
  } = data;
  const {
    date_of_birth,
    gender,
    state_name,
    country_name,
    city_name,
    address,
  } = personal_details;
  const {
    ug_course_name,
    ug_department_name,
    ug_university_name,
    ug_institution_name,
    ug_year_of_completion,
    pg_course_name,
    pg_department_name,
    pg_university_name,
    pg_institution_name,
    pg_year_of_completion,
    phd_course_name,
    phd_department_name,
    phd_university_name,
    phd_institution_name,
    phd_year_of_completion,
    area_of_interest,
    category,
    comments,
    // is_volunteer,
    other_ug_university,
    other_ug_institution,
    other_pg_university,
    other_pg_institution,
    other_phd_university,
    other_phd_institution,
  } = educational_details;
  const {
    institution_name: institutionName,
    institution_email_id,
    institution_contact_number,
    premium_ug_students_strength,
    premium_professional_members_count,
    state_name: institutionState,
    country_name: institutionCountry,
    city_name: institutionCity,
    premium_student_members_count,
    premium_pg_students_strength,
    premium_research_scholars_strength,
    institution_departments,

    // institution_strength,
  } = institution_details;
  const {
    first_name: adminFirstName,
    last_name: adminLastName,
    email_id: adminEmailId,
    alternate_email_id,
    contact_number,
    alternate_contact_number,
  } = admin_details;

  const {
    company_name,
    company_email_id,
    company_contact_number,
    company_state_name: company_state,
    company_country_name: company_country,
    company_city_name: company_city,
    strength_of_company,
    no_of_premium_professional_members,
  } = company_details;

  return (
    <div>
      <Modal onHide={onHide}>
        {loader ? (
          <Card className="pt-5 pb-5">
            <Loader size="sm" />
          </Card>
        ) : (
          <>
            {user_type === "3" ? (
              <Card className="cps-18 cpe-18 cpt-29 cpb-29 fadeInUp">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="text-18-500 title-text">
                    Institution Details
                  </div>
                </div>
                <div className="row cmt-28">
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    Institution/Organization Name
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {institutionName}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    Email ID
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {institution_email_id}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    Contact Number
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {institution_contact_number}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    Country
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {institutionCountry}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    State/Province
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {institutionState}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    City
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {institutionCity || ""}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    IFERP Premium Student Members
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {premium_student_members_count}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    IFERP Premium Professional Members
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {premium_professional_members_count}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    IFERP Premium U.G. Students
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {premium_ug_students_strength}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    IFERP Premium P.G. Students
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {premium_pg_students_strength}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    IFERP Premium Research Scholars
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {premium_research_scholars_strength}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    Departments
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {institution_departments}
                  </div>
                </div>
              </Card>
            ) : user_type === "4" ? (
              <Card className="cps-18 cpe-18 cpt-29 cpb-29 fadeInUp">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="text-18-500 title-text">Company Details</div>
                </div>
                <div className="row cmt-28">
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    Company Name
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {company_name}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    Company Email ID
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {company_email_id}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    Company Contact Number
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {company_contact_number}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    Country
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {company_country}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    State/Province
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {company_state}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    City
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {company_city || ""}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    Strength of the company
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {strength_of_company}
                  </div>
                  <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                    IFERP Premium Professional Members
                  </div>
                  <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                    {no_of_premium_professional_members}
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="cps-18 cpe-18 cpt-29 cpb-29 fadeInUp">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="text-18-500 title-text">Personal Details</div>
                </div>
                <div className="row cmt-28">
                  {first_name && (
                    <>
                      <div className="col-md-3 cmb-22 text-15-400 color-raisin-black">
                        First Name
                      </div>
                      <div className="col-md-3 cmb-22 text-15-500 color-raisin-black text-break">
                        {first_name}
                      </div>
                    </>
                  )}
                  {last_name && (
                    <>
                      <div className="col-md-3 cmb-22 text-15-400 color-raisin-black">
                        Last Name
                      </div>
                      <div className="col-md-3 cmb-22 text-15-500 color-raisin-black text-break">
                        {last_name}
                      </div>
                    </>
                  )}
                  {phone_number && (
                    <>
                      <div className="col-md-3 cmb-22 text-15-400 color-raisin-black">
                        Phone Number
                      </div>
                      <div className="col-md-3 cmb-22 text-15-500 color-raisin-black text-break">
                        {phone_number &&
                          `${getCountryCode(
                            country_code || "IN"
                          )} ${phone_number}`}
                      </div>
                    </>
                  )}
                  {email_id && (
                    <>
                      <div className="col-md-3 cmb-22 text-15-400 color-raisin-black">
                        Email ID
                      </div>
                      <div className="col-md-3 cmb-22 text-15-500 color-raisin-black text-break">
                        {email_id}
                      </div>
                    </>
                  )}
                  {date_of_birth && (
                    <>
                      <div className="col-md-3 cmb-22 text-15-400 color-raisin-black">
                        Date of Birth
                      </div>
                      <div className="col-md-3 cmb-22 text-15-500 color-raisin-black text-break">
                        {date_of_birth}
                      </div>
                    </>
                  )}
                  {gender && (
                    <>
                      <div className="col-md-3 cmb-22 text-15-400 color-raisin-black">
                        Gender
                      </div>
                      <div className="col-md-3 cmb-22 text-15-500 color-raisin-black text-break">
                        {gender}
                      </div>
                    </>
                  )}
                  {country_name && (
                    <>
                      <div className="col-md-3 cmb-22 text-15-400 color-raisin-black">
                        Country
                      </div>
                      <div className="col-md-3 cmb-22 text-15-500 color-raisin-black text-break">
                        {country_name}
                      </div>
                    </>
                  )}
                  {state_name && (
                    <>
                      <div className="col-md-3 cmb-22 text-15-400 color-raisin-black">
                        State/Province
                      </div>
                      <div className="col-md-3 cmb-22 text-15-500 color-raisin-black text-break">
                        {state_name}
                      </div>
                    </>
                  )}
                  {address && (
                    <>
                      <div className="col-md-3 cmb-22 text-15-400 color-raisin-black">
                        Door No., Street Name
                      </div>
                      <div className="col-md-3 cmb-22 text-15-500 color-raisin-black text-break">
                        {address}
                      </div>
                    </>
                  )}
                  {city_name && (
                    <>
                      <div className="col-md-3 cmb-22 text-15-400 color-raisin-black">
                        City
                      </div>
                      <div className="col-md-3 cmb-22 text-15-500 color-raisin-black text-break">
                        {city_name || ""}
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}
            {user_type === "3" || user_type === "4" ? (
              <Card className="cps-18 cpe-18 cpt-29 cpb-29 mt-4 fadeInUp">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="text-18-500 title-text">Admin Details</div>
                </div>
                <div className="row cmt-28">
                  {adminFirstName && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        First Name
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {adminFirstName}
                      </div>
                    </>
                  )}
                  {adminLastName && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Last Name
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {adminLastName}
                      </div>
                    </>
                  )}
                  {adminEmailId && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Email ID
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {adminEmailId}
                      </div>
                    </>
                  )}
                  {alternate_email_id && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Alternate Email ID
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {alternate_email_id}
                      </div>
                    </>
                  )}
                  {contact_number && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Contact Number
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {contact_number}
                      </div>
                    </>
                  )}
                  {alternate_contact_number && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Alternate Contact Number
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {alternate_contact_number}
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="cps-18 cpe-18 cpt-29 cpb-29 mt-4 fadeInUp">
                {ug_course_name && (
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="text-18-500 title-text">
                      Education Details
                    </div>
                  </div>
                )}
                <div className="row cmt-28">
                  {ug_course_name && (
                    <>
                      <div className="text-15-600 color-raisin-black cmb-16">
                        Academic Details
                      </div>
                      <div className="col-md-12 cmb-22 text-15-600 color-raisin-black">
                        Bachelor Degree/UG Details
                      </div>
                    </>
                  )}
                  {ug_course_name && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Course Name
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {ug_course_name}
                      </div>
                    </>
                  )}
                  {ug_department_name && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Deparment
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {ug_department_name}
                      </div>
                    </>
                  )}
                  {ug_university_name && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        University
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {`${ug_university_name} ${
                          other_ug_university ? ` (${other_ug_university})` : ""
                        }`}
                      </div>
                    </>
                  )}
                  {ug_institution_name && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Institution
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {`${ug_institution_name} ${
                          other_ug_institution
                            ? ` (${other_ug_institution})`
                            : ""
                        }`}
                      </div>
                    </>
                  )}
                  {ug_year_of_completion && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Year of Completion
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {ug_year_of_completion}
                      </div>
                    </>
                  )}
                  {ug_course_name && (
                    <>
                      <div className="border-bottom cmb-22" />
                    </>
                  )}
                  {pg_course_name && (
                    <div className="col-md-12 cmb-22 text-15-600 color-raisin-black">
                      Master Degree/PG Details
                    </div>
                  )}
                  {pg_course_name && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Course Name
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {pg_course_name}
                      </div>
                    </>
                  )}
                  {pg_department_name && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Deparment
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {pg_department_name}
                      </div>
                    </>
                  )}
                  {pg_university_name && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        University
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {`${pg_university_name} ${
                          other_pg_university ? ` (${other_pg_university})` : ""
                        }`}
                      </div>
                    </>
                  )}
                  {pg_institution_name && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Institution
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {`${pg_institution_name} ${
                          other_pg_institution
                            ? ` (${other_pg_institution})`
                            : ""
                        }`}
                      </div>
                    </>
                  )}
                  {pg_year_of_completion && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Year of Completion
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {pg_year_of_completion}
                      </div>
                    </>
                  )}
                  {pg_course_name && (
                    <>
                      <div className="border-bottom cmb-22" />
                    </>
                  )}
                  {phd_course_name && (
                    <div className="col-md-12 cmb-22 text-15-600 color-raisin-black">
                      Doctorate/Ph.D Programme Details
                    </div>
                  )}
                  {phd_course_name && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Course Name
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {phd_course_name}
                      </div>
                    </>
                  )}
                  {phd_department_name && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Deparment
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {phd_department_name}
                      </div>
                    </>
                  )}
                  {phd_university_name && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        University
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {`${phd_university_name} ${
                          other_phd_university
                            ? ` (${other_phd_university})`
                            : ""
                        }`}
                      </div>
                    </>
                  )}
                  {phd_institution_name && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Institution
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {`${phd_institution_name} ${
                          other_phd_institution
                            ? ` (${other_phd_institution})`
                            : ""
                        }`}
                      </div>
                    </>
                  )}
                  {phd_year_of_completion && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Year of Completion
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {phd_year_of_completion}
                      </div>
                    </>
                  )}
                  {phd_course_name && (
                    <>
                      <div className="border-bottom cmb-22" />
                    </>
                  )}
                  {(area_of_interest || category || comments) && (
                    <div className="text-15-600 color-raisin-black cmb-16">
                      Interests
                    </div>
                  )}
                  {area_of_interest && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Area of Interest
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {area_of_interest}
                      </div>
                    </>
                  )}
                  {category && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Category
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {category}
                      </div>
                    </>
                  )}
                  {comments && (
                    <>
                      <div className="col-md-4 cmb-22 text-15-400 color-raisin-black">
                        Comments
                      </div>
                      <div className="col-md-8 cmb-22 text-15-500 color-raisin-black text-break">
                        {comments}
                      </div>
                    </>
                  )}
                  {/* <div className="col-md-5 cmb-22 text-15-400 color-raisin-black">
              Interested in volunteering IFERP events
            </div>
            <div className="col-md-7 cmb-22 text-15-500 color-raisin-black text-break">
              {is_volunteer === "1" ? "Yes" : "No"}
            </div> */}
                </div>
              </Card>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};
export default ProfileDetail;
