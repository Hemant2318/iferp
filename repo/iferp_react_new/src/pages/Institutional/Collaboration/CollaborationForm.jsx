import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { isEqual, orderBy } from "lodash";
import Dropdown from "components/form/Dropdown";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import {
  getDataFromLocalStorage,
  getEventDate,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import {
  addCollaboration,
  fetchEventByType,
  fetchAllEvents,
  setApiError,
} from "store/slices";
import moment from "moment";

const CollaborationForm = ({ type }) => {
  const dispatch = useDispatch();
  const { eventType, eventID } = useParams();
  const formRef = useRef();
  const { eventTypeList } = useSelector((state) => ({
    eventTypeList: state.global.eventTypeList,
  }));
  const [btnLoading, setBtnLoading] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [eventListLoading, setEventListLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    const formData = objectToFormData({
      ...values,
      user_id: getDataFromLocalStorage("id"),
      type: values?.type?.replace("-collaboration", ""),
    });
    const response = await dispatch(addCollaboration(formData));
    if (response?.status === 200) {
      dispatch(
        setApiError({
          show: true,
          message: "Data Submit Successfully.",
          type: "success",
        })
      );
      if (formRef.current) {
        formRef.current.resetForm();
      }
    }
    setBtnLoading(false);
  };
  const getEventByType = async (typeID) => {
    setEventListLoading(true);
    const formData = objectToFormData({
      event_type: typeID,
    });
    const response = await dispatch(fetchEventByType(formData));
    const list = response?.data?.event_details.map((o) => {
      return {
        id: o.id,
        event_name: o.event_name,
        start_date: o.event_start_date,
        end_date: o.event_end_date,
        city_name: o.city_name,
        country_name: o.country_name,
        created_id: o.created_id,
      };
    });
    handleEventList(list);
  };
  const getMyEvent = async () => {
    const response = await dispatch(fetchAllEvents());
    const list = response?.data?.events.map((o) => {
      return {
        id: o.id,
        event_name: o.event_name,
        start_date: o.start_date,
        end_date: o.end_date,
        city_name: o.city_name,
        country_name: o.country_name,
        created_id: o.created_id,
      };
    });
    handleEventList(list);
  };
  const handleEventList = (data) => {
    let list = [];
    data?.forEach((o) => {
      const {
        start_date,
        created_id,
        event_name,
        city_name,
        country_name,
        end_date,
      } = o;
      let isFuture =
        moment().diff(moment(start_date, "YYYY-MM-DD"), "days") < 0;
      if (type === "publication-collaboration") {
        isFuture = true;
      }
      if (isFuture && !created_id) {
        list.push({
          ...o,
          label: `${event_name} - ${city_name}, ${country_name} - ${getEventDate(
            start_date,
            end_date
          )}`,
        });
      }
    });
    setEventList(orderBy(list, "start_date"));
    setEventListLoading(false);
  };
  useEffect(() => {
    setEventListLoading(true);
    getMyEvent();
    if (eventType) {
      getEventByType(eventType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validationSchema = Yup.object().shape({
    event_type_id: Yup.string().when("type", {
      is: "conference-collaboration",
      then: Yup.string().required("Event type is required."),
    }),
    event_id: Yup.string().required("Event name is required."),
    institution_representative_name: Yup.string().required("Name is required."),
    institution_representative_designation: Yup.string().required(
      "Designation is required."
    ),
    institution_representative_email_id: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required."),
    institution_representative_contact_no: Yup.string()
      .required("Contact number is required.")
      .min(10, "Phone number must be 10 digit.")
      .max(10, "Phone number must be 10 digit."),
  });
  const initialValues = {
    type: type,
    event_type_id: eventType || "",
    event_id: eventID || "",
    no_of_student_participants: "",
    no_of_faculty_participants: "",
    no_of_publication_in_sij: "",
    no_of_publication_in_wsj: "",
    no_of_publication_in_ugcj: "",
    no_of_publication_in_gsj: "",
    institution_representative_name: "",
    institution_representative_designation: "",
    institution_representative_contact_no: "",
    institution_representative_email_id: "",
  };
  return (
    <Card className="cps-34 cpe-34 cpb-20 cpt-40">
      <div className="text-center text-24-500 title-text cmb-40">
        {`Proposal For ${titleCaseString(type.replace("-", " "))}`}
      </div>
      <Formik
        enableReinitialize
        innerRef={formRef}
        initialValues={initialValues}
        onSubmit={handelSave}
        validationSchema={validationSchema}
      >
        {(props) => {
          const { values, errors, handleSubmit, resetForm, handleChange } =
            props;
          return (
            <form>
              <div className="row">
                <div className="col-md-6 cmb-22">
                  <TextInput value="SRM Engineering College" disabled />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput value="ID - 546793" disabled />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput value="Gold Membership" disabled />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput value="India" disabled />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput value="Tamil Nadu" disabled />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput value="Chennai" disabled />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput value="srmcollege@srmuniv.in" disabled />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput value="044 -86539733" disabled />
                </div>

                {type === "conference-collaboration" ? (
                  <>
                    <div className="col-md-6 cmb-22">
                      <Dropdown
                        placeholder="Event Type*"
                        options={eventTypeList}
                        optionValue="name"
                        id="event_type_id"
                        value={values.event_type_id}
                        error={errors.event_type_id}
                        onChange={(e) => {
                          handleChange(e);
                          getEventByType(e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <Dropdown
                        placeholder="Event Name*"
                        options={eventList}
                        id="event_id"
                        value={values.event_id}
                        error={errors.event_id}
                        onChange={handleChange}
                        isLoading={eventListLoading}
                        disabled={!values.event_type_id}
                      />
                    </div>
                  </>
                ) : (
                  <div className="cmb-22">
                    <Dropdown
                      placeholder="Conference Name*"
                      options={eventList}
                      id="event_id"
                      value={values.event_id}
                      error={errors.event_id}
                      onChange={handleChange}
                    />
                  </div>
                )}
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="No. of Student Participants"
                    id="no_of_student_participants"
                    value={values.no_of_student_participants}
                    error={errors.no_of_student_participants}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="No. of Faculty Participants"
                    id="no_of_faculty_participants"
                    value={values.no_of_faculty_participants}
                    error={errors.no_of_faculty_participants}
                    onChange={handleChange}
                  />
                </div>
                {type === "publication" && (
                  <>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        placeholder="No. of Publications in Scopus Indexed Journals"
                        id="no_of_publication_in_sij"
                        value={values.no_of_publication_in_sij}
                        error={errors.no_of_publication_in_sij}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        placeholder="No.of Publications in Web of Science Journals"
                        id="no_of_publication_in_wsj"
                        value={values.no_of_publication_in_wsj}
                        error={errors.no_of_publication_in_wsj}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        placeholder="No. of Publications in UGC Journals"
                        id="no_of_publication_in_ugcj"
                        value={values.no_of_publication_in_ugcj}
                        error={errors.no_of_publication_in_ugcj}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        placeholder="No. of Publications in Google Scholar Journals"
                        id="no_of_publication_in_gsj"
                        value={values.no_of_publication_in_gsj}
                        error={errors.no_of_publication_in_gsj}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                <div className="text-16-500 color-black-olive cmb-22">
                  Institution’s Representative Details
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Name*"
                    id="institution_representative_name"
                    value={values.institution_representative_name}
                    error={errors.institution_representative_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Designation*"
                    id="institution_representative_designation"
                    value={values.institution_representative_designation}
                    error={errors.institution_representative_designation}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Contact Number*"
                    id="institution_representative_contact_no"
                    value={values.institution_representative_contact_no}
                    error={errors.institution_representative_contact_no}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 cmb-22">
                  <TextInput
                    placeholder="Email ID*"
                    id="institution_representative_email_id"
                    value={values.institution_representative_email_id}
                    error={errors.institution_representative_email_id}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center gap-4 cmt-20 cmb-20">
                <Button
                  text="Cancel"
                  isRounded
                  btnStyle="light-outline"
                  className="cps-50 cpe-50"
                  onClick={resetForm}
                />
                <Button
                  isRounded
                  text="Submit"
                  btnStyle="primary-dark"
                  className="cps-50 cpe-50"
                  onClick={handleSubmit}
                  btnLoading={btnLoading}
                  disabled={isEqual(values, initialValues)}
                />
              </div>
            </form>
          );
        }}
      </Formik>
    </Card>
  );
};
export default CollaborationForm;
