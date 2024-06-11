import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import { editMembership, showSuccess, throwError } from "store/slices";
import { decrypt, encrypt, objectToFormData } from "utils/helpers";
// import PayButton from "components/Layout/PayButton";
import CCAvenuePay from "components/Layout/CCAvenuePay";

const MembershipPreviewDetails = ({
  userDetails,
  memberType,
  memberTypeId,
}) => {
  const htmlElRef = useRef(null);
  const params = useParams();
  const dispatch = useDispatch();
  const nevigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);
  const handelPay = async (paymentValue) => {
    let forData = objectToFormData({
      id: params?.userId,
      ...paymentValue,
    });
    const response = await dispatch(editMembership(forData));
    if (response?.status === 200) {
      nevigate(`/${memberType}/dashboard`);
      nevigate(0);
    }
    setBtnLoading(false);
  };

  useEffect(() => {
    if (localStorage.paymentIntent) {
      let localInitValue = {};
      let localResponse = {};
      if (localStorage.paymentIntent) {
        localInitValue = decrypt(localStorage.paymentIntent);
      }
      if (localStorage.paymentResponse) {
        localResponse = decrypt(localStorage.paymentResponse);
      }
      const { order_status, status_message } = localResponse;
      if (order_status === "Success") {
        setBtnLoading(true);
        dispatch(showSuccess(status_message));
        setTimeout(() => {
          handelPay({
            order_id: localResponse?.order_id || "",
            payment_id: localResponse?.tracking_id || "",
            payment_method: localInitValue?.currency,
            amount: localInitValue?.amount,
          });
        }, 1500);
      } else if (status_message) {
        dispatch(
          throwError({
            message: status_message,
          })
        );
      } else {
        // Nothing
      }
      setTimeout(() => {
        htmlElRef?.current?.scrollIntoView({ behavior: "smooth" });
        localStorage.removeItem("paymentResponse");
        localStorage.removeItem("paymentIntent");
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    first_name,
    last_name,
    email_id,
    phone_number,
    registration_status,
    personal_details = {},
    educational_details = {},
    professional_details = {},
    admin_details = {},
    institution_details = {},
    company_details = {},
    membership_details = {},
  } = userDetails;
  const {
    date_of_birth,
    gender,
    country_name,
    state_name,
    city_name,
    address,
  } = personal_details;
  const {
    first_name: adminFirstName,
    last_name: adminLastName,
    email_id: adminEmailId,
    alternate_email_id,
    contact_number,
    alternate_contact_number,
  } = admin_details;
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
    address: institutionAddress,
    pincode: institutionPincode,
    premium_student_members_count,
    premium_pg_students_strength,
    premium_research_scholars_strength,
    institution_departments,
    // institution_strength,
  } = institution_details;
  const {
    institution_name,
    department,
    designation,
    address: professionalAddress,
    // pincode: professionalPincode,
    professional_experience,
    industry_experience,
    country_name: professionalCountry,
    state_name: professionalState,
  } = professional_details;
  const {
    company_name,
    company_email_id,
    company_contact_number,
    company_state_name,
    company_country_name,
    company_city_name,
    strength_of_company,
    address: companyAddress,
    pincode: companyPincode,
    no_of_premium_professional_members,
  } = company_details;
  const {
    amount,
    amount_without_tax,
    plan_name,
    text_percentage,
    usd_amount,
    usd_text_percentage,
    usd_amount_without_tax,
  } = membership_details;
  const isNational =
    country_name === "India" ||
    company_country_name === "India" ||
    institutionCountry === "India" ||
    professionalCountry === "India";
  const data = [
    {
      key: "Institution Details",
      isHide: memberTypeId !== "3",
      data: [
        {
          key: "Institution / Organization Name",
          value: institutionName,
        },
        {
          key: "Institution Email ID",
          value: institution_email_id,
        },
        {
          key: "contact Number",
          value: institution_contact_number,
        },
        {
          key: "Country",
          value: institutionCountry,
        },
        {
          key: "State/Province",
          value: institutionState,
        },
        {
          key: "City",
          value: institutionCity || "",
        },
        {
          key: "Address",
          value: institutionAddress || "",
        },
        {
          key: "Pin Code",
          value: institutionPincode || "",
        },
        {
          key: "IFERP Premium Student Members",
          value: premium_student_members_count,
        },
        {
          key: "IFERP Premium Professional Members",
          value: premium_professional_members_count,
        },
        {
          key: "Strength of Premium U.G. Students",
          value: premium_ug_students_strength,
        },
        {
          key: "Strength of Premium P.G. Students",
          value: premium_pg_students_strength,
        },
        {
          key: "Strength of Premium Research Scholars",
          value: premium_research_scholars_strength,
        },
        {
          key: "Departments of your organization",
          value: institution_departments,
        },
      ],
    },
    {
      key: "Personal Details",
      isHide: !(memberTypeId === "2" || memberTypeId === "5"),
      data: [
        {
          key: "First Name",
          value: first_name,
        },
        {
          key: "Last Name",
          value: last_name,
        },
        {
          key: "Phone Number",
          value: phone_number,
        },
        {
          key: "Email ID",
          value: email_id,
        },
        {
          key: "Date Of Birth",
          value: date_of_birth,
        },
        {
          key: "Gender",
          value: gender,
        },
        {
          key: "Country",
          value: country_name,
        },
        {
          key: "State/Province",
          value: state_name,
        },
        {
          key: "Door No. , Street Name",
          value: address,
        },
        {
          key: "Area Name, City",
          value: city_name || "",
        },
      ],
    },
    {
      key: memberTypeId === "5" ? "Education Details" : "Academic Details",
      isHide: !(memberTypeId === "2" || memberTypeId === "5"),
      data: [
        {
          key: "Bachelor Degree/UG Details",
          value: "",
        },
        {
          key: "Course Name",
          value: ug_course_name,
        },
        {
          key: "Deparment",
          value: ug_department_name,
        },
        {
          key: "University",
          value: `${ug_university_name} ${
            other_ug_university ? ` (${other_ug_university})` : ""
          }`,
        },
        {
          key: "Institution",
          value: `${ug_institution_name} ${
            other_ug_institution ? ` (${other_ug_institution})` : ""
          }`,
        },
        {
          key: "Year of Completion",
          value: ug_year_of_completion,
        },
        {
          key: "Master Degree/PG Details",
          value: "",
        },
        {
          key: "Course Name",
          value: pg_course_name || "--Not Applicable--",
        },
        {
          key: "Deparment",
          value: pg_department_name || "--Not Applicable--",
        },
        {
          key: "University",
          value:
            `${pg_university_name} ${
              other_pg_university ? ` (${other_pg_university})` : ""
            }` || "--Not Applicable--",
        },
        {
          key: "Institution",
          value:
            `${pg_institution_name} ${
              other_pg_institution ? ` (${other_pg_institution})` : ""
            }` || "--Not Applicable--",
        },
        {
          key: "Year of Completion",
          value: pg_year_of_completion || "--Not Applicable--",
        },
        {
          key: "Doctorate/Ph.D Programme Details",
          value: "",
        },
        {
          key: "Course Name",
          value: phd_course_name || "--Not Applicable--",
        },
        {
          key: "Deparment",
          value: phd_department_name || "--Not Applicable--",
        },
        {
          key: "University",
          value:
            `${phd_university_name} ${
              other_phd_university ? ` (${other_phd_university})` : ""
            }` || "--Not Applicable--",
        },
        {
          key: "Institution",
          value:
            `${phd_institution_name} ${
              other_phd_institution ? ` (${other_phd_institution})` : ""
            }` || "--Not Applicable--",
        },
        {
          key: "Year of Completion",
          value: phd_year_of_completion || "--Not Applicable--",
        },
        {
          key: "Professional/Organizational Details",
          value: "",
          isHide: memberTypeId !== "2",
        },
        {
          key: "Institution/Organization Name",
          value: institution_name,
          isHide: memberTypeId !== "2",
        },
        {
          key: "Department",
          value: department,
          isHide: memberTypeId !== "2",
        },
        {
          key: "Designation",
          value: designation,
          isHide: memberTypeId !== "2",
        },
        {
          key: "Address",
          value: professionalAddress,
          isHide: memberTypeId !== "2",
        },
        {
          key: "Country",
          value: professionalCountry,
          isHide: memberTypeId !== "2",
        },
        {
          key: "State/Province",
          value: professionalState,
          isHide: memberTypeId !== "2",
        },
        {
          key: "Professional Experience",
          value: professional_experience,
          isHide: memberTypeId !== "2",
        },
        {
          key: "Industry Experience",
          value: industry_experience,
          isHide: memberTypeId !== "2",
        },
      ],
    },
    {
      key: "Company Details",
      isHide: !(memberTypeId === "4"),
      data: [
        { key: "Company Name", value: company_name },
        { key: "Company Email ID", value: company_email_id },
        { key: "Company contact Number", value: company_contact_number },
        { key: "Country", value: company_country_name },
        { key: "State/Province", value: company_state_name },
        { key: "City", value: company_city_name || "" },
        { key: "Address", value: companyAddress || "" },
        { key: "Pin Code", value: companyPincode || "" },
        { key: "Strength of the Company", value: strength_of_company },
        {
          key: "IFERP Premium Professional Members",
          value: no_of_premium_professional_members,
        },
      ],
    },
    {
      key: "Admin Details",
      isHide: !(memberTypeId === "3" || memberTypeId === "4"),
      data: [
        { key: "First Name", value: adminFirstName },
        { key: "Last Name", value: adminLastName },
        { key: "Email Id", value: adminEmailId },
        { key: "Alternate Email ID", value: alternate_email_id },
        { key: "Contact Number", value: contact_number },
        { key: "Alternate Contact Number", value: alternate_contact_number },
      ],
    },
    {
      key: "Interests",
      isHide: !(memberTypeId === "2" || memberTypeId === "5"),
      data: [
        {
          key: "Area of Interest",
          value: area_of_interest || "--Not Applicable--",
        },
        { key: "Category", value: category || "--Not Applicable--" },
        { key: "Comments", value: comments || "--Not Applicable--" },
      ],
    },
    {
      key: "Membership Details",
      data: [
        { key: "Membership Plan", value: plan_name },
        {
          key: "Amount",
          value: `${isNational ? "₹" : "$"}${
            isNational ? amount_without_tax : usd_amount_without_tax
          }`,
        },
        {
          key: isNational ? "GST" : "Payment Charges",
          value: isNational
            ? `+${text_percentage}% GST`
            : `+${usd_text_percentage}%`,
        },
        {
          key: "Total",
          value: `${isNational ? "₹" : "$"}${isNational ? amount : usd_amount}`,
        },
      ],
    },
  ];
  let finalAmount = isNational ? amount : usd_amount;
  return (
    <div id="member-details-view-container">
      <div className="text-center text-26-600 color-raisin-black mb-5">
        Membership Preview Details
      </div>
      <div className="row">
        {data?.map((elem, index) => {
          return (
            <React.Fragment key={index}>
              <div
                className={`text-18-500 color-new-car cmb-22 mt-3 ${
                  elem.isHide ? " d-none" : ""
                }`}
              >
                {elem.key}
              </div>
              {elem.data.map((child, childIndex) => {
                return (
                  <React.Fragment key={childIndex}>
                    <div
                      className={`col-md-6 cmb-20 text-16-400 color-black-olive ${
                        elem.isHide || child.isHide ? " d-none" : ""
                      }`}
                    >
                      {child.key}
                    </div>
                    <div
                      className={`col-md-6 cmb-20 text-16-500 color-raisin-black ${
                        elem.isHide || child.isHide ? " d-none" : ""
                      }`}
                    >
                      {child.value}
                    </div>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}
        <div className="d-flex justify-content-center gap-4 mt-5">
          <div ref={htmlElRef} />
          <Button
            isRounded
            text="Previous"
            btnStyle="light-outline"
            className="cps-30 cpe-34"
            icon={<i className="bi bi-chevron-left me-3" />}
            onClick={() => {
              nevigate(
                `/${memberType}/register/${params.userId}/membership-details`
              );
            }}
          />
          {registration_status === "3" && amount > 0 ? (
            <CCAvenuePay
              btnLoading={btnLoading}
              onClick={() => {
                if (registration_status === "3") {
                  let paymentIntentData = {
                    page_type: "REQUEST",
                    type: "SIGNUP",
                    currency: isNational ? "INR" : "USD",
                    amount: finalAmount,
                    price: isNational ? amount : usd_amount,
                    toURL: window.location.pathname,
                  };
                  localStorage.paymentIntent = encrypt(paymentIntentData);
                  nevigate("/member/cc-avenue-payment");
                }
              }}
            />
          ) : (
            <Button
              isRounded
              btnStyle="primary-dark"
              btnLoading={btnLoading}
              className="cps-40 cpe-40"
              text="Continue"
              onClick={() => {
                if (registration_status === "3" && amount === 0) {
                  setBtnLoading(true);
                  handelPay({
                    order_id: "",
                    payment_id: "",
                    payment_method: isNational ? "INR" : "USD",
                    amount: 0,
                  });
                } else {
                  dispatch(
                    throwError({
                      message: "Registration not complete for some reason.",
                    })
                  );
                }
              }}
            />
          )}
          {/* <PayButton
            currency={isNational ? "INR" : "USD"}
            amount={finalAmount}
            onClick={() => {
              if (registration_status === "3") {
                handelPay({
                  order_id: "",
                  payment_id: "",
                  payment_method: isNational ? "INR" : "USD",
                  amount: 0,
                });
              } else {
                nevigate(`/${memberType}/dashboard`);
              }
            }}
            handelSuccess={(res) => {
              handelPay(res);
            }}
            isPayment={registration_status === "3" && amount > 0}
          >
            <Button
              isRounded
              btnStyle="primary-dark"
              btnLoading={btnLoading}
              className="cps-40 cpe-40"
              text={
                registration_status === "3" && amount > 0
                  ? "Pay Now"
                  : "Continue"
              }
            />
          </PayButton> */}
        </div>
      </div>
    </div>
  );
};
export default MembershipPreviewDetails;
