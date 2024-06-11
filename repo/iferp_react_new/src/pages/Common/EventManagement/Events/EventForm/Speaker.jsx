import ToggleContainer from "components/Layout/ToggleContainer";
import SpeakerForm from "components/ReusableForms/Speaker";

const Speaker = ({ toggleTitle, eventId, fetchEventDetails }) => {
  return (
    <ToggleContainer
      title={toggleTitle}
      isError={eventId === "add-event"}
      errorMessage="Event is required."
    >
      <div className="mb-3">
        <SpeakerForm eventId={eventId} fetchEventDetails={fetchEventDetails} />
      </div>
    </ToggleContainer>
  );
};
export default Speaker;
