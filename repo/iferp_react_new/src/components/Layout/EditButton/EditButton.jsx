import { icons } from "utils/constants";
import Button from "../../form/Button";
import "./EditButton.scss";

const EditButton = ({ onClick, noTitle, btnPosition, editIconOnclick }) => {
  return noTitle ? (
    <div
      className={`${btnPosition} edit-icon pointer`}
      onClick={editIconOnclick}
    >
      <img src={icons.primaryEdit} alt="edit" className="" />
    </div>
  ) : (
    <Button
      isSquare
      text="Edit"
      onClick={onClick}
      btnStyle="primary-outline"
      className="common-edit-button"
      icon={<img src={icons.primaryEdit} alt="edit" className="me-2" />}
    />
  );
};
export default EditButton;
