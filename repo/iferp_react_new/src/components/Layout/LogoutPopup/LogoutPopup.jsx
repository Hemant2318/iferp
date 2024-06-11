import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import Button from "../../form/Button";
import { icons } from "utils/constants";
import {
  handelLogout,
  setIsLogout,
  logoutAPI,
  updateLastSeen,
} from "store/slices";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import { useNavigate } from "react-router-dom";

const LogoutPopup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoad, setIsLoad] = useState(false);
  const { isLogout } = useSelector((state) => ({
    isLogout: state.global.isLogout,
  }));
  const btnLogout = async () => {
    setIsLoad(true);
    let loginUserID = getDataFromLocalStorage("id");
    if (getDataFromLocalStorage("jwt_token")) {
      await dispatch(updateLastSeen({ userID: loginUserID }));
    }
    await dispatch(logoutAPI(objectToFormData({ user_id: loginUserID })));
    dispatch(handelLogout());
    navigate("/", {
      replace: true,
      state: { redirectRoute: "" },
    });
    setIsLoad(false);
  };
  return (
    <>
      {isLogout && (
        <Modal
          onHide={() => {
            dispatch(setIsLogout(false));
          }}
        >
          <div className="d-flex flex-column justify-content-center align-items-center cmt-20">
            <div className="cmb-20 ms-5">
              <img src={icons.logoutBack} alt="unautho" height={150} />
            </div>

            <div className="text-center cmt-30 cmb-12">
              <div className="text-24-500 color-raisin-black">Log Out</div>
              <div className="text-16-400 color-dark-silver cmt-16">
                Are you sure you want to logout?
              </div>
            </div>
            <div className="d-flex align-items-center cmt-30 cmb-30 gap-4">
              <Button
                isRounded
                text="Cancel"
                btnStyle="primary-outline"
                className="cps-50 cpe-50"
                onClick={() => {
                  dispatch(setIsLogout(false));
                }}
              />
              <Button
                isRounded
                text="Logout"
                onClick={btnLogout}
                btnLoading={isLoad}
                className="cps-50 cpe-50"
                btnStyle="danger-outline"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
export default LogoutPopup;
