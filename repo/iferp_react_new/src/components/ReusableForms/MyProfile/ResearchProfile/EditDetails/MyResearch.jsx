import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { cloneDeep, isEqual, some } from "lodash";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import { addResearchId } from "store/slices";
import { researchType } from "utils/constants";

const MyResearch = ({ onHide, isEdit, getProfileData }) => {
  const dispatch = useDispatch();
  const { researchProfile } = useSelector((state) => ({
    researchProfile: state.student.researchProfile,
  }));
  const { research_id } = researchProfile || {};
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    const payload = { research_id: JSON.stringify(values.researchIds) };
    const response = await dispatch(addResearchId(payload));
    if (response?.status === 200) {
      getProfileData();
      onHide();
    }
    setBtnLoading(false);
  };

  const validationSchema = Yup.object().shape({
    researchIds: Yup.array(
      Yup.object({
        name: Yup.string().required("ID name is required."),
        number: Yup.string().required("ID number/link is required."),
      })
    ),
  });
  const initialValues = {
    researchIds: isEdit
      ? research_id
      : [
          {
            id: "",
            name: "",
            number: "",
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
        const isAddMore = some(values.researchIds, (o) => !o.name || !o.number);
        return (
          <form>
            <div className="row">
              {values.researchIds.map((elem, index) => {
                const { name, number } = elem;
                const { name: errName, number: errNumber } =
                  errors?.researchIds?.[index] || {};
                let newID = name ? [{ id: name, label: name }] : [];
                researchType.forEach((elm) => {
                  let thisExist = values.researchIds?.find(
                    (o) => o.name === elm?.id
                  );
                  if (!thisExist) {
                    newID.push(elm);
                  }
                });

                return (
                  <React.Fragment key={index}>
                    <div className="cmb-22">
                      <Dropdown
                        label={`ID Name ${index + 1}*`}
                        placeholder="Select id name"
                        options={newID}
                        id={`researchIds[${index}][name]`}
                        value={name}
                        error={errName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="cmb-22">
                      <TextInput
                        label={`ID Number/Link ${index + 1}*`}
                        placeholder="Enter ID Number/Link"
                        onChange={handleChange}
                        value={number}
                        error={errNumber}
                        id={`researchIds[${index}][number]`}
                      />
                    </div>
                    <div
                      className={`d-flex gap-3 ${
                        values.researchIds.length - 1 === index ? "" : " cmb-22"
                      }`}
                    >
                      {values.researchIds.length - 1 === index && (
                        <Button
                          isSquare
                          text="+ Add Another ID"
                          btnStyle="primary-light"
                          className="h-35 text-14-500"
                          disabled={isAddMore}
                          onClick={() => {
                            setFieldValue("researchIds", [
                              ...values.researchIds,
                              {
                                id: "",
                                name: "",
                                number: "",
                              },
                            ]);
                          }}
                        />
                      )}
                      {values?.researchIds.length > 1 && (
                        <Button
                          isSquare
                          text="Delete"
                          btnStyle="primary-gray"
                          icon={<i className="bi bi-trash me-2" />}
                          className="cpt-5 cpb-5 cps-10 cpe-10 h-35"
                          onClick={() => {
                            const listArray = cloneDeep(values?.researchIds);
                            listArray.splice(index, 1);
                            setFieldValue("researchIds", listArray);
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
export default MyResearch;
