import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MembershipBenefits from "components/Layout/MembershipBenefits";
import Card from "components/Layout/Card";
import { membershipType } from "utils/constants";
import { getMembershipDetails } from "store/slices";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";

const MyMembership = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = getDataFromLocalStorage();
  const [planDetails, setPlanDetails] = useState({});
  const handelMembershipDetails = async (id) => {
    if (id) {
      const response = await dispatch(
        getMembershipDetails(objectToFormData({ id: id }))
      );

      setPlanDetails(response?.data || {});
    }
  };
  useEffect(() => {
    handelMembershipDetails(membership_plan_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { member_id, membership_plan_id, user_type } = userData;
  const { plan_name, benefit_detail } = planDetails || {};
  const userFlag = membershipType.find((o) => o.id === user_type)?.type;

  return (
    <Card className="cps-24 cpe-24 cpt-24 cpb-20 h-100">
      <div className="text-18-500-27 color-title-navy font-poppins">
        My Membership
      </div>
      <div className="cmt-20">
        <div className="row mb-2">
          <div className="text-14-400 color-raisin-black   col-md-5">
            Membership ID
          </div>
          <div className="text-14-500 color-raisin-black   col-md-7">
            {member_id}
          </div>
        </div>
        <div className="row mb-2">
          <div className="text-14-400 color-raisin-black   col-md-5">
            Membership Plan
          </div>
          <div className="text-14-500 color-raisin-black   col-md-7">
            {plan_name}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between cmt-30 cmb-20">
        <div className="text-18-500-27 color-title-navy font-poppins">
          My Benefits
        </div>
        <div
          className="text-15-400 color-new-car   pointer"
          onClick={() => {
            navigate(`/${userFlag}/my-profile/my-membership`);
          }}
        >
          <u className=" ">View All</u>
        </div>
      </div>
      <MembershipBenefits
        hidePlanDetail
        limitedOptions={3}
        benefitDetail={benefit_detail}
      />
    </Card>
  );
};
export default MyMembership;
