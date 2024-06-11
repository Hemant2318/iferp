import ToggleContainer from "components/Layout/ToggleContainer";
import RegistrationForm from "components/ReusableForms/Registration";

const Registration = ({ eventId }) => {
  return (
    <ToggleContainer
      title="Registration"
      isError={eventId === "add-event"}
      errorMessage="Event is required."
    >
      <div className="mb-3">
        <RegistrationForm eventId={eventId} />
      </div>
    </ToggleContainer>
  );
};
export default Registration;
