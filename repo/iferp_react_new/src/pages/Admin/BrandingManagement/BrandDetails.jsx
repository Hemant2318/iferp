import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import ExportButton from "components/Layout/ExportButton";
import { icons } from "utils/constants";
import { getUserType, objectToFormData } from "utils/helpers";
import {
  editBrandingAppliedStatus,
  getBrandingAppliedDetails,
} from "store/slices";
import BrandForm from "./BrandForm";

const BrandDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [statusLoader, setStatusLoader] = useState("");
  const [editData, setEditData] = useState(null);
  const [detailsData, setDetailsData] = useState({});
  const handleRedirect = () => {
    const userType = getUserType();
    navigate(`/${userType}/branding-management/${params.brandId}`);
  };
  const getProfiles = async () => {
    let forData = objectToFormData({
      id: params.brandId,
      brand_detail_id: params.industryId,
    });
    const response = await dispatch(getBrandingAppliedDetails(forData));
    let resData = {};
    if (response.data) {
      resData = response.data;
    }
    setDetailsData(resData);
    setIsLoading(false);
  };
  const handelSave = async (type) => {
    setStatusLoader(type);
    let forData = objectToFormData({
      status: type,
      id: params.brandId,
      brand_detail_id: params.industryId,
    });
    const response = await dispatch(editBrandingAppliedStatus(forData));
    if (response?.status === 200) {
      getProfiles();
    }
    setStatusLoader("");
  };
  useEffect(() => {
    getProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    user_details = {},
    id,
    event_name,
    address_first,
    address_second,
    event_date,
    industry_experience,
    name_of_head,
    designation_of_head,
    name_of_contact_person,
    designation_of_contact_person,
    contact_number,
    pan_number,
    tan_number,
    gst_number,
    email_id: emailId,
    type,
    designation,
    about_the_product,
    objectives_the_product,
    first_impression_to_product,
    rate_quality_of_product,
    innovative_is_your_product,
    money_value_of_product,
    recommend_of_our_product,
    things_like_about_our_product,
    improvement_of_our_product,
    satisfied_with_product,
    title_of_project,
    current_socio_economic_status,
    objectives_of_project,
    targeted_groups_of_project,
    area_of_execution_of_project,
    outcome_benefits_of_project,
    estimated_cost_of_project,
    estimated_period_of_completion_of_project,
    purpose_of_csr_project,
    status,
    country_name,
    state_name,
  } = detailsData;
  const {
    organization_name,
    email_id,
    phone_number,
    country,
    city,
    state: userState,
  } = user_details;

  const exibitionData = [
    {
      title: "",
      data: [
        {
          key: "Organization name",
          value: organization_name,
        },
        {
          key: "Email ID",
          value: email_id,
        },
        {
          key: "Contact Number",
          value: phone_number,
        },
        {
          key: "Country",
          value: country,
        },
        {
          key: "City",
          value: city || "",
        },
        {
          key: "Event Name",
          value: event_name,
        },
        {
          key: "Venue",
          value: `${address_first}, ${address_second}`,
        },
        {
          key: "Date",
          value: event_date,
        },
      ],
    },
    {
      title: "Head of the Organization Details (CEO/MD/CMD/Director etc)",
      data: [
        {
          key: "Name of the head",
          value: name_of_head,
        },
        {
          key: "Designation",
          value: designation_of_head,
        },
        {
          key: "Name of the Contact Person",
          value: name_of_contact_person,
        },
        {
          key: "Designation",
          value: designation_of_contact_person,
        },
        {
          key: "Email ID",
          value: emailId,
        },
        {
          key: "Contact Number",
          value: contact_number,
        },
        {
          key: "Address",
          value: address_first + ", " + address_second,
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
          key: "PAN Number",
          value: pan_number,
        },
        {
          key: "TAN Number",
          value: tan_number,
        },
        {
          key: "GST Number",
          value: gst_number,
        },
        {
          key: "Industry Experience",
          value: industry_experience,
        },
      ],
    },
  ];
  const brandPromotionData = [
    {
      title: "",
      data: [
        {
          key: "Organization name",
          value: organization_name,
        },
        {
          key: "Email ID",
          value: email_id,
        },
        {
          key: "Contact Number",
          value: phone_number,
        },
        {
          key: "Country",
          value: country,
        },
        {
          key: "State/Province",
          value: userState,
        },
        {
          key: "City",
          value: city || "",
        },
      ],
    },
    {
      title: "Contact Person Details",
      data: [
        {
          key: "Name",
          value: name_of_contact_person,
        },
        {
          key: "Email ID",
          value: emailId,
        },
        {
          key: "Contact Number",
          value: contact_number,
        },
        {
          key: "Designation",
          value: designation,
        },
      ],
    },
    {
      title: "Product Description",
      data: [
        {
          key: "",
          value: about_the_product,
        },
      ],
    },
    {
      title: "Objectives of the Product",
      data: [
        {
          key: "",
          value: objectives_the_product,
        },
      ],
    },
  ];
  const conductSurveyData = [
    {
      title: "",
      data: [
        {
          key: "Organization name",
          value: organization_name,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "Email ID",
          value: email_id,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "Contact Number",
          value: phone_number,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "Country",
          value: country,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "State/Province",
          value: userState,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "City",
          value: city || "",
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "What is your first impression to the product?",
          value: first_impression_to_product,
          keyClass: "col-md-6 text-16-400 color-black-olive",
          valueClass: "col-md-6 text-16-500 color-black-olive",
        },
        {
          key: "How would you like to rate the quality of the product?",
          value: rate_quality_of_product,
          keyClass: "col-md-6 text-16-400 color-black-olive",
          valueClass: "col-md-6 text-16-500 color-black-olive",
        },
        {
          key: "How innovative is your product?",
          value: innovative_is_your_product,
          keyClass: "col-md-6 text-16-400 color-black-olive",
          valueClass: "col-md-6 text-16-500 color-black-olive",
        },
        {
          key: "How would you rate the money value of the product?",
          value: money_value_of_product,
          keyClass: "col-md-6 text-16-400 color-black-olive",
          valueClass: "col-md-6 text-16-500 color-black-olive",
        },
        {
          key: "How would you like to recommend our product?",
          value: recommend_of_our_product,
          keyClass: "col-md-6 text-16-400 color-black-olive",
          valueClass: "col-md-6 text-16-500 color-black-olive",
        },
        {
          key: "What are the things you like about our product?",
          value: things_like_about_our_product,
          keyClass: "col-md-12 text-16-400 color-black-olive pb-2",
          valueClass: "col-md-12 text-16-500 color-black-olive",
        },
        {
          key: "What would you like to say about the improvement of our product?",
          value: improvement_of_our_product,
          keyClass: "col-md-12 text-16-400 color-black-olive pb-2",
          valueClass: "col-md-12 text-16-500 color-black-olive",
        },
        {
          key: "Overall how satisfied are you with this product?",
          value: satisfied_with_product,
          keyClass: "col-md-12 text-16-400 color-black-olive pb-2",
          valueClass: "col-md-12 text-16-500 color-black-olive",
        },
      ],
    },
  ];
  const csrActivityData = [
    {
      title: "",
      data: [
        {
          key: "Organization name",
          value: organization_name,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "Email ID",
          value: email_id,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "Contact Number",
          value: phone_number,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "Country",
          value: country,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "State/Province",
          value: userState,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "City",
          value: city || "",
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
      ],
    },
    {
      title: "Contact Person Details",
      data: [
        {
          key: "Name",
          value: organization_name,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "Email ID",
          value: emailId,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "Contact Number",
          value: contact_number,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "Designation",
          value: designation,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
      ],
    },
    {
      title: "CSR Activity Requirements",
      data: [
        {
          key: "Title of the Project",
          value: title_of_project,
          keyClass: "col-md-12 text-16-400 color-black-olive pb-2",
          valueClass: "col-md-12 text-16-500 color-black-olive",
        },
        {
          key: "Current Socio-economic status of the Area and Target group",
          value: current_socio_economic_status,
          keyClass: "col-md-12 text-16-400 color-black-olive pb-2",
          valueClass: "col-md-12 text-16-500 color-black-olive",
        },
        {
          key: "Objectives of the project",
          value: objectives_of_project,
          keyClass: "col-md-12 text-16-400 color-black-olive pb-2",
          valueClass: "col-md-12 text-16-500 color-black-olive",
        },
        {
          key: "Targeted groups of the project proposal",
          value: targeted_groups_of_project,
          keyClass: "col-md-12 text-16-400 color-black-olive pb-2",
          valueClass: "col-md-12 text-16-500 color-black-olive",
        },
        {
          key: "Geographical area of execution of project and reason for selecting that area",
          value: area_of_execution_of_project,
          keyClass: "col-md-12 text-16-400 color-black-olive pb-2",
          valueClass: "col-md-12 text-16-500 color-black-olive",
        },
        {
          key: "Expected outcome / benefits of the project (It should clearly bring out the outcomes expected on completion of the CSR project in terms of Skill, income level etc)",
          value: outcome_benefits_of_project,
          keyClass: "col-md-12 text-16-400 color-black-olive pb-2",
          valueClass: "col-md-12 text-16-500 color-black-olive",
        },
        {
          key: "Estimated cost of the project",
          value: estimated_cost_of_project,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "Estimated period of completion",
          value: estimated_period_of_completion_of_project,
          keyClass: "col-md-3 text-16-400 color-black-olive",
          valueClass: "col-md-9 text-16-500 color-black-olive",
        },
        {
          key: "Purpose of CSR Project",
          value: purpose_of_csr_project,
          keyClass: "col-md-12 text-16-400 color-black-olive pb-2",
          valueClass: "col-md-12 text-16-500 color-black-olive",
        },
      ],
    },
  ];
  return (
    <div id="career-management-container">
      {editData && (
        <BrandForm
          editData={editData}
          payload={{ id: params.brandId, brand_detail_id: editData.id }}
          onHide={() => {
            setEditData(null);
          }}
          handelSuccess={() => {
            setEditData(null);
            getProfiles();
          }}
        />
      )}
      <Card className="cps-30 cpe-30 cpb-30 cpt-20">
        {!isLoading && (
          <div className="cpt-12 cpb-12 d-flex align-items-center justify-content-between cmb-12 gap-3 flex-wrap">
            <div className="d-flex align-items-center">
              <span className="d-flex" onClick={handleRedirect}>
                <img
                  src={icons.leftArrow}
                  alt="back"
                  className="h-21 me-3 pointer"
                />
              </span>
              <span className="text-18-500 color-black-olive">
                {organization_name}
              </span>
            </div>

            <div className="d-flex gap-3">
              {status !== "0" && (
                <Button
                  isSquare
                  text="Edit"
                  btnStyle="light-outline"
                  className="pe-3 ps-3 h-35 text-13-400"
                  icon={<i className="bi bi-pencil pe-2" />}
                  onClick={() => {
                    setEditData({
                      id: id,
                      organization_name: organization_name,
                      member_type: country,
                      member_id: city || "",
                      status: status,
                    });
                  }}
                />
              )}
              <ExportButton
                exportAPI={getBrandingAppliedDetails}
                payload={objectToFormData({
                  id: params.brandId,
                  brand_detail_id: params.industryId,
                  export_status: 1,
                })}
              />
            </div>
          </div>
        )}
        <div>
          {type === 1 &&
            exibitionData.map((elem, index) => {
              return (
                <div key={index}>
                  {elem.title && (
                    <div className="text-18-500 color-new-car cmb-16">
                      {elem.title}
                    </div>
                  )}
                  {elem.data.map((childElem, childIndex) => {
                    return (
                      <div className="row cmb-16 d-flex gap-2" key={childIndex}>
                        <div className="col-md-3 text-16-400 color-black-olive">
                          {childElem.key}
                        </div>
                        <div className="col-md-9 text-16-500 color-black-olive">
                          {childElem.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          {type === 2 &&
            brandPromotionData.map((elem, index) => {
              return (
                <div key={index}>
                  {elem.title && (
                    <div className="text-18-500 color-new-car cmb-16">
                      {elem.title}
                    </div>
                  )}
                  {elem.data.map((childElem, childIndex) => {
                    return (
                      <div className="row cmb-16" key={childIndex}>
                        {childElem.key ? (
                          <>
                            <div className="col-md-3 text-16-400 color-black-olive">
                              {childElem.key}
                            </div>
                            <div className="col-md-9 text-16-500 color-black-olive">
                              {childElem.value}
                            </div>
                          </>
                        ) : (
                          <div className="text-16-500 color-black-olive">
                            {childElem.value}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          {type === 3 &&
            conductSurveyData.map((elem, index) => {
              return (
                <div key={index}>
                  {elem.title && (
                    <div className="text-18-500 color-new-car cmb-16">
                      {elem.title}
                    </div>
                  )}
                  {elem.data.map((childElem, childIndex) => {
                    return (
                      <div className="row cmb-16" key={childIndex}>
                        <div className={childElem.keyClass}>
                          {childElem.key}
                        </div>
                        <div className={childElem.valueClass}>
                          {childElem.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          {type === 4 &&
            csrActivityData.map((elem, index) => {
              return (
                <div key={index}>
                  {elem.title && (
                    <div className="text-18-500 color-new-car cmb-16">
                      {elem.title}
                    </div>
                  )}
                  {elem.data.map((childElem, childIndex) => {
                    return (
                      <div className="row cmb-16" key={childIndex}>
                        <div className={childElem.keyClass}>
                          {childElem.key}
                        </div>
                        <div className={childElem.valueClass}>
                          {childElem.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
        {status === "0" && (
          <div className="d-flex gap-4 cmt-40">
            <Button
              isRounded
              text="Accept"
              btnStyle="primary-dark"
              className="cps-40 cpe-40"
              onClick={() => {
                handelSave("1");
              }}
              btnLoading={statusLoader === "1"}
            />
            <Button
              isRounded
              text="Reject"
              btnStyle="primary-gray"
              className="cps-40 cpe-40"
              onClick={() => {
                handelSave("2");
              }}
              btnLoading={statusLoader === "2"}
            />
          </div>
        )}
      </Card>
    </div>
  );
};
export default BrandDetails;
