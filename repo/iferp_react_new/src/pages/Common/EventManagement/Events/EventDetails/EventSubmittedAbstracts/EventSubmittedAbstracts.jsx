import SubmittedPapers from "pages/Common/EventManagement/SubmittedPapers";

const EventSubmittedAbstracts = ({ eventId }) => {
  return (
    <div className="mt-3">
      <SubmittedPapers eventId={eventId} />
    </div>
  );
};
export default EventSubmittedAbstracts;
