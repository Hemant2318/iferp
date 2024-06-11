import { useEffect, useState } from "react";
import Card from "components/Layout/Card";
import InstitutionCertificates from "./InstitutionCertificates";
import AmbassadorCertificates from "./AmbassadorCertificates";
import { getDataFromLocalStorage } from "utils/helpers";
import { useNavigate } from "react-router-dom";

const InstitutionalCertificates = () => {
  const navigate = useNavigate();
  const [type, setType] = useState(0);
  const activeClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  useEffect(() => {
    if (!["0", "6"].includes(getDataFromLocalStorage("user_type"))) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Card className="d-flex align-items-center p-1 unset-br">
        <div
          className={type === 0 ? activeClass : inActiveClass}
          onClick={() => {
            if (type === 1) {
              setType(0);
            }
          }}
        >
          Institution Certificates
        </div>
        <div
          className={type === 1 ? activeClass : inActiveClass}
          onClick={() => {
            if (type === 0) {
              setType(1);
            }
          }}
        >
          Ambassador Certificates
        </div>
      </Card>

      {type === 0 && <InstitutionCertificates />}
      {type === 1 && <AmbassadorCertificates />}
    </>
  );
};
export default InstitutionalCertificates;
