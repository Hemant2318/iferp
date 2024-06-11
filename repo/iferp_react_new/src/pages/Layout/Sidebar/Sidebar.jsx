import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getDataFromLocalStorage } from "utils/helpers";
import { setIsCollapseSidebar, setIsLogout } from "store/slices";
import {
  adminRoute,
  corporateRoute,
  institutionalRoute,
  profetionalRoute,
  resourceRoute,
  studentRoute,
  icons,
} from "utils/constants";
import "./Sidebar.scss";
import { useEffect } from "react";

const adminSidebarOptions = [
  {
    id: 1,
    title: "Dashboard",
    icon: icons.dashboard,
    url: adminRoute.dashboard,
  },
  {
    id: 2,
    title: "Profile Management",
    icon: icons.profile,
    url: adminRoute.profileManagement,
  },
  {
    id: 3,
    title: "Event Management",
    icon: icons.conferenceEvents,
    url: adminRoute.eventManagement,
  },
  {
    id: 4,
    title: "Journal Management",
    icon: icons.publication,
    url: adminRoute.journalManagement,
  },
  {
    id: 5,
    title: "Network Management",
    icon: icons.network,
    url: adminRoute.networkManagement,
  },
  {
    id: 6,
    title: "Chapters & Groups Management",
    icon: icons.chapteres,
    url: adminRoute.chaptersAndGroups,
  },
  {
    id: 7,
    title: "Certificate Management",
    icon: icons.certificate,
    url: adminRoute.certificateManagement,
  },
  {
    id: 8,
    title: "Award Management",
    icon: icons.award,
    url: adminRoute.awardManagement,
  },
  {
    id: 9,
    title: "Resource Management",
    icon: icons.resource,
    url: adminRoute.resourceManagement,
  },
  {
    id: 10,
    title: "Career Management",
    icon: icons.career,
    url: adminRoute.careerManagement,
  },
  {
    id: 11,
    title: "Mentorship Management",
    icon: icons.mentorship,
    url: adminRoute.mentorshipManagement,
  },
  {
    id: 12,
    title: "Inbox/Notifications",
    icon: icons.inbox,
    url: adminRoute.inboxNotifications,
  },
  {
    id: 13,
    title: "Branding Management",
    icon: icons.branding,
    url: adminRoute.brandingManagement,
  },
  {
    id: 14,
    title: "University Management",
    icon: icons.conferenceEvents,
    url: adminRoute.universityManagement,
  },
  {
    id: 15,
    title: "Institution Management",
    icon: icons.conferenceEvents,
    url: adminRoute.institutionManagement,
  },
  {
    id: 16,
    title: "Region Management",
    icon: icons.resource,
    url: adminRoute.regionManagement,
  },
  {
    id: 17,
    title: "Department Management",
    icon: icons.chapteres,
    url: adminRoute.departmentManagement,
  },
  {
    id: 18,
    title: "Settings",
    icon: icons.career,
    url: adminRoute.setting,
  },
  {
    id: 19,
    title: "Newsletter",
    icon: icons.resource,
    url: adminRoute.newsLetter,
  },
];
const studentSidebarOptions = [
  {
    id: 1,
    title: "Dashboard",
    icon: icons.dashboard,
    url: studentRoute.dashboard,
  },
  {
    id: 2,
    title: "My Profile",
    icon: icons.profile,
    url: studentRoute.myProfile,
    tourId: "profile-details-id",
  },
  {
    id: 3,
    title: "Conferences & Events",
    icon: icons.conferenceEvents,
    url: studentRoute.conferencesAndEvents,
    tourId: "all-events-id",
  },
  {
    id: 4,
    title: "Publications",
    icon: icons.publication,
    url: studentRoute.publications,
    tourId: "publications-id",
  },
  {
    id: 5,
    title: "Inbox/Notifications",
    icon: icons.inbox,
    url: studentRoute.inboxNotifications,
  },
  {
    id: 6,
    title: "My Post and Networks",
    icon: icons.network,
    url: studentRoute.networkManagement,
    tourId: "my-network-community-id",
  },
  {
    id: 7,
    title: "Chapters & Groups",
    icon: icons.chapteres,
    url: studentRoute.chaptersAndGroups,
    tourId: "chapters-groups-id",
  },
  {
    id: 8,
    title: "Career Support",
    icon: icons.career,
    url: studentRoute.careerSupport,
    tourId: "career-support-id",
  },
  {
    id: 9,
    title: "Mentorship",
    icon: icons.mentorship,
    url: studentRoute.mentorship,
    tourId: "mentorship-id",
    isNewFeature: true,
  },
  {
    id: 10,
    title: "Nominate For Award",
    icon: icons.nomineeAward,
    url: studentRoute.nominateForAward,
    tourId: "nomiante-for-awards-id",
  },
  {
    id: 11,
    title: "IFERP Digital Library",
    icon: icons.digitalLibrary,
    url: studentRoute.digitalLibrary,
  },
  {
    id: 12,
    title: "Certificates & Rewards",
    icon: icons.certificate,
    url: studentRoute.certificatesAndRewards,
  },
  {
    id: 13,
    title: "Award Winners",
    icon: icons.award,
    url: studentRoute.awardWinners,
  },
  {
    id: 14,
    title: "Help & support",
    icon: icons.userHelp,
    url: studentRoute.helpSupport,
  },
];
const profetionalSidebarOptions = [
  {
    id: 1,
    title: "Dashboard",
    icon: icons.dashboard,
    url: profetionalRoute.dashboard,
  },
  {
    id: 2,
    title: "My Profile",
    icon: icons.profile,
    url: profetionalRoute.myProfile,
    tourId: "profile-details-id",
  },
  {
    id: 3,
    title: "Conferences & Events",
    icon: icons.conferenceEvents,
    url: profetionalRoute.conferencesAndEvents,
    tourId: "all-events-id",
  },
  {
    id: 4,
    title: "Publications",
    icon: icons.publication,
    url: profetionalRoute.publications,
    tourId: "publications-id",
  },
  {
    id: 5,
    title: "Inbox/Notifications",
    icon: icons.inbox,
    url: profetionalRoute.inboxNotifications,
  },
  {
    id: 6,
    title: "My Post and Networks",
    icon: icons.network,
    url: profetionalRoute.networkManagement,
    tourId: "my-network-community-id",
  },
  {
    id: 7,
    title: "Chapters & Groups",
    icon: icons.chapteres,
    url: profetionalRoute.chaptersAndGroups,
    tourId: "chapters-groups-id",
  },
  {
    id: 8,
    title: "Career Support",
    icon: icons.career,
    url: profetionalRoute.careerSupport,
    tourId: "career-support-id",
  },
  {
    id: 9,
    title: "Mentorship",
    icon: icons.mentorship,
    url: profetionalRoute.mentorship,
    tourId: "mentorship-id",
    isNewFeature: true,
  },
  {
    id: 10,
    title: "Nominate For Award",
    icon: icons.nomineeAward,
    url: profetionalRoute.nominateForAward,
    tourId: "nomiante-for-awards-id",
  },
  {
    id: 11,
    title: "IFERP Digital Library",
    icon: icons.digitalLibrary,
    url: profetionalRoute.digitalLibrary,
  },
  {
    id: 12,
    title: "Certificates & Rewards",
    icon: icons.certificate,
    url: profetionalRoute.certificatesAndRewards,
  },
  {
    id: 13,
    title: "Award Winners",
    icon: icons.award,
    url: profetionalRoute.awardWinners,
  },
  {
    id: 14,
    title: "Help & support",
    icon: icons.userHelp,
    url: profetionalRoute.helpSupport,
  },
];
const instituteSidebarOptions = [
  {
    id: 1,
    title: "Dashboard",
    icon: icons.dashboard,
    url: institutionalRoute.dashboard,
  },
  {
    id: 2,
    title: "Our Profile",
    icon: icons.ourProfile,
    url: institutionalRoute.myProfile,
  },
  {
    id: 3,
    title: "Activity Plan",
    icon: icons.activePlan,
    url: institutionalRoute.activityPlan,
  },
  {
    id: 4,
    title: "Our Academicians",
    icon: icons.ourAcademies,
    url: institutionalRoute.ourAcademies,
  },
  {
    id: 5,
    title: "Conferences & Events",
    icon: icons.conferenceEvents,
    url: institutionalRoute.conferencesAndEvents,
  },
  {
    id: 6,
    title: "Publications",
    icon: icons.publication,
    url: institutionalRoute.publications,
  },
  {
    id: 7,
    title: "Inbox/Notifications",
    icon: icons.inbox,
    url: institutionalRoute.inboxNotifications,
  },
  {
    id: 8,
    title: "My Post and Networks",
    icon: icons.network,
    url: institutionalRoute.networkManagement,
  },
  {
    id: 9,
    title: "Innovation Ambassador",
    icon: icons.innovation,
    url: institutionalRoute.innovationAmbassador,
  },
  {
    id: 10,
    title: "Chapters & Groups",
    icon: icons.chapteres,
    url: institutionalRoute.chaptersAndGroups,
  },
  {
    id: 11,
    title: "Career Support",
    icon: icons.career,
    url: institutionalRoute.careerSupport,
  },
  {
    id: 12,
    title: "Nominate For Award",
    icon: icons.nominateAward,
    url: institutionalRoute.nominateForAward,
  },
  {
    id: 13,
    title: "Certificates & Rewards",
    icon: icons.certificate,
    url: institutionalRoute.certificatesAndRewardsList,
  },
  {
    id: 14,
    title: "Collaboration",
    icon: icons.collaboration,
    url: institutionalRoute.collaboration,
  },
  {
    id: 15,
    title: "Funds And Grants",
    icon: icons.fund,
    url: institutionalRoute.fundsAndGrants,
  },
  {
    id: 16,
    title: "Help",
    icon: icons.userHelp,
    url: institutionalRoute.helpSupport,
  },
];
const corporateSidebarOptions = [
  {
    id: 1,
    title: "Dashboard",
    icon: icons.dashboard,
    url: corporateRoute.dashboard,
  },
  {
    id: 2,
    title: "Our Profile",
    icon: icons.corporateProfile,
    url: corporateRoute.myProfile,
  },
  {
    id: 3,
    title: "Conferences & Events",
    icon: icons.conferenceEvents,
    url: corporateRoute.events,
    tourId: "all-events-id",
  },
  {
    id: 4,
    title: "Publications",
    icon: icons.publication,
    url: corporateRoute.publications,
  },
  {
    id: 5,
    title: "Branding & Publicity",
    icon: icons.branding,
    url: corporateRoute.brandingAndPublicity,
  },
  {
    id: 6,
    title: "Inbox/Notifications",
    icon: icons.inbox,
    url: corporateRoute.inboxNotifications,
  },
  {
    id: 7,
    title: "My Post and Networks",
    icon: icons.network,
    url: corporateRoute.networkManagement,
  },
  {
    id: 8,
    title: "Chapters & Groups",
    icon: icons.chapteres,
    url: corporateRoute.chaptersAndGroups,
  },
  {
    id: 9,
    title: "Talent Development",
    icon: icons.career,
    url: corporateRoute.careerSupport,
  },
  {
    id: 10,
    title: "Certificates & Rewards",
    icon: icons.certificate,
    url: corporateRoute.certificatesAndRewardsList,
  },
  {
    id: 11,
    title: "Award Winners",
    icon: icons.award,
    url: corporateRoute.awardWinners,
  },
  {
    id: 12,
    title: "Nominate For Award",
    icon: icons.nominateAward,
    url: corporateRoute.nominateForAward,
  },
  {
    id: 13,
    title: "IFERP Digital Library",
    icon: icons.digitalLibrary,
    url: corporateRoute.digitalLibrary,
  },
  {
    id: 14,
    title: "Help",
    icon: icons.institutionalHelp,
    url: corporateRoute.helpSupport,
  },
];
const resourceSidebarOptions = [
  {
    id: 1,
    title: "Dashboard",
    icon: icons.dashboard,
    url: resourceRoute.dashboard,
  },
  {
    id: 2,
    title: "Profile Management",
    icon: icons.profile,
    url: resourceRoute.profileManagement,
  },
  {
    id: 3,
    title: "Event Management",
    icon: icons.conferenceEvents,
    url: resourceRoute.eventManagement,
  },
  {
    id: 4,
    title: "Journal Management",
    icon: icons.publication,
    url: resourceRoute.journalManagement,
  },
  {
    id: 5,
    title: "Chapters & Groups Management",
    icon: icons.chapteres,
    url: resourceRoute.chaptersAndGroups,
  },
  {
    id: 6,
    title: "My Post and Networks",
    icon: icons.network,
    url: resourceRoute.networkManagement,
  },
  {
    id: 7,
    title: "Inbox/Notifications",
    icon: icons.inbox,
    url: resourceRoute.inboxNotifications,
  },
  {
    id: 8,
    title: "Certificate Management",
    icon: icons.certificate,
    url: resourceRoute.certificateManagement,
  },
  {
    id: 9,
    title: "Award Management",
    icon: icons.award,
    url: resourceRoute.awardManagement,
  },
  {
    id: 10,
    title: "Career Management",
    icon: icons.career,
    url: resourceRoute.careerManagement,
  },
  {
    id: 11,
    title: "Branding Management",
    icon: icons.branding,
    url: resourceRoute.brandingManagement,
  },
];

