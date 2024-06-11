import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { cloneDeep, isEqual, some } from "lodash";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import DatePicker from "components/form/DatePicker";
import Dropdown from "components/form/Dropdown";
import { addAchievements } from "store/slices";

const Achievements = ({ onHide, isEdit, getProfileData }) => {
  const dispatch = useDispatch();
  const { researchProfile } = useSelector((state) => ({
    researchProfile: state.student.researchProfile,
  }));
  const { achievements } = researchProfile || {};
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    const payload = { achievements: JSON.stringify(values.achievements) };
    const response = await dispatch(addAchievements(payload));
    if (response?.status === 200) {
      getProfileData();
      onHide();
    }
    setBtnLoading(false);
  };

  const validationSchema = Yup.object().shape({
    achievements: Yup.array(
      Yup.object({
        award_name: Yup.string().required("Award name is required."),
        event_name: Yup.string().required("Event is required."),
        date: Yup.string().required("Date is required."),
        category: Yup.string().required("Category is required."),
      })
    ),
  });
  const initialValues = {
    achievements: isEdit
      ? achievements
      : [
          {
            id: "",
            award_name: "",
            event_name: "",
            category: "",
            date: "",
          },
        ],
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handelSave}
      validationSchema={validationSchema}
    >
      {(props) => {
        const { values, errors, handleChange, setFieldValue, handleSubmit } =
          props;
        const isAddMore = some(
          values.achievements,
          (o) => !o.award_name || !o.event_name
        );
        return (
          <form>
            <div className="row">
              {values.achievements.map((elem, index) => {
                const { award_name, event_name, date, category } = elem;
                const {
                  award_name: errAward,
                  event_name: errEvent,
                  date: errDate,
                  category: errCategory,
                } = errors?.achievements?.[index] || {};
                return (
                  <React.Fragment key={index}>
                    <div className="cmb-22">
                      <TextInput
                        label="Award/Certificate Name*"
                        placeholder="Enter Award/Certificate Name"
                        onChange={handleChange}
                        value={award_name}
                        error={errAward}
                        id={`achievements[${index}][award_name]`}
                      />
                    </div>
                    <div className="cmb-22">
                      <TextInput
                        label="Event Name*"
                        placeholder="Enter Event Name"
                        id={`achievements[${index}][event_name]`}
                        value={event_name}
                        error={errEvent}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="cmb-22">
                      <Dropdown
                        label="Category*"
                        placeholder="Select Category"
                        id={`achievements[${index}][category]`}
                        options={[
                          {
                            id: "Honor",
                            label: "Honor",
                          },
                          {
                            id: "Elected",
                            label: "Elected",
                          },
                        ]}
                        value={category}
                        error={errCategory}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="cmb-22">
                      <DatePicker
                        label="Date*"
                        placeholder="Select Date"
                        id={`achievements[${index}][date]`}
                        value={date}
                        error={errDate}
                        onChange={handleChange}
                      />
                    </div>
                    <div
                      className={`d-flex gap-3 ${
                        values.achievements.length - 1 === index
                          ? ""
                          : " cmb-22"
                      }`}
                    >
                      {values.achievements.length - 1 === index && (
                        <Button
                          isSquare
                          text="+ Add Another Award"
                          btnStyle="primary-light"
                          className="h-35 text-14-500"
                          disabled={isAddMore}
                          onClick={() => {
                            setFieldValue("achievements", [
                              ...values.achievements,
                              {
                                id: "",
                                award_name: "",
                                event_name: "",
                                date: "",
                                category: "",
                              },
                            ]);
                          }}
                        />
                      )}
                      {values?.achievements.length > 1 && (
                        <Button
                          isSquare
                          text="Delete"
                          btnStyle="primary-gray"
                          icon={<i className="bi bi-trash me-2" />}
                          className="cpt-5 cpb-5 cps-10 cpe-10 h-35"
                          onClick={() => {
                            const listArray = cloneDeep(values?.achievements);
                            listArray.splice(index, 1);
                            setFieldValue("achievements", listArray);
                          }}
                        />
                      )}
                    </div>
                  </React.Fragment>
                );
              })}

              <div className="d-flex justify-content-center gap-4 cmt-40">
                <Button
                  isRounded
                  text="Cancel"
                  btnStyle="light-outline"
                  className="cps-40 cpe-40"
                  onClick={onHide}
                />
                <Button
                  isRounded
                  text="Submit"
                  btnStyle="primary-dark"
                  className="cps-40 cpe-40"
                  onClick={handleSubmit}
                  btnLoading={btnLoading}
                  disabled={isEqual(values, initialValues) || isAddMore}
                />
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};
export default Achievements;
