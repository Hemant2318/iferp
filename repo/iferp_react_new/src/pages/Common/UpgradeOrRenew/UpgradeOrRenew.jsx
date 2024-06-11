import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { filter } from "lodash";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import Loader from "components/Layout/Loader";
import Card from "components/Layout/Card";
import {
  getMembershipDetails,
  showSuccess,
  throwError,
  upgradePremium,
} from "store/slices";
import {
  decrypt,
  encrypt,
  getDataFromLocalStorage,
  objectToFormData,
} from "utils/helpers";
// import PayButton from "components/Layout/PayButton";
import CCAvenuePay from "components/Layout/CCAvenuePay";
import moment from "moment";
import MembershipBenefits from "components/Layout/MembershipBenefits";

const UpgradeOrRenew = () => {
  const htmlElRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = getDataFromLocalStorage();
  const {
    id,
    user_type,
    membership_plan_id,
    membership_details = {},
    personal_details = {},
  } = userData;
  const { country_name } = personal_details;
  const { expire_date } = membership_details;
  const isRenew = moment().diff(expire_date, "days") > 0;
  const isUpgrade = !isRenew;
  const isAlready = false;
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const memberList = filter(
    membershipList,
    (o) => o.membership_id === user_type
  );
  const [isBtnLoading, setBtnIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [planDetails, setPlanDetails] = useState({});
  const [planID, setPlanID] = useState("");
  const handelSave = async (values) => {
    const payload = {
      type: isUpgrade ? "0" : "1",
      id: id,
      membership_plan_id: planID,
      ...values,
    };
    const response = await dispatch(upgradePremium(objectToFormData(payload)));
    if (response?.status === 200) {
      navigate("/");
      window.location.reload();
    }
    setBtnIsLoading(false);
  };
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
        setBtnIsLoading(true);
        dispatch(showSuccess(status_message));
        setTimeout(() => {
          handelSave({
            id: id,
            type: isUpgrade ? "0" : "1",
            membership_plan_id: localInitValue.planID,
            payment_method: localInitValue.currency,
            amount: localInitValue?.amount || 0,
            discount: localInitValue?.discount || 0,
            order_id: localResponse?.order_id || "",
            payment_id: localResponse?.tracking_id || "",
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
  useEffect(() => {
    if (planID) {
      handelMembershipDetails(planID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planID]);
  useEffect(() => {
    if (isAlready) {
      navigate(-1);
      return;
    }
    let membershipPlanID = "";
    if (user_type === "5") {
      membershipPlanID = membership_plan_id === 11 ? 12 : membership_plan_id;
    } else if (user_type === "2") {
      membershipPlanID = membership_plan_id === 2 ? 3 : membership_plan_id;
    } else {
    }
    setPlanID(membershipPlanID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { benefit_detail = [], amount, usd_amount } = planDetails || {};
  const isNational = country_name === "India";
  let finalAmount = isNational ? amount : usd_amount;

  let planData = {
    name: planDetails?.plan_name || "",
    days: planDetails?.valid || 0,
    amount: isNational
      ? `₹ ${planDetails?.amount}`
      : `$ ${planDetails?.usd_amount}`,
  };
  return (
    <Card className="cps-50 cpe-50 cpt-50 cpb-40">
      <div className="text-26-500 color-raisin-black cmb-40 text-center">
        {isUpgrade ? "Upgrade To Premium Member" : "Renew Membership"}
      </div>

      <form>
        <div className="row d-flex align-items-center">
          <div className="col-md-3">Membership Plan*</div>
          <div className="col-md-5">
            <Dropdown
              optionKey="id"
              value={planID}
              optionValue="name"
              options={memberList}
              placeholder="Select Membership Pan"
              onChange={(e) => {
                setPlanID(e?.target?.value);
              }}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="cpt-125 cpb-125">
            <Loader size="md" />
          </div>
        ) : (
          <MembershipBenefits
            benefitDetail={benefit_detail}
            planData={planData}
          />
        )}
        {planID && !isLoading && (
          <div className="row mt-3">
            <div className="d-flex justify-content-center gap-4 cmt-30">
              <div ref={htmlElRef} />
              <Button
                text="Cancel"
                isRounded
                btnStyle="light-outline"
                className="cps-40 cpe-40"
                onClick={() => {}}
              />
              {finalAmount === 0 ? (
                <Button
                  text="Pay Now"
                  isRounded
                  btnStyle="primary-dark"
                  className="cps-40 cpe-40"
                  onClick={() => {
                    dispatch(
                      throwError({
                        message: "Invalid membership selected.",
                      })
                    );
                  }}
                />
              ) : (
                <CCAvenuePay
                  btnLoading={isBtnLoading}
                  onClick={() => {
                    let paymentIntentData = {
                      page_type: "REQUEST",
                      type: "RENEW",
                      currency: isNational ? "INR" : "USD",
                      price: isNational ? amount : usd_amount,
                      planID: planID,
                      amount: finalAmount,
                      discount: 0,
                      toURL: window.location.pathname,
                    };
                    localStorage.paymentIntent = encrypt(paymentIntentData);
                    navigate("/member/cc-avenue-payment");
                  }}
                />
              )}
              {/* <PayButton
                isPayment={true}
                currency="INR"
                amount={amount}
                onClick={() => {}}
                handelSuccess={(e) => {
                  handelSave(e);
                }}
              >
                <Button
                  isRounded
                  text="Pay Now"
                  btnStyle="primary-dark"
                  className="cps-40 cpe-40"
                  btnLoading={isBtnLoading}
                />
              </PayButton> */}
            </div>
          </div>
        )}
      </form>
    </Card>
  );
};
export default UpgradeOrRenew;
