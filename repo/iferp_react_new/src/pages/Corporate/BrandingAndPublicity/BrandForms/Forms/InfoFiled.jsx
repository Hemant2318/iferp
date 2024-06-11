import TextInput from "components/form/TextInput";
import { getDataFromLocalStorage } from "utils/helpers";

const InfoField = () => {
  const data = getDataFromLocalStorage();
  const {
    first_name,
    last_name,
    email_id,
    phone_number,
    company_details: companyDetails = {},
  } = data;
  const { company_city_name, company_state_name, company_country_name } =
    companyDetails;

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
        <TextInput value={company_city_name || ""} disabled />
      </div>
      <div className="col-md-6 cmb-22">
        <TextInput value={company_state_name} disabled />
      </div>
      <div className="col-md-6 cmb-22">
        <TextInput value={company_country_name} disabled />
      </div>
    </>
  );
};
export default InfoField;
