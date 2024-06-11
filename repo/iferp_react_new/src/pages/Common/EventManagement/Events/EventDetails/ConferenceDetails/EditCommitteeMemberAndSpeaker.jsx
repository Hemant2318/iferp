import Modal from "components/Layout/Modal";
import CommitteeMember from "components/ReusableForms/CommitteeMember";
import Speaker from "components/ReusableForms/Speaker";

const EditCommitteeMemberAndSpeaker = ({
  onHide,
  type,
  eventId,
  fetchEventDetails,
}) => {
  return (
    <Modal
      onHide={onHide}
      title={type === 0 ? "Organizing Committee Members" : "Keynote Speakers"}
    >
      <div className="cms-40 cme-40 cpt-20 cpb-20">
        {type === 0 ? (
          <CommitteeMember
            eventId={eventId}
            fetchEventDetails={fetchEventDetails}
          />
        ) : (
          <Speaker eventId={eventId} fetchEventDetails={fetchEventDetails} />
        )}
      </div>
    </Modal>
  );
};
export default EditCommitteeMemberAndSpeaker;
