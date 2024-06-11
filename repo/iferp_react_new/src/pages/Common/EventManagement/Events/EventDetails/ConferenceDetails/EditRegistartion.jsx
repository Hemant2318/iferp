import Modal from "components/Layout/Modal";
import Registration from "components/ReusableForms/Registration";

const EditRegistartion = ({ onHide, eventId, fetchEventDetails }) => {
  return (
    <Modal onHide={onHide} title="Registration">
      <div className="cms-20 cme-20 cpt-20 cpb-20">
        <Registration
          eventId={eventId}
          onHide={onHide}
          fetchEventDetails={fetchEventDetails}
        />
      </div>
    </Modal>
  );
};
export default EditRegistartion;
