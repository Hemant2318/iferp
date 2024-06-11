import ToggleContainer from "components/Layout/ToggleContainer";
import CommitteeMemberFrom from "components/ReusableForms/CommitteeMember";
const CommitteeMember = ({ toggleTitle, eventId, fetchEventDetails }) => {
  return (
    <ToggleContainer
      title={toggleTitle}
      isError={eventId === "add-event"}
      errorMessage="Event is required."
    >
      <div className="mb-3">
        <CommitteeMemberFrom
          eventId={eventId}
          fetchEventDetails={fetchEventDetails}
        />
      </div>
    </ToggleContainer>
  );
};
export default CommitteeMember;
