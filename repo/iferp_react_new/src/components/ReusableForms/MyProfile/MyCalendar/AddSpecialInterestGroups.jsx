import { useSelector } from "react-redux";
import SeachInput from "components/form/SeachInput";
import Modal from "components/Layout/Modal";
import Profile from "components/Layout/Profile";
import Button from "components/form/Button";

const AddSpecialInterestGroups = ({ onHide }) => {
  const { myGroupsList } = useSelector((state) => ({
    myGroupsList: state.global.myGroupsList,
  }));
  return (
    <Modal title="Add Special Interest Groups" onHide={onHide}>
      <div className="cps-50 cpe-50 cmb-30 mt-5">
        <div className="cmb-22">
          <SeachInput placeholder="Search Groups" />
        </div>
        <div>
          <div className="text-15-400 mb-2">Recommended</div>
          <div>
            {myGroupsList.map((elem, index) => {
              const memberCount = elem?.joined_members.length || 0;
              return (
                <div
                  key={index}
                  className={`d-flex align-items-center justify-content-between ${
                    myGroupsList.length - 1 === index ? "" : "border-bottom"
                  }`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <Profile isRounded text={elem.name} size="s-60" />
                    <div>
                      <div className="text-14-500 color-black-olive">
                        {elem.name}
                      </div>
                      <div className="text-12-400 color-black-olive">
                        {elem.interest_category}
                      </div>
                      <div className="text-12-400 color-black-olive">
                        {memberCount} Members
                      </div>
                    </div>
                  </div>
                  <Button
                    isSquare
                    text="Join Now"
                    btnStyle="primary-outline"
                    className="h-35 text-14-500 text-nowrap"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default AddSpecialInterestGroups;
