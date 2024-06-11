import { useEffect, useRef, useState } from "react";
import { find, forEach, isEqual, omit } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import Label from "components/form/Label";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import FileUpload from "components/form/FileUpload";
import { fetchAllEvents } from "store/slices";
import { getFilenameFromUrl } from "utils/helpers";
import RolesAndResponsibilities from "pages/Common/EventManagement/ConferencesAndEvents/ApplyForCommitteeMember/RolesAndResponsibilities";
import InfoField from "./InfoFiled";

const ApplyForCommitteeMember = ({
  handelSaveCareer,
  btnLoading,
  reset,
  setReset,
}) => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const { comitteeMemberCategoryList } = useSelector((state) => ({
    comitteeMemberCategoryList: state.global.comitteeMemberCategoryList,
  }));
  const [isShow, setIsShow] = useState(false);

  const [categoryList, setCategoryList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const fetchEventDetails = async () => {
    const response = await dispatch(fetchAllEvents());
    setEventList(response?.data?.events || []);
  };

  useEffect(() => {
    fetchEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reset) {
      if (formRef.current) {
        formRef.current.resetForm();
      }
    }
    setReset(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  const handelSave = (values) => {
    handelSaveCareer(omit(values, ["photoFileName"]));
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
    photoFileName: "",
  };

  return (
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
                    return elem.id === values.committee_member_category;
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
                  placeholder="Select Conference"
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
                    setFieldValue("committee_member_category", "");
                    handleChange(e);
                    setCategoryList(newList);
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
                  placeholder="Select Committee Member Category"
                  options={categoryList}
                  optionKey="id"
                  optionValue="name"
                  onChange={(e) => {
                    handleChange(e);
                    setIsShow(true);
                  }}
                  value={values.committee_member_category}
                  error={errors?.committee_member_category}
                  disabled={!values.event_id || categoryList.length === 0}
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
                  setFieldValue("photoFileName", fileName);
                  setFieldValue(id, value);
                }}
                fileText={getFilenameFromUrl(
                  values?.photoFileName || values.photo_path
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
  );
};
export default ApplyForCommitteeMember;
