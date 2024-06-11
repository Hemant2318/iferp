import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import { getCountryCode } from "utils/helpers";

const MyPersonalExecutive = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { personalExecutive } = useSelector((state) => ({
    personalExecutive: state.global.personalExecutive || {},
  }));
  const { id, name, email_id, phone_number, country_code } = personalExecutive;

  const redirect = () => {
    localStorage.personalExecutiveId = id;
    navigate(`/${params?.memberType}/inbox-notifications/compose`);
  };

  return (
    <Card className="cpt-46 cpb-80 cps-50 cpe-40">
      <div className="text-24-500 text-center color-title-navy font-poppins">
        My Personal Customer Service Executive
      </div>
      <div className="center-flex text-15-400-25 color-subtitle-navy text-center mt-3">
        <div className="w-75">
          Our peronal Customer Service Representative helps you with all queries
          related to your IFERP Membership, benefits etc
        </div>
      </div>
      <div className="cmt-50 d-flex flex-wrap justify-content-center gap-2">
        <div className="border cpt-24 cpe-24 cpb-24 cps-24">
          <img src={icons.customerService} alt="customerService" />
        </div>
        <div className="cms-40 d-flex flex-column gap-2">
          <div>
            <div className="text-18-500 color-raisin-black cmb-18">{name}</div>
            <div className="text-16-400 color-raisin-black cmb-16">
              <i className="bi bi-envelope color-new-car text-14-400 cme-12" />
              {email_id}
            </div>
            <div className="text-16-400 color-raisin-black">
              <i className="bi bi-telephone color-new-car text-14-400 cme-12" />
              {phone_number &&
                `${getCountryCode(country_code || "IN")} ${phone_number}`}
            </div>
          </div>
          <div className="d-flex mt-auto">
            <Button
              isRounded
              text="Email Now"
              btnStyle="primary-outline"
              className="text-16-500 cps-40 cpe-40"
              onClick={redirect}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
export default MyPersonalExecutive;
