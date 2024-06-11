import { useEffect } from "react";
import FullscreenLoader from "../FullscreenLoader";
import { useNavigate } from "react-router-dom";
import { getDataFromLocalStorage } from "utils/helpers";
import { membershipType } from "utils/constants";

const EmailRedirection = () => {
  const navigate = useNavigate();
  const handelRedirection = (data) => {
    // console.log(data);
    const { user_type, email_id: loginEmailID } =
      getDataFromLocalStorage() || {};
    const findType = membershipType.find((o) => o.id === user_type)?.type || "";
    const {
      email_type,
      event_id,
      email_id,
      post_id,
      paper_id,
      user_id,
      mail_id,
      group_id,
    } = data;
    if (loginEmailID && email_id === loginEmailID) {
      switch (email_type) {
        case "community":
          navigate(
            `/${findType}/conferences-and-events/event-details/${event_id}/community`
          );
          break;
        case "post_verify_ownership":
          navigate(
            `/${findType}/dashboard/network/post/post-details/${post_id}`
          );
          break;
        case "abstract_paper":
          navigate(`/${findType}/my-profile/submitted-papers/${paper_id}`);
          break;
        case "journal_paper":
          navigate(`/${findType}/publications/submitted-papers/${paper_id}`);
          break;
        case "accept_abstract_paper":
          localStorage.abstractID = paper_id;
          navigate(`/${findType}/my-profile/my-events/${event_id}`);
          break;
        case "accept_journal_paper":
          localStorage.paperID = paper_id;
          navigate(`/${findType}/publications/submit-paper`);
          break;
        case "research_profile_publication":
          localStorage.openResearchProfile = user_id;
          navigate("/");
          break;
        case "post_popup":
          localStorage.openPostPopup = post_id;
          navigate("/");
          break;
        case "new_comment":
          localStorage.isNewComment = post_id;
          navigate(
            `/${findType}/dashboard/network/post/post-details/${post_id}`
          );
          break;
        case "post_details":
          navigate(
            `/${findType}/dashboard/network/post/post-details/${post_id}`
          );
          break;
        case "new_request":
          navigate(
            `/${findType}/network-management/network/network/new-requests`
          );
          break;
        case "inbox_message":
          navigate(`/${findType}/inbox-notifications/inbox/${mail_id}/0`);
          break;
        case "career_approved":
          navigate(`/${findType}/career-support/careers`);
          break;
        case "new_chat":
          localStorage.redirectChat = group_id;
          navigate(`/${findType}/network-management/network/chat/message`);
          break;
        case "award_winners":
          navigate(`/${findType}/award-winners`);
          break;
        case "login":
          navigate("/");
          break;
        default:
          navigate("/");
          break;
      }
    } else {
      switch (email_type) {
        case "community":
          localStorage.emailRedirectURL = `conferences-and-events/event-details/${event_id}/community`;
          navigate("/");
          break;
        case "post_verify_ownership":
          localStorage.emailRedirectURL = `dashboard/network/post/post-details/${post_id}`;
          navigate("/");
          break;
        case "abstract_paper":
          localStorage.emailRedirectURL = `my-profile/submitted-papers/${paper_id}`;
          navigate("/");
          break;
        case "journal_paper":
          localStorage.emailRedirectURL = `publications/submitted-papers/${paper_id}`;
          navigate("/");
          break;
        case "research_profile_publication":
          localStorage.openResearchProfile = user_id;
          navigate("/");
          break;
        case "post_popup":
          localStorage.openPostPopup = post_id;
          navigate("/");
          break;
        case "new_comment":
          localStorage.isNewComment = post_id;
          localStorage.emailRedirectURL = `dashboard/network/post/post-details/${post_id}`;
          navigate("/");
          break;
        case "post_details":
          localStorage.emailRedirectURL = `dashboard/network/post/post-details/${post_id}`;
          navigate("/");
          break;
        case "new_request":
          localStorage.emailRedirectURL =
            "network-management/network/network/new-requests";
          navigate("/");
          break;
        case "inbox_message":
          localStorage.emailRedirectURL = `inbox-notifications/inbox/${mail_id}/0`;
          navigate("/");
          break;
        case "career_approved":
          localStorage.emailRedirectURL = "career-support/careers";
          navigate("/");
          break;
        case "new_chat":
          localStorage.redirectChat = group_id;
          localStorage.emailRedirectURL =
            "network-management/network/chat/message";
          navigate("/");
          break;
        case "award_winners":
          localStorage.emailRedirectURL = "award-winners";
          navigate("/");
          break;
        case "login":
          navigate("/");
          break;
        case "register":
          navigate("/member/registerrrrrrr");
          break;
        default:
          navigate("/");
          break;
      }
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const responseParams = {};
    for (const [key, value] of params.entries()) {
      responseParams[key] = value;
    }
    if (!responseParams?.email_type) {
      navigate("/");
    } else {
      handelRedirection(responseParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
      <FullscreenLoader />
    </div>
  );
};
export default EmailRedirection;
