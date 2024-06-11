import { useNavigate, useParams } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { getDataFromLocalStorage } from "utils/helpers";
import Journals from "./Journals";
import SubmittedPapers from "./SubmittedPapers";
import PublicationAssistance from "./PublicationAssistance";
import Reviewers from "./Reviewers";
import { useEffect } from "react";

const JournalManagement = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { memberType, type } = params;
  const handleRedirect = (optionType) => {
    navigate(`/${memberType}/journal-management/${optionType}`);
  };
  const { resource_role, user_type: userType } = getDataFromLocalStorage();
  const access = {
    isPublicationAsistance: userType === "0",
    isReviewers: resource_role === "1",
  };
  useEffect(() => {
    if (!["0", "6"].includes(getDataFromLocalStorage("user_type"))) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <Tabs
        defaultActiveKey={type}
        id="uncontrolled-tab-example"
        className="mb-3 gap-4"
      >
        <Tab
          eventKey="journals"
          title="Journals"
          onEnter={() => {
            handleRedirect("journals");
          }}
        >
          {type === "journals" && <Journals />}
        </Tab>
        <Tab
          eventKey="submitted-papers"
          title="Submitted Papers"
          onEnter={() => {
            handleRedirect("submitted-papers");
          }}
        >
          {type === "submitted-papers" && <SubmittedPapers />}
        </Tab>
        {access.isPublicationAsistance && (
          <Tab
            eventKey="publication-assistance"
            title="Publication Assistance"
            onEnter={() => {
              handleRedirect("publication-assistance");
            }}
          >
            {type === "publication-assistance" && <PublicationAssistance />}
          </Tab>
        )}
        {access.isReviewers && (
          <Tab
            eventKey="reviewers"
            title="Reviewers"
            onEnter={() => {
              handleRedirect("reviewers");
            }}
          >
            {type === "reviewers" && <Reviewers />}
          </Tab>
        )}
      </Tabs>
    </div>
  );
};
export default JournalManagement;
