import Modal from "components/Layout/Modal";
import React, { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Dropdown from "components/form/Dropdown";
import Button from "components/form/Button";
import { endTimeList, startTimeList, timeZoneList } from "utils/constants";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setCustomizeDateTime } from "store/slices";
import { isEmpty } from "lodash";

const CustomizeTimePopup = ({ setIsCustomizeTime }) => {
  const dispatch = useDispatch();
  const { customizedDate } = useSelector((state) => ({
    customizedDate: state.mentorship.customizedDate,
  }));
  const [selectedTimeZoneId, setSelectedTimeZoneId] = useState("IST");

  const initialValues = {
    timeZone: timeZoneList?.[70]?.label,
    startTime: "",
    endTime: "",
  };
  const validationSchema = Yup.object().shape({
    timeZone: Yup.string().required("Timezone is required."),
    startTime: Yup.string().required("Start time is required."),
    endTime: Yup.lazy((_, o) => {
      const { startTime } = o?.parent;
      if (startTime) {
        return Yup.string().test(
          "endTime",
          "End time must be greater than start time",
          function (endTime) {
            const { startTime } = this.parent;
            return startTime && endTime && startTime < endTime;
          }
        );
      } else {
        return Yup.string();
      }
    }),
  });

  const handleSave = async (values) => {
    if (!isEmpty(values)) {
      if (customizedDate) {
        dispatch(
          setCustomizeDateTime({
            date: moment(customizedDate).format("DD/MM/YYYY"),
            timezone: values?.timeZone,
            start_time: values?.startTime,
            end_time: values?.endTime,
          })
        );
      }
      setIsCustomizeTime(false);
    }
  };
  return (
    <Modal
      onHide={() => {
        setIsCustomizeTime(false);
      }}
    >
      <div className="d-flex flex-column justify-content-center cps-15 cpe-15">
        <div className="text-center cmb-12">
          <div className="text-20-500 color-black-olive">Customize Time </div>
        </div>

        <div className="text-16-500 color-dark-navy-blue cmb-24">
          {customizedDate && moment(customizedDate).format("Do MMM YYYY")}
        </div>

        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSave}
          >
            {(props) => {
              const { values, handleChange, handleSubmit, errors } = props;
              const { timeZone, startTime, endTime } = values;
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
              return (
                <form className="row flex-wrap">
                  <div className="col-md-4 cmb-24">
                    <Dropdown
                      label="TimeZone*"
                      placeholder="Select TimeZone"
                      id="timeZone"
                      value={timeZone}
                      options={timeZoneList}
                      optionKey="value"
                      optionValue="label"
                      onChange={(e) => {
                        const timeZoneId = e?.target?.data?.id;
                        setSelectedTimeZoneId(timeZoneId);
                        handleChange(e);
                      }}
                      error={errors?.timeZone}
                    />
                  </div>
                  <div className="col-md-4 cmb-24">
                    <Dropdown
                      label="Start Time*"
                      placeholder="Select Start Time"
                      id="startTime"
                      value={startTime}
                      options={newStartTimeList}
                      optionKey="id"
                      optionValue="value"
                      onChange={handleChange}
                      error={errors?.startTime}
                    />
                  </div>
                  <div className="col-md-4 cmb-24">
                    <Dropdown
                      label="End Time*"
                      placeholder="Select End Time"
                      id="endTime"
                      value={endTime}
                      options={newOldTimeList}
                      optionKey="id"
                      optionValue="value"
                      onChange={handleChange}
                      error={errors?.endTime}
                    />
                  </div>

                  <div className="d-flex justify-content-center cmb-20">
                    <Button
                      text="Submit"
                      btnStyle="primary-dark"
                      className="cps-20 cpe-20"
                      onClick={handleSubmit}
                    />
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Modal>
  );
};

export default CustomizeTimePopup;
