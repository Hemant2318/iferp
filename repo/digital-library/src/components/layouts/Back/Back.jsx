import { useNavigate } from "react-router-dom";
import { icons } from "utils/constants";

const Back = ({ children, prevRoute }) => {
  const navigate = useNavigate();
  return (
    <div className="fa-center gap-3">
      <div
        className="d-flex pointer"
        onClick={() => {
          if (prevRoute) {
            navigate(prevRoute);
          } else {
            navigate(-1);
          }
        }}
      >
        <img src={icons.leftArrow} alt="left" />
      </div>
      {children}
    </div>
  );
};

export default Back;
