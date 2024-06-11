import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import Modal from "components/Layout/Modal";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import Dropdown from "components/form/Dropdown";
import { objectToFormData } from "utils/helpers";
import {
  allocateAbstract,
  fetchReviewrEvents,
  fetchReviewrEventsAbstracts,
} from "store/slices";

const AllocateProject = ({ onHide, handelSuccess, editData = {}, eventId }) => {
  const dispatch = useDispatch();
  const [btnLoading, setBtnLoading] = useState(false);
  const [eventLoading, setEventLoading] = useState(true);
  const [eventList, setEventList] = useState([]);
  const [abstarctLoading, setAbstarctLoading] = useState(false);
  const [abstarctList, setAbstarctList] = useState([]);
  const { id, name, email_id, phone_number } = editData;
  const handelSave = async (values) => {
    setBtnLoading(true);
    const response = await dispatch(allocateAbstract(objectToFormData(values)));
    if (response?.status === 200) {
      handelSuccess();
    }
    setBtnLoading(false);
  };
  const getEventPaper = async (eventID) => {
    setAbstarctLoading(true);
    const response = await dispatch(
      fetchReviewrEventsAbstracts(
        objectToFormData({
          event_id: eventID,
        })
      )
    );
    let newData = response?.data || [];
    newData = newData.filter((o) => o.user_id !== id);
    setAbstarctList(newData);
    setAbstarctLoading(false);
  };
  const getReviewerEvents = async () => {
    const response = await dispatch(
      fetchReviewrEvents(objectToFormData({ user_id: id }))
    );
    setEventList(response?.data || []);
    setEventLoading(false);
  };
  useEffect(() => {
    getReviewerEvents();
    if (eventId) {
      getEventPaper(eventId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object().shape({
    event_id: Yup.string().required("Event is required."),
    abstract_paper_id: Yup.string().required("Abstract paper is required."),
  });
  const initialValues = {
    user_id: id,
    event_id: eventId || "",
    abstract_paper_id: "",
  };
  return (
    <Modal onHide={onHide} title="Allocate Project">
      <div className="cmt-34 cms-20 cme-20 cmb-10">
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handelSave}
        >
          {(props) => {
            const { values, errors, handleChange, handleSubmit } = props;
            return (
              <form>
                <div className="row">
                  <div className="cmb-22">
                    <TextInput placeholder="Name" value={name} disabled />
                  </div>
                  <div className="cmb-22">
                    <TextInput
                      placeholder="Email ID"
                      value={email_id}
                      disabled
                    />
                  </div>
                  <div className="cmb-22">
                    <TextInput
                      placeholder="Phone Number"
                      value={phone_number}
                      disabled
                    />
                  </div>
                  <div className="cmb-22">
                    <Dropdown
                      id="event_id"
                      options={eventList}
                      optionValue="event_name"
                      value={values.event_id}
                      error={errors.event_id}
                      placeholder="Select Event"
                      isLoading={eventLoading}
                      disabled={eventId}
                      onChange={(e) => {
                        getEventPaper(e.target.value);
                        handleChange(e);
                      }}
                    />
                  </div>
                  <div className="cmb-22">
                    <Dropdown
                      options={abstarctList}
                      optionValue="abstract_id"
                      extraDisplayKey="paper_title"
                      onChange={handleChange}
                      value={values.abstract_paper_id}
                      error={errors.abstract_paper_id}
                      disabled={!values.event_id}
                      id="abstract_paper_id"
                      placeholder="Select Abstract Paper"
                      isLoading={abstarctLoading}
                    />
                  </div>
                  <div className="d-flex justify-content-center gap-4 mt-3">
                    <Button
                      isRounded
                      text="Cancel"
                      onClick={onHide}
                      btnStyle="light-outline"
                      className="cps-30 cpe-30"
                    />
                    <Button
                      isRounded
                      text="Done"
                      onClick={handleSubmit}
                      btnStyle="primary-dark"
                      btnLoading={btnLoading}
                      className="cps-30 cpe-30"
                      disabled={isEqual(values, initialValues)}
                    />
                  </div>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default AllocateProject;
