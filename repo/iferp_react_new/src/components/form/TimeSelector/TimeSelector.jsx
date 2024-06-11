import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ColorDropdown from "../ColorDropdown";
import { endTimeList, startTimeList, timeZoneList } from "utils/constants";
import CheckBox from "../CheckBox";
import Dropdown from "../Dropdown";
import TableV2 from "components/Layout/TableV2/TableV2";
import Card from "components/Layout/Card";
import Button from "../Button";
import CalendarLayout from "components/Layout/CalendarLayout";
import CustomizeTimePopup from "pages/Common/Mentorship/Mentors/AddSession/CustomizeTimePopup";
import { useDispatch, useSelector } from "react-redux";
import MentorPreviewPopup from "components/ReusableForms/MentorPreviewPopup/MentorPreviewPopup";
import { setCustomizeDateTime, setUnavailableDateTime } from "store/slices";
import moment from "moment";

const TimeSelector = ({
  values,
  handleChange,
  handleSubmit,
  setFieldValue,
  isCustomizeTime,
  setIsCustomizeTime,
  errors,
  isLoading,
  mySessionData,
  initialValues,
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const { formType: type } = params;
  const [modalShow, setModalShow] = React.useState(false);
  const upDateViewStatus = type === "update-session-details" ? true : false;
  const { customizeDateTime, unavailableDateTime } = useSelector((state) => ({
    customizeDateTime: state.mentorship.customizeDateTime,
    unavailableDateTime: state.mentorship.unavailableDateTime,
  }));
  const [selectedTimeZoneId, setSelectedTimeZoneId] = useState("IST");

  const dispatch = useDispatch();

  const dummyData = [
    {
      id: 1,
      dayName: "Monday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
    {
      id: 2,
      dayName: "Tuesday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
    {
      id: 3,
      dayName: "Wednesday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
    {
      id: 4,
      dayName: "Thursday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
    {
      id: 5,
      dayName: "Friday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
    {
      id: 6,
      dayName: "Saturday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
    {
      id: 7,
      dayName: "Sunday",
      startTime: "10:00 AM IST",
      endTime: "06:00 PM IST",
    },
  ];
  const header = [
    {
      title: <div className="text-nowrap color-text-navy text-16-400">Day</div>,
    },
    {
      title: (
        <div className="text-nowrap color-text-navy text-16-400">
          Start Time
        </div>
      ),
    },
    {
      title: (
        <div className="text-nowrap color-text-navy text-16-400">End Time</div>
      ),
    },
  ];
  // const { mySessionData } = useSelector((state) => ({
  //   mySessionData: state.mentorship.mySessionData,
  // }));
  let rowData = [];
  dummyData?.forEach((elm) => {
    const { id, dayName } = elm;
    const checkboxFieldName = `checkedDays[${id}]`;
    const newStartTimeList = startTimeList.map((sTime) => {
      return {
        ...sTime,
        value: `${sTime.value} ${selectedTimeZoneId}`,
      };
    });
    const newOldTimeList = endTimeList.map((sTime) => {
      return {
        ...sTime,
        value: `${sTime.value} ${selectedTimeZoneId}`,
      };
    });
    let obj = [
      {
        value: (
          <div className="d-flex gap-2 align-items-center">
            <CheckBox
              type="PRIMARY-ACTIVE"
              onClick={() => {
                setFieldValue(checkboxFieldName, !values?.checkedDays[id]);
              }}
              isChecked={values?.checkedDays[id]}
            />
            <div>{dayName}</div>
          </div>
        ),
      },
      {
        value: (
          <div className="d-flex">
            <ColorDropdown
              id={`startTimes[${id}]`}
              options={newStartTimeList}
              optionKey="id"
              optionValue="value"
              value={values?.startTimes[id]}
              onChange={handleChange}
              error={errors.startTimes?.startTimes[id]}
            />
          </div>
        ),
      },

      {
        value: (
          <div>
            <ColorDropdown
              id={`endTimes[${id}]`}
              options={newOldTimeList}
              optionKey="id"
              optionValue="value"
              value={values?.endTimes[id]}
              onChange={handleChange}
              error={errors.endTimes?.endTimes[id]}
            />
          </div>
        ),
      },
    ];
    rowData.push({ data: obj });
  });

  useEffect(() => {
    if (mySessionData && mySessionData?.daily) {
      const updatedValues = { ...values };

      mySessionData?.daily?.forEach((dayData, index) => {
        updatedValues[`startTimes[${index + 1}]`] = dayData?.start_time || "";
        updatedValues[`endTimes[${index + 1}]`] = dayData?.end_time || "";
      });

      setFieldValue("startTimes", updatedValues?.startTimes);
      setFieldValue("endTimes", updatedValues?.endTimes);
    }

    // eslint-disable-next-line array-callback-return
    mySessionData?.customize_time?.map((dateTime, i) => {
      const tz = dateTime?.time_zone?.split("(");
      const tzValue = tz?.[tz?.length - 1]?.replace(")", "");
      dispatch(
        setCustomizeDateTime({
          date: dateTime?.date,
          time_zone: tzValue,
          start_time: dateTime?.start_time,
          end_time: dateTime?.end_time,
        })
      );
    });
    // eslint-disable-next-line array-callback-return
    mySessionData?.unavalible_time?.map((dateTime, i) => {
      dispatch(
        setUnavailableDateTime({
          date: dateTime?.date,
          time_zone: null,
          start_time: null,
          end_time: null,
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mySessionData]);

  // useEffect(() => {
  //   if (mySessionData && mySessionData?.daily) {
  //     mySessionData?.daily?.forEach((dayData, index) => {
  //       setFieldValue(`startTimes[${index + 1}]`, dayData?.start_time || "");
  //       setFieldValue(`endTimes[${index + 1}]`, dayData?.end_time || "");
  //     });
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [mySessionData]);
  const statusDataType = [
    // { id: "0", label: "Pending" },
    { id: "1", label: "Approved" },
    { id: "2", label: "Rejected" },
  ];

  const minDate = moment().format("YYYY-MM-DD");
  return (
    <div>
      {isCustomizeTime && (
        <CustomizeTimePopup setIsCustomizeTime={setIsCustomizeTime} />
      )}
      <div className="text-16-500 color-dark-blue cmb-10">
        Date and Time Selection
      </div>
      <div className="row">
        <Card className="col-md-8 cpt-15 cpb-15 ">
          <div className="cmb-20">
            <Dropdown
              id="timizone"
              value={values?.timizone}
              label="Timezone*"
              placeholder="Select Timezone"
              options={timeZoneList}
              optionKey="value"
              optionValue="label"
              onChange={(e) => {
                const timeZoneId = e?.target?.data?.id;
                setSelectedTimeZoneId(timeZoneId);
                handleChange(e);
              }}
              error={errors?.timizone}
              disabled={upDateViewStatus ? true : false}
            />
          </div>
          <div className="cmb-24">
            <TableV2
              header={header}
              rowData={rowData}
              tableBorder
              disabled={upDateViewStatus ? true : false}
            />
          </div>
          {upDateViewStatus && (
            <div className="cmb-24">
              <Dropdown
                id="status"
                placeholder="Select Status"
                options={statusDataType}
                value={values?.status}
                optionKey="id"
                optionValue="label"
                label="Status"
                onChange={handleChange}
                // error={errors?.status}
              />
            </div>
          )}
          {/* {type !== "update-session-details" && ( */}
          <div className="d-flex gap-3">
            <Button
              text={`${upDateViewStatus ? "Update" : "Submit"}`}
              btnStyle="primary-dark"
              className="cps-20 cpe-20"
              onClick={handleSubmit}
              btnLoading={isLoading}
            />
            <Button text="Cancel" btnStyle="" onClick={() => navigate(-1)} />
            {type === "add-new-session" && (
              <Button
                text="Preview"
                btnStyle=""
                onClick={() => {
                  if (values && Object.keys(errors)?.length === 0) {
                    setModalShow(true);
                  }
                }}
              />
            )}
          </div>
          {/* )} */}
        </Card>
        <Card className="col-md-4 cpt-15 cpb-15">
          <CalendarLayout
            isView
            isCustomizeTime
            customizeOnClick={() => {
              setIsCustomizeTime(true);
            }}
            mySessionData={mySessionData}
            minDate={minDate}
          />
        </Card>
        <MentorPreviewPopup
          userDetails={values}
          show={modalShow}
          onHide={() => setModalShow(false)}
          sessionCustomizeTime={customizeDateTime}
          sessionUnAvailableTime={unavailableDateTime}
          isBookingSession={false}
        />
      </div>
    </div>
  );
};

export default TimeSelector;
