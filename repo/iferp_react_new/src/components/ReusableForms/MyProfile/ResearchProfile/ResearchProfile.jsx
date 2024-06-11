import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import { fetchResearchProfileData } from "store/slices";
import ResearchStatistics from "components/ReusableForms/ViewResearchProfile/ResearchStatistics";
import ResearchItems from "components/ReusableForms/ViewResearchProfile/ResearchItems";
import EditDetails from "./EditDetails";
import Profile from "./Profile";
import Scores from "./Scores";
import CreateResearchItem from "./CreateResearchItem";
import { getDataFromLocalStorage } from "utils/helpers";
import ShareButton from "components/Layout/ShareButton";
import Loader from "components/Layout/Loader";
import "./ConnectPopup.scss";
// import UserDetails from "components/ReusableForms/ViewResearchProfile/UserDetails";

const ResearchProfile = () => {
  const dispatch = useDispatch();
  // const { researchProfile } = useSelector((state) => ({
  //   researchProfile: state.student.researchProfile,
  // }));
  let userID = getDataFromLocalStorage("id");
  const [isResearchItem, setIsResearchItem] = useState(false);
  const [type, setType] = useState(0);
  const [formType, setFormType] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const fetchDetails = async () => {
    setIsPageLoading(true);
    await dispatch(fetchResearchProfileData(`user_id=${userID}`));
    setIsPageLoading(false);
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isPageLoading ? (
        <Card className="mb-3 cps-24 cpe-24 cpt-24 cpb-24">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          {isResearchItem && (
            <CreateResearchItem
              onHide={() => {
                setIsResearchItem(false);
              }}
              handelSuccess={() => {
                setIsResearchItem(false);
              }}
            />
          )}
          {formType && (
            <EditDetails
              isEdit={isEdit}
              formType={formType}
              userID={userID}
              onHide={() => {
                setFormType(null);
                setIsEdit(false);
              }}
            />
          )}
          {/* <Card className="mb-3 cps-24 cpe-24 cpt-24 cpb-24 ">
            <div className="d-flex ">
              <UserProfile
                isRounded
                url={profile_photo}
                text={first_name}
                size="s-100"
                className="me-4"
              />
              <div className="flex-grow-1  ">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  {first_name && (
                    <div className="text-20-500 color-raisin-black">{`${first_name} ${last_name}`}</div>
                  )}

                  <EditButton
                    onClick={() => {
                      setFormType(1);
                    }}
                  />
                </div>
                <div className="text-15-400 color-black-olive mt-2 mb-2">
                  {`${designation ? `${designation} -` : ""} ${
                    user_type === "2" ? institution_name : university
                  }`}
                </div>

                <div className="text-14-400 color-black-olive">
                  {`${
                    user_type === "2"
                      ? university
                        ? `${university} -`
                        : ""
                      : ""
                  } ${state_name}, ${country_name}`}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between cmt-26">
              <div className="col-md-12">
                {area_of_interest && (
                  <>
                    <div className="text-14-500 color-black-olive">
                      Skills and expertise
                    </div>
                    <div className="text-15-400 color-black-olive mt-2 d-flex gap-2 flex-wrap">
                      {area_of_interest?.split(",").map((elem, index) => {
                        return (
                          <span
                            key={index}
                            className="bg-new-car-light ps-2 pe-2 pb-1 pt-1 text-13-500 text-nowrap"
                          >
                            {elem}
                          </span>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card> */}
          {/* <UserDetails
            isMyProfile
            setFormType={setFormType}
            profile_details={researchProfile?.profile_details}
          /> */}
          <Card className="d-flex align-items-center justify-content-between flex-wrap gap-3 unset-br mb-3 cps-16 pe-1 pt-1 pb-1">
            <div>
              <Tabs
                defaultActiveKey={type}
                id="uncontrolled-tab-example"
                className="gap-5"
              >
                <Tab
                  eventKey={0}
                  title="Profile"
                  onEnter={() => {
                    setType(0);
                  }}
                />
                <Tab
                  eventKey={1}
                  title="Research"
                  onEnter={() => {
                    setType(1);
                  }}
                />
                <Tab
                  eventKey={2}
                  title="Statistics"
                  onEnter={() => {
                    setType(2);
                  }}
                />
                {/* <Tab
              eventKey={3}
              title="Scores"
              onEnter={() => {
                setType(3);
              }}
            /> */}
              </Tabs>
            </div>

            <div className="d-flex align-items-center flex-wrap gap-3">
              <div>
                <ShareButton
                  url={`${window?.location?.origin}/member/global-research-profile/${userID}`}
                />
              </div>

              <div id="add-research-item-id">
                <Button
                  isSquare
                  text="Add Research Item"
                  btnStyle="primary-dark"
                  className="h-35 text-14-500 text-nowrap"
                  icon={
                    <img src={icons.lightSave} alt="create" className="me-2" />
                  }
                  onClick={() => {
                    setIsResearchItem(true);
                  }}
                />
              </div>
            </div>
          </Card>
          {type === 0 && (
            <Profile
              isSelfUser
              setFormType={setFormType}
              setIsEdit={setIsEdit}
              fetchDetails={fetchDetails}
              userID={userID}
              isPageLoading={isPageLoading}
            />
          )}
          {type === 1 && <ResearchItems userID={userID} isMyProfile />}
          {type === 2 && <ResearchStatistics userID={userID} isMyProfile />}
          {type === 3 && <Scores />}
        </>
      )}
    </>
  );
};
export default ResearchProfile;
