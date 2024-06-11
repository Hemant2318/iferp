import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { isEqual, map, omit } from "lodash";
import moment from "moment";
import * as Yup from "yup";
import { Formik } from "formik";
import Button from "components/form/Button";
import Label from "components/form/Label";
import DatePicker from "components/form/DatePicker";
import RadioInput from "components/form/RadioInput";
import TextInput from "components/form/TextInput";
import Dropdown from "components/form/Dropdown";
import Location from "components/form/Location";
import FileUpload from "components/form/FileUpload";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import MultipleSelect from "components/form/MultipleSelect";
import CheckBox from "components/form/CheckBox";
import { icons, eventMode, virtualPlatform, adminRoute } from "utils/constants";
import {
  getDataFromLocalStorage,
  getFilenameFromUrl,
  getFormDataArrayObject,
  objectToFormData,
  trimAllSpace,
  trimLeftSpace,
} from "utils/helpers";
import {
  addEvent,
  editEvent,
  fetchAllResources,
  fetchChapters,
  fetchSIGGroup,
  getEvent,
  showSuccess,
  storeEventData,
  throwError,
} from "store/slices";
import ImportantDates from "./ImportantDates";
import CommitteeMember from "./CommitteeMember";
import Speaker from "./Speaker";
import Registration from "./Registration";
import Gallery from "./Gallery";
import CreatableCityDropDown from "components/form/CreatableCityDropDown";
import TextArea from "components/form/TextArea";
import MultipleFileUpload from "components/form/MultipleFileUpload";
import "./EventForm.scss";

