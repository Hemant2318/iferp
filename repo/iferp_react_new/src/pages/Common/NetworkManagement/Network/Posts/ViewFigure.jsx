import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import { useDispatch } from "react-redux";
import { downloadFile } from "utils/helpers";

const ViewFigure = ({ onHide, figures }) => {
  const dispatch = useDispatch();
  return (
    <Modal onHide={onHide}>
      <div id="figures-list">
        <div className="border-bottom mb-3 cpb-10">
          Figures ({figures.length})
        </div>
        {figures?.map((elm, index) => {
          return (
            <div key={index} className="border mb-3 p-2">
              <div className="cps-10 cpt-10 cpb-10">
                <span className="text-15-400 color-raisin-black">{`Figure ${
                  index + 1
                }:`}</span>
                <span className="ms-1 text-15-500 color-raisin-black">
                  {elm.caption}
                </span>
              </div>
              <img src={elm.figure} alt="figure" className="mw-100" />
            </div>
          );
        })}
        <div className="center-flex">
          <Button
            isSquare
            icon={<i className="bi bi-download me-2" />}
            btnStyle="primary-dark"
            text="Download Figures"
            className="h-auto text-14-400 ps-4 pe-4 pt-2 pb-2"
            onClick={() => {
              figures.forEach((el) => {
                dispatch(downloadFile(el.figure));
              });
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ViewFigure;
