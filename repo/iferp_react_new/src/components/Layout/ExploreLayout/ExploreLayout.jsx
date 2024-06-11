import Button from "components/form/Button/Button";
import { useNavigate } from "react-router-dom";
import { icons } from "utils/constants";

const ExploreLayout = ({ redirect, info, externalButton }) => {
  const navigate = useNavigate();
  return (
    <div className="center-flex pb-5 pt-5">
      <div className="text-center">
        <div
          style={{
            height: "250px",
          }}
        >
          <img src={icons.explore} alt="search" className="fill fit-image" />
        </div>
        <div className="text-15-500 color-raisin-black mt-5 mb-3">{info}</div>
        <div className="d-flex justify-content-center">
          {externalButton ? (
            externalButton
          ) : (
            <Button
              isRounded
              btnStyle="primary-dark"
              className="text-14-500 cps-12 cpe-12 h-auto"
              text="Explore Now"
              onClick={() => {
                if (redirect) {
                  navigate(redirect);
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default ExploreLayout;
