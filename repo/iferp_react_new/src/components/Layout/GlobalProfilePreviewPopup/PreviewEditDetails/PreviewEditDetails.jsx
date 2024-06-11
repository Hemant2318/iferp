import React from "react";
import Modal from "components/Layout/Modal";
import Publications from "./Publications";
import AcademicExperience from "./AcademicExperience";
import CurrentJournalRoles from "./CurrentJournalRoles";
import Achievements from "./Achievements";

const PreviewEditDetails = ({
  formType,
  isEdit,
  onHide,
  fetchDetails,
  isFieldEmpty,
}) => {
  const title = {
    1: "Experience",
    2: "Publications",
    3: "Current Journal Roles",
    4: "Achievements",
  };

  const formComponent = {
    1: (
      <AcademicExperience
        isEdit={isEdit}
        onHide={onHide}
        fetchDetails={fetchDetails}
      />
    ),
    2: (
      <Publications
        isEdit={isEdit}
        onHide={onHide}
        fetchDetails={fetchDetails}
      />
    ),
    3: (
      <CurrentJournalRoles
        isEdit={isEdit}
        onHide={onHide}
        fetchDetails={fetchDetails}
        isFieldEmpty={isFieldEmpty}
      />
    ),

    4: (
      <Achievements
        isEdit={isEdit}
        onHide={onHide}
        fetchDetails={fetchDetails}
        isFieldEmpty={isFieldEmpty}
      />
    ),
  };
  return (
    <Modal
      isEdit={isEdit}
      onHide={onHide}
      title={title[formType]}
      width={"100%"}
    >
      <div
        className="cps-20 cpe-20 cmt-30 cpb-20 overflow-x-hidden overflow-y-auto"
        style={{ maxHeight: "600px" }}
      >
        {formComponent[formType]}
      </div>
    </Modal>
  );
};

export default PreviewEditDetails;