const Sidebar = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const userData = getDataFromLocalStorage();
  // const [IsShow , setIsShow] = useState(false);
  const { user_type, membership_details = {}, resource_role } = userData;
  const { id: membershipID } = membership_details;
  let navigate = useNavigate();
  const { tourIndex, isTour, isCollapseSidebar } = useSelector((state) => ({
    tourIndex: state.global.tourIndex,
    isTour: state.global.isTour,
    isCollapseSidebar: state.global.isCollapseSidebar,
  }));
  let { mentor_status } = getDataFromLocalStorage();
  const handleRedirect = (url) => {
    navigate(url);
  };
  const getOptions = (type) => {
    switch (type) {
      case "0":
        return adminSidebarOptions;
      case "2":
        return profetionalSidebarOptions;
      case "3":
        return instituteSidebarOptions;
      case "4":
        return corporateSidebarOptions;
      case "5":
        return studentSidebarOptions;
      case "6":
        let newRoutes = resourceSidebarOptions;
        if (resource_role && resource_role === "2") {
          newRoutes = resourceSidebarOptions.filter((_, i) => i !== 1);
        }
        return newRoutes;

      default:
        return [];
    }
  };
  useEffect(() => {
    let elem = document.getElementById("side-option-list-id");
    if (tourIndex < 12 && isTour) {
      if (elem) {
        elem.style.overflowY = "hidden";
      }
    } else {
      if (elem) {
        elem.style.overflowY = "auto";
      }
    }
  }, [tourIndex, isTour]);

  const access = {
    isHelpAndSupport: membershipID === 3 || membershipID === 12,
    isSubMentorship: membershipID === 3 || membershipID === 2,
  };
  const loadOption = getOptions(user_type);
  return (
    <div
      id="Sidebar-container"
      className={`iferp-scroll ${isCollapseSidebar ? "collapse-side" : ""}`}
    >
      {/* <div className={`mobile-logo-container ${IsShow ? 'showslider' : 'hideSlider'}`} onClick={() => setIsShow(!IsShow)}> */}
      <div
        className={`mobile-logo-container`}
        onClick={() => {
          if (window.innerWidth > 1088) {
            dispatch(setIsCollapseSidebar(false));
          }
        }}
      >
        {/* <img className="img-logo1" src={icons.roundLogo} alt="img" /> */}
        <i className="bi bi-list img-logo1 text-24-500" />
      </div>

      <nav
        className={`sidemenu-container ${
          isCollapseSidebar ? "collapse-sidemenu-container" : ""
        }`}
        id="nav-sidemenu"
      >
        <div className="desktop-logo-container">
          <div>
            <img className="img-logo1" src={icons.logo} alt="img" />
          </div>
          <div
            className="expand-icon"
            onClick={() => {
              dispatch(setIsCollapseSidebar(true));
            }}
          >
            <img src={icons.collapse} alt="collapse" />
          </div>
        </div>
        <ul className="iferp-scroll px-2" id="side-option-list-id">
          {loadOption?.map((elem) => {
            let isActive = window.location?.pathname?.includes(elem.url);
            const isHelp =
              window.location.pathname.includes("help") &&
              access.isHelpAndSupport;

            const isMentorship =
              window.location.pathname.includes("mentorship") &&
              access.isSubMentorship;

            if (isHelp && elem.url.includes("help")) {
              isActive = true;
            }
            if (isMentorship && elem.url.includes("mentorship")) {
              isActive = true;
            }

            return (
              <li
                key={elem.id}
                id={elem.tourId || ""}
                className={`sidemenu-block ${
                  isActive
                    ? `${
                        isMentorship &&
                        mentor_status !== "Reject" &&
                        mentor_status !== ""
                          ? "cmb-130"
                          : ""
                      }
                    ${isMentorship && "cmb-60"}
                      } active-option pointer`
                    : "color-subtitle-navy pointer"
                }`}
                onClick={() => {
                  if (elem.url) {
                    handleRedirect(elem.url);
                  }
                }}
              >
                <div className="sidemenu-block">
                  <img src={elem.icon} alt={elem.title} />
                  <em>{elem.title}</em>
                  {elem?.isNewFeature && !isActive && (
                    <span className="new-feature-logo-block text-14-500">
                      New
                    </span>
                  )}

                  {isHelp && isActive && (
                    <i className="bi bi-chevron-down help-colaps-icon" />
                  )}
                  {isMentorship && isActive && (
                    <i className="bi bi-chevron-down help-colaps-icon" />
                  )}
                </div>
                {isHelp && isActive && (
                  <div className="help-and-support">
                    <div className="help-option-block mt-3">
                      <div className="hr-line" />
                      <div className="vr-line" />
                      <div
                        className={`help-option w-100 text-16-400 pointer ${
                          window.location.pathname.includes("help-and-support")
                            ? "active-sub"
                            : "inactive-sub"
                        }`}
                        onClick={() => {
                          navigate(
                            `/${params?.memberType}/help/help-and-support`
                          );
                        }}
                      >
                        Help & Support
                      </div>
                    </div>
                    <div className="help-option-block mt-3">
                      <div className="hr-line" />
                      <div className="vr-line" />
                      <div
                        className={`help-option w-100 text-16-400 pointer ${
                          window.location.pathname.includes(
                            "my-personal-executive"
                          )
                            ? "active-sub"
                            : "inactive-sub"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(
                            `/${params?.memberType}/help/my-personal-executive`
                          );
                        }}
                      >
                        My Personal Executive
                      </div>
                    </div>
                  </div>
                )}
                {isHelp && isActive && (
                  <div className="mobile-help-and-support">
                    <div className="help-option-block mt-3">
                      <div
                        className={`text-22-400 ${
                          window.location.pathname.includes("help-and-support")
                            ? "color-new-car"
                            : "color-black-olive"
                        }`}
                      >
                        <i className="bi bi-headset" />
                      </div>
                      <div
                        className={`help-option w-100 text-16-400 pointer ${
                          window.location.pathname.includes("help-and-support")
                            ? "active-sub"
                            : "inactive-sub"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(
                            `/${params?.memberType}/help/help-and-support`
                          );
                        }}
                      >
                        Help & Support
                      </div>
                    </div>
                    <div className="help-option-block mt-3">
                      <div
                        className={` text-22-400 ${
                          window.location.pathname.includes(
                            "my-personal-executive"
                          )
                            ? "color-new-car"
                            : "color-black-olive"
                        }`}
                      >
                        <i className="bi bi-chat-left-dots" />
                      </div>
                      <div
                        className={`help-option w-100 text-16-400 pointer ${
                          window.location.pathname.includes(
                            "my-personal-executive"
                          )
                            ? "active-sub"
                            : "inactive-sub"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(
                            `/${params?.memberType}/help/my-personal-executive`
                          );
                        }}
                      >
                        My Personal Executive
                      </div>
                    </div>
                  </div>
                )}

                {isMentorship && isActive && (
                  <div className="sub-mentorship">
                    <div className="mentorship-option-block mt-3">
                      <div className="hr-line" />
                      <div className="vr-line" />
                      <div
                        className={`mentorship-option w-100 text-16-400 pointer ${
                          window.location.pathname.includes("mentee")
                            ? "active-sub"
                            : "inactive-sub"
                        }`}
                        onClick={() => {
                          navigate(
                            `/${params?.memberType}/mentorship/mentee/all-mentors`
                          );
                        }}
                      >
                        Mentee Profile
                      </div>
                    </div>
                    {mentor_status !== "Reject" && mentor_status !== "" && (
                      <div className="mentorship-option-block mt-3">
                        <div className="hr-line" />
                        <div className="vr-line" />
                        <div
                          className={`mentorship-option w-100 text-16-400 pointer ${
                            window.location.pathname
                              ?.split("/")
                              .includes("mentor")
                              ? "active-sub"
                              : "inactive-sub"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(
                              `/${params?.memberType}/mentorship/mentor`
                            );
                          }}
                        >
                          Mentor Profile
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {isMentorship && isActive && (
                  <div className="mobile-sub-mentorship">
                    <div className="mentorship-option-block mt-3">
                      <div
                        className={`text-22-400 ${
                          window.location.pathname.includes("mentee")
                            ? "color-new-car"
                            : "color-black-olive"
                        }`}
                      >
                        <i className="bi bi-people-fill" />
                      </div>
                      <div
                        className={`mentorship-option w-100 text-16-400 pointer ${
                          window.location.pathname.includes("mentee")
                            ? "active-sub"
                            : "inactive-sub"
                        }`}
                        onClick={() => {
                          navigate(
                            `/${params?.memberType}/mentorship/mentee/all-mentors`
                          );
                        }}
                      >
                        Mentee
                      </div>
                    </div>
                    <div className="mentorship-option-block mt-3">
                      <div
                        className={`text-22-400 ${
                          window.location.pathname
                            ?.split("/")
                            .includes("mentor")
                            ? "color-new-car"
                            : "color-black-olive"
                        }`}
                      >
                        <i className="bi bi-person-square" />
                      </div>
                      <div
                        className={`mentorship-option w-100 text-16-400 pointer ${
                          window.location.pathname
                            ?.split("/")
                            .includes("mentor")
                            ? "active-sub"
                            : "inactive-sub"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/${params?.memberType}/mentorship/mentor`);
                        }}
                      >
                        Mentor
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}

          <li
            className={`sidemenu-block pointer ${
              window.location.pathname.includes("help") &&
              access.isHelpAndSupport
                ? "cmt-125 logout-options"
                : ""
            }`}
            onClick={() => {
              dispatch(setIsLogout(true));
            }}
          >
            <div className="sidemenu-block color-subtitle-navy pointer">
              <img src={icons.logout} alt="logout" />
              <em>Log Out</em>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Sidebar;
