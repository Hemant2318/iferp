import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";
import moment from "moment";
import * as Yup from "yup";
import { Formik } from "formik";
import Button from "../../form/Button";
import DatePicker from "../../form/DatePicker";
import { objectToFormData } from "utils/helpers";
import { editEvent, showSuccess } from "store/slices";

const ImportantDates = ({ eventId, fetchEventDetails }) => {
  const dispatch = useDispatch();
  const { eventDates, eventData } = useSelector((state) => ({
    membershipList: state.global.membershipList,
    eventDates: state.global.eventData?.dates || {},
    eventData: state.global.eventData || {},
  }));
  const [btnLoading, setBtnLoading] = useState(false);
  const initialValues = {
    early_bird_registration: eventDates?.early_bird_registration || "",
    abstract_submission: eventDates?.abstract_submission || "",
    full_paper_submission: eventDates?.full_paper_submission || "",
    registration_deadline: eventDates?.registration_deadline || "",
  };
  const validationSchema = Yup.object().shape({
    early_bird_registration: Yup.string().required(
      "Early bird registration date is required."
    ),
    abstract_submission: Yup.string().required(
      "Abstract submission date is required."
    ),
    full_paper_submission: Yup.string().required(
      "Full paper submission date is required."
    ),
    registration_deadline: Yup.string().required(
      "Registration deadline date is required."
    ),
  });
  const handelSave = async (values) => {
    setBtnLoading(true);
    const payloadData = { ...values, type: 1, id: eventId };
    const payload = objectToFormData(payloadData);
    const response = await dispatch(editEvent(payload));
    if (response?.status === 200) {
      fetchEventDetails();
      const text = eventDates?.early_bird_registration ? "update" : "add";
      dispatch(showSuccess(`Important dates ${text} successfully.`));
    }
    setBtnLoading(false);
  };
  return (
    <div className="cmt-20">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handelSave}
        validationSchema={validationSchema}
      >
        {(props) => {
          const { values, errors, handleChange, handleSubmit, resetForm } =
            props;
          return (
            <form>
              <div className="row">
                <div className="cmb-22">
                  <DatePicker
                    label="Early Bird Registration"
                    placeholder="Select early bird date"
                    id="early_bird_registration"
                    minDate={moment().format("YYYY-MM-DD")}
                    maxDate={eventData.start_date}
                    onChange={handleChange}
                    value={values.early_bird_registration}
                    error={errors.early_bird_registration}
                  />
                </div>

                <div className="cmb-22">
                  <DatePicker
                    label="Abstract Submission"
                    placeholder="Select abstract submission date"
                    id="abstract_submission"
                    minDate={moment().format("YYYY-MM-DD")}
                    maxDate={eventData.start_date}
                    onChange={handleChange}
                    value={values.abstract_submission}
                    error={errors.abstract_submission}
                  />
                </div>

                <div className="cmb-22">
                  <DatePicker
                    label="Full Paper Submission"
                    placeholder="Select full paper submission date"
                    id="full_paper_submission"
                    minDate={moment().format("YYYY-MM-DD")}
                    maxDate={eventData.start_date}
                    onChange={handleChange}
                    value={values.full_paper_submission}
                    error={errors.full_paper_submission}
                  />
                </div>

                <div className="cmb-22">
                  <DatePicker
                    label="Registration Deadline"
                    placeholder="Select registration deadline date"
                    id="registration_deadline"
                    minDate={moment().format("YYYY-MM-DD")}
                    maxDate={eventData.start_date}
                    onChange={handleChange}
                    value={values.registration_deadline}
                    error={errors.registration_deadline}
                  />
                </div>
                <div className="d-flex justify-content-center gap-4 cmt-20">
                  <Button
                    text="Cancel"
                    isRounded
                    btnStyle="light-outline"
                    className="cps-40 cpe-40"
                    onClick={resetForm}
                  />
                  <Button
                    text="Done"
                    isRounded
                    btnStyle="primary-dark"
                    className="cps-40 cpe-40"
                    onClick={handleSubmit}
                    btnLoading={btnLoading}
                    disabled={isEqual(values, eventDates)}
                  />
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
export default ImportantDates;
