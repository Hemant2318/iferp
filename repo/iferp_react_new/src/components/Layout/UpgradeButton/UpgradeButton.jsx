import { useDispatch } from "react-redux";
import { Image } from "react-bootstrap";
import Button from "../../form/Button";
import { setIsPremiumPopup } from "store/slices";
import { icons } from "utils/constants";

const UpgradeButton = ({ text }) => {
  const dispatch = useDispatch();
  return (
    <>
      <Button
        isSquare
        icon={
          <Image
            src={icons.primaryCrown}
            className="me-2"
            height={20}
            width={21}
          />
        }
        text={text || "Upgrade"}
        btnStyle="primary-outline"
        className="rounded text-15-500 cps-20 cpe-20 bg-transparant"
        onClick={() => {
          dispatch(setIsPremiumPopup(true));
        }}
      />
    </>
  );
};
export default UpgradeButton;
