import { useDispatch, useSelector } from "react-redux";
import { setRProfileID } from "store/slices";
import ResearchProfile from "components/ReusableForms/MyProfile/ResearchProfilePage";
import Modal from "../Modal";

const GlobalProfile = () => {
  const dispatch = useDispatch();
  const { rProfileID } = useSelector((state) => ({
    rProfileID: state.global.rProfileID,
  }));

  return (
    <>
      {rProfileID && (
        <Modal
          size="lg"
          onHide={() => {
            dispatch(setRProfileID());
          }}
        >
          <ResearchProfile />
        </Modal>
      )}
    </>
  );
};
export default GlobalProfile;
