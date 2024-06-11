import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { getDataFromLocalStorage, getUserType } from "utils/helpers";
import {
  membershipType,
  adminRoute,
  commonRoute,
  corporateRoute,
  institutionalRoute,
  profetionalRoute,
  resourceRoute,
  studentRoute,
} from "utils/constants";
import SessionExpiredPopup from "components/Layout/SessionExpiredPopup";
import FullscreenLoader from "components/Layout/FullscreenLoader";
import {
  fetchAttendedDetails,
  fetchComitteeMemberCategory,
  fetchCountry,
  fetchEventType,
  fetchMemberships,
  fetchPostCategories,
  fetchProfile,
  getDepartments,
  getCourses,
  getFollowedChapters,
  getLanguages,
  getMyCalender,
  getMyGroups,
  getNotifications,
  getPersonalExecutive,
  setIsBadge,
  setPostID,
  setIsRegisterPopup,
  setSpeakerInviteRegistrationPopup,
  setMentorNotifyPopup,
  getAllTopicsList,
} from "store/slices";
import Layout from "pages/Layout";
import ChangePassword from "pages/Auth/ChangePassword";
import Dashboard from "pages/Admin/Dashboard";
import StudentDashboard from "pages/Student/Dashboard";
import LiveEvents from "pages/Student/Dashboard/LiveEvents";
import ProfetionalDashboard from "pages/Profetional/Dashboard";
import InstitutionalDashboard from "pages/Institutional/Dashboard";
import CorporateDashboard from "pages/Corporate/Dashboard";
import BrandingAndPublicity from "pages/Corporate/BrandingAndPublicity";
import BrandForms from "pages/Corporate/BrandingAndPublicity/BrandForms";
import ResourceDashboard from "pages/Resource/Dashboard";
import ProfileManagement from "pages/Common/ProfileManagement";
import EventManagement from "pages/Common/EventManagement";
import EventDetails from "pages/Common/EventManagement/Events/EventDetails";
import AgendaForm from "pages/Common/EventManagement/Events/EventDetails/Agenda/AgendaForm";
import EventForm from "pages/Common/EventManagement/Events/EventForm";
import SessionDetails from "pages/Common/EventManagement/Events/EventDetails/Agenda/SessionDetails";
import ReviewerDetails from "pages/Common/EventManagement/Reviewers/ReviewerDetails";
import JournalReviewerDetails from "pages/Admin/JournalManagement/Reviewers/ReviewerDetails";
import Paper from "components/ReusableForms/Paper";
import ActivityPlan from "pages/Common/EventManagement/IFERPActivityPlan/ActivityPlan";
import ConferencesAndEvents from "pages/Common/EventManagement/ConferencesAndEvents";
import AbstractSubmission from "pages/Common/EventManagement/ConferencesAndEvents/AbstractSubmission";
import ApplyForCommitteeMember from "pages/Common/EventManagement/ConferencesAndEvents/ApplyForCommitteeMember";
import SubmittedAbstracts from "pages/Common/EventManagement/ConferencesAndEvents/SubmittedAbstracts";
import Sponsorship from "pages/Common/EventManagement/ConferencesAndEvents/Sponsorship";
import NominateForSpeakerAndChiefGuest from "pages/Common/EventManagement/ConferencesAndEvents/NominateForSpeakerAndChiefGuest";
import JournalManagement from "pages/Admin/JournalManagement";
import ChaptersAndGroups from "pages/Common/ChaptersAndGroups";
import ChapterForm from "pages/Common/ChaptersAndGroups/ChapterForm";
import ChapterDetails from "pages/Common/ChaptersAndGroups/Chapters/ChapterDetails";
import GroupDetails from "pages/Common/ChaptersAndGroups/Group/GroupDetails";
import CertificateManagement from "pages/Admin/CertificateManagement";
import EventCertificateDetails from "pages/Admin/CertificateManagement/EventCertificates/EventCertificateDetails";
import AwardManagement from "pages/Admin/AwardManagement";
import AwardWinnerFrom from "pages/Admin/AwardManagement/AwardWinner/AwardWinnerFrom";
import ResourceManagement from "pages/Admin/ResourceManagement";
import ResourceForm from "pages/Admin/ResourceManagement/ResourceForm";
import ViewResource from "pages/Admin/ResourceManagement/ViewResource";
import CareerManagement from "pages/Admin/CareerManagement";
import CareerManagementForm from "pages/Admin/CareerManagement/CareerManagementForm";
import CareerEvents from "pages/Admin/CareerManagement/CareerEvents";
import CareerEventMembers from "pages/Admin/CareerManagement/CareerEventMembers";
import BrandingManagement from "pages/Admin/BrandingManagement";
import Brand from "pages/Admin/BrandingManagement/Brand";
import BrandDetails from "pages/Admin/BrandingManagement/BrandDetails";
import UniversityManagement from "pages/Admin/UniversityManagement";
import Institution from "pages/Admin/InstitutionManagement";
import Calendar from "components/Layout/Calendar";
import Register from "pages/Register";
import MyProfile from "components/ReusableForms/MyProfile";
import MyEventDetails from "components/ReusableForms/MyProfile/MyEventDetails";
import Publications from "pages/Common/Publications";
import PublicationAssistanceForm from "pages/Common/Publications/PublicationAssistanceForm";
import SubmitPaperForm from "pages/Common/Publications/SubmitPaperForm";
import CareerSupport from "pages/Common/CareerSupport";
import CareerForm from "pages/Common/CareerSupport/CareerForm";
import ViewAppliedCareerSupport from "pages/Common/CareerSupport/ViewAppliedCareerSupport";
import NominateForAward from "pages/Common/NominateForAward";
import NominateForAwardList from "pages/Common/NominateForAward/NominateForAwardList";
import CertificatesAndRewards from "pages/Common/CertificatesAndRewards";
import CertificatesAndRewardsList from "pages/Common/CertificatesAndRewards/CertificatesAndRewardsList";
import AwardWinners from "pages/Common/AwardWinners";
import HelpSupport from "pages/Common/Help/HelpSupport";
import FundsAndGrants from "pages/Institutional/FundsAndGrants";
import Collaboration from "pages/Institutional/Collaboration";
import InstitutionalActivityPlan from "pages/Institutional/ActivityPlan";
import InstitutionalPlanEventForm from "pages/Institutional/ActivityPlan/InstitutionalPlanEventForm";
import InstitutionalPlanEditEventForm from "pages/Institutional/ActivityPlan/InstitutionalPlanEventForm/InstitutionalPlanEditEventForm";
import OurAcademies from "pages/Institutional/OurAcademies";
import InnovationAmbassador from "pages/Institutional/InnovationAmbassador";
import MyPersonalExecutive from "pages/Common/Help/MyPersonalExecutive";
import InboxNotifications from "pages/Common/InboxNotifications";
import EmailDetails from "pages/Common/InboxNotifications/EmailDetails";
import EmailForm from "pages/Common/InboxNotifications/EmailForm";
import NetworkManagement from "pages/Common/NetworkManagement";
import CreateGroup from "pages/Common/NetworkManagement/Network/Groups/CreateGroup";
import DigitalLibrary from "pages/Common/DigitalLibrary";
import LogoutPopup from "components/Layout/LogoutPopup/LogoutPopup";
import PremiumPopup from "components/Layout/PremiumPopup";
import UpgradeOrRenew from "pages/Common/UpgradeOrRenew";
import CommitteeMemberDetails from "components/ReusableForms/CommitteeMember/CommitteeMemberDetails";
import SpeakerDetails from "components/ReusableForms/Speaker/SpeakerDetails";
import PostDetails from "pages/Common/NetworkManagement/Network/Posts/PostDetails";
import { onMessageListener } from "services/firebase.services";
import StudentTour from "components/Layout/ProductTours/StudentTour";
import ProfessionalTour from "components/Layout/ProductTours/ProfessionalTour";
import CCAvenuePaymentPage from "pages/CCAvenuePaymentPage";
import ResearchProfile from "components/ReusableForms/MyProfile/ResearchProfile";
import GlobalProfile from "components/Layout/GlobalProfile";
import PostPopup from "components/Layout/PostPopup";
import ProfileDetails from "components/ReusableForms/MyProfile/ProfileDetails";
import GlobalPost from "pages/GlobalPost";
import PaySuccess from "pages/PaySuccess/PaySuccess";
import PayCancel from "pages/PayCancel/PayCancel";
import EmailRedirection from "components/Layout/EmailRedirection";
import PopupRegister from "components/ReusableForms/PopupRegister";
import ChapterDetailOfUser from "pages/Common/ChaptersAndGroups/Chapters/ChapterDetails/ChapterDetailOfUser";
import RegionManagement from "pages/Admin/RegionManagement";
import BecomeKeynoteSpeaker from "pages/Admin/CareerManagement/BecomeKeynoteSpeaker/BecomeKeynoteSpeaker";
import SentInvitationDetails from "pages/Admin/CareerManagement/BecomeKeynoteSpeaker/SendInvitations/SentInvitationDetails";
import KeynoteSpeakerView from "pages/Common/CareerSupport/KeynoteSpeakerView/KeynoteSpeakerView";
import ApplicationView from "pages/Common/CareerSupport/KeynoteSpeakerView/SpeakerApplications/ApplicationView";
import ViewInvitation from "pages/Common/CareerSupport/KeynoteSpeakerView/InvitationsReceived/ViewInvitation";
import VideoRecorder from "pages/Common/CareerSupport/KeynoteSpeakerView/VideoRecorder/VideoRecorder";
import MentorshipManagement from "pages/Admin/MentorshipManagement/MentorshipManagement";
import DetailsOfMentor from "pages/Admin/MentorshipManagement/AllMentors/DetailsOfMentor/DetailsOfMentor";
import MenteesDetails from "pages/Admin/MentorshipManagement/AllMentors/DetailsOfMentor/MenteesDetails";
import DetailsMentee from "pages/Admin/MentorshipManagement/AllMentees/DetailsMentee";
import MentorSettlementDetails from "pages/Admin/MentorshipManagement/Payment/MentorSettlements/MentorSettlementDetails";
import DetailsOfSession from "pages/Admin/MentorshipManagement/AllMentors/DetailsOfMentor/DetailsOfSession";
import Mentorship from "pages/Common/Mentorship";
import Mentors from "pages/Common/Mentorship/Mentors";
import BookingSession from "pages/Common/Mentorship/BookingSession";
import SingleMenteeDetails from "pages/Common/Mentorship/Mentors/AllMentees/SingleMenteeDetails";
import AddSession from "pages/Common/Mentorship/Mentors/AddSession";
import MySessionDetails from "pages/Common/Mentorship/Mentors/MySession/MySessionDetails";
import MenteeSettlementsDetails from "pages/Admin/MentorshipManagement/Payment/MenteeSettlements/MenteeSettlementsDetails";
import ProfessionalMemberReg from "components/ReusableForms/Dashboard/ProfessionalMemberReg";
import CardInformation from "pages/Common/Mentorship/CardInformation";
import ChatWithMentor from "pages/Common/Mentorship/ChatWithMentor/ChatWithMentor";
import MentorProfileDetail from "pages/Common/Mentorship/MentorProfileDetail";
import BecomeMentorPopup from "components/Layout/BecomeMentorPopup";
import Setting from "pages/Admin/Setting";
import NewGlobalResearchProfile from "pages/NewGlobalResearchProfile";
import NewsLetter from "pages/Admin/NewsLetter";
import DepartmentManagement from "pages/Admin/DepartmentManagement";

