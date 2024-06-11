import { useNavigate, useParams } from "react-router-dom";
import { icons } from "utils/constants";
import { Button, CustomTab } from "components";
import ProfileTab from "./ProfileTab";
import OrganizationConference from "./OrganizationConference";
import Statistics from "./Statistics";
import Network from "./Network";
import SavedList from "./SavedList";
import InboxNotifications from "./InboxNotifications";

const OrganizationProfile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { type } = params;
  const handleRedirect = (option) => {
    navigate(`/organization-profile/${option}`);
  };
  return (
    <div className="container bg-feff">
      <div className="shadow cpt-30 cps-30 cpe-30">
        <div className="row d-flex">
          <div className="col-md-3 b-e3e3">
            <img src={icons.newIferpLogo} alt="logo" className="fit-image" />
          </div>
          <div className="col-md-9">
            <div className="d-flex justify-content-end">
              <span className="d-flex b-e3e3 rounded-circle p-2 pointer">
                <img src={icons.edit} alt="edit" style={{ height: "12px" }} />
              </span>
            </div>
            <div className="text-22-500 color-3d3d">
              Academy Institute of Engineering & Technology
            </div>
            <div className="text-16-400 color-3d3d">Chennai, Tamil Nadu</div>
            <div className="text-16-500 color-5555 cmb-20 mt-4">
              Activity on Research Pedia
            </div>
            <div className="row cmb-20">
              <div className="fa-center gap-2 col-md-3">
                <span>
                  <img src={icons.play} alt="play" />
                </span>
                <span className="text-15-400 color-3d3d">224 Predio</span>
              </div>
              <div className="fa-center gap-2 col-md-3">
                <span>
                  <img src={icons.series} alt="series" />
                </span>
                <span className="text-15-400 color-3d3d">
                  22 Conference Series
                </span>
              </div>
            </div>
            <div className="row">
              <div className="fa-center gap-2 col-md-3">
                <span>
                  <img src={icons.conference} alt="conference" />
                </span>
                <span className="text-15-400 color-3d3d">38 Conferences</span>
              </div>
              <div className="fa-center gap-2 col-md-3">
                <span>
                  <img src={icons.discussion} alt="discussion" />
                </span>
                <span className="text-15-400 color-3d3d">46 Discussions</span>
              </div>
            </div>
          </div>
        </div>
        <div className="fb-center pb-1 mt-3">
          <CustomTab
            active={type || "profile"}
            options={[
              {
                title: "Profile",
                activeText: "profile",
                onClick: () => {
                  handleRedirect("profile");
                },
              },
              {
                title: "Conferences",
                activeText: "conferences",
                onClick: () => {
                  handleRedirect("conferences");
                },
              },
              {
                title: "Statistics",
                activeText: "statistics",
                onClick: () => {
                  handleRedirect("statistics");
                },
              },
              {
                title: "Network",
                activeText: "network",
                onClick: () => {
                  handleRedirect("network");
                },
              },
              {
                title: "Saved List",
                activeText: "saved-list",
                onClick: () => {
                  handleRedirect("saved-list");
                },
              },
              {
                title: "Inbox & Notificatons",
                activeText: "inbox-notificatons",
                onClick: () => {
                  handleRedirect("inbox-notificatons");
                },
              },
            ]}
          />
          <div className="d-flex gap-3">
            <Button
              btnText="Publish Research"
              btnStyle="SO"
              onClick={() => {}}
              leftIcon={icons.successPlus}
            />
          </div>
        </div>
      </div>
      {type === "profile" && <ProfileTab />}
      {type === "conferences" && <OrganizationConference />}
      {type === "statistics" && <Statistics />}
      {type === "network" && <Network />}
      {type === "saved-list" && <SavedList />}
      {type === "inbox-notificatons" && <InboxNotifications />}
    </div>
  );
};

export default OrganizationProfile;
