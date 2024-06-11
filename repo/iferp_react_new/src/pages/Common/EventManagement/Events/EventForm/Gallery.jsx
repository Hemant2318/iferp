import ToggleContainer from "components/Layout/ToggleContainer";
import PastConferencesGallery from "components/ReusableForms/PastConferencesGallery";
const Gallery = ({ eventId, fetchEventDetails }) => {
  return (
    <ToggleContainer
      title="Past Conferences Gallery"
      isError={eventId === "add-event"}
      errorMessage="Event is required."
    >
      <div className="cmb-20">
        <PastConferencesGallery
          eventId={eventId}
          fetchEventDetails={fetchEventDetails}
        />
      </div>
    </ToggleContainer>
  );
};
export default Gallery;
