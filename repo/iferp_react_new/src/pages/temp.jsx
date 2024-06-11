import CalendarLayout from "components/Layout/CalendarLayout";

const Temp = () => {
  return (
    <div className="temp vh-100 container mt-5">
      <div className="row">
        <div className="col-md-4 bg-white mb-3">
          <CalendarLayout />
        </div>
        <div className="col-md-4 bg-white mb-3">
          <CalendarLayout isSelectTime isSchedule />
        </div>
        <div className="col-md-4 bg-white mb-3">
          <CalendarLayout isSelectTime isReschedule />
        </div>
        <div className="col-md-4 bg-white mb-3">
          <CalendarLayout isView />
        </div>
        <div className="col-md-4 bg-white mb-3">
          <CalendarLayout isView isCustomizeTime />
        </div>
      </div>
    </div>
  );
};

export default Temp;
