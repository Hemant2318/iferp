import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { find, forEach, isEqual } from "lodash";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import Dropdown from "components/form/Dropdown";
import Label from "components/form/Label";
import FileUpload from "components/form/FileUpload";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import {
  getDataFromLocalStorage,
  getFilenameFromUrl,
  objectToFormData,
} from "utils/helpers";
import {
  applyAsCommitteeMember,
  fetchAllEvents,
  setApiError,
} from "store/slices";
import RolesAndResponsibilities from "./RolesAndResponsibilities";
import InfoField from "pages/Common/CareerSupport/CareerForm/Forms/InfoFiled";

const ApplyForCommitteeMember = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formRef = useRef();
  const { comitteeMemberCategoryList } = useSelector((state) => ({
    comitteeMemberCategoryList: state.global.comitteeMemberCategoryList,
  }));
  const [isShow, setIsShow] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [CMList, setCMList] = useState([]);
  const fetchEventDetails = async () => {
    const response = await dispatch(fetchAllEvents());
    setEventList(response?.data?.events || []);
  };

  useEffect(() => {
    fetchEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handelSave = async (values) => {
    setBtnLoading(true);
    let forData = objectToFormData({
      user_id: getDataFromLocalStorage("id"),
      ...values,
    });
    const response = await dispatch(applyAsCommitteeMember(forData));
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

  const validationSchema = Yup.object().shape({
    event_id: Yup.string().required("Event is required."),
    committee_member_category: Yup.string().required(
      "Committee member category is required."
    ),
    photo_path: Yup.string().required("File is required."),
  });
  const initialValues = {
    event_id: "",
    committee_member_category: "",
    photo_path: "",
    cvFileName: "",
  };

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
        <div className="text-26-500 title-text responsive-title">
          Apply For Committee Member
        </div>
      </div>

      <Formik
        innerRef={formRef}
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
            <form className="row cmt-40">
              {isShow && (
                <RolesAndResponsibilities
                  onHide={() => {
                    setIsShow(false);
                  }}
                  data={
                    find(comitteeMemberCategoryList, (elem) => {
                      return elem.id === values.committee_member_id;
                    }) || {}
                  }
                />
              )}
              <InfoField isInstitution />

              <div className="cmb-22 d-flex align-items-center">
                <div className="me-2">
                  <Label label="Register for" required />
                </div>
                <div className="flex-grow-1">
                  <Dropdown
                    id="event_id"
                    placeholder="Select Conference*"
                    options={eventList}
                    optionKey="id"
                    optionValue="event_name"
                    onChange={(e) => {
                      const ids = e.target?.data?.ocm_categories_id || "";
                      let newList = [];
                      forEach(comitteeMemberCategoryList, (o) => {
                        if (ids.includes(o.id)) {
                          newList.push(o);
                        }
                      });
                      handleChange(e);
                      setCMList(newList);
                    }}
                    value={values.event_id}
                    error={errors?.event_id}
                  />
                </div>
              </div>
              <div className="cmb-22 d-flex align-items-center">
                <div className="me-2">
                  <Label label="Committee Member Category" required />
                </div>
                <div className="flex-grow-1">
                  <Dropdown
                    id="committee_member_category"
                    placeholder="Select Committee Member Category*"
                    options={CMList}
                    optionKey="id"
                    optionValue="name"
                    onChange={(e) => {
                      handleChange(e);
                      setIsShow(true);
                    }}
                    value={values.committee_member_category}
                    error={errors?.committee_member_category}
                  />
                </div>
              </div>

              <div className="col-md-6 cmb-22">
                <FileUpload
                  id="photo_path"
                  onChange={(e) => {
                    const id = e.target.id;
                    const value = e.target.value;
                    const fileName = e.target.fileName;
                    setFieldValue("cvFileName", fileName);
                    setFieldValue(id, value);
                  }}
                  fileText={getFilenameFromUrl(
                    values?.cvFileName || values.photo_path || "Profile Photo*"
                  )}
                  error={errors?.photo_path}
                />
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
export default ApplyForCommitteeMember;
