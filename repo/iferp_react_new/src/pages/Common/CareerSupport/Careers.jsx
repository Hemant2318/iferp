import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import BenefitsOfCommitteeMember from "components/Layout/BenefitsOfCommitteeMember/BenefitsOfCommitteeMember";
import { fetchAllCareer } from "store/slices";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";

const Careers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { memberType } = params;
  const [pageLoading, setPageLoading] = useState(true);
  const [isBenifit, setIsBenifit] = useState(false);
  const [list, setList] = useState([]);
  const getCareers = async () => {
    const response = await dispatch(
      fetchAllCareer(
        objectToFormData({
          user_id: getDataFromLocalStorage("id"),
        })
      )
    );
    let resList = [];
    if (response?.data?.career_details) {
      resList = response?.data?.career_details;
    }
    setList(resList);
    setPageLoading(false);
  };
  useEffect(() => {
    getCareers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const userData = getDataFromLocalStorage();
  const userType = userData?.user_type;
  const access = {
    isInstitution: userType === "3",
    isNominationAsSpeakerApply: userType === "4",
    isProfetionalFree: userData?.membership_plan_id === "2",
  };
  return (
    <>
      {isBenifit && (
        <BenefitsOfCommitteeMember
          onHide={() => {
            setIsBenifit(false);
          }}
        />
      )}
      <div className="center-flex flex-column mb-5">
        <div className="text-24-500 color-title-navy font-poppins">
          Career Support
        </div>
        <div className="text-15-400-25 color-subtitle-navy mt-2">
          We help you become expert in the field of your interest
        </div>
      </div>

      {pageLoading ? (
        <div className="center-flex cpt-50 cpb-50">
          <Loader size="md" />
        </div>
      ) : list.length === 0 ? (
        <div className="center-flex cpt-50 cpb-50 text-15-400">
          <div>Data not found.</div>
        </div>
      ) : (
        <div className="row fadeInUp">
          {list.map((elem, index) => {
            return (
              <div className="col-md-6 cmb-22 d-flex" key={index}>
                <Card className="cps-16 cpe-16 cpt-22 cpb-22 d-flex flex-column w-100">
                  <div className="text-18-500 color-new-car">
                    {elem.career_category}
                  </div>
                  <div className="text-15-400 color-black-olive mt-2 cmb-30">
                    {elem.description}
                  </div>
                  <div
                    className={`${
                      elem.type ? "d-flex align-items-end mt-auto" : "d-none"
                    }`}
                  >
                    {access.isInstitution ? (
                      <Button
                        isRounded
                        text={elem.type === 14 ? "Apply Now" : "View Details"}
                        btnStyle="primary-dark"
                        className="h-35 text-13-400 cps-20 cpe-20"
                        onClick={() => {
                          if (elem.type === 14) {
                            navigate(
                              `/${memberType}/career-support/${elem?.career_id}/${elem?.type}`
                            );
                          } else {
                            const types = [1, 3, 4];
                            if (types.includes(elem.type)) {
                              navigate(
                                `/${memberType}/career-support/${elem?.career_id}/events`
                              );
                            } else {
                              navigate(
                                `/${memberType}/career-support/${elem?.career_id}/events/members`
                              );
                            }
                          }
                        }}
                      />
                    ) : (
                      <Button
                        isRounded
                        text="Apply Now"
                        btnStyle="primary-dark"
                        className="h-35 text-13-400 cps-20 cpe-20"
                        onClick={() => {
                          const types = [1, 3, 4];
                          if (access.isProfetionalFree) {
                            setIsBenifit(true);
                          } else {
                            if (types.includes(elem.type)) {
                              navigate(
                                `/${memberType}/career-support/${elem?.career_id}/events`
                              );
                            } else {
                              navigate(
                                `/${memberType}/career-support/${elem?.career_id}/${elem?.type}`
                              );
                            }
                          }
                        }}
                      />
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
          {access.isNominationAsSpeakerApply && (
            <div className="col-md-6 cmb-22 d-flex">
              <Card className="cps-16 cpe-16 cpt-22 cpb-22 d-flex flex-column w-100">
                <div className="text-18-500 color-new-car">
                  Nominate your Talent to CSR Activity
                </div>
                <div className="text-15-400 color-black-olive mt-2 cmb-30">
                  Nominate your talented employees to become chief guests and
                  speakers in the upcoming IFERP events like conferences,
                  webinars etc..
                </div>
                <div className="d-flex align-items-end mt-auto">
                  <Button
                    isRounded
                    btnStyle="primary-dark"
                    className="text-14-500 cps-30 cpe-30 pt-2 pb-2 h-46"
                    text={
                      <div className="text-12-500">
                        <div className="text-nowrap mt-2">
                          Nominate as speaker
                        </div>
                        <div className="mb-2">{"& chief guest"}</div>
                      </div>
                    }
                    onClick={() => {
                      navigate("/corporate/events/event-list/conference");
                    }}
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default Careers;
