import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isEqual, filter } from "lodash";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import Loader from "components/Layout/Loader";
import { objectToFormData } from "utils/helpers";
import { getMembershipDetails, handelUserRegisterDetails } from "store/slices";
import MembershipBenefits from "components/Layout/MembershipBenefits";

const MembershipDetails = ({
  userDetails,
  fetchUserData,
  handelSuccess,
  memberType,
}) => {
  const memberTypeId = userDetails.user_type;
  const nevigate = useNavigate();
  const dispatch = useDispatch();
  const {
    id: userID,
    is_self_registered,
    registration_status,
    personal_details = {},
    membership_details = {},
    company_details = {},
    institution_details = {},
  } = userDetails;

  const { id } = membership_details;

  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const memberList = filter(
    membershipList,
    (o) => o.membership_id === memberTypeId
  );
  const [isLoading, setIsLoading] = useState(false);
  const [planDetails, setPlanDetails] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);

  const handelMembershipDetails = async (id) => {
    if (id) {
      setIsLoading(true);
      const response = await dispatch(
        getMembershipDetails(objectToFormData({ id: id }))
      );
      let data = {};
      if (response.status === 200) {
        data = response?.data;
      }
      setPlanDetails(data);
      setIsLoading(false);
    }
  };
  const handelSave = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      ...values,
      type: "3",
      id: userID,
    });
    const response = await dispatch(handelUserRegisterDetails(forData));
    if (response?.status === 200) {
      const fetchData = await fetchUserData();
      if (fetchData?.status === 200) {
        handelSuccess();
      }
    }
    setBtnLoading(false);
  };
  useEffect(() => {
    if (id) {
      handelMembershipDetails(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const initialValues = {
    membership_plan_id: id || "",
  };
  const { benefit_detail = [] } = planDetails || {};
  const validationSchema = Yup.object().shape({
    membership_plan_id: Yup.string().required("Membership is required."),
  });
  const { country_name } = personal_details;
  const { company_country_name } = company_details;
  const { country_name: institutionCountry_name } = institution_details;
  const isNational =
    country_name === "India" ||
    company_country_name === "India" ||
    institutionCountry_name === "India";
  let planData = {
    name: planDetails?.plan_name || "",
    days: planDetails?.valid || 0,
    amount: isNational
      ? `₹ ${planDetails?.amount}`
      : `$ ${planDetails?.usd_amount}`,
  };
  return (
    <>
      <div className="text-18-500 color-raisin-black cmb-22">
        Membership Details
      </div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (isEqual(values, initialValues)) {
            if (registration_status === "2" && is_self_registered === "0") {
              handelSave(values);
            } else {
              handelSuccess();
            }
          } else {
            handelSave(values);
          }
        }}
      >
        {(props) => {
          const { values, errors, handleChange, handleSubmit } = props;

          return (
            <form>
              <div className="row d-flex align-items-center">
                <div className="col-md-3">Membership Plan*</div>
                <div className="col-md-5">
                  <Dropdown
                    placeholder="Select Membership Pan"
                    options={memberList}
                    optionKey="id"
                    optionValue="name"
                    id="membership_plan_id"
                    value={values.membership_plan_id}
                    onChange={(e) => {
                      handelMembershipDetails(e.target.value);
                      handleChange(e);
                    }}
                    disabled={is_self_registered === "0"}
                    error={errors.membership_plan_id}
                  />
                </div>
              </div>
              {isLoading ? (
                <div className="cpt-125 cpb-125">
                  <Loader size="md" />
                </div>
              ) : (
                <>
                  <MembershipBenefits
                    benefitDetail={benefit_detail}
                    planData={planData}
                  />
                  <div className="d-flex justify-content-center gap-4 mt-5">
                    <Button
                      isRounded
                      text="Previous"
                      btnStyle="light-outline"
                      className="cps-30 cpe-34"
                      icon={<i className="bi bi-chevron-left me-3" />}
                      onClick={() => {
                        const redirectPage =
                          memberTypeId === "3" || memberTypeId === "4"
                            ? "admin-details"
                            : "education-details";

                        nevigate(
                          `/${memberType}/register/${userID}/${redirectPage}`
                        );
                      }}
                    />
                    <Button
                      isRounded
                      text="Continue"
                      btnStyle="primary-dark"
                      className="cps-40 cpe-40"
                      onClick={handleSubmit}
                      btnLoading={btnLoading}
                    />
                  </div>
                </>
              )}
            </form>
          );
        }}
      </Formik>
    </>
  );
};
export default MembershipDetails;
