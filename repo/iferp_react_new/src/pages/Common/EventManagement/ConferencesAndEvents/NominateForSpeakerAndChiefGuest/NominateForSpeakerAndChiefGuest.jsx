import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { cloneDeep, isEqual, map, omit } from "lodash";
import * as Yup from "yup";
import { Formik } from "formik";
import Button from "components/form/Button";
import TextInput from "components/form/TextInput";
import FileUpload from "components/form/FileUpload";
import Dropdown from "components/form/Dropdown";
import RadioInput from "components/form/RadioInput";
import Label from "components/form/Label";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import { addEventNomination, getNominatedUsers } from "store/slices";
import {
  getDataFromLocalStorage,
  getFilenameFromUrl,
  objectToFormData,
} from "utils/helpers";

const NominateForSpeakerAndChiefGuest = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [btnLoading, setBtnLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const getProfiles = async () => {
    const response = await dispatch(
      getNominatedUsers({
        event_id: params?.eventId,
        user_id: getDataFromLocalStorage("id"),
      })
    );
    let resList = [];
    if (response?.data) {
      resList = response?.data;
    }
    setUserList(resList);
    setMemberLoading(false);
  };
  useEffect(() => {
    getProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handelSave = async (values) => {
    setBtnLoading(true);
    const nominationDetails = map(values.nomination_details, (elem) => {
      return omit(elem, ["data", "cvFileName"]);
    });
    let forData = objectToFormData({
      nomination_details: JSON.stringify(nominationDetails),
    });
    const response = await dispatch(addEventNomination(forData));
    if (response?.status === 200) {
      navigate(-1);
    }
    setBtnLoading(false);
  };
  const validationSchema = Yup.object().shape({
    nomination_details: Yup.array(
      Yup.object({
        user_id: Yup.string().required("Member is required."),
        nomination_cv: Yup.string().required("CV is required."),
        position: Yup.string().required("Nominate position is required."),
      })
    ),
  });
  const defaultData = [
    {
      user_id: "",
      event_id: params?.eventId,
      nomination_cv: "",
      cvFileName: "",
      position: "",
      data: {},
    },
  ];
  const initialValues = {
    nomination_details: defaultData,
  };
  const {
    company_name,
    company_country_name,
    company_state_name,
    company_city_name,
  } = getDataFromLocalStorage("company_details") || {};
  return (
    <Card className="cps-40 cpe-40 cpt-40 cpb-40">
      <div className="d-flex center-flex position-relative">
        <span
          className="d-flex position-absolute start-0"
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <div className="text-26-500 color-black-olive">
          {"Nominate For Speaker & Chief guest"}
        </div>
      </div>
      <div className="text-15-400 color-black-olive text-center mt-3">
        As a premium IFERP Corporate member you qualify to nomiante a deserving
      </div>
      <div className="text-15-400 color-black-olive text-center">
        premium professional candidate
      </div>

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
            handleSubmit,
            setFieldValue,
            resetForm,
            handleChange,
          } = props;
          const isAddMore = values?.nomination_details.every(
            (o) => o.user_id && o.nomination_cv && o.position
          );

          return (
            <form className="row cmt-40">
              <div className="text-20-400 raisin-color-black cmb-22">
                {"Nominee’s Information"}
              </div>
              {values.nomination_details.map((elem, index) => {
                const { user_id, position, cvFileName, nomination_cv, data } =
                  elem;
                const {
                  user_id: errUserID,
                  position: errPosition,
                  nomination_cv: errNominationCV,
                } = errors?.nomination_details?.[index] || {};
                const {
                  member_id = "",
                  member_type = "",
                  member_email = "",
                  member_phone = "",
                } = data;
                return (
                  <React.Fragment key={index}>
                    {values?.nomination_details.length > 1 && (
                      <div className="d-flex justify-content-end cmb-22">
                        <Button
                          onClick={() => {
                            const listArray = cloneDeep(
                              values?.nomination_details
                            );
                            listArray.splice(index, 1);
                            setFieldValue("nomination_details", listArray);
                          }}
                          btnStyle="delete-outline"
                          icon={
                            <i className="bi bi-trash me-2 d-flex align-items-center" />
                          }
                          text="Delete"
                          className="cpt-5 cpb-5 cps-10 cpe-10"
                          isSquare
                        />
                      </div>
                    )}
                    <div className="col-md-6 cmb-22">
                      <Dropdown
                        placeholder="Select User"
                        id={`nomination_details[${index}][user_id]`}
                        options={userList}
                        optionKey="id"
                        optionValue="name"
                        isLoading={memberLoading}
                        onChange={(e) => {
                          const data = e.target.data;
                          setFieldValue(
                            `nomination_details[${index}][data]`,
                            data
                          );
                          handleChange(e);
                        }}
                        value={user_id}
                        error={errUserID}
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        value={
                          member_id
                            ? `${member_id} - ${member_type}`
                            : member_type
                        }
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        value={member_email}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        value={member_phone}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        value={company_name}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        value="Software Developer"
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        value={company_country_name}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        value={company_state_name}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <TextInput
                        value={company_city_name || ""}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 cmb-22">
                      <FileUpload
                        id={`nomination_details[${index}][nomination_cv]`}
                        onChange={(e) => {
                          const fileName = e.target.fileName;
                          setFieldValue(
                            `nomination_details[${index}][cvFileName]`,
                            fileName
                          );
                          handleChange(e);
                        }}
                        fileText={getFilenameFromUrl(
                          cvFileName || nomination_cv || "CV"
                        )}
                        error={errNominationCV}
                      />
                    </div>
                    <div className="cmb-22">
                      <TextInput
                        value={localStorage.eventName || ""}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="d-flex">
                      <div className="me-5">
                        <Label label="Nominate for the Position of" required />
                      </div>
                      <div className="d-flex flex-grow-1">
                        <RadioInput
                          label="Chief Guest"
                          className="pe-4"
                          value={1}
                          onChange={() => {
                            setFieldValue(
                              `nomination_details[${index}][position]`,
                              "Chief Guest"
                            );
                          }}
                          checked={position === "Chief Guest"}
                        />
                        <RadioInput
                          label="Speaker"
                          value={0}
                          onChange={() => {
                            setFieldValue(
                              `nomination_details[${index}][position]`,
                              "Speaker"
                            );
                          }}
                          checked={position === "Speaker"}
                        />
                      </div>
                    </div>
                    <div className="text-13-400 pt-1" style={{ color: "red" }}>
                      {errPosition}
                    </div>
                  </React.Fragment>
                );
              })}
              <div className="row cmt-12">
                <div className="col-md-6 d-flex">
                  <Button
                    onClick={() => {
                      setFieldValue("nomination_details", [
                        ...values?.nomination_details,
                        ...defaultData,
                      ]);
                    }}
                    text="+ Add Nominee"
                    btnStyle="primary-light"
                    className="h-35 text-14-500"
                    disabled={!isAddMore}
                    isSquare
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center gap-4">
                <Button
                  text="Cancel"
                  isRounded
                  btnStyle="light-outline"
                  className="cps-40 cpe-40"
                  onClick={resetForm}
                />
                <Button
                  text="Submit"
                  isRounded
                  btnStyle="primary-dark"
                  className="cps-40 cpe-40"
                  onClick={handleSubmit}
                  btnLoading={btnLoading}
                  onChange={() => {}}
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
export default NominateForSpeakerAndChiefGuest;
