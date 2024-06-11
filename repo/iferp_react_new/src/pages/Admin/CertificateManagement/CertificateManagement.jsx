import { useNavigate, useParams } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { adminRoute } from "utils/constants";
import { getDataFromLocalStorage } from "utils/helpers";
import InstitutionalCertificates from "./InstitutionalCertificates";
import EventCertificates from "./EventCertificates";
// import EventCertificates from "./EventCertificatesV2";
import MembershipCertificates from "./MembershipCertificates";

const CertificateManagement = () => {
  const params = useParams();

  const navigate = useNavigate();

  const handleRedirect = (type) => {
    navigate(`${adminRoute.certificateManagement}/${type}`);
  };
  return (
    <div>
      {getDataFromLocalStorage("user_type") === "0" && (
        <Tabs
          defaultActiveKey={params?.type}
          id="uncontrolled-tab-example"
          className="mb-3 gap-4"
        >
          <Tab
            eventKey="event-certificates"
            title="Event Certificates"
            onEnter={() => {
              handleRedirect("event-certificates");
            }}
          />

          <Tab
            eventKey="membership-certificates"
            title="Membership Certificates"
            onEnter={() => {
              handleRedirect("membership-certificates");
            }}
          />

          <Tab
            eventKey="institutional-certificates"
            title="Institutional Certificates"
            onEnter={() => {
              handleRedirect("institutional-certificates");
            }}
          />
        </Tabs>
      )}
      {params?.type === "event-certificates" && <EventCertificates />}
      {params?.type === "membership-certificates" && <MembershipCertificates />}
      {params?.type === "institutional-certificates" && (
        <InstitutionalCertificates />
      )}
    </div>
  );
};
export default CertificateManagement;
