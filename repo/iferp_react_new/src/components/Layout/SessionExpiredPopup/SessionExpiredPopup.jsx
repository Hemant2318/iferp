import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import Button from "../../form/Button";
import { icons } from "utils/constants";
import { handelLogout } from "store/slices";

const SessionExpiredPopup = () => {
  const dispatch = useDispatch();
  const { isSessionExpired } = useSelector((state) => ({
    isSessionExpired: state.global.isSessionExpired,
  }));
  const handelClose = () => {
    dispatch(handelLogout());
  };
  return (
    <>
      {isSessionExpired && (
        <Modal hideClose onHide={() => {}}>
          <div className="d-flex flex-column justify-content-center align-items-center cmt-20">
            <div className="cmb-20">
              <img src={icons.unauthorized} alt="unautho" height={200} />
            </div>
            <div className="text-center cmt-30 cmb-12">
              <div className="text-24-500 color-raisin-black">
                Your session has expired
              </div>
              <div className="text-16-400 color-dark-silver cmt-16">
                Your session is expired for some reason, <br />
                please login again to move forword.
              </div>
            </div>
            <div className="cmt-30 cmb-30">
              <Button
                isRounded
                onClick={handelClose}
                btnStyle="primary-dark"
                text="Okay"
                className="cps-50 cpe-50"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
export default SessionExpiredPopup;