const EventForm = () => {
  const params = useParams();
  const isEdit = params?.eventId !== "add-event" ? true : false;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    membershipList,
    eventTypeList,
    eventData,
    comitteeMemberCategoryList,
  } = useSelector((state) => ({
    membershipList: state.global.membershipList,
    eventTypeList: state.global.eventTypeList,
    eventData: state.global.eventData,
    comitteeMemberCategoryList: state.global.comitteeMemberCategoryList,
  }));

  const [isFormLoading, setIsFormLoading] = useState(isEdit);
  const [isPastEvent, setIsPastEvent] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [resourceList, setResourceList] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    event_type_id: "",
    event_name: "",
    event_short_name: "",
    start_date: "",
    end_date: "",
    country: "",
    country_name: "",
    city: "",
    associated_with_chapter: "",
    chapter_id: "",
    special_interest_groups: "",
    ocm_categories_id: "",
    resources_id: "",
    brochure_image: "",
    brochureFileName: "",
    poster_image: "",
    posterFileName: "",
    send_to: "",
    event_mode: "",
    virtual_platform: "",
    virtual_platform_link: "",
    about_the_conference: "",
    organizer_name: "",
    cover_image: "",
    coverImageFileName: "",
  });
  const handleRedirect = () => {
    if (localStorage.prevRoute) {
      navigate(localStorage.prevRoute);
    } else {
      navigate(-1);
    }
  };
  const getGroups = async () => {
    const response = await dispatch(fetchSIGGroup());
    const apiData = response?.data || [];
    setGroupList(apiData);
  };
  const getChapters = async () => {
    const response = await dispatch(fetchChapters({}));
    const apiData = response?.data || [];
    setChapterList(apiData);
  };
  const handelSave = (values) => {
    setBtnLoading(true);
    if (isEdit) {
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
        "coverImageFileName",
      ]);
      payloadObject = {
        ...payloadObject,
        type: 4,
        id: params?.eventId,
        event_type: values.event_type_id,
      };
      handelEditEvent(payloadObject);
    } else {
      handelAddEvent(values);
    }
  };
  const handelAddEvent = async (values) => {
    const payload = {
      ...values,
      event_type: values.event_type_id,
    };
    const formDataPayload = getFormDataArrayObject(payload);

    const response = await dispatch(addEvent(formDataPayload));
    if (response?.status === 200) {
      setIsFormLoading(true);
      navigate(
        `${adminRoute.eventManagement}/events/${response?.data?.event_id}`
      );
      dispatch(showSuccess("Event add successfully."));
    }
    setBtnLoading(false);
  };
  const handelEditEvent = async (values) => {
    const payload = getFormDataArrayObject(values);
    const response = await dispatch(editEvent(payload));
    if (response?.status === 200) {
      setIsFormLoading(true);
      fetchEventDetails();
      dispatch(showSuccess("Event update successfully."));
    }
    setBtnLoading(false);
  };
  const fetchEventDetails = async () => {
    await dispatch(getEvent(params?.eventId));
    setIsFormLoading(false);
  };
  const getResources = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchAllResources(forData));
    const resList = response?.data?.resource_users || [];
    setResourceList(
      map(resList, (elm) => {
        return { ...elm, label: `${elm.first_name} ${elm.last_name}` };
      })
    );
  };
  useEffect(() => {
    let userType = getDataFromLocalStorage("user_type");
    if (["0", "6"].includes(userType)) {
      getGroups();
      getChapters();
      getResources();
      if (isEdit) {
        fetchEventDetails();
      }
    } else {
      navigate("/");
    }

    return () => {
      dispatch(storeEventData({}));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.eventId]);
  useEffect(() => {
    if (eventData) {
      setInitialValues({
        ...initialValues,
        ...eventData,
        brochureFileName: eventData?.brochure_path || "",
        brochure_image: eventData?.brochure_path || "",
        posterFileName: eventData?.poster_path || "",
        poster_image: eventData?.poster_path || "",
        coverImageFileName: eventData?.cover_image || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData]);

  const validationSchema = Yup.object().shape({
    event_type_id: Yup.string().required("Event type is required."),
    event_name: Yup.string().required("Event name is required."),
    start_date: Yup.string().required("Start date is required."),
    end_date: Yup.string().required("End date is required."),
    // country: Yup.string().required("Country is required."),
    // city: Yup.string().required("locations is required."),
    associated_with_chapter: Yup.string().required(
      "Select associated with chapter."
    ),
    chapter_id: Yup.string().when("associated_with_chapter", {
      is: (val) => `${val}` === `${1}`,
      then: Yup.string().required("Chapter is required"),
    }),
    special_interest_groups: Yup.string().required(
      "Special interest groups is required."
    ),
    ocm_categories_id: Yup.string().required(
      "Committee member category is required."
    ),
    resources_id: Yup.string().required("Resource Co-ordinator is required."),
    brochure_image: Yup.string().required("Brochure image is required."),
    poster_image: Yup.string().required("Poster image is required."),
    send_to: Yup.string().required("Send to is required."),
    event_mode: Yup.string().required("Event mode is required."),
    country: Yup.string().when("event_mode", {
      is: (val) => val !== "Virtual",
      then: Yup.string().required("Country is required."),
    }),
    // city: Yup.string().when("event_mode", {
    //   is: (val) => val !== "Virtual",
    //   then: Yup.string().required("City is required."),
    // }),
    virtual_platform: Yup.string().when("event_mode", {
      is: (val) => val === "Virtual" || val === "Hybrid",
      then: Yup.string().required("Virtual platform is required."),
    }),
    virtual_platform_link: Yup.lazy((value, obj) => {
      const { event_mode } = obj?.parent;
      if (event_mode === "Virtual" || event_mode === "Hybrid") {
        return Yup.string()
          .required("Virtual platform link is required.")
          .url("Enter correct url.");
      } else {
        return Yup.string().url("Enter correct url.");
      }
    }),
    about_the_conference: Yup.string().max(
      500,
      "Maximum 500 character are allow."
    ),
  });
  return (
    <div id="event-form-container">
      <Card className="cps-24 cpt-12 cpb-12 d-flex align-items-center cmb-12 ">
        <span className="d-flex" onClick={handleRedirect}>
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <span className="text-16-400 color-black-olive">{`${
          isEdit ? "Edit" : "Add"
        } Event`}</span>
      </Card>

      {isFormLoading ? (
        <Card className="cmb-24 cps-30 cpe-30 cpt-40 cpb-40 d-flex align-items-center justify-content-center">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          <Card className="cps-30 cpe-30 cpt-38 cmb-30 fadeInUp">
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handelSave}
            >
              {(props) => {
                const {
                  values,
                  errors,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                  resetForm,
                } = props;
                return (
                  <form className="row">
                    {!isEdit && (
                      <div className="d-flex justify-content-end align-items-center gap-2 cmb-24">
                        <div className="center-flex">
                          <CheckBox
                            className="checkbox-size-24"
                            type="PRIMARY-ACTIVE"
                            onClick={() => {
                              setIsPastEvent(!isPastEvent);
                              setFieldValue("start_date", "");
                              setFieldValue("end_date", "");
                            }}
                            isChecked={isPastEvent}
                          />
                        </div>
                        <div className="ms-2">Past Event</div>
                      </div>
                    )}
                    <div className="col-md-6 cmb-24">
                      <Dropdown
                        label="Event Type"
                        placeholder="Select Event Type"
                        id="event_type_id"
                        optionKey="id"
                        optionValue="name"
                        options={eventTypeList}
                        value={values.event_type_id}
                        error={errors.event_type_id}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      <TextInput
                        label="Event Short Name"
                        id="event_short_name"
                        value={values.event_short_name}
                        error={errors.event_short_name}
                        placeholder="Enter Event Name"
                        onChange={(e) => {
                          setFieldValue(
                            "event_short_name",
                            trimAllSpace(e.target.value.toUpperCase())
                          );
                        }}
                      />
                    </div>
                    <div className="cmb-24">
                      <TextInput
                        label="Event Name"
                        id="event_name"
                        value={values.event_name}
                        error={errors.event_name}
                        placeholder="Enter Event Name"
                        onChange={(e) => {
                          setFieldValue(
                            "event_name",
                            trimLeftSpace(e.target.value)
                          );
                        }}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      <DatePicker
                        id="start_date"
                        minDate={isPastEvent ? null : moment()}
                        maxDate={isPastEvent ? moment() : null}
                        placeholder="Select Date"
                        value={values.start_date}
                        error={errors.start_date}
                        onChange={(e) => {
                          setFieldValue("end_date", "");
                          handleChange(e);
                        }}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      <DatePicker
                        id="end_date"
                        placeholder="Select Date"
                        onChange={handleChange}
                        value={values.end_date}
                        error={errors.end_date}
                        disabled={!values.start_date}
                        minDate={values.start_date}
                        maxDate={isPastEvent ? moment() : null}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      <Location
                        type="country"
                        data={{
                          id: "country",
                          placeholder: "Select Country",
                          value: values.country,
                          error: errors.country,
                          onChange: (e) => {
                            setFieldValue(
                              "country_name",
                              e?.target?.data?.country || ""
                            );
                            handleChange(e);
                          },
                          isClearable: true,
                        }}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      {/* <Location
                        type="city"
                        data={{
                          id: "city",
                          placeholder: "Select City",
                          value: values.city,
                          error: errors.city,
                          countryId: values.country,
                          onChange: handleChange,
                          disabled: !values.country,
                          isClearable: true,
                        }}
                      /> */}
                      <CreatableCityDropDown
                        id="city"
                        disabled={!values.country}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        value={values.city}
                        error={errors.city}
                        countryId={values?.country_name}
                        isClearable
                      />
                    </div>
                    {+values?.city === 586 && (
                      <div className="col-md-6 cmb-24 d-block">
                        <TextInput
                          placeholder="Add Other City"
                          id="other_city"
                          value={values.other_city}
                          error={errors.other_city}
                          onChange={handleChange}
                        />
                      </div>
                    )}
                    <div className="col-md-6 d-flex align-items-center cmb-24">
                      <div className="row">
                        <div className="col-md-7 d-flex">
                          <Label label="Associated With Chapter" required />
                        </div>
                        <div className="col-md-5 d-flex">
                          <RadioInput
                            label="Yes"
                            className="pe-4"
                            value={1}
                            onChange={() => {
                              setFieldValue("chapter_id", "");
                              setFieldValue("associated_with_chapter", 1);
                            }}
                            checked={values.associated_with_chapter === 1}
                          />
                          <RadioInput
                            label="No"
                            value={0}
                            onChange={() => {
                              setFieldValue("chapter_id", "");
                              setFieldValue("associated_with_chapter", 0);
                            }}
                            checked={values.associated_with_chapter === 0}
                          />
                        </div>
                        <div
                          className="text-13-400 pt-1"
                          style={{ color: "red" }}
                        >
                          {errors.associated_with_chapter}
                        </div>
                      </div>
                    </div>
                    {values.associated_with_chapter === 1 && (
                      <div className="col-md-6 cmb-24">
                        <Dropdown
                          placeholder="Select Chapter"
                          id="chapter_id"
                          options={chapterList}
                          value={values.chapter_id}
                          error={errors.chapter_id}
                          optionKey="id"
                          optionValue="chapter_name"
                          onChange={handleChange}
                        />
                      </div>
                    )}
                    <div className="cmb-24">
                      <MultipleSelect
                        label="Special Interest Groups"
                        placeholder="Select Special Interest Groups"
                        id="special_interest_groups"
                        value={values.special_interest_groups}
                        error={errors.special_interest_groups}
                        options={groupList}
                        optionKey="id"
                        optionValue="name"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="cmb-24">
                      <MultipleSelect
                        label="Committee Member Category"
                        placeholder="Select Committee Member Category"
                        id="ocm_categories_id"
                        value={values.ocm_categories_id}
                        error={errors.ocm_categories_id}
                        options={comitteeMemberCategoryList}
                        optionKey="id"
                        optionValue="name"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="cmb-24">
                      <MultipleSelect
                        label="Resource Co-ordinator"
                        placeholder="Select Resource Co-ordinator"
                        id="resources_id"
                        value={values.resources_id}
                        error={errors.resources_id}
                        options={resourceList.filter((o) => o.role === "2")}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      <FileUpload
                        label="Brochure"
                        fileText={getFilenameFromUrl(values.brochureFileName)}
                        id="brochure_image"
                        onChange={(e) => {
                          const value = e.target.value;
                          const fileName = e.target.fileName;
                          let fileType = fileName
                            ? fileName?.split(".")?.pop()
                            : "";
                          if (
                            ["png", "jpg", "jpeg", "pdf"].includes(fileType)
                          ) {
                            setFieldValue("brochure_image", value);
                            setFieldValue("brochureFileName", fileName);
                          } else {
                            setFieldValue("brochureFileName", "");
                            dispatch(
                              throwError({
                                message: "Invalid file selected",
                              })
                            );
                          }
                        }}
                        value={values.brochure_image}
                        error={errors.brochure_image}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      <FileUpload
                        label="Poster"
                        fileType="image"
                        fileText={getFilenameFromUrl(values.posterFileName)}
                        id="poster_image"
                        onChange={(e) => {
                          const value = e.target.value;
                          const fileName = e.target.fileName;
                          let fileType = fileName
                            ? fileName?.split(".")?.pop()
                            : "";
                          if (["png", "jpg", "jpeg"].includes(fileType)) {
                            setFieldValue("poster_image", value);
                            setFieldValue("posterFileName", fileName);
                          } else {
                            setFieldValue("posterFileName", "");
                            dispatch(
                              throwError({
                                message: "Invalid file selected",
                              })
                            );
                          }
                        }}
                        value={values.poster_image}
                        error={errors.poster_image}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      <MultipleSelect
                        label="Send To"
                        placeholder="Select membership"
                        id="send_to"
                        value={values.send_to}
                        error={errors.send_to}
                        options={[
                          { id: "ALL", name: "ALL" },
                          ...membershipList,
                        ]}
                        optionKey="id"
                        optionValue="name"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      <Dropdown
                        label="Event Mode"
                        placeholder="Select Any"
                        id="event_mode"
                        options={eventMode}
                        value={values.event_mode}
                        error={errors.event_mode}
                        optionKey="value"
                        optionValue="value"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      <Dropdown
                        label="Virtual Platform"
                        placeholder="Select Virtual Platform"
                        id="virtual_platform"
                        options={virtualPlatform}
                        value={values.virtual_platform}
                        error={errors.virtual_platform}
                        optionKey="value"
                        optionValue="value"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      <TextInput
                        label={`${values.virtual_platform} Link`}
                        placeholder="https://"
                        id="virtual_platform_link"
                        onChange={handleChange}
                        value={values.virtual_platform_link}
                        error={errors.virtual_platform_link}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      <TextInput
                        label="Organization Name"
                        placeholder="Enter Organization Name"
                        id="organizer_name"
                        onChange={(e) =>
                          handleChange({
                            target: {
                              id: "organizer_name",
                              value: trimLeftSpace(e.target.value),
                            },
                          })
                        }
                        value={values.organizer_name}
                      />
                    </div>
                    <div className="col-md-6 cmb-24">
                      <MultipleFileUpload
                        isMultiple
                        label="Cover Image"
                        fileType="image"
                        fileText={getFilenameFromUrl(values.coverImageFileName)}
                        id="cover_image"
                        onChange={(e) => {
                          const value = e.target.value;
                          const fileNames = e.target.fileNames;
                          const fileType = Array.isArray(fileNames)
                            ? fileNames?.map((e) => e?.split(".")?.pop())
                            : "";
                          const isValid = fileType?.every((extension) =>
                            ["png", "jpg", "jpeg"].includes(extension)
                          );

                          if (isValid) {
                            setFieldValue("cover_image", value);
                            setFieldValue("coverImageFileName", fileNames);
                          } else {
                            setFieldValue("coverImageFileName", "");
                            dispatch(
                              throwError({
                                message: "Invalid file selected",
                              })
                            );
                          }
                        }}
                        value={values.cover_image}
                      />
                    </div>

                    <div className="col-md-6 cmb-24">
                      <TextArea
                        rows={3}
                        label="Description"
                        placeholder="Enter Description of Your Organization"
                        value={values.about_the_conference}
                        error={errors.about_the_conference}
                        id="about_the_conference"
                        onChange={(e) =>
                          handleChange({
                            target: {
                              id: "about_the_conference",
                              value: trimLeftSpace(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    {/* <div className="col-md-6 cmb-24">
                      <Label label="Preview" />
                      <span className="d-flex gap-3 align-items-center cmt-10">
                        {values?.cover_image?.length > 0 &&
                          values?.cover_image?.map((elem, index) => {
                            return <FilePreview url={elem} key={index} />;
                          })}
                      </span>
                    </div> */}
                    <div className="d-flex justify-content-center gap-4 cmt-24 cpb-46">
                      <Button
                        isRounded
                        text={isEdit ? "Reset" : "Cancel"}
                        btnStyle="light-outline"
                        className="cps-40 cpe-40"
                        onClick={resetForm}
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
                  </form>
                );
              }}
            </Formik>
          </Card>
          <ImportantDates
            eventId={params.eventId}
            fetchEventDetails={fetchEventDetails}
          />
          <CommitteeMember
            toggleTitle="Add Committee Member"
            eventId={params.eventId}
            fetchEventDetails={fetchEventDetails}
          />
          <Speaker
            toggleTitle="Add Speaker"
            eventId={params.eventId}
            fetchEventDetails={fetchEventDetails}
          />
          <Registration
            eventId={params.eventId}
            fetchEventDetails={fetchEventDetails}
          />
          <Gallery
            eventId={params.eventId}
            fetchEventDetails={fetchEventDetails}
          />
        </>
      )}
    </div>
  );
};
export default EventForm;
