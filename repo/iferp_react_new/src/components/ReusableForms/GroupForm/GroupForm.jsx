import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { cloneDeep } from "lodash";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "../../form/Button";
import TextArea from "../../form/TextArea";
import TextInput from "../../form/TextInput";
import MultipleSelect from "../../form/MultipleSelect";
import Profile from "../../Layout/Profile";
import Loader from "../../Layout/Loader";
import { objectToFormData } from "utils/helpers";
import { addSIGGroup, fetchAllProfiles } from "store/slices";

const GroupForm = ({ onHide, handelSuccess, editData, isPopup }) => {
  const { id, name, interest_category, description, invited_members } =
    editData || {};
  const dispatch = useDispatch();
  const [btnLoader, setButtonLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userList, setUserList] = useState([]);

  const getProfiles = async (obj) => {
    const response = await dispatch(fetchAllProfiles({}));
    setUserList(
      response?.data?.users.map((e) => {
        return { ...e, label: `${e.firstName} ${e.lastName}` };
      }) || []
    );
    setIsLoading(false);
  };
  const handelSave = async (values) => {
    setButtonLoader(true);
    let forData = {
      ...values,
      invited_members: values.invited_members.toString(),
    };
    if (id) {
      forData.id = id;
    }
    const response = await dispatch(addSIGGroup(objectToFormData(forData)));
    if (response?.status === 200) {
      handelSuccess();
    } else {
      setButtonLoader(false);
    }
  };
  useEffect(() => {
    getProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialValues = {
    name: name || "",
    interest_category: interest_category || "",
    description: description || "",
    invited_members: invited_members?.map((o) => `${o.user_id}`) || [],
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    interest_category: Yup.string().required("Interest category is required."),
    description: Yup.string()
      .required("Description is required.")
      .max(100, "Maximum 100 character allow for this field."),
    invited_members: Yup.array().min(1, "Member is required"),
  });
  return (
    <div
      className={window.innerWidth < 700 ? "" : "cmt-34 cms-34 cme-34 cmb-34"}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handelSave}
        validationSchema={validationSchema}
      >
        {(props) => {
          const { values, errors, handleChange, handleSubmit, resetForm } =
            props;
          return (
            <form>
              <div className="row d-flex justify-conent-between align-items-center cmb-26">
                <TextInput
                  placeholder="Group Name"
                  onChange={handleChange}
                  id="name"
                  value={values.name}
                  error={errors.name}
                />
              </div>
              <div className="cmb-22">
                <MultipleSelect
                  placeholder="Select Interest Category"
                  id="interest_category"
                  value={values.interest_category}
                  error={errors.interest_category}
                  onChange={handleChange}
                  optionValue="id"
                  options={[
                    { id: "Computer science" },
                    { id: "Digital technology" },
                  ]}
                />
              </div>
              <div className="row d-flex justify-content-between align-items-center cmb-26">
                <TextArea
                  placeholder="Group Description"
                  onChange={handleChange}
                  id="description"
                  value={values.description}
                  error={errors.description}
                />
              </div>

              <div className="cpt-24 mt-3">
                <div className="text-18-500 color-title-navy font-poppins mb-3">
                  Add Members
                  {errors.invited_members && (
                    <span className="text-13-400 ms-3">
                      <span style={{ color: "red" }}>
                        {errors.invited_members}
                      </span>
                    </span>
                  )}
                </div>
                {isLoading ? (
                  <div className="center-flex pt-5 pb-5">
                    <Loader size="md" />
                  </div>
                ) : (
                  <div
                    className={`invite-group-member-list iferp-scroll fadeInUp ${
                      isPopup ? "" : "max-430"
                    }`}
                  >
                    {userList.map((elem, index) => {
                      const exist = values.invited_members.includes(elem.id);
                      return (
                        <div
                          className={`cps-16 cpe-16 cpt-20 cpb-20 ${
                            userList.length - 1 === index ? "" : "border-bottom"
                          }`}
                          key={index}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center create-group-profile-container">
                              <Profile
                                isRounded
                                text={elem.firstName}
                                size="s-48"
                              />
                              <div className="user-details-block ms-3">
                                <div className="text-15-600 color-raisin-black">
                                  {elem.label}
                                </div>
                                <div className="text-13-400 color-black-olive mt-1">
                                  {elem.des}
                                </div>
                              </div>
                            </div>
                            <div>
                              <Button
                                text={exist ? "Undo" : "Invite"}
                                btnStyle={
                                  exist ? "light-outline" : "primary-light"
                                }
                                className="h-35 cps-20 cpe-20"
                                onClick={() => {
                                  let oldList = cloneDeep(
                                    values.invited_members
                                  );
                                  if (exist) {
                                    oldList = oldList.filter(
                                      (o) => o !== elem.id
                                    );
                                  } else {
                                    oldList = [...oldList, elem.id];
                                  }
                                  handleChange({
                                    target: {
                                      id: "invited_members",
                                      value: oldList,
                                    },
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="d-flex justify-content-center gap-4 cmt-30">
                  <Button
                    isRounded
                    text="Cancel"
                    btnStyle="light-outline"
                    className="cps-40 cpe-40"
                    onClick={() => {
                      isPopup ? onHide() : resetForm();
                    }}
                  />
                  <Button
                    isRounded
                    text={id ? "Update Group" : "Create Group"}
                    btnStyle="primary-dark"
                    className="cps-20 cpe-20"
                    onClick={handleSubmit}
                    btnLoading={btnLoader}
                  />
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
export default GroupForm;
