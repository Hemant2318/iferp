import { useState } from "react";
import Card from "components/Layout/Card";
import { journalType } from "utils/constants";
import { getDataFromLocalStorage, getUserType } from "utils/helpers";
import PublicationAssistanceForm from "./PublicationAssistanceForm";
import SubmittedPapers from "./SubmittedPapers";
import Journals from "./Journals";
import MyProjects from "./MyProject";
import { useNavigate } from "react-router-dom";

const Publications = () => {
  const navigate = useNavigate();
  const [type, setType] = useState(0);
  const activeClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  const userType = getDataFromLocalStorage("user_type");
  const access = {
    isPageTab: ["2", "3", "4", "5"].includes(userType),
    isPublicationAsistanceTab: userType === "5",
    isSubmitPaperTab: ["3", "4"].includes(userType),
    MyProjects: ["2"].includes(userType),
  };
  return (
    <>
      {access.isPageTab && (
        <Card className="d-flex align-items-center p-1 unset-br mb-3">
          <div
            className={type === 0 ? activeClass : inActiveClass}
            onClick={() => {
              if (type !== 0) {
                setType(0);
              }
            }}
          >
            Publication
          </div>
          {access.isPublicationAsistanceTab && (
            <div
              className={inActiveClass}
              onClick={() => {
                const memberType = getUserType();
                navigate(`/${memberType}/publications/publicationAssistance`);
              }}
            >
              Publication Assistance
            </div>
          )}
          {access.isSubmitPaperTab && (
            <div
              className={type === 2 ? activeClass : inActiveClass}
              onClick={() => {
                if (type !== 2) {
                  setType(2);
                }
              }}
            >
              Submitted Papers
            </div>
          )}
          {access.MyProjects && (
            <div
              className={type === 3 ? activeClass : inActiveClass}
              onClick={() => {
                if (type !== 3) {
                  setType(3);
                }
              }}
            >
              My Projects/Tasks
            </div>
          )}
        </Card>
      )}
      {type === 0 && <Journals />}
      {type === 1 && (
        <PublicationAssistanceForm
          journalType={journalType}
          setType={setType}
        />
      )}
      {type === 2 && <SubmittedPapers />}
      {type === 3 && <MyProjects />}
    </>
  );
};
export default Publications;