const AppRoutes = () => {
  const {
    isRegisterPopup,
    speakerInviteRegistrationPopup,
    mentorNotifyPopup,
    isSessionExpired,
  } = useSelector((state) => ({
    isRegisterPopup: state.global.isRegisterPopup,
    speakerInviteRegistrationPopup: state.global.speakerInviteRegistrationPopup,
    mentorNotifyPopup: state.global.mentorNotifyPopup,
    isSessionExpired: state.global.isSessionExpired,
  }));
  const userData = getDataFromLocalStorage();
  const {
    user_type: userType,
    registration_status: registrationStatus,
    registration_email_otp_status,
    account_number,
    beneficiary_bank_account,
    stripe_connect_status,
    mentor_status,
  } = userData;

  const findType = membershipType.find((o) => o.id === userData?.user_type);
  const memberType = getUserType();
  const [isWait, setIsWait] = useState(true);
  const nevigate = useNavigate();
  const dispatch = useDispatch();
  const handelRedirect = (redirectUrl) => {
    if (!window.location.pathname.includes(redirectUrl)) {
      nevigate(`/${memberType}/register/${userData?.id}/${redirectUrl}`);
    }
  };
  const getGlobalAPIs = async () => {
    let response = await dispatch(fetchProfile());
    if (response?.status === 200) {
      response = await dispatch(fetchAttendedDetails());
      if (response?.status === 200) {
        response = await dispatch(fetchMemberships());
        if (response?.status === 200) {
          response = await dispatch(fetchEventType());
          if (response?.status === 200) {
            response = await dispatch(fetchCountry());
            if (response?.status === 200) {
              response = await dispatch(fetchComitteeMemberCategory());
              if (response?.status === 200) {
                response = await dispatch(fetchPostCategories());
                if (response?.status === 200) {
                  response = await dispatch(getFollowedChapters());
                  if (response?.status === 200) {
                    response = await dispatch(getMyGroups());
                    if (response?.status === 200) {
                      response = await dispatch(getMyCalender());
                      if (response?.status === 200) {
                        response = await dispatch(getPersonalExecutive());
                        if (response?.status === 200) {
                          response = await dispatch(getNotifications());
                          if (response?.status === 200) {
                            response = await dispatch(getLanguages());
                            if (response?.status === 200) {
                              response = await dispatch(getDepartments());
                              if (response?.status === 200) {
                                response = await dispatch(getAllTopicsList());
                                if (response?.status === 200) {
                                  response = await dispatch(getCourses());
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  const redirectToNotification = () => {
    nevigate(`/${memberType}/inbox-notifications/notifications`);
  };
  const redirectToEvent = (eventID, subModule) => {
    if (["2", "5"].includes(userType)) {
      localStorage.isRedirectToOCM = 1;
      nevigate(
        `/${memberType}/conferences-and-events/event-details/${eventID}/conference-details`
      );
    } else if (["0", "6"].includes(userType)) {
      nevigate(
        `/${memberType}/event-management/event-details/${eventID}/${subModule}`
      );
    } else {
      // Nothing
    }
  };
  const redirectToAbstractPaper = (eventID, paperID) => {
    // /admin/event-management/event-details/76/submitted-abstracts
    if (["2", "5"].includes(userType)) {
      localStorage.abstractID = paperID;
      nevigate(`/${memberType}/my-profile/my-events/${eventID}`);
    } else if (["0", "6"].includes(userType)) {
      nevigate(
        `/${memberType}/event-management/event-details/${eventID}/submitted-abstracts`
      );
    } else {
      // Nothing
    }
  };
  const redirectToJournalPaper = (paperID) => {
    if (["2", "5"].includes(userType)) {
      localStorage.paperID = paperID;
      nevigate(`/${memberType}/publications/submit-paper`);
    } else if (["0", "6"].includes(userType)) {
      nevigate(`/${memberType}/journal-management/submitted-papers/${paperID}`);
    } else {
      // Nothing
    }
  };
  const redirectToPostPopup = (postID) => {
    localStorage.isNewComment = postID;

    nevigate(`/${findType}/dashboard/network/post/post-details/${postID}`);
  };
  const redirectToCarrer = (e) => {
    const { career_id, career_applied_id, career_type } = e;

    if ([1, 3, 4].includes(career_type)) {
      nevigate(
        `/${memberType}/career-management/${career_id}/events/${career_applied_id}`
      );
    } else {
      nevigate(`/${memberType}/career-management/${career_id}/events/members`);
    }
  };
  const redirectToPublication = () => {
    if (["2", "5"].includes(userType)) {
      nevigate(`/${memberType}/publications/scopus-indexed-journals`);
    } else if (["0", "6"].includes(userType)) {
      nevigate(`/${memberType}/journal-management/journals`);
    } else {
      // Nothing
    }
  };
  const getNotification = (e) => {
    dispatch(setIsBadge(true));
    const {
      type: notification_type,
      event_id,
      post_id,
      paper_id,
      chapter_id,
      group_id,
      group_name,
      group_description,
    } = e || {};
    switch (notification_type) {
      case "EVENT_REGISTERED":
        redirectToEvent(event_id, "participants");
        break;
      case "EDIT_EVENT":
        nevigate(
          `/${memberType}/conferences-and-events/event-details/${event_id}/conference-details`
        );
        break;
      case "ADD_EVENT_MEMBER":
        nevigate(
          `/${memberType}/conferences-and-events/event-details/${event_id}/community`
        );
        break;
      case "EDIT_EVENT_MEMBER":
        nevigate(`${memberType}/my-profile/my-events/${event_id}`);
        break;
      case "ABSTARCT_SUBMITTED":
        redirectToAbstractPaper(event_id, paper_id);
        break;
      case "ABSTARCT_SUBMITTED_STATUS":
        redirectToAbstractPaper(event_id, paper_id);
        break;
      case "LIKE_POST":
        dispatch(setPostID(post_id));
        break;
      case "COMMENT_POST":
        redirectToPostPopup(post_id);
        break;
      case "EDIT_PROFILE":
        nevigate(`/${memberType}/profile-management`);
        break;
      case "ADD_STUDENT":
        nevigate(`/${memberType}/profile-management`);
        break;
      case "ADD_FACULTY":
        nevigate(`/${memberType}/profile-management`);
        break;
      case "ADD_FEEDBACK":
        nevigate(`/${memberType}/network-management/feedback`);
        break;
      case "ADD_PUBLICATION_ASSISTANCE":
        nevigate(`/${memberType}/journal-management/publication-assistance`);
        break;
      case "ADD_JOURNAL_PAPER":
        redirectToJournalPaper(paper_id);
        break;
      case "JOURNAL_SUBMITTED_STATUS":
        redirectToJournalPaper(paper_id);
        break;
      case "JOIN_GROUP":
        nevigate(
          `/${memberType}/network-management/network/groups/discover-groups`
        );
        break;
      case "FOLLOW_CHAPTER":
        nevigate(
          `/${memberType}/chapters-groups/chapters/${chapter_id}/event-people`
        );
        break;
      case "FOLLOW_GROUP":
        nevigate(
          `/${memberType}/chapters-groups/sig-groups/${group_id}/conference`
        );
        break;
      case "ADD_GROUP":
        nevigate(
          `/${memberType}/chapters-groups/sig-groups/${group_id}/conference`
        );
        break;
      case "EDIT_GROUP":
        localStorage.groupName = group_name;
        localStorage.groupDescription = group_description;
        nevigate(
          `/${memberType}/chapters-groups/sig-groups/${group_id}/conference`
        );
        break;
      case "ADD_GROUP_MEMBER":
        nevigate(
          `/${memberType}/chapters-groups/sig-groups/${group_id}/conference`
        );
        break;
      case "APPLIED_CAREER":
        redirectToCarrer(e);
        break;
      case "ADD_NOMINATION":
        nevigate(`/${memberType}/award-management/nomination-details`);
        break;
      case "ADD_SESSION":
        nevigate(
          `/${memberType}/conferences-and-events/event-details/${event_id}/agenda`
        );
        break;
      case "UPLOAD_EVENT_CERTIFICATE":
        nevigate(`/${memberType}/certificates-and-rewards`);
        break;
      case "AWARD_WINNER":
        nevigate(`/${memberType}/award-winners`);
        break;
      case "COMPOSE":
        nevigate(`/${memberType}/inbox-notifications/inbox`);
        break;
      case "ADD_BRAND":
        nevigate(`/${memberType}/branding-and-publicity`);
        break;
      case "ADD_RESOURCE":
        redirectToPublication();
        break;
      case "EDIT_JOURNAL":
        redirectToPublication();
        break;
      case "DELETE_JOURNAL":
        redirectToPublication();
        break;
      case "ADD_POST":
        nevigate(
          `/${memberType}/network-management/network/post/post-details/${post_id}`
        );
        break;
      case "POST_REQUEST":
        nevigate(
          `/${memberType}/network-management/network/post/post-details/${post_id}`
        );
        break;
      case "DELETE_POST":
        nevigate(`/${memberType}/network-management/network/posts/my-posts`);
        break;
      case "ADD_SELF_EVENT":
        redirectToEvent(event_id, "conference-details");
        break;
      case "ADD_ACTIVITY_REPORT":
        nevigate(`/${memberType}/event-management/activity-report`);
        break;
      case "ADD_COLLABORATION":
        nevigate(`/${memberType}/career-management/career-support`);
        break;
      case "ADD_SPONSORS":
        nevigate(`/${memberType}/event-management/sponsors`);
        break;
      case "ADD_NOMINATION_AS_CHIEF_GUEST":
        nevigate(`/${memberType}/event-management/nominations`);
        break;
      case "ALLOCATE_ABSTRACT":
        nevigate(`/${memberType}/my-profile/my-projects`);
        break;
      case "RENEW_MEMBERSHIP":
        redirectToNotification();
        break;
      case "ADD_STUDENT_AMBASSADORS":
        redirectToNotification();
        break;
      case "ADD_FACULTY_AMBASSADORS":
        redirectToNotification();
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    getGlobalAPIs();
    onMessageListener(getNotification);
    const handleMessage = (event) => {
      const { data } = event;
      getNotification(data);
    };
    navigator?.serviceWorker?.addEventListener("message", handleMessage);
    return () => {
      navigator?.serviceWorker?.removeEventListener("message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // useEffect(() => {
  //   if (registration_email_otp_status === "0") {
  //     nevigate(commonRoute.verifyEmail, {
  //       replace: true,
  //       state: {
  //         email: userData.email_id,
  //       },
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [window.location.pathname, registration_email_otp_status]);
  // useEffect(() => {
  //   if (userType === "2" && registrationStatus === "1") {
  //     setTimeout(() => {
  //       dispatch(setMemberRegmodalShow(true));
  //     }, 500);
  //   }
  // }, [registrationStatus]);
  useEffect(() => {
    const isNavigate = localStorage.getItem("IsGlobalProfileRoute");
    if (isNavigate) {
      if (registrationStatus === "4") {
        nevigate(`/${memberType}${isNavigate}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("IsGlobalProfileRoute")]);

  useEffect(() => {
    if (
      userType === findType?.id &&
      registrationStatus === "4" &&
      !window.location.pathname.includes(findType?.type)
    ) {
      const pathName = window.location.pathname;
      if (
        !pathName.includes("global-research-profile") ||
        !pathName.includes("global-post") ||
        !pathName.includes("email-redirect") ||
        !pathName.includes("cc-avenue-payment")
      ) {
        //  Do Nothing
      } else {
        nevigate(`/${memberType}/dashboard`);
      }
    } else {
      switch (userType) {
        case "2":
          if (!isSessionExpired && registrationStatus !== "4") {
            setTimeout(() => {
              dispatch(setIsRegisterPopup(true));
              dispatch(setSpeakerInviteRegistrationPopup(true));
              // dispatch(setMemberRegmodalShow(true));
            }, 500);
          }
          if (registrationStatus === "4") {
            setTimeout(() => {
              dispatch(setMentorNotifyPopup(true));
            }, 500);
          }
          // nevigate(`/${memberType}/dashboard`);
          // switch (registrationStatus) {
          //   case "0":
          //     handelRedirect("personal-details");
          //     break;
          //   case "1":
          //     handelRedirect("education-details");
          //     break;
          //   case "2":
          //     handelRedirect("membership-details");
          //     break;
          //   case "3":
          //     handelRedirect("preview-details");
          //     break;
          //   default:
          //     break;
          // }
          break;
        case "3":
          switch (registrationStatus) {
            case "0":
              handelRedirect("institution-details");
              break;
            case "1":
              handelRedirect("admin-details");
              break;
            case "2":
              handelRedirect("membership-details");
              break;
            case "3":
              handelRedirect("preview-details");
              break;
            default:
              break;
          }
          break;
        case "4":
          switch (registrationStatus) {
            case "0":
              handelRedirect("company-details");
              break;
            case "1":
              handelRedirect("admin-details");
              break;
            case "2":
              handelRedirect("membership-details");
              break;
            case "3":
              handelRedirect("preview-details");
              break;
            default:
              break;
          }
          break;
        case "5":
          if (!isSessionExpired && registrationStatus !== "4") {
            setTimeout(() => {
              // dispatch(setMemberRegmodalShow(true));
              dispatch(setIsRegisterPopup(true));
            }, 500);
          }

          // switch (registrationStatus) {
          //   case "0":
          //     handelRedirect("personal-details");
          //     break;
          //   case "1":
          //     handelRedirect("education-details");
          //     break;
          //   case "2":
          //     handelRedirect("membership-details");
          //     break;
          //   case "3":
          //     handelRedirect("preview-details");
          //     break;
          //   default:
          //     break;
          // }
          break;
        case "6":
          switch (registrationStatus) {
            case "0":
              handelRedirect("personal-details");
              break;
            case "1":
              handelRedirect("education-details");
              break;
            case "2":
              handelRedirect("membership-details");
              break;
            case "3":
              handelRedirect("preview-details");
              break;

            default:
              break;
          }
          break;
        default:
          break;
      }
    }
    setIsWait(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const routeArray = [
    // Common Route
    // { path :  commonRoute.researchProfile , component : <GlobalResearchProfile />},
    // { path: commonRoute.emailRedirection, component: <EmailRedirection /> },
    { path: commonRoute.changePassword, component: <ChangePassword /> },
    { path: commonRoute.myProfile, component: <ProfileDetails /> },
    // { path: commonRoute.calendar, component: <Calendar /> },
    {
      path: commonRoute.committeeMemberDetails,
      component: <CommitteeMemberDetails />,
    },
    { path: commonRoute.speakerDetails, component: <SpeakerDetails /> },
    { path: commonRoute.postDetails, component: <PostDetails /> },
    {
      path: commonRoute.profileManagement,
      component: <ProfileManagement />,
    },
    {
      path: commonRoute.addEvent,
      component: <EventForm />,
    },
    {
      layoutId: "event-management-layout",
      path: commonRoute.eventManagementType,
      component: <EventManagement />,
    },
    {
      path: commonRoute.eventDetailsType,
      component: <EventDetails />,
    },
    {
      path: commonRoute.eventSessionDetails,
      component: <SessionDetails />,
    },
    {
      path: commonRoute.eventReviewerDetails,
      component: <ReviewerDetails />,
    },
    {
      path: commonRoute.journalReviewerDetails,
      component: <JournalReviewerDetails />,
    },
    {
      path: commonRoute.activityPlan,
      component: <ActivityPlan />,
    },
    {
      path: commonRoute.eventAgandaForm,
      component: <AgendaForm />,
    },
    {
      path: commonRoute.conferencesAndEvents,
      component: <ConferencesAndEvents />,
    },
    {
      path: commonRoute.conferencesAndEventsList,
      component: <ConferencesAndEvents />,
    },
    {
      path: commonRoute.abstractSubmissionForm,
      component: <AbstractSubmission />,
    },
    {
      path: commonRoute.applyForCommitteeMember,
      component: <ApplyForCommitteeMember />,
    },
    {
      path: commonRoute.submittedAbstract,
      component: <SubmittedAbstracts />,
    },
    {
      path: commonRoute.sponsorshipnForm,
      component: <Sponsorship />,
    },
    {
      path: commonRoute.nominateForm,
      component: <NominateForSpeakerAndChiefGuest />,
    },
    {
      path: commonRoute.journalManagementType,
      component: <JournalManagement />,
    },
    {
      path: commonRoute.eventPaper,
      component: <Paper />,
    },
    {
      path: commonRoute.careerEvents,
      component: <CareerEvents />,
    },
    {
      path: commonRoute.myProfileType,
      component: <MyProfile />,
    },
    {
      path: commonRoute.myProfileEvent,
      component: <MyEventDetails />,
    },
    {
      path: commonRoute.publications,
      component: <Publications />,
    },
    {
      path: commonRoute.publicationAssistance,
      component: <PublicationAssistanceForm />,
    },
    {
      path: commonRoute.publicationSubmitPaperForm,
      component: <SubmitPaperForm />,
    },
    {
      path: commonRoute.chaptersAndGroupsType,
      component: <ChaptersAndGroups />,
    },
    {
      path: commonRoute.chaptersDetailsType,
      component: <ChapterDetails />,
    },
    {
      path: commonRoute.chaptersDetailsPeople,
      component: <ChapterDetailOfUser />,
    },
    {
      path: commonRoute.groupDetails,
      component: <GroupDetails />,
    },
    {
      path: commonRoute.careerSupport,
      component: <CareerSupport />,
    },
    {
      path: commonRoute.careerSupportView,
      component: <ViewAppliedCareerSupport />,
    },
    {
      path: commonRoute.careerSupportForm,
      component: <CareerForm />,
    },
    {
      path: commonRoute.keynoteSpeakerView,
      component: <KeynoteSpeakerView />,
    },
    {
      path: commonRoute.applicationDetailsView,
      component: <ApplicationView />,
    },
    {
      path: commonRoute.viewInvitationDetails,
      component: <ViewInvitation />,
    },
    {
      path: commonRoute.videoRecord,
      component: <VideoRecorder />,
    },
    {
      path: commonRoute.mentorship,
      component: <Mentorship />,
    },
    {
      path: commonRoute.mentorshipMentor,
      component: <Mentors />,
    },
    {
      path: commonRoute.mentorBookSession,
      component: <BookingSession />,
    },
    {
      path: commonRoute.cardInformation,
      component: <CardInformation />,
    },
    {
      path: profetionalRoute.chatWithMentor,
      component: <ChatWithMentor />,
    },
    {
      path: profetionalRoute.chatWithMentee,
      component: <ChatWithMentor />,
    },
    {
      path: commonRoute.singleMenteeDetails,
      component: <SingleMenteeDetails />,
    },
    {
      path: commonRoute.addNewSession,
      component: <AddSession />,
    },
    {
      path: commonRoute.sessionDetail,
      component: <MySessionDetails />,
    },
    {
      path: commonRoute.mentorProfileDetail,
      component: <MentorProfileDetail />,
    },
    {
      path: commonRoute.nominateForAward,
      component: <NominateForAward />,
    },
    {
      path: commonRoute.nominateForAwardList,
      component: <NominateForAwardList />,
    },
    {
      path: commonRoute.certificatesAndRewards,
      component: <CertificatesAndRewards />,
    },
    {
      path: commonRoute.certificatesAndRewardsList,
      component: <CertificatesAndRewardsList />,
    },
    {
      path: commonRoute.awardWinners,
      component: <AwardWinners />,
    },
    {
      path: commonRoute.helpSupport,
      component: <HelpSupport />,
    },
    {
      path: commonRoute.myPersonalExecutive,
      component: <MyPersonalExecutive />,
    },
    {
      path: commonRoute.inboxNotifications,
      component: <InboxNotifications />,
    },
    {
      path: commonRoute.emailDetails,
      component: <EmailDetails />,
    },
    {
      path: commonRoute.emailForm,
      component: <EmailForm />,
    },
    {
      path: commonRoute.networkManagementParent,
      component: <NetworkManagement />,
    },
    {
      path: commonRoute.networkManagement,
      component: <NetworkManagement />,
    },
    {
      path: commonRoute.createGroup,
      component: <CreateGroup />,
    },
    {
      path: commonRoute.digitalLibrary,
      component: <DigitalLibrary />,
    },
    {
      path: commonRoute.upgradeUser,
      component: <UpgradeOrRenew />,
    },
    {
      path: commonRoute.renewUser,
      component: <UpgradeOrRenew />,
    },
    {
      path: commonRoute.certificateManagementType,
      component: <CertificateManagement />,
    },
    {
      path: commonRoute.certificateManagementEventDetail,
      component: <EventCertificateDetails />,
    },
    {
      path: commonRoute.userReasearchprofile,
      component: <ResearchProfile />,
    },
    {
      path: commonRoute.regionManagementType,
      component: <RegionManagement />,
    },
    // Admin Route
    {
      path: adminRoute.dashboard,
      layoutId: "dadhboard-container",
      component: <Dashboard />,
    },
    {
      path: adminRoute.addChapters,
      component: <ChapterForm />,
    },
    {
      path: adminRoute.awardWinnerForm,
      component: <AwardWinnerFrom />,
    },
    {
      path: adminRoute.awardManagementType,
      component: <AwardManagement />,
    },
    {
      path: adminRoute.resourceManagement,
      component: <ResourceManagement />,
    },
    {
      path: adminRoute.resourceManagementForm,
      component: <ResourceForm />,
    },
    {
      path: adminRoute.viewResource,
      component: <ViewResource />,
    },
    {
      path: adminRoute.careerManagementType,
      component: <CareerManagement />,
    },
    {
      path: adminRoute.careerManagementForm,
      component: <CareerManagementForm />,
    },
    {
      path: adminRoute.careerEventMembers,
      component: <CareerEventMembers />,
    },
    {
      path: adminRoute.careerSupportView,
      component: <ViewAppliedCareerSupport />,
    },
    {
      path: adminRoute.KeynoteSpeakerType,
      component: <BecomeKeynoteSpeaker />,
    },
    {
      path: adminRoute.sendInvitationDetails,
      component: <SentInvitationDetails />,
    },
    {
      path: adminRoute.mentorshipManagementType,
      component: <MentorshipManagement />,
    },
    {
      path: adminRoute.detailsOfMentor,
      component: <DetailsOfMentor />,
    },
    {
      path: adminRoute.singleMenteeDetails,
      component: <MenteesDetails />,
    },
    {
      path: adminRoute.mainMenteeDetail,
      component: <DetailsMentee />,
    },
    {
      path: adminRoute.mentorSettlementDetails,
      component: <MentorSettlementDetails />,
    },
    {
      path: adminRoute.menteeSettlementsDetails,
      component: <MenteeSettlementsDetails />,
    },
    {
      path: adminRoute.viewMoeDetailsPayment,
      component: <DetailsOfSession />,
    },
    {
      path: adminRoute.brandingManagement,
      component: <BrandingManagement />,
    },
    {
      path: adminRoute.brand,
      component: <Brand />,
    },
    {
      path: adminRoute.brandIndustry,
      component: <BrandDetails />,
    },
    {
      path: adminRoute.universityManagement,
      component: <UniversityManagement />,
    },
    {
      path: adminRoute.institutionManagement,
      component: <Institution />,
    },
    {
      path: adminRoute.setting,
      component: <Setting />,
    },
    {
      path: adminRoute.newsLetter,
      component: <NewsLetter />,
    },
    {
      path: adminRoute.departmentManagementType,
      component: <DepartmentManagement />,
    },

    // Student Route
    {
      path: studentRoute.dashboard,
      component: <StudentDashboard />,
    },
    {
      path: studentRoute.liveEvents,
      component: <LiveEvents />,
    },
    // Profetional Route
    {
      path: profetionalRoute.dashboard,
      component: <ProfetionalDashboard />,
    },
    {
      path: profetionalRoute.liveEvents,
      component: <LiveEvents />,
    },
    // Institutional Route
    {
      path: institutionalRoute.careerEventMembers,
      component: <CareerEventMembers />,
    },
    {
      path: institutionalRoute.fundsAndGrantsType,
      component: <FundsAndGrants />,
    },
    {
      path: institutionalRoute.collaboration,
      component: <Collaboration />,
    },
    {
      path: institutionalRoute.eventCollaboration,
      component: <Collaboration />,
    },
    {
      path: institutionalRoute.activityPlanType,
      component: <InstitutionalActivityPlan />,
    },
    {
      path: institutionalRoute.institutionalEventForm,
      component: <InstitutionalPlanEventForm />,
    },
    {
      path: institutionalRoute.institutionalEditEventForm,
      component: <InstitutionalPlanEditEventForm />,
    },
    {
      path: institutionalRoute.ourAcademiesType,
      component: <OurAcademies />,
    },
    {
      path: institutionalRoute.innovationAmbassadorType,
      component: <InnovationAmbassador />,
    },
    {
      path: institutionalRoute.dashboard,
      component: <InstitutionalDashboard />,
    },
    {
      path: institutionalRoute.liveEvents,
      component: <LiveEvents />,
    },
    // Corporate Route
    {
      path: corporateRoute.dashboard,
      component: <CorporateDashboard />,
    },
    {
      path: corporateRoute.brandingAndPublicity,
      component: <BrandingAndPublicity />,
    },
    {
      path: corporateRoute.brandingAndPublicityForm,
      component: <BrandForms />,
    },
    // Resource Route
    {
      path: resourceRoute.dashboard,
      component: <ResourceDashboard />,
    },
    {
      path: resourceRoute.awardWinnerForm,
      component: <AwardWinnerFrom />,
    },
    {
      path: resourceRoute.awardManagementType,
      component: <AwardManagement />,
    },
    {
      path: resourceRoute.brandingManagement,
      component: <BrandingManagement />,
    },
    {
      path: resourceRoute.brand,
      component: <Brand />,
    },
    {
      path: resourceRoute.brandIndustry,
      component: <BrandDetails />,
    },
    {
      path: resourceRoute.careerManagementType,
      component: <CareerManagement />,
    },
    {
      path: resourceRoute.careerManagementForm,
      component: <CareerManagementForm />,
    },
    {
      path: resourceRoute.careerEventMembers,
      component: <CareerEventMembers />,
    },
    {
      path: resourceRoute.careerSupportView,
      component: <ViewAppliedCareerSupport />,
    },
    {
      path: resourceRoute.KeynoteSpeakerType,
      component: <BecomeKeynoteSpeaker />,
    },
    {
      path: resourceRoute.sendInvitationDetails,
      component: <SentInvitationDetails />,
    },
    {
      path: resourceRoute.mentorshipManagementType,
      component: <MentorshipManagement />,
    },
    {
      path: resourceRoute.detailsOfMentor,
      component: <DetailsOfMentor />,
    },
    {
      path: resourceRoute.singleMenteeDetails,
      component: <MenteesDetails />,
    },
    {
      path: resourceRoute.mainMenteeDetail,
      component: <DetailsMentee />,
    },
    {
      path: resourceRoute.mentorSettlementDetails,
      component: <MentorSettlementDetails />,
    },
    {
      path: resourceRoute.menteeSettlementsDetails,
      component: <MenteeSettlementsDetails />,
    },
    {
      path: resourceRoute.viewMoeDetailsPayment,
      component: <DetailsOfSession />,
    },
    // Admin Navigate
    {
      path: adminRoute.awardManagement,
      to: `${adminRoute.awardManagement}/award-winners`,
      isNavigate: true,
    },
    {
      path: adminRoute.certificateManagement,
      to: `${adminRoute.certificateManagement}/event-certificates`,
      isNavigate: true,
    },
    {
      path: adminRoute.chaptersAndGroups,
      to: `${adminRoute.chaptersAndGroups}/chapters`,
      isNavigate: true,
    },
    {
      path: adminRoute.journalManagement,
      to: `${adminRoute.journalManagement}/journals`,
      isNavigate: true,
    },
    {
      path: adminRoute.eventManagement,
      to: `${adminRoute.eventManagement}/events`,
      isNavigate: true,
    },
    {
      path: adminRoute.inboxNotifications,
      to: `${adminRoute.inboxNotifications}/inbox`,
      isNavigate: true,
    },
    {
      path: adminRoute.networkManagement,
      to: `${adminRoute.networkManagement}/network-list`,
      isNavigate: true,
    },
    {
      path: adminRoute.careerManagement,
      to: `${adminRoute.careerManagement}/career-support`,
      isNavigate: true,
    },
    {
      path: adminRoute.KeynoteSpeaker,
      to: `${adminRoute.KeynoteSpeaker}/all-applications`,
      isNavigate: true,
    },
    {
      path: adminRoute.mentorshipManagement,
      to: `${adminRoute.mentorshipManagement}/all-mentors`,
      isNavigate: true,
    },
    {
      path: adminRoute.departmentManagement,
      to: `${adminRoute.departmentManagement}/departments`,
      isNavigate: true,
    },
    // {
    //   path: adminRoute.detailsOfMentor,
    //   to: `${adminRoute.detailsOfMentor}/Erisa-Kurniati`,
    //   isNavigate: true,
    // },
    {
      path: adminRoute.regionManagement,
      to: `${adminRoute.regionManagement}/country`,
      isNavigate: true,
    },
    // {
    //   path: adminRoute.setting,
    //   to: `${adminRoute.setting}`,
    //   isNavigate: true,
    // },
    // Student Navigate
    {
      path: studentRoute.chaptersAndGroups,
      to: `${studentRoute.chaptersAndGroups}/chapters`,
      isNavigate: true,
    },
    {
      path: studentRoute.myProfile,
      to: `${studentRoute.myProfile}/research-profile`,
      isNavigate: true,
    },
    {
      path: studentRoute.conferencesAndEvents,
      to: `${studentRoute.conferencesAndEvents}/iferp-events/event-list/conference`,
      // to: `${studentRoute.conferencesAndEvents}/event-list/conference`,
      isNavigate: true,
    },
    {
      path: studentRoute.publications,
      to: `${studentRoute.publications}/scopus-indexed-journals`,
      isNavigate: true,
    },
    {
      path: studentRoute.inboxNotifications,
      to: `${studentRoute.inboxNotifications}/inbox`,
      isNavigate: true,
    },
    {
      path: studentRoute.networkManagement,
      to: `${studentRoute.networkManagement}/posts/discover-posts`,
      isNavigate: true,
    },
    {
      path: studentRoute.careerSupport,
      to: `${studentRoute.careerSupport}/careers`,
      isNavigate: true,
    },
    {
      path: studentRoute.mentorship,
      to: `${studentRoute.mentorship}/all-mentors`,
      isNavigate: true,
    },
    // Profetional Navigate
    {
      path: profetionalRoute.chaptersAndGroups,
      to: `${profetionalRoute.chaptersAndGroups}/chapters`,
      isNavigate: true,
    },
    {
      path: profetionalRoute.myProfile,
      to: `${profetionalRoute.myProfile}/research-profile`,
      isNavigate: true,
    },
    {
      path: profetionalRoute.conferencesAndEvents,
      to: `${profetionalRoute.conferencesAndEvents}/iferp-events/event-list/conference`,
      // to: `${profetionalRoute.conferencesAndEvents}/event-list/conference`,
      isNavigate: true,
    },
    {
      path: profetionalRoute.publications,
      to: `${profetionalRoute.publications}/scopus-indexed-journals`,
      isNavigate: true,
    },
    {
      path: profetionalRoute.inboxNotifications,
      to: `${profetionalRoute.inboxNotifications}/inbox`,
      isNavigate: true,
    },
    {
      path: profetionalRoute.networkManagement,
      to: `${profetionalRoute.networkManagement}/posts/discover-posts`,
      isNavigate: true,
    },
    {
      path: profetionalRoute.careerSupport,
      to: `${profetionalRoute.careerSupport}/careers`,
      isNavigate: true,
    },
    {
      path: profetionalRoute.mentorship,
      to: `${profetionalRoute.mentorship}/all-mentors`,
      isNavigate: true,
    },
    // Institutional Navigate
    {
      path: institutionalRoute.myProfile,
      to: `${institutionalRoute.myProfile}/my-membership`,
      isNavigate: true,
    },
    {
      path: institutionalRoute.conferencesAndEvents,
      to: `${institutionalRoute.conferencesAndEvents}/iferp-events/event-list/conference`,
      isNavigate: true,
    },
    {
      path: institutionalRoute.inboxNotifications,
      to: `${institutionalRoute.inboxNotifications}/inbox`,
      isNavigate: true,
    },
    {
      path: institutionalRoute.ourAcademies,
      to: `${institutionalRoute.ourAcademies}/student-members`,
      isNavigate: true,
    },
    {
      path: institutionalRoute.networkManagement,
      to: `${institutionalRoute.networkManagement}/posts/discover-posts`,
      isNavigate: true,
    },
    {
      path: institutionalRoute.fundsAndGrants,
      to: `${institutionalRoute.fundsAndGrants}/accepted-proposals`,
      isNavigate: true,
    },
    {
      path: institutionalRoute.activityPlan,
      to: `${institutionalRoute.activityPlan}/iferp-plan`,
      isNavigate: true,
    },
    {
      path: institutionalRoute.publications,
      to: `${institutionalRoute.publications}/scopus-indexed-journals`,
      isNavigate: true,
    },
    {
      path: institutionalRoute.innovationAmbassador,
      to: `${institutionalRoute.innovationAmbassador}/student-ambassadors`,
      isNavigate: true,
    },
    {
      path: institutionalRoute.chaptersAndGroups,
      to: `${institutionalRoute.chaptersAndGroups}/chapters`,
      isNavigate: true,
    },
    {
      path: institutionalRoute.careerSupport,
      to: `${institutionalRoute.careerSupport}/careers`,
      isNavigate: true,
    },
    // Corporate Navigate
    {
      path: corporateRoute.chaptersAndGroups,
      to: `${corporateRoute.chaptersAndGroups}/chapters`,
      isNavigate: true,
    },
    {
      path: corporateRoute.myProfile,
      to: `${corporateRoute.myProfile}/my-membership`,
      isNavigate: true,
    },

    {
      path: corporateRoute.events,
      to: `${corporateRoute.events}/event-list/conference`,
      isNavigate: true,
    },
    {
      path: corporateRoute.publications,
      to: `${corporateRoute.publications}/scopus-indexed-journals`,
      isNavigate: true,
    },
    {
      path: corporateRoute.inboxNotifications,
      to: `${corporateRoute.inboxNotifications}/inbox`,
      isNavigate: true,
    },
    {
      path: corporateRoute.networkManagement,
      to: `${corporateRoute.networkManagement}/posts/discover-posts`,
      isNavigate: true,
    },
    {
      path: corporateRoute.careerSupport,
      to: `${corporateRoute.careerSupport}/careers`,
      isNavigate: true,
    },
    {
      path: corporateRoute.careerSupport,
      to: `${corporateRoute.careerSupport}/careers`,
      isNavigate: true,
    },
    // Resource Navigate
    {
      path: resourceRoute.chaptersAndGroups,
      to: `${resourceRoute.chaptersAndGroups}/chapters`,
      isNavigate: true,
    },
    {
      path: resourceRoute.journalManagement,
      to: `${resourceRoute.journalManagement}/journals`,
      isNavigate: true,
    },
    {
      path: resourceRoute.eventManagement,
      to: `${resourceRoute.eventManagement}/events`,
      isNavigate: true,
    },
    {
      path: resourceRoute.inboxNotifications,
      to: `${resourceRoute.inboxNotifications}/inbox`,
      isNavigate: true,
    },
    {
      path: resourceRoute.networkManagement,
      to: `${resourceRoute.networkManagement}/network/posts/discover-posts`,
      isNavigate: true,
    },
    {
      path: resourceRoute.certificateManagement,
      to: `${resourceRoute.certificateManagement}/event-certificates`,
      isNavigate: true,
    },
    {
      path: resourceRoute.awardManagement,
      to: `${resourceRoute.awardManagement}/award-winners`,
      isNavigate: true,
    },
    {
      path: resourceRoute.careerManagement,
      to: `${resourceRoute.careerManagement}/career-support`,
      isNavigate: true,
    },
    {
      path: resourceRoute.KeynoteSpeaker,
      to: `${resourceRoute.KeynoteSpeaker}/all-applications`,
      isNavigate: true,
    },
    {
      path: resourceRoute.mentorshipManagement,
      to: `${resourceRoute.mentorshipManagement}/all-mentors`,
      isNavigate: true,
    },
    // Global
    {
      path: "*",
      to: `/${memberType}/dashboard`,
      isNavigate: true,
    },
  ];
  return (
    <div className={isWait ? "d-none" : ""}>
      <SessionExpiredPopup />
      <LogoutPopup />
      <PremiumPopup />
      <GlobalProfile />
      <PostPopup />
      <Calendar />
      {mentorNotifyPopup &&
        mentor_status === "Accept" &&
        account_number === "" &&
        beneficiary_bank_account === "" &&
        stripe_connect_status === "" && <BecomeMentorPopup />}
      {!isSessionExpired &&
        isRegisterPopup &&
        registration_email_otp_status === "0" &&
        userData?.is_speaker_register !== "1" && <PopupRegister />}
      {/* {isRegisterPopup &&
        registration_email_otp_status === "0" &&
        registrationStatus === "0" && <PopupRegister />} */}

      {speakerInviteRegistrationPopup &&
        userData?.is_speaker_register === "1" && <ProfessionalMemberReg />}

      {userType === "5" && <StudentTour />}

      {userType === "2" && <ProfessionalTour />}
      <Suspense fallback={<FullscreenLoader />}>
        <Routes>
          {/* <Route
            exact
            path={commonRoute.verifyEmail}
            element={<VerifyEmail />}
          /> */}
          <Route
            exact
            path={commonRoute.paymentPage}
            element={<CCAvenuePaymentPage />}
          />
          <Route
            exact
            path={commonRoute.registerDetails}
            element={<Register />}
          />
          {/* <Route
            exact
            path={commonRoute.researchProfile}
            element={<GlobalResearchProfile />}
          /> */}
          <Route
            exact
            path={commonRoute.researchProfile}
            element={<NewGlobalResearchProfile />}
          />
          <Route exact path={commonRoute.globalPost} element={<GlobalPost />} />
          <Route
            exact
            path={commonRoute.emailRedirection}
            element={<EmailRedirection />}
          />
          <Route exact path="/:member/pay-success" element={<PaySuccess />} />
          <Route exact path="/:member/pay-cancel" element={<PayCancel />} />
          {routeArray.map((elem, index) => {
            return (
              <Route
                exact
                key={index}
                path={elem.path}
                element={
                  elem.isNavigate ? (
                    <Navigate to={elem.to} replace />
                  ) : (
                    <Layout id={elem.layoutId || ""}>{elem.component}</Layout>
                  )
                }
              />
            );
          })}
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRoutes;
