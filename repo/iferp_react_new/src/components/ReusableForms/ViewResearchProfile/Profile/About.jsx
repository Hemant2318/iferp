import Card from "components/Layout/Card";
import EditButton from "components/Layout/EditButton";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchResearchItems } from "store/slices";
import { icons } from "utils/constants";

const About = ({ isMyProfile, about, setIsEdit, setFormType, userID }) => {
  const dispatch = useDispatch();
  const [researchCount, setResearchCount] = useState(0);
  const getReasecrhItems = async () => {
    const response = await dispatch(fetchResearchItems(`?user_id=${userID}`));
    setResearchCount(response?.data?.posts?.length || 0);
  };
  useEffect(() => {
    getReasecrhItems();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Card className="unset-br mb-3">
      <div className="d-flex justify-content-between align-items-center cps-16 cpt-16 cpb-16 cpe-16 border-bottom">
        <div className="text-16-500 title-text">About/Bio</div>
        {about?.id && isMyProfile && (
          <div>
            <EditButton
              onClick={() => {
                setFormType(2);
                setIsEdit(true);
              }}
            />
          </div>
        )}
      </div>
      <div className="cps-16 cpe-16 cpt-22 cpb-22">
        {about?.id ? (
          <div>
            <div className="mb-2">
              <div className="text-14-400 color-black-olive mb-1">
                Career Objective
              </div>
              <div className="text-14-500 color-black-olive">
                {about?.introduction}
              </div>
            </div>

            <div className="mb-2">
              <div className="text-14-400 color-black-olive mb-1">
                Disciplines
              </div>
              <div className="text-14-500 color-black-olive">
                {about?.disciplines}
              </div>
            </div>
            {/* <div className="mb-2">
            <div className="text-14-400 color-black-olive mb-1">
              Skills & Expertise
            </div>
            <div className="text-14-500 color-black-olive">
              {about?.skills_and_expertise}
            </div>
          </div> */}
            <div className="mb-2">
              <div className="text-14-400 color-black-olive mb-1">
                Languages
              </div>
              <div className="text-14-500 color-black-olive">
                {about?.languages}
              </div>
            </div>
            <div>
              <div className="text-14-400 color-black-olive mb-1">
                Activity on Research Interest
              </div>
              <div className="text-14-500 color-black-olive">
                {researchCount} Research Items
              </div>
            </div>
          </div>
        ) : (
          <div
            className="center-flex flex-column mt-3 mb-2"
            onClick={() => {
              setFormType(2);
            }}
          >
            <div>
              <img src={icons.about} alt="affiliations" />
            </div>
            <div className="text-15-500 color-black-olive mt-1 mb-1">
              <u className="hover-effect">
                Add your Introduction, Disciplines & Languages
              </u>
            </div>
            <div className="text-14-400 color-subtitle-navy text-center">
              Update your profile by adding about yourself. Make it easier for
              others to get you know better
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default About;
