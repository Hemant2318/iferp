import { Button, Modal } from "components";
import { icons } from "utils/constants";
import "./Sessionexpired.scss";

const Sessionexpired = ({ isSessionExpired, setSession }) => {
  const handelClose = () => {
    setSession(false);
  };
  return (
    <>
      {isSessionExpired && (
        <Modal size="md">
          <div className="d-flex flex-column justify-content-center align-items-center mt-5">
            <div className="mb-1 cme-50">
              <img src={icons.session} alt="unautho" height={150} />
            </div>
            <div className="text-center cmt-30 cmb-12">
              <div className="text-25-600 color-raisin-black">
                Your session has expired
              </div>
              <div className="text-16-400-26 color-dark-silver cmt-16">
                Your session is expired for some reason, <br />
                please login again to move forword.
              </div>
            </div>
            <div className="cmt-30 cmb-30">
              <Button
                isRounded
                onClick={handelClose}
                btnStyle="DO"
                btnText="Logout"
                rightIcon={icons.logout}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
export default Sessionexpired;
