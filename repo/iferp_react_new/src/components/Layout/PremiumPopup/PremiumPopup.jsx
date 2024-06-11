import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../form/Button";
import Modal from "../../Layout/Modal";
import { icons, membershipType } from "utils/constants";
import { getDataFromLocalStorage } from "utils/helpers";
import {
  setIsDiscountPopup,
  setIsMentorPremiumBenefit,
  setIsPremiumPopup,
} from "store/slices";

const UpgradeButton = ({ text }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isPremiumPopup, isMentorPremiumBenefit } = useSelector((state) => ({
    isPremiumPopup: state.global.isPremiumPopup,
    isMentorPremiumBenefit: state.global.isMentorPremiumBenefit,
  }));
  const benefits = [
    "Network with Industry Leaders",
    "Connection with international bodies and agencies",
    "Interdisciplinary Research Opportunities",
  ];
  const mentorBenefits = [
    "Professional Premium mentors get very minimal platform fee",
    "Premium mentors get their payment settlement every month ",
    "Conduct unlimited 1 on 1 mentorship sessions effortlessly",
  ];
  const userType = getDataFromLocalStorage("user_type");
  const findType = membershipType.find((o) => o.id === userType)?.type || "";
  const features = isMentorPremiumBenefit ? mentorBenefits : benefits;
  return (
    <>
      {isPremiumPopup && (
        <Modal
          onHide={() => {
            dispatch(setIsPremiumPopup(false));
            dispatch(setIsMentorPremiumBenefit(false));
          }}
          title=""
        >
          <div className="center-flex flex-column cmb-30">
            <div>
              <img src={icons.successTick} alt="success" />
            </div>
            <div className="text-32-600 color-raisin-blck cmt-24 cmb-30 lh-1 test-wrap">
              Become Premium Member
            </div>
            <div className="text-16-500 color-raisin-blck mb-2">
              Upgrade to Premium student Member & Get
            </div>
            <div className="text-start mt-2">
              {features.map((elem, index) => {
                return (
                  <div key={index} className="cmb-12 text-14-400">
                    <img src={icons.checkCircle} alt="right" className="me-2" />
                    {elem}
                  </div>
                );
              })}
            </div>
            <div className="d-flex mt-5 mb-4">
              <Button
                isRounded
                text="Upgrade to Premium"
                btnStyle="primary-dark"
                className="cps-20 cpe-20"
                onClick={() => {
                  if (findType) {
                    navigate(`/${findType}/upgrade`);
                    dispatch(setIsPremiumPopup(false));
                    dispatch(setIsMentorPremiumBenefit(false));
                  }
                }}
              />
            </div>
            <div
              className="text-15-400 color-black-olive pointer"
              onClick={() => {
                if (isMentorPremiumBenefit) {
                  dispatch(setIsDiscountPopup(true));
                  dispatch(setIsPremiumPopup(false));
                } else {
                  dispatch(setIsMentorPremiumBenefit(false));
                  dispatch(setIsPremiumPopup(false));
                }
              }}
            >
              {"Skip I’ll do later"}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
export default UpgradeButton;
