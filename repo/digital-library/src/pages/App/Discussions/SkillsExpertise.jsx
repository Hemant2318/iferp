import Card from "components/layouts/Card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResearchProfileData } from "../../../store/globalSlice";
import { getDataFromLocalStorage } from "../../../utils/helpers/common";
import Loader from "../../../components/layouts/Loader";

const SkillsExpertise = () => {
  const dispatch = useDispatch();
  const userData = getDataFromLocalStorage();
  const reduxData = useSelector((state) => state.global);
  const { researchProfile } = reduxData || {};

  const [isPageLoading, setIsPageLoading] = useState(false);

  const fetchDetails = async () => {
    setIsPageLoading(true);
    await dispatch(fetchResearchProfileData(`user_id=${userData?.id}`));
    setIsPageLoading(false);
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { area_of_interest } = researchProfile?.profile_details || {};

  return (
    <Card>
      <div className="text-16-400 lh-24 color-4d4d cps-22 cpt-16 cpb-10">
        Skills & Expertise
      </div>
      <div className="bt-e3e3" />
      {isPageLoading ? (
        <div className="d-flex align-items-center justify-content-center h-100 cpt-100 cpb-100">
          <Loader size="sm" />
        </div>
      ) : (
        <>
          <div className="cps-20 cpt-20 cpe-20 cpb-20 d-flex flex-wrap gap-2">
            <div className="text-14-400 color-8080">
              Questions will appear based on your skills and expertise
            </div>
            {area_of_interest ? (
              area_of_interest
                ?.split(",")
                ?.slice(0, 7)
                ?.map((elm, index) => {
                  return (
                    <span
                      key={index}
                      className="bg-f0f0 cps-10 cpe-10 cpt-5 cpb-5 text-13-400 text-nowrap color-4d4d lh-23 br-2"
                    >
                      {elm}
                    </span>
                  );
                })
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 cpt-100 cpb-100">
                No Data Found.
              </div>
            )}
          </div>
          {/* <div className="text-center bg-fbfb pt-2 pb-2 border-top">
            <span className="pointer text-14-400 lh-21 color-5555">
              View all
            </span>
          </div> */}
        </>
      )}
    </Card>
  );
};

export default SkillsExpertise;
