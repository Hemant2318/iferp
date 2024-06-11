import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { cloneDeep, remove } from "lodash";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "components/form/Button";
import Location from "components/form/Location";
import Dropdown from "components/form/Dropdown";
import FileUpload from "components/form/FileUpload";
import Label from "components/form/Label";
import TextInput from "components/form/TextInput";
import Card from "components/Layout/Card";
import { icons, adminRoute, memberType } from "utils/constants";
import { getFilenameFromUrl, objectToFormData } from "utils/helpers";
import { addChapters, fetchChapters } from "store/slices";

const ChapterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { chapterId } = params;
  const isEdit = chapterId !== "add-chapter";
  const [btnLoading, setBtnLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    chapter_name: "",
    chapter_member_details: [
      {
        member_category: "",
        member_name: "",
        member_designation: "",
        member_institute: "",
        member_country: "",
        member_state: "",
        member_image: "",
        fileName: "",
      },
    ],
  });
  const validationSchema = Yup.object().shape({
    chapter_name: Yup.string().required("Chapter name is required."),
    chapter_member_details: Yup.array(
      Yup.object({
        member_category: Yup.string().required("Member category is required."),
        member_name: Yup.string().required("Member name is required."),
        member_designation: Yup.string().required(
          "Member designation is required."
        ),
        member_institute: Yup.string().required(
          "Member institute is required."
        ),
        member_country: Yup.string().required("Member country is required."),
        member_state: Yup.string().required("Member state is required."),
        member_image: Yup.string().required("Member image is required."),
      })
    ),
  });

  const handleRedirect = () => {
    navigate(adminRoute.chapters);
  };
  const handelSave = (values) => {
    setBtnLoading(true);
    const newData = remove(cloneDeep(values.chapter_member_details), (e) => {
      delete e.fileName;
      return e;
    });
    const payloadData = {
      ...values,
      chapter_member_details: JSON.stringify(newData),
    };
    if (isEdit) {
      payloadData.id = chapterId;
    }
    handelAdd(payloadData);
  };
  const handelAdd = async (data) => {
    let forData = objectToFormData(data);
    const response = await dispatch(addChapters(forData));
    if (response?.status === 200) {
      handleRedirect();
    } else {
      setBtnLoading(false);
    }
  };
  const getChapters = async () => {
    const response = await dispatch(fetchChapters({ id: chapterId }));
    if (response?.data) {
      setInitialValues(response.data);
    }
  };
  useEffect(() => {
    if (isEdit) {
      getChapters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div id="chapter-form-container">
      <Card className="cps-24 cpt-12 cpb-12 d-flex align-items-center cmb-12 ">
        <span className="d-flex" onClick={handleRedirect}>
          <img src={icons.leftArrow} alt="back" className="h-21 me-3 pointer" />
        </span>
        <span className="text-16-400 color-black-olive">
          {isEdit ? "Edit Chapter" : "Create Chapter"}
        </span>
      </Card>
      <Card className="cps-30 cpe-30 cpt-38 cmb-30">
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
            const { chapter_member_details = [] } = values;
            return (
              <form>
                <div className="row">
                  <div className="col-md-12 d-flex align-items-center">
                    <div className="me-2">
                      <Label label="Chapter Name" required />
                    </div>
                    <div className="flex-grow-1">
                      <TextInput
                        placeholder="Enter Chapter Name"
                        id="chapter_name"
                        value={values.chapter_name}
                        onChange={handleChange}
                        error={errors?.chapter_name}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-18-500 color-title-navy font-poppins cmt-34 cmb-20">
                  Chapter Member
                </div>

                {chapter_member_details.map((elem, index) => {
                  const {
                    member_category,
                    member_name,
                    member_designation,
                    member_institute,
                    member_country,
                    member_state,
                    member_image,
                    fileName,
                  } = elem;
                  const {
                    member_category: errMemberCategory,
                    member_name: errMemberName,
                    member_designation: errMemberDesignation,
                    member_institute: errMemberInstitute,
                    member_country: errMemberCountry,
                    member_state: errMemberState,
                    member_image: errMemberImage,
                  } = errors?.chapter_member_details?.[index] || {};

                  return (
                    <div key={index} className="cmt-20 row">
                      {chapter_member_details.length > 1 && (
                        <div className="d-flex justify-content-end cmb-12">
                          <Button
                            onClick={() => {
                              const listArray = cloneDeep(
                                chapter_member_details
                              );
                              listArray.splice(index, 1);
                              setFieldValue(
                                "chapter_member_details",
                                listArray
                              );
                            }}
                            btnStyle="light-outline"
                            icon={<img src={icons.deleteIcon} alt="delete" />}
                            isSquare
                          />
                        </div>
                      )}

                      <div className="col-md-6 cmb-24">
                        <Dropdown
                          placeholder="Member Category"
                          id={`chapter_member_details[${index}][member_category]`}
                          value={member_category}
                          options={memberType}
                          optionKey="value"
                          optionValue="value"
                          onChange={handleChange}
                          error={errMemberCategory}
                        />
                      </div>
                      <div className="col-md-6 cmb-24">
                        <TextInput
                          placeholder="Name"
                          id={`chapter_member_details[${index}][member_name]`}
                          value={member_name}
                          onChange={handleChange}
                          error={errMemberName}
                        />
                      </div>

                      <div className="col-md-6 cmb-24">
                        <TextInput
                          placeholder="Designation"
                          id={`chapter_member_details[${index}][member_designation]`}
                          value={member_designation}
                          onChange={handleChange}
                          error={errMemberDesignation}
                        />
                      </div>
                      <div className="col-md-6 cmb-24">
                        <TextInput
                          placeholder="Institution/Organization Name"
                          id={`chapter_member_details[${index}][member_institute]`}
                          value={member_institute}
                          onChange={handleChange}
                          error={errMemberInstitute}
                        />
                      </div>

                      <div className="col-md-6 cmb-24">
                        <Location
                          type="country"
                          data={{
                            id: `chapter_member_details[${index}][member_country]`,
                            placeholder: "Country*",
                            value: member_country,
                            error: errMemberCountry,
                            onChange: handleChange,
                          }}
                        />
                      </div>
                      <div className="col-md-6 cmb-24">
                        <Location
                          type="state"
                          data={{
                            id: `chapter_member_details[${index}][member_state]`,
                            placeholder: "State/Province*",
                            value: member_state,
                            countryId: member_country,
                            optionKey: "id",
                            disabled: !member_country,
                            error: errMemberState,
                            onChange: handleChange,
                          }}
                        />
                      </div>
                      <div className="col-md-6 cmb-24 ">
                        {/* <div className="me-2">
                          <Label label="Upload photo" required />
                        </div> */}
                        <div className="flex-grow-1">
                          <FileUpload
                            label="Upload photo*"
                            fileType="image"
                            id={`chapter_member_details[${index}][member_image]`}
                            onChange={(e) => {
                              handleChange({
                                target: {
                                  id: `chapter_member_details[${index}][fileName]`,
                                  value: e.target.fileName,
                                },
                              });
                              handleChange(e);
                            }}
                            fileText={
                              fileName || getFilenameFromUrl(member_image) || ""
                            }
                            error={errMemberImage}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="row">
                  <div className="col-md-6 d-flex">
                    <Button
                      onClick={() => {
                        const newArray = [
                          {
                            member_category: "",
                            member_name: "",
                            member_designation: "",
                            member_institute: "",
                            member_country: "",
                            member_image: "",
                            fileName: "",
                          },
                        ];
                        setFieldValue("chapter_member_details", [
                          ...chapter_member_details,
                          ...newArray,
                        ]);
                      }}
                      text="+ Add Member"
                      btnStyle="primary-light"
                      className="h-35 text-14-500"
                      isSquare
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center gap-4 cmt-24 cpb-46">
                  <Button
                    text="Cancel"
                    isRounded
                    btnStyle="light-outline"
                    className="cps-40 cpe-40"
                    onClick={resetForm}
                  />
                  <Button
                    text="Done"
                    isRounded
                    btnStyle="primary-dark"
                    className="cps-40 cpe-40"
                    onClick={handleSubmit}
                    btnLoading={btnLoading}
                  />
                </div>
              </form>
            );
          }}
        </Formik>
      </Card>
    </div>
  );
};
export default ChapterForm;
