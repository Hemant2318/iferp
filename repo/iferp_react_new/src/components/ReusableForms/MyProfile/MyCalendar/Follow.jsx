import SeachInput from "components/form/SeachInput";
import Modal from "components/Layout/Modal";
import Profile from "components/Layout/Profile";
import Button from "components/form/Button";

const Follow = ({ onHide }) => {
  const list = [];
  return (
    <Modal title="Follow" onHide={onHide}>
      <div className="cps-50 cpe-50 cmb-30 mt-5">
        <div className="cmb-22">
          <SeachInput placeholder="Search Community" />
        </div>
        <div>
          <div className="text-15-400 mb-2">Recommended</div>
          <div>
            <div
              className={`d-flex align-items-center justify-content-between ${
                list.length === 0 ? "" : "border-bottom"
              }`}
            >
              <div className="d-flex align-items-center gap-3">
                <Profile isRounded text="A" size="s-60" />
                <div>
                  <div className="text-14-500 color-black-olive">Anaya K</div>
                  <div className="text-12-400 color-black-olive">
                    Professor, Canada
                  </div>
                  <div className="text-12-400 color-black-olive">
                    268 Followers
                  </div>
                </div>
              </div>
              <Button
                isSquare
                text="Follow"
                btnStyle="primary-outline"
                className="h-35 text-14-500 text-nowrap"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default Follow;
