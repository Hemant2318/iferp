import Modal from "components/Layout/Modal";
import PastConferencesGallery from "components/ReusableForms/PastConferencesGallery";

const EditPastConferencesGallery = ({ onHide, eventId, fetchEventDetails }) => {
  return (
    <Modal onHide={onHide} title="Past Conferences Gallery">
      <div className="cms-40 cme-40 cpt-20 cpb-20">
        <PastConferencesGallery
          eventId={eventId}
          fetchEventDetails={fetchEventDetails}
        />
      </div>
    </Modal>
  );
};
export default EditPastConferencesGallery;
