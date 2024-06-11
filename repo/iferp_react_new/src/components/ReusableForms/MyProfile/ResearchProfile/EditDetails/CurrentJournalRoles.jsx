import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { cloneDeep, isEqual, some } from "lodash";
import TextInput from "components/form/TextInput";
import Button from "components/form/Button";
import { addJournalRoles } from "store/slices";

const CurrentJournalRoles = ({ onHide, isEdit, getProfileData }) => {
  const dispatch = useDispatch();
  const { researchProfile } = useSelector((state) => ({
    researchProfile: state.student.researchProfile,
  }));
  const { current_journal_roles } = researchProfile || {};
  const [btnLoading, setBtnLoading] = useState(false);
  const handelSave = async (values) => {
    setBtnLoading(true);
    const payload = { journal_roles: JSON.stringify(values.journal_roles) };
    const response = await dispatch(addJournalRoles(payload));
    if (response?.status === 200) {
      getProfileData();
      onHide();
    }
    setBtnLoading(false);
  };
  const validationSchema = Yup.object().shape({
    journal_roles: Yup.array(
      Yup.object({
        role: Yup.string().required("Role is required."),
        journals: Yup.string().required("Journals is required."),
      })
    ),
  });
  const initialValues = {
    journal_roles: isEdit
      ? current_journal_roles
      : [
          {
            id: "",
            role: "",
            journals: "",
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
          values.journal_roles,
          (o) => !o.role || !o.journals
        );
        return (
          <form>
            <div className="row">
              {values.journal_roles.map((elem, index) => {
                const { role, journals } = elem;
                const { role: errRole, journals: errJournals } =
                  errors?.journal_roles?.[index] || {};
                return (
                  <React.Fragment key={index}>
                    <div className="cmb-22">
                      <TextInput
                        label="Role*"
                        placeholder="Enter a role (e.g., Guest Editor)"
                        onChange={handleChange}
                        value={role}
                        error={errRole}
                        id={`journal_roles[${index}][role]`}
                      />
                    </div>
                    <div className="cmb-22">
                      <TextInput
                        label="Journals*"
                        placeholder="Enter Jounal where you have this role"
                        id={`journal_roles[${index}][journals]`}
                        value={journals}
                        error={errJournals}
                        onChange={handleChange}
                      />
                    </div>
                    <div
                      className={`d-flex gap-3 ${
                        values.journal_roles.length - 1 === index
                          ? ""
                          : " cmb-22"
                      }`}
                    >
                      {values.journal_roles.length - 1 === index && (
                        <Button
                          isSquare
                          text="+ Add Another Role"
                          btnStyle="primary-light"
                          className="h-35 text-14-500"
                          disabled={isAddMore}
                          onClick={() => {
                            setFieldValue("journal_roles", [
                              ...values.journal_roles,
                              { id: "", role: "", journals: "" },
                            ]);
                          }}
                        />
                      )}
                      {values?.journal_roles.length > 1 && (
                        <Button
                          isSquare
                          text="Delete"
                          btnStyle="delete-outline"
                          icon={<i className="bi bi-trash me-2" />}
                          className="cpt-5 cpb-5 cps-10 cpe-10"
                          onClick={() => {
                            const listArray = cloneDeep(values?.journal_roles);
                            listArray.splice(index, 1);
                            setFieldValue("journal_roles", listArray);
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
export default CurrentJournalRoles;
