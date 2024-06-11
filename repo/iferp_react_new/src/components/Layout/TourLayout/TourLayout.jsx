import Button from "components/form/Button";
import { useDispatch } from "react-redux";
import { tourStatus } from "store/slices";
const TourLayout = ({
  title,
  info,
  handelNext,
  handelBack,
  isHideBack,
  isDone,
}) => {
  const dispatch = useDispatch();
  return (
    <>
      <div className="text-start text-15-500 color-raisin-black">
        {title || ""}
      </div>
      <div
        className="text-start text-14-400 mt-1"
        style={{
          color: "#2D2D2D",
        }}
      >
        {info || ""}
      </div>
      <div className="d-flex justify-content-between cmt-22">
        {!isHideBack && (
          <Button
            text="Back"
            btnStyle="light-outline"
            className="h-auto unset-br"
            onClick={() => {
              handelBack();
            }}
          />
        )}
        <div className="d-flex gap-2">
          <Button
            text={isDone ? "Done" : "Next"}
            btnStyle="primary-outline "
            className="h-auto unset-br"
            onClick={() => {
              handelNext();
            }}
          />
          <Button
            text={"Skip Tour"}
            btnStyle="light-outline"
            className="h-auto unset-br"
            onClick={async () => {
              await dispatch(tourStatus(19, true));
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />
        </div>
      </div>
    </>
  );
};
export default TourLayout;
