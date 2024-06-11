import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { Formik } from "formik";
import Modal from "components/Layout/Modal";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Location from "components/form/Location";
import DatePicker from "components/form/DatePicker";
import { objectToFormData, titleCaseString } from "utils/helpers";
import { addCareerEvents } from "store/slices";

const CareerEventsForm = ({
  editData,
  onHide,
  type,
  handelSuccess,
  careerId,
}) => {
  const dispatch = useDispatch();
  const getTitle = () => {
    let returnValue = "";
    switch (type) {
      case 1:
        returnValue = "Industrial Visit";
        break;
      case 3:
        returnValue = "Internship";
        break;
      case 4:
        returnValue = "Placement Drive";
        break;

      default:
        break;
    }
    return returnValue;
  };
  const getPayload = (objectData) => {
    let returnValue = { career_id: careerId };
    const {
      company_name,
      date,
      country,
      city,
      internship_name,
      duration,
      organization_name,
      organized_by_iferp,
    } = objectData;
    switch (type) {
      case 1:
        returnValue = { ...returnValue, company_name, date, country, city };
        break;
      case 3:
        returnValue = {
          ...returnValue,
          company_name,
          date,
          country,
          city,
          internship_name,
          duration,
        };
        break;
      case 4:
        returnValue = {
          ...returnValue,
          organization_name,
          organized_by_iferp,
          date,
          country,
          city,
        };
        break;

      default:
        break;
    }
    return returnValue;
  };
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = (values) => {
    setBtnLoading(true);
    const objectPayload = getPayload(values);
    if (editData) {
      handelAddData({ ...objectPayload, career_event_id: editData.id });
    } else {
      handelAddData(objectPayload);
    }
  };
  const handelAddData = async (values) => {
    let forData = objectToFormData(values);
    const response = await dispatch(addCareerEvents(forData));
    if (response?.status === 200) {
      handelSuccess();
      onHide();
    } else {
      setBtnLoading(false);
    }
  };
  const validationSchema = Yup.object().shape({
    internship_name: Yup.string().when("type", {
      is: () => type === 3,
      then: Yup.string().required("Internship name is required"),
    }),
    duration: Yup.string().when("type", {
      is: () => type === 3,
      then: Yup.string().required("Duration is required"),
    }),
    company_name: Yup.string().when("type", {
      is: () => type !== 4,
      then: Yup.string().required("Company name is required"),
    }),
    organization_name: Yup.string().when("type", {
      is: () => type === 4,
      then: Yup.string().required("Organization name is required"),
    }),
    organized_by_iferp: Yup.string().when("type", {
      is: () => type === 4,
      then: Yup.string().required("Organized by IFERP is required"),
    }),
    date: Yup.string().required("Date is required."),
    country: Yup.string().required("Country is required."),
    // city: Yup.string().required("City is required."),
  });
  const initialValues = {
    date: editData?.date || "",
    country: editData?.country || "",
    city: editData?.city || "",
    company_name: editData?.event_name || "",
    internship_name: editData?.internship_name || "",
    organization_name: editData?.organization_name || "",
    organized_by_iferp: "Organized By IFERP",
    duration: editData?.duration || "",
  };
  return (
    <Modal
      onHide={onHide}
      title={editData ? `Edit ${getTitle()}` : `Add ${getTitle()}`}
      size="md"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handelSave}
        validationSchema={validationSchema}
      >
        {(props) => {
          const { values, errors, handleChange, handleSubmit, setFieldValue } =
            props;
          return (
            <form>
              <div className="row cmt-34 cms-20 cme-20 cmb-24">
                {type === 3 && (
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      placeholder="Internship Name"
                      id="internship_name"
                      onChange={(e) => {
                        setFieldValue("internship_name", e.target.value);
                      }}
                      value={values.internship_name}
                      error={errors.internship_name}
                    />
                  </div>
                )}
                {type !== 4 && (
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      placeholder="Company Name"
                      id="company_name"
                      onChange={(e) => {
                        setFieldValue("company_name", e.target.value);
                      }}
                      value={values.company_name}
                      error={errors.company_name}
                    />
                  </div>
                )}
                {type === 4 && (
                  <>
                    <div className="col-md-12 cmb-22">
                      <TextInput
                        placeholder="Institution / Organization Name"
                        id="organization_name"
                        onChange={(e) => {
                          setFieldValue("organization_name", e.target.value);
                        }}
                        value={values.organization_name}
                        error={errors.organization_name}
                      />
                    </div>
                    <div className="col-md-12 cmb-22">
                      <TextInput
                        onChange={() => {}}
                        value={values.organized_by_iferp}
                        disabled
                      />
                    </div>
                  </>
                )}

                <div className="col-md-12 cmb-22">
                  <DatePicker
                    placeholder="Date"
                    id="date"
                    onChange={handleChange}
                    value={values.date}
                    error={errors.date}
                  />
                </div>
                {type === 3 && (
                  <div className="col-md-12 cmb-22">
                    <TextInput
                      placeholder="Duration"
                      id="duration"
                      onChange={(e) => {
                        setFieldValue(
                          "duration",
                          titleCaseString(e.target.value)
                        );
                      }}
                      value={values.duration}
                      error={errors.duration}
                    />
                  </div>
                )}
                <div className="col-md-12 cmb-22">
                  <Location
                    type="country"
                    data={{
                      id: "country",
                      placeholder: "Country",
                      value: values.country,
                      error: errors.country,
                      onChange: handleChange,
                    }}
                  />
                </div>
                <div className="col-md-12 cmb-22">
                  <Location
                    type="city"
                    data={{
                      id: "city",
                      placeholder: "City",
                      value: values.city,
                      error: errors.city,
                      countryId: values.country,
                      onChange: handleChange,
                      disabled: !values.country,
                    }}
                  />
                </div>

                <div className="d-flex justify-content-center gap-4 cmt-30">
                  <Button
                    text="Cancel"
                    isRounded
                    btnStyle="light-outline"
                    className="cps-40 cpe-40"
                    onClick={onHide}
                  />
                  <Button
                    text="Submit"
                    isRounded
                    btnStyle="primary-dark"
                    className="cps-40 cpe-40"
                    btnLoading={btnLoading}
                    onClick={handleSubmit}
                    disabled={isEqual(initialValues, values)}
                  />
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
};
export default CareerEventsForm;
