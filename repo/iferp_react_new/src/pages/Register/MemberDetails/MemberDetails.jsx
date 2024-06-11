import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "utils/constants";
import { objectToFormData, titleCaseString } from "utils/helpers";
import PersonalDetails from "./PersonalDetails";
import EducationDetails from "./EducationDetails";
import MembershipDetails from "./MembershipDetails";
import InstitutionDetails from "./InstitutionDetails";
import AdminDetails from "./AdminDetails";
import CompanyDetails from "./CompanyDetails";
import { useDispatch } from "react-redux";
import { editMembership } from "store/slices";
import "./MemberDetails.scss";

const formTypeArray = [
  "personal-details",
  "education-details",
  "membership-details",
  "institution-details",
  "admin-details",
  "company-details",
  "preview-details",
];
const MemberDetails = ({
  userDetails,
  fetchUserData,
  memberType,
  memberTypeId,
}) => {
  const dispatch = useDispatch();
  const {
    id,
    is_admin_add,
    registration_status,
    personal_details = {},
    company_details = {},
    institution_details = {},
    professional_details = {},
  } = userDetails;
  const { country_name } = personal_details;
  const { company_country_name } = company_details;
  const { country_name: institutionCountry } = institution_details;
  const { country_name: professionalCountry } = professional_details;
  const isNational =
    country_name === "India" ||
    company_country_name === "India" ||
    institutionCountry === "India" ||
    professionalCountry === "India";
  const nevigate = useNavigate();
  const params = useParams();
  const getTypeFromParams = (type) => {
    if (formTypeArray.includes(type)) {
      return type;
    } else {
      nevigate(`/${memberType}/dashboard`);
      return "";
    }
  };

  const [type, setType] = useState(getTypeFromParams(params?.formType));

  const handleDirectRegister = async () => {
    let forData = objectToFormData({
      id: id,
      order_id: "",
      payment_id: "",
      payment_method: isNational ? "INR" : "USD",
      amount: 0,
    });
    const response = await dispatch(editMembership(forData));
    if (response?.status === 200) {
      nevigate(`/${memberType}/dashboard`);
      nevigate(0);
    }
  };
  useEffect(() => {
    if (registration_status === "4") {
      nevigate(`/${memberType}/dashboard`);
    }
    setType(getTypeFromParams(params?.formType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.formType]);

  const arrayOption = [
    {
      id: 1,
      title:
        memberTypeId === "4"
          ? "Company Details"
          : memberTypeId === "3"
          ? "Institution Details"
          : "Personal Details",
      isActive: +registration_status >= 1,
    },
    {
      id: 2,
      title:
        memberTypeId === "3" || memberTypeId === "4"
          ? "Admin Details"
          : "Education Details",
      isActive: +registration_status >= 2,
    },
    {
      id: 3,
      title: "Membership Details",
      isActive: +registration_status >= 3,
    },
  ];

  return (
    <div id="member-details-container">
      <div className="text-center text-26-600 color-raisin-black mb-5">
        {memberType === "institutional"
          ? "Institutional / Organizational"
          : titleCaseString(memberType)}{" "}
        Member Registration
      </div>
      <div className="details-list">
        {arrayOption.map((elem, index) => {
          return (
            <React.Fragment key={index}>
              <div className="details-block">
                {elem.isActive ? (
                  <img
                    src={icons.activeDetails}
                    alt="active"
                    className="active-selection"
                  />
                ) : (
                  <div className="number-block">{elem.id}</div>
                )}
                <div
                  className={`text-18-400 ${
                    elem.isActive ? "color-new-car" : "color-black-olive"
                  }`}
                  onClick={() => {
                    // setType(elem.id);
                  }}
                >
                  {elem.title}
                </div>
              </div>
              {arrayOption.length - 1 !== index && (
                <div
                  className={`border-saprator ${
                    elem.isActive ? "active-border" : ""
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="cmt-40">
        {type === "personal-details" && (
          <PersonalDetails
            userDetails={userDetails}
            fetchUserData={fetchUserData}
            handelSuccess={() => {
              nevigate(
                `/${memberType}/register/${params.userId}/education-details`
              );
            }}
          />
        )}
        {type === "institution-details" && (
          <InstitutionDetails
            userDetails={userDetails}
            fetchUserData={fetchUserData}
            handelSuccess={() => {
              nevigate(
                `/${memberType}/register/${params.userId}/admin-details`
              );
            }}
          />
        )}
        {type === "education-details" && (
          <EducationDetails
            userDetails={userDetails}
            isDirectRegister={
              is_admin_add === "1" && registration_status !== "4"
            }
            handleDirectRegister={handleDirectRegister}
            fetchUserData={fetchUserData}
            handelSuccess={() => {
              nevigate(
                `/${memberType}/register/${params.userId}/membership-details`
              );
            }}
          />
        )}
        {type === "admin-details" && (
          <AdminDetails
            userDetails={userDetails}
            fetchUserData={fetchUserData}
            isDirectRegister={
              is_admin_add === "1" && registration_status !== "4"
            }
            handleDirectRegister={handleDirectRegister}
            handelSuccess={() => {
              nevigate(
                `/${memberType}/register/${params.userId}/membership-details`
              );
            }}
          />
        )}
        {type === "membership-details" && (
          <MembershipDetails
            userDetails={userDetails}
            fetchUserData={fetchUserData}
            memberType={memberType}
            handelSuccess={() => {
              nevigate(
                `/${memberType}/register/${params.userId}/preview-details`
              );
            }}
          />
        )}
        {type === "company-details" && (
          <CompanyDetails
            userDetails={userDetails}
            fetchUserData={fetchUserData}
            handelSuccess={() => {
              nevigate(
                `/${memberType}/register/${params.userId}/admin-details`
              );
            }}
          />
        )}
      </div>
    </div>
  );
};
export default MemberDetails;
