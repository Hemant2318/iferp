import Modal from "../Modal/Modal";
import { Radio, Button } from "components";
import { useDispatch, useSelector } from "react-redux";
import { setIsCitetion } from "store/globalSlice";

const CiteButton = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { isCitetion } = reduxData;
  return (
    <>
      {isCitetion && (
        <Modal
          size="md"
          title="Cite this Article"
          onHide={() => {
            dispatch(setIsCitetion(false));
          }}
        >
          <div className="cps-30 cpt-30 cpb-20">
            <div className="text-15-400">Select the type of file</div>
            <div className="d-flex flex-column gap-2 mt-2">
              <Radio label="RIS" checked={true} />
              <Radio label="BibTeX" />
              <Radio label="Plain Text" />
            </div>
            <div className="text-15-400 mt-3">Select the type of file</div>
            <div className="d-flex flex-column gap-2 mt-2">
              <Radio label="Citation only" checked={true} />
              <Radio label="Citation and abstract" />
            </div>
            <div className="f-center gap-4 flex-wrap mt-4">
              <Button btnText="Download" btnStyle="SD" onClick={() => {}} />
              <div
                className="text-16-400 color-5555"
                onClick={() => {
                  dispatch(setIsCitetion(false));
                }}
              >
                Cancel
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CiteButton;
