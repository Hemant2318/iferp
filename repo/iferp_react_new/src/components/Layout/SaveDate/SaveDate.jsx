import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep } from "lodash";
import { saveEventDate, setMyEvents } from "store/slices";
import { objectToFormData } from "utils/helpers";

const SaveDate = ({ eventID }) => {
  const dispatch = useDispatch();
  const { myEvents } = useSelector((state) => ({
    myEvents: state.global.myEvents,
  }));
  const [btnLoading, setBtnLoading] = useState(false);
  const btnClick = async () => {
    setBtnLoading(true);
    const response = await dispatch(
      saveEventDate(
        objectToFormData({
          event_id: eventID,
        })
      )
    );
    if (response?.status === 200) {
      let oldList = cloneDeep(myEvents);
      if (isExist) {
        oldList = oldList.filter((o) => `${o.id}` !== `${eventID}`);
      } else {
        oldList = [...oldList, response?.data];
      }
      dispatch(setMyEvents(oldList));
    }
    setBtnLoading(false);
  };
  const isExist = myEvents.find((o) => `${o.id}` === `${eventID}`)?.id;

  return (
    <>
      <span
        className="color-new-car text-13-400 pointer d-flex align-items-center text-nowrap"
        onClick={() => {
          btnClick(isExist);
        }}
      >
        <i className="bi bi-calendar3-event me-2" />
        {btnLoading ? (
          <div className="spinner-border text-dark spinner-border-sm" />
        ) : isExist ? (
          "Unsave Date"
        ) : (
          "Save Date"
        )}
      </span>
    </>
  );
};
export default SaveDate;
