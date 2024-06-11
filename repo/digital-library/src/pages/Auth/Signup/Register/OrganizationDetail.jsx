import { Formik } from "formik";
import * as Yup from "yup";
import SliderLayout from "pages/Auth/SliderLayout/SliderLayout";
import { Card } from "react-bootstrap";
import { Button, TextArea, InputText, FileUpload } from "components";

const OrganizationDetail = () => {
  const initialValues = {
    about: "",
    objective: "",
    mission: "",
    vision: "",
    researchArea: "",
    presenters: "",
  };
  const validationSchema = Yup.object().shape({
    about: Yup.string().required("About is required."),
    objective: Yup.string().required("Objective is required."),
    mission: Yup.string().required("Mission is required."),
    vision: Yup.string().required("Vision is required."),
    researchArea: Yup.string().required("Research Areas is required."),
    presenters: Yup.string().required("Target Presenters Areas is required."),
    password: Yup.string().required("Password is required."),
  });
  return (
    <div id="detail-container" className="bg-skyBlue overflow-auto">
      <SliderLayout>
        <Card className="bg-ffff m-auto cp-50">
          <div className="text-26-500 color-2d2d text-center cmb-36">
            Organization Detail
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {(props) => {
              const { errors, values, handleChange } = props;
              const {
                about,
                objective,
                mission,
                vision,
                researchArea,
                presenters,
              } = values;
              return (
                <form className="row">
                  <div className="col-md-12 mb-4">
                    <TextArea
                      rows={3}
                      label="About Organization*"
                      labelClass="text-15-400 color-3d3d"
                      placeholder="Enter few lines about the organization"
                      id="about"
                      value={about}
                      error={errors?.about}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-12 mb-4">
                    <InputText
                      label="Objectives*"
                      labelClass="text-15-400 color-3d3d"
                      placeholder="Enter your organization’s objectives"
                      id="objective"
                      value={objective}
                      error={errors?.objective}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-12 mb-4">
                    <InputText
                      label="Mission*"
                      labelClass="text-15-400 color-3d3d"
                      placeholder="Enter your organization’s mission"
                      id="mission"
                      value={mission}
                      error={errors?.mission}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-12 mb-4">
                    <InputText
                      label="Vision*"
                      labelClass="text-15-400 color-3d3d"
                      placeholder="Enter your organization’s vision"
                      id="vision"
                      value={vision}
                      error={errors?.vision}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-12 mb-4">
                    <InputText
                      label="Research Areas*"
                      labelClass="text-15-400 color-3d3d"
                      placeholder="Enter research areas"
                      id="researchArea"
                      value={researchArea}
                      error={errors?.researchArea}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-12 mb-4">
                    <InputText
                      label="Target Presenters*"
                      labelClass="text-15-400 color-3d3d"
                      placeholder="Designation of the presenters"
                      id="presenters"
                      value={presenters}
                      error={errors?.presenters}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-12 mb-5">
                    <FileUpload
                      label="Organization’s Logo*"
                      labelClass="text-15-400 color-3d3d"
                      placeholder="Logo"
                    />
                  </div>

                  <div className="d-flex justify-content-center">
                    <Button btnText="Register" btnStyle="SD" />
                  </div>
                </form>
              );
            }}
          </Formik>
        </Card>
      </SliderLayout>
    </div>
  );
};

export default OrganizationDetail;
