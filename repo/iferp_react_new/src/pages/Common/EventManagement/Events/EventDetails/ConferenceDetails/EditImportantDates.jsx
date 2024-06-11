import Modal from "components/Layout/Modal";
import ImportantDates from "components/ReusableForms/ImportantDates";

const EditImportantDates = ({ onHide, eventId, fetchEventDetails }) => {
  return (
    <Modal onHide={onHide} title="Important Dates">
      <div className="cms-40 cme-40 cpt-20 cpb-20">
        <ImportantDates
          eventId={eventId}
          fetchEventDetails={fetchEventDetails}
        />
      </div>
    </Modal>
  );
};
export default EditImportantDates;
