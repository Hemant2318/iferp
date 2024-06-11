import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import Internship from "./Forms/Internship";
import PlacementTraining from "./Forms/PlacementTraining";
import PatentFilingAssistance from "./Forms/PatentFilingAssistance";
import BecomeAKeynoteSpeaker from "./Forms/BecomeAKeynoteSpeaker";
import EditorialBoardMemberOrReviewer from "./Forms/EditorialBoardMemberOrReviewer";
import BecomeASessionChair from "./Forms/BecomeASessionChair";
import OpportunityForBookWriting from "./Forms/OpportunityForBookWriting";
import ProposalWritingAssistanceForDSTOrSERBOrAICTE from "./Forms/ProposalWritingAssistanceForDSTOrSERBOrAICTE";
import PeopleInTheNews from "./Forms/PeopleInTheNews";
import ResearchEnhancement from "./Forms/ResearchEnhancement";
import FundsAndGrants from "./Forms/FundsAndGrants";
import CenterOfExcellence from "./Forms/CenterOfExcellence";
import ApplyForCommitteeMember from "./Forms/ApplyForCommitteeMember";
import GuidelinesAndBenifitsPopup from "components/Layout/GuidelinesAndBenifitsPopup/GuidelinesAndBenifitsPopup";
import PostAJob from "./Forms/PostAJob";
import ConductTraining from "./Forms/ConductTraining";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import {
  careerApply,
  getCareerDetails,
  setApiError,
  setIsPremiumPopup,
} from "store/slices";

const CareerForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const planID = getDataFromLocalStorage("membership_plan_id");
  const { formType, careerId } = params;
  const [formValue, setFormValue] = useState({});
  const [careerData, setCareerData] = useState({});
  const [isCareerGuidline, setIsCareerGuidline] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [reset, setReset] = useState(false);

  const handelSaveCareer = async (values) => {
    setFormValue(values);
    if (planID === 2 || planID === 11) {
      dispatch(setIsPremiumPopup(true));
      return;
    }
    if (careerData?.benefits || careerData?.guidelines) {
      setIsCareerGuidline(true);
      return;
    }

    handelAdd(values);
  };
  const handelAdd = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      id: careerId,
      user_id: getDataFromLocalStorage("id"),
      ...values,
    });
    const response = await dispatch(careerApply(forData));
    if (response?.status === 200) {
      dispatch(
        setApiError({
          show: true,
          message: "Data Submit Successfully.",
          type: "success",
        })
      );
      setReset(true);
    }
    setBtnLoading(false);
  };
  const getTitle = (type) => {
    switch (type) {
      case "2":
        return "Apply For Placement Traning";
      case "3":
        return "Apply For Internship";
      case "5":
        return "Apply For Patent Filing Assistance";
      case "6":
        return "Become A Keynote Speaker";
      case "7":
        return "Apply For Committee Member";
      case "8":
        return "Editorial Board Member/Reviewer";
      case "9":
        return "Become A Session Chair";
      case "10":
        return "Opportunity For Book Writing";
      case "11":
        return "Proposal Writing Assistance for DST/SERB/AICTE";
      case "12":
        return "People In The News";
      case "13":
        return "Research Enhancement";
      case "14":
        return "Center of Excellence (COE)";
      case "15":
        return "Funds & Grants";
      case "16":
        return "Post A Job";
      case "17":
        return "Conduct Training";
      default:
        return "";
    }
  };
  const getComponent = (type) => {
    switch (type) {
      case "2":
        return (
          <PlacementTraining
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "3":
        return (
          <Internship
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "5":
        return (
          <PatentFilingAssistance
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "6":
        return (
          <BecomeAKeynoteSpeaker
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "7":
        return (
          <ApplyForCommitteeMember
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "8":
        return (
          <EditorialBoardMemberOrReviewer
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "9":
        return (
          <BecomeASessionChair
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "10":
        return (
          <OpportunityForBookWriting
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "11":
        return (
          <ProposalWritingAssistanceForDSTOrSERBOrAICTE
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "12":
        return (
          <PeopleInTheNews
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "13":
        return (
          <ResearchEnhancement
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "14":
        return (
          <CenterOfExcellence
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "15":
        return (
          <FundsAndGrants
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "16":
        return (
          <PostAJob
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "17":
        return (
          <ConductTraining
            handelSaveCareer={handelSaveCareer}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );

      default:
        return (
          <div className="center-flex">
            <img src={icons.comingSoon} alt="soon" />
          </div>
        );
    }
  };
  const getDetails = async () => {
    const formData = objectToFormData({
      career_id: careerId,
    });
    const response = await dispatch(getCareerDetails(formData));
    setCareerData(response?.data || {});
  };
  useEffect(() => {
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careerId]);
  return (
    <Card className="cps-40 cpe-40 cpt-40 cpb-40">
      {isCareerGuidline && (
        <GuidelinesAndBenifitsPopup
          title={getTitle(formType)}
          data={careerData}
          onHide={() => {
            setIsCareerGuidline(false);
          }}
          handelSave={async () => {
            setIsCareerGuidline(false);
            handelAdd(formValue);
          }}
        />
      )}
      <div className="d-flex center-flex position-relative">
        <span
          className="d-flex position-absolute start-0"
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <div className="text-26-500 title-text responsive-title">
          {getTitle(formType)}
        </div>
      </div>

      {getComponent(formType)}
    </Card>
  );
};
export default CareerForm;
