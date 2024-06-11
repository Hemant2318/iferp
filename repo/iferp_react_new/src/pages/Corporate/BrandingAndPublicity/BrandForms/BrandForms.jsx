import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import { addBrandingPublicity, setApiError } from "store/slices";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import ExhibitionRegistration from "./Forms/ExhibitionRegistration";
import BrandPromotion from "./Forms/BrandPromotion";
import ConductSurvey from "./Forms/ConductSurvey";
import CSRActivity from "./Forms/CSRActivity";
import "./BrandForms.scss";

const BrandForms = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { type } = params;
  const [btnLoading, setBtnLoading] = useState(false);
  const [reset, setReset] = useState(false);

  const handelSaveBrand = (values) => {
    handelAdd(values);
  };
  const handelAdd = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      type: type,
      user_id: getDataFromLocalStorage("id"),
      ...values,
    });
    const response = await dispatch(addBrandingPublicity(forData));
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
  const getTitle = () => {
    switch (type) {
      case "1":
        return (
          <div className="text-center cps-30 cpe-30">
            <div className="text-26-500 color-black-olive">
              Exhibition Registration
            </div>
            <div className="text-15-400 color-black-olive mt-3">
              Take advantage of the opportunity to present your company, your
              products and services by to your direct target group - by
              exhibiting at specialised IFERP Conferences
            </div>
          </div>
        );
      case "2":
        return (
          <div className="text-center cps-30 cpe-30">
            <div className="text-26-500 color-black-olive">Brand Promotion</div>
            <div className="text-15-400 color-black-olive mt-3">
              Your product, logo will be displayed on IFERP Newsletter,
              Magazines and Conference websites to make your brand more popular
              and trust worthy
            </div>
          </div>
        );
      case "3":
        return (
          <div className="text-center cps-30 cpe-30">
            <div className="text-26-500 color-black-olive">Conduct Survey</div>
          </div>
        );
      case "4":
        return (
          <div className="text-center cps-30 cpe-30">
            <div className="text-26-500 color-black-olive">CSR Activity</div>
            <div className="text-15-400 color-black-olive mt-3">
              Conduct world class trainings effortlessly to our IFERP members
              and get various
              <br /> benefits like certification & rewards
            </div>
          </div>
        );
      default:
        return "";
    }
  };
  const getComponent = () => {
    switch (type) {
      case "1":
        return (
          <ExhibitionRegistration
            handelSaveBrand={handelSaveBrand}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "2":
        return (
          <BrandPromotion
            handelSaveBrand={handelSaveBrand}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "3":
        return (
          <ConductSurvey
            handelSaveBrand={handelSaveBrand}
            btnLoading={btnLoading}
            setBtnLoading={setBtnLoading}
            reset={reset}
            setReset={setReset}
          />
        );
      case "4":
        return (
          <CSRActivity
            handelSaveBrand={handelSaveBrand}
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
  return (
    <>
      {type === "3" && (
        <div className="row" id="brand-forms-container">
          <div className="text-center">
            <div className="text-26-500 color-black-olive position-relative">
              <span>
                <div
                  className="d-flex position-absolute start-0 top-0"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  <img
                    src={icons.leftArrow}
                    alt="back"
                    className="h-21 me-3 pointer"
                  />
                </div>
              </span>
              <span>Survey</span>
            </div>
            <div className="text-15-400 color-black-olive mt-3 mb-3">
              Conduct survey with more than 35000 professional members and make
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="col-md-12">
              <Card className="border dashboard-card">
                <div className="col-md-12 center-flex border-b cpt-16 cpb-16">
                  <div className="card-profile">
                    <img src={icons.studentMember} alt="img" />
                  </div>
                  <div className="text-start cps-16">
                    <div className="text-20-600 color-raisin-black">7200+</div>
                    <div className="text-15-500 color-black-olive">
                      Student Members
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div className="col-md-4 mb-2">
            <div className="col-md-12">
              <Card className="border dashboard-card ">
                <div className="col-md-12 center-flex border-b cpt-16 cpb-16">
                  <div className="card-profile">
                    <img src={icons.studentMember} alt="img" />
                  </div>
                  <div className="text-start cps-16">
                    <div className="text-20-600 color-raisin-black">7200+</div>
                    <div className="text-15-500 color-black-olive">
                      Student Members
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div className="col-md-4 mb-2">
            <div className="col-md-12">
              <Card className="border dashboard-card ">
                <div className="col-md-12 center-flex border-b cpt-16 cpb-16">
                  <div className="card-profile">
                    <img src={icons.studentMember} alt="img" />
                  </div>
                  <div className="text-start cps-16">
                    <div className="text-20-600 color-raisin-black">7200+</div>
                    <div className="text-15-500 color-black-olive">
                      Student Members
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
      <Card className="cps-40 cpe-40 cpt-40 cpb-40">
        <div className="d-flex center-flex position-relative">
          {type !== "3" && (
            <div
              className="d-flex position-absolute start-0 top-0"
              onClick={() => {
                navigate(-1);
              }}
            >
              <img
                src={icons.leftArrow}
                alt="back"
                className="h-21 me-3 pointer"
              />
            </div>
          )}

          {getTitle()}
        </div>
        {getComponent()}
      </Card>
    </>
  );
};
export default BrandForms;
