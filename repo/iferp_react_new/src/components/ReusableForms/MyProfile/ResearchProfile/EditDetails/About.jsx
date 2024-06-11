import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { forEach, isEqual } from "lodash";
import Button from "components/form/Button";
import TextArea from "components/form/TextArea";
import CreatableDropdown from "components/form/CreatableDropdown";
import { objectToFormData } from "utils/helpers";
import { addAbout } from "store/slices";

const About = ({ onHide, getProfileData }) => {
  const dispatch = useDispatch();
  const { researchProfile, newLanguageList } = useSelector((state) => ({
    researchProfile: state.student.researchProfile,
    newLanguageList: state.global.languageList,
  }));
  const { about } = researchProfile || {};
  const { introduction, disciplines, skills_and_expertise, languages } =
    about || {};
  const [btnLoading, setBtnLoading] = useState(false);
  const [disciplinList, setDisciplinList] = useState({
    existing: [
      {
        id: "Telecommunications",
        label: "Telecommunications",
      },
      {
        id: "Electrical Engineering",
        label: "Electrical Engineering",
      },
      {
        id: "Optical Engineering",
        label: "Optical Engineering",
      },
    ],
    custom: [],
  });
  const [skillList, setSkillList] = useState({
    existing: [
      {
        id: "Software Development",
        label: "Software Development",
      },
      {
        id: "Digital Signal Processing",
        label: "Digital Signal Processing",
      },
      {
        id: "Optical Wireless Communication",
        label: "Optical Wireless Communication",
      },
    ],
    custom: [],
  });
  const [languageList, setLanguageList] = useState({
    existing: newLanguageList?.map((o) => {
      return { id: o.language, label: o.language };
    }),
    custom: [],
  });
  const handelSave = async (values) => {
    setBtnLoading(true);
    const payload = objectToFormData(values);
    const response = await dispatch(addAbout(payload));
    if (response?.status === 200) {
      getProfileData();
      onHide();
    }
    setBtnLoading(false);
  };
  useEffect(() => {
    if (languages) {
      const customList = [];
      forEach(languages.split(","), (elm) => {
        if (!languageList.existing.find((o) => o.id === elm)) {
          customList.push({
            id: elm,
            label: elm,
          });
        }
      });
      setLanguageList({
        ...languageList,
        custom: customList,
      });
    }
    if (skills_and_expertise) {
      const customList = [];
      forEach(skills_and_expertise.split(","), (elm) => {
        if (!skillList.existing.find((o) => o.id === elm)) {
          customList.push({
            id: elm,
            label: elm,
          });
        }
      });
      setSkillList({
        ...skillList,
        custom: customList,
      });
    }
    if (disciplines) {
      console.log("disciplines", disciplines);
      const customList = [];
      forEach(disciplines.split(","), (elm) => {
        if (!disciplinList.existing.find((o) => o.id === elm)) {
          customList.push({
            id: elm,
            label: elm,
          });
        }
      });
      setDisciplinList({
        ...disciplinList,
        custom: customList,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [about]);

  const validationSchema = Yup.object().shape({
    introduction: Yup.string()
      .required("Introduction is required.")
      .max(500, "Maximum 500 character allow for this field."),
    disciplines: Yup.string().required("Disciplines is required."),
    // skills_and_expertise: Yup.string().required(
    //   "Skills and expertise is required."
    // ),
    languages: Yup.string().required("Languages is required."),
  });
  const initialValues = {
    introduction: introduction || "",
    disciplines: disciplines || "",
    // skills_and_expertise: skills_and_expertise || "",
    skills_and_expertise: "Test",
    languages: languages || "",
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handelSave}
      validationSchema={validationSchema}
    >
      {(props) => {
        const { values, errors, handleChange, handleSubmit } = props;
        return (
          <form>
            <div className="row">
              <div className="cmb-22">
                <TextArea
                  label="Career Objective*"
                  placeholder="Enter Career Objective"
                  rows={3}
                  id="introduction"
                  value={values.introduction}
                  error={errors.introduction}
                  onChange={handleChange}
                />
              </div>
              <div className="cmb-22">
                <CreatableDropdown
                  label="Disciplines*"
                  placeholder="Select or enter disciplines"
                  options={[...disciplinList.existing, ...disciplinList.custom]}
                  id="disciplines"
                  value={values.disciplines}
                  error={errors.disciplines}
                  onChange={handleChange}
                  onCreateOption={(e) => {
                    let strToArray = values.disciplines
                      ? values.disciplines.split(",")
                      : [];
                    strToArray.push(e);
                    setDisciplinList({
                      ...disciplinList,
                      custom: [...disciplinList.custom, { id: e, label: e }],
                    });
                    handleChange({
                      target: {
                        id: "disciplines",
                        value: strToArray.join(","),
                      },
                    });
                  }}
                />
              </div>
              {/* <div className="cmb-22">
                <CreatableDropdown
                  label="Skills And Expertise*"
                  placeholder="Select or enter skills and expertise"
                  options={[...skillList.existing, ...skillList.custom]}
                  id="skills_and_expertise"
                  value={values.skills_and_expertise}
                  error={errors.skills_and_expertise}
                  onChange={handleChange}
                  onCreateOption={(e) => {
                    let strToArray = values.skills_and_expertise
                      ? values.skills_and_expertise.split(",")
                      : [];
                    strToArray.push(e);
                    setSkillList({
                      ...skillList,
                      custom: [...skillList.custom, { id: e, label: e }],
                    });
                    handleChange({
                      target: {
                        id: "skills_and_expertise",
                        value: strToArray.join(","),
                      },
                    });
                  }}
                />
              </div> */}
              <div>
                <CreatableDropdown
                  label="Languages*"
                  placeholder="Select or enter languages"
                  options={[...languageList.existing, ...languageList.custom]}
                  id="languages"
                  value={values.languages}
                  error={errors.languages}
                  onChange={handleChange}
                  onCreateOption={(e) => {
                    let strToArray = values.languages
                      ? values.languages.split(",")
                      : [];
                    strToArray.push(e);
                    setLanguageList({
                      ...languageList,
                      custom: [...languageList.custom, { id: e, label: e }],
                    });
                    handleChange({
                      target: {
                        id: "languages",
                        value: strToArray.join(","),
                      },
                    });
                  }}
                />
              </div>
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
                  btnLoading={btnLoading}
                  onClick={handleSubmit}
                  disabled={isEqual(values, initialValues)}
                />
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};
export default About;
