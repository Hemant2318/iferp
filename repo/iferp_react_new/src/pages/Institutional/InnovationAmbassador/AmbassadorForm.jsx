import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import Modal from "components/Layout/Modal";
import { objectToFormData } from "utils/helpers";
import {
  addInstitutionalAmbassador,
  getNonAmbassadorUsers,
} from "store/slices";

const AmbassadorForm = ({ onHide, type, handelSuccess }) => {
  const dispatch = useDispatch();
  const [btnLoading, setBtnLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [user_id, setUserId] = useState("");
  const [userData, setUserData] = useState({});

  const handelSave = async () => {
    setBtnLoading(true);
    const response = await dispatch(
      addInstitutionalAmbassador(
        objectToFormData({
          user_id: user_id,
        })
      )
    );
    if (response?.status === 200) {
      handelSuccess();
    }
    setBtnLoading(false);
  };

  const fetchMemberes = async () => {
    const response = await dispatch(getNonAmbassadorUsers(type));
    setUserList(response?.data || []);
  };

  useEffect(() => {
    fetchMemberes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const { department_name, email_id, phone_number } = userData;
  return (
    <Modal title="Add Ambassador" onHide={onHide}>
      <form className="cpt-30 cpb-30 cps-50 cpe-50">
        <div className="row mt-3">
          <div className="col-md-6 cmb-22">
            <Dropdown
              placeholder={`Select ${
                type === 0 ? "Student" : "Faculty"
              } Member`}
              options={userList}
              optionValue="first_name"
              extraDisplayKey="last_name"
              id="user_id"
              value={user_id}
              onChange={(e) => {
                setUserId(e.target.value);
                setUserData(e.target.data);
              }}
            />
          </div>
          <div className="col-md-6 cmb-22">
            <TextInput
              value={department_name}
              placeholder="Department"
              disabled
            />
          </div>
          <div className="col-md-6 cmb-22">
            <TextInput value={email_id} placeholder="Email Id" disabled />
          </div>
          <div className="col-md-6 cmb-22">
            <TextInput
              value={phone_number}
              placeholder="Phone Number"
              disabled
            />
          </div>
          <div className="d-flex justify-content-center gap-4">
            <Button
              isRounded
              text="Cancel"
              btnStyle="light-outline"
              className="cps-40 cpe-40"
              onClick={onHide}
            />
            <Button
              text="Register"
              isRounded
              btnStyle="primary-dark"
              className="cps-40 cpe-40"
              onClick={handelSave}
              btnLoading={btnLoading}
              disabled={!user_id}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
export default AmbassadorForm;
