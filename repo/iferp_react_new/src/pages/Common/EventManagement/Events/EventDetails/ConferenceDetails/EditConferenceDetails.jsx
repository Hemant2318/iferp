import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEqual, omit } from "lodash";
import * as Yup from "yup";
import { Formik } from "formik";
import Button from "components/form/Button";
import Location from "components/form/Location";
import DatePicker from "components/form/DatePicker";
import FileUpload from "components/form/FileUpload";
import Label from "components/form/Label";
import TextInput from "components/form/TextInput";
import Modal from "components/Layout/Modal";
import { editEvent } from "store/slices";
import {
  getFilenameFromUrl,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";

const EditConferenceDetails = ({ onHide, eventId, fetchEventDetails }) => {
  const dispatch = useDispatch();
  const { eventData } = useSelector((state) => ({
    eventData: state.global.eventData,
  }));
  const [btnLoading, setBtnLoading] = useState(false);
  const initialValues = {
    ...eventData,
    brochureFileName: eventData?.brochure_path || "",
    brochure_image: eventData?.brochure_path || "",
    posterFileName: eventData?.poster_path || "",
    poster_image: eventData?.poster_path || "",
  };
  const validationSchema = Yup.object().shape({
    event_name: Yup.string().required("Event name is required."),
    start_date: Yup.string().required("Start date is required."),
    end_date: Yup.string().required("End date is required."),
    country: Yup.string().required("Country is required."),
    // city: Yup.string().required("locations is required."),
    brochure_image: Yup.string().required("Brochure image is required."),
    poster_image: Yup.string().required("Poster image is required."),
  });

  const handelSave = (values) => {
    setBtnLoading(true);

    let payloadObject = omit(values, [
      "brochureFileName",
      "brochure_path",
      "committee_membres",
      "posterFileName",
      "poster_path",
      "speaker_details",
      "dates",
      "status",
      "event_agendas",
      "past_conference_gallery",
    ]);
    payloadObject = {
      ...payloadObject,
      type: 4,
      id: eventId,
      event_type: values.event_type_id,
    };
    handelEditEvent(payloadObject);
  };
  const handelEditEvent = async (values) => {
    const payload = objectToFormData(values);
    const response = await dispatch(editEvent(payload));
    if (response?.status === 200) {
      fetchEventDetails();
    }
    setBtnLoading(false);
  };
  return (
    <Modal onHide={onHide} title="Conference Details">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handelSave}
      >
        {(props) => {
          const { values, errors, handleChange, handleSubmit, setFieldValue } =
            props;
          return (
            <div className="cms-30 cme-30 cmt-30 cpb-20">
              <div className="row">
                <div className="cmb-22">
                  <TextInput
                    placeholder="Event Name"
                    id="event_name"
                    onChange={(e) => {
                      setFieldValue(
                        "event_name",
                        titleCaseString(e.target.value)
                      );
                    }}
                    value={values.event_name}
                    error={errors.event_name}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <DatePicker
                    placeholder="Start Date"
                    id="start_date"
                    onChange={handleChange}
                    value={values.start_date}
                    error={errors.start_date}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <DatePicker
                    placeholder="End Date"
                    id="end_date"
                    onChange={handleChange}
                    value={values.end_date}
                    error={errors.end_date}
                    minDate={values.start_date}
                    disabled={!values.start_date}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <Location
                    type="country"
                    data={{
                      id: "country",
                      placeholder: "Select Country*",
                      value: values.country,
                      error: errors.country,
                      onChange: (e) => {
                        setFieldValue("country", e.target.value);
                      },
                    }}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <Location
                    type="city"
                    data={{
                      id: "city",
                      placeholder: "Select City",
                      value: values.city,
                      error: errors.city,
                      countryId: values.country,
                      onChange: (e) => {
                        setFieldValue("city", titleCaseString(e.target.value));
                      },
                      disabled: !values.country,
                    }}
                  />
                </div>
                <div className="d-flex align-items-center flex-wrap cmb-22">
                  <div className="me-2">
                    <Label label="Upload Brochure" />
                  </div>
                  <div className="flex-1">
                    <FileUpload
                      fileType="image"
                      fileText={getFilenameFromUrl(values.brochureFileName)}
                      id="brochure_image"
                      onChange={(e) => {
                        const value = e.target.value;
                        const fileName = e.target.fileName;

                        setFieldValue("brochure_image", value);
                        setFieldValue("brochureFileName", fileName);
                      }}
                      value={values.brochure_image}
                      error={errors.brochure_image}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center flex-wrap cmb-22">
                  <div className="me-4 pe-2">
                    <Label label="Upload Poster" />
                  </div>
                  <div className="flex-1">
                    <FileUpload
                      fileType="image"
                      fileText={getFilenameFromUrl(values.posterFileName)}
                      id="poster_image"
                      onChange={(e) => {
                        const value = e.target.value;
                        const fileName = e.target.fileName;
                        setFieldValue("poster_image", value);
                        setFieldValue("posterFileName", fileName);
                      }}
                      value={values.poster_image}
                      error={errors.poster_image}
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center gap-4 cmt-20">
                <Button
                  text="Cancel"
                  isRounded
                  btnStyle="light-outline"
                  className="cps-40 cpe-40"
                  onClick={onHide}
                />
                <Button
                  isRounded
                  text="Done"
                  btnStyle="primary-dark"
                  className="cps-40 cpe-40"
                  onClick={handleSubmit}
                  btnLoading={btnLoading}
                  disabled={isEqual(initialValues, values)}
                />
              </div>
            </div>
          );
        }}
      </Formik>
    </Modal>
  );
};
export default EditConferenceDetails;
