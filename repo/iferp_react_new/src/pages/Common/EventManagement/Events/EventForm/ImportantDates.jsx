import ToggleContainer from "components/Layout/ToggleContainer";
import ImportantDatesForm from "components/ReusableForms/ImportantDates";

const ImportantDates = ({ eventId, fetchEventDetails }) => {
  return (
    <ToggleContainer
      title="Add Important Dates"
      isError={eventId === "add-event"}
      errorMessage="Event is required."
    >
      <div className="row cmb-20">
        <div className="col-md-8">
          <ImportantDatesForm
            eventId={eventId}
            fetchEventDetails={fetchEventDetails}
          />
        </div>
      </div>
    </ToggleContainer>
  );
};
export default ImportantDates;
