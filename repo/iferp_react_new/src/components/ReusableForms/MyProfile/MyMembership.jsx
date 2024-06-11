import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import MembershipBenefits from "components/Layout/MembershipBenefits";
import {
  addFeedback,
  getMembershipDetails,
  setApiError,
  setIsPremiumPopup,
} from "store/slices";
import {
  getDataFromLocalStorage,
  objectToFormData,
  trimLeftSpace,
} from "utils/helpers";
import MembershipCertificate from "components/Layout/MembershipCertificate";
import MembershipCard from "components/Layout/MembershipCard";
import { icons } from "utils/constants";

const MyMembership = ({ profileData }) => {
  const dispatch = useDispatch();
  const {
    first_name,
    last_name,
    member_id,
    membership_details = {},
  } = profileData;
  const { id, plan_name: planName, expire_date } = membership_details;
  const [isLoading, setIsLoading] = useState(false);
  const [planDetails, setPlanDetails] = useState({});
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState("");

  const handelMembershipDetails = async () => {
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
  useEffect(() => {
    handelMembershipDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const { benefit_detail = [] } = planDetails;
  const { id: membershipID } = getDataFromLocalStorage("membership_details");
  const access = {
    isUpgradeButton: membershipID === 2 || membershipID === 11,
    isRenew: moment().diff(expire_date, "days") > 0,
    showBenifits: [2, 3, 4, 11].includes(id),
    isCertificate: ![2, 11].includes(id),
  };
  return (
    <Card className="cps-18 cpe-18 cpt-29 cpb-29 fadeInUp">
      <div className="text-18-500 color-title-navy font-poppins">
        My Membership
      </div>
      <div className="row cmt-28">
        <div className="col-md-2 cmb-16 text-15-400 color-raisin-black">
          Name
        </div>
        <div className="col-md-10 cmb-16 text-15-500 color-raisin-black">{`${first_name} ${last_name}`}</div>
        <div className="col-md-2 cmb-16 text-15-400 color-raisin-black">
          Membership ID
        </div>
        <div className="col-md-10 cmb-16 text-15-500 color-raisin-black">
          {member_id}
        </div>
        <div className="col-md-2 cmb-16 text-15-400 color-raisin-black">
          Plan
        </div>
        <div className="col-md-10 cmb-16 text-15-500 color-raisin-black">
          {planName}
        </div>
      </div>
      {isLoading ? (
        <div className="cpt-125 cpb-125">
          <Loader size="md" />
        </div>
      ) : (
        <>
          <div className="text-18-500 color-title-navy font-poppins mb-3 mt-3">
            My Current Subscription Benefits
          </div>

          <MembershipBenefits
            hidePlanDetail
            isRenew={access.isRenew}
            benefitDetail={benefit_detail}
            isUpgradeButton={access.isUpgradeButton}
            showBenifitList={access.showBenifits}
          />

          <div className="mt-5 mb-2 text-16-400 color-raisin-black">
            Feed back
          </div>
          <div className="d-flex">
            <div className="col-md-10">
              <TextInput
                placeholder="Comments if any"
                className="rounded-0 text-input"
                value={comment}
                onChange={(e) => {
                  setComment(trimLeftSpace(e.target.value));
                }}
              />
            </div>
            <div className="flex-grow-1">
              <Button
                isSquare
                text="Submit"
                btnStyle="primary-dark"
                className="cps-20 cpe-20 cpt-20 cpb-20 text-16-400 rounded-0 h-45"
                btnLoading={commentLoading}
                onClick={async () => {
                  setCommentLoading(true);
                  const res = await dispatch(addFeedback({ message: comment }));
                  if (res?.status === 200) {
                    dispatch(
                      setApiError({
                        show: true,
                        message: "Feed back send Successfully.",
                        type: "success",
                      })
                    );
                    setComment("");
                  }
                  setCommentLoading(false);
                }}
              />
            </div>
          </div>
          <div className="d-flex flex-wrap gap-3 mt-5">
            {access.isCertificate ? (
              <div className="col-12 col-sm-4">
                <MembershipCertificate />
              </div>
            ) : (
              <div
                className="col-12 col-sm-4"
                id="membership-certificate-container"
                onClick={() => {
                  dispatch(setIsPremiumPopup(true));
                }}
              >
                <div>
                  <img
                    src={icons.primaryMemberCertificate}
                    alt="cer"
                    className="me-3"
                  />
                </div>
                <div className="text-16-500 color-new-car text-center">
                  <div>Upgrade To Premium</div>
                  <div>For The Membership Certificate</div>
                </div>
              </div>
            )}
            <div className="col-12 col-sm-4">
              <MembershipCard />
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
export default MyMembership;
