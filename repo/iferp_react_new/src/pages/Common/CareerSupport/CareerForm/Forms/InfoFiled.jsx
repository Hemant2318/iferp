import TextInput from "components/form/TextInput";
import { getDataFromLocalStorage } from "utils/helpers";

const InfoField = ({ isInstitution }) => {
  const data = getDataFromLocalStorage();
  const {
    first_name,
    last_name,
    email_id,
    phone_number,
    educational_details: educationalDetails = {},
    personal_details: personalDetails = {},
  } = data;
  const { city_name, state_name, country_name } = personalDetails;
  const {
    phd_university_name,
    phd_institution_name,
    phd_department_name,
    phd_course_name,
    pg_university_name,
    pg_institution_name,
    pg_department_name,
    pg_course_name,
    ug_university_name,
    ug_institution_name,
    ug_department_name,
    ug_course_name,
  } = educationalDetails;
  const institution =
    phd_institution_name || pg_institution_name || ug_institution_name;
  const university =
    phd_university_name || pg_university_name || ug_university_name;
  const department =
    phd_department_name || pg_department_name || ug_department_name;
  const course = phd_course_name || pg_course_name || ug_course_name;
  return (
    <>
      <div className="col-md-6 cmb-22">
        <TextInput value={`${first_name} ${last_name}`} disabled />
      </div>
      <div className="col-md-6 cmb-22">
        <TextInput value={email_id} disabled />
      </div>
      <div className="col-md-6 cmb-22">
        <TextInput value={phone_number} disabled />
      </div>
      <div className="col-md-6 cmb-22">
        <TextInput value={city_name || ""} disabled />
      </div>
      <div className="col-md-6 cmb-22">
        <TextInput value={state_name} disabled />
      </div>
      <div className="col-md-6 cmb-22">
        <TextInput value={country_name} disabled />
      </div>
      <div className="col-md-6 cmb-22">
        <TextInput value={course} disabled />
      </div>
      <div className="col-md-6 cmb-22">
        <TextInput value={department} disabled />
      </div>
      <div className="col-md-6 cmb-22">
        <TextInput value={university} disabled />
      </div>

      {isInstitution && (
        <div className="col-md-6 cmb-22">
          <TextInput value={institution} disabled />
        </div>
      )}
    </>
  );
};
export default InfoField;
