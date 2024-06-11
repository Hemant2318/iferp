import { Card } from "react-bootstrap";
import HeaderLayout from "components/Layout/HeaderLayout";
import "./Success.scss";

const Success = () => {
  return (
    <HeaderLayout>
      <div id="success-box-register">
        <Card className="col-md-5 col-md-3 m-auto card-padding">
          <div className="center-flex cmb-40">
            <div className="right-tick">
              <i className="bi bi-check color-new-car font-100" />
            </div>
          </div>
          <div className="text-28-500 color-black-olive text-center cmb-20">
            Submitted Successfully
          </div>
          <div className="text-16-400 color-black-olive text-center">
            <div className="mb-2">Your application is under process</div>
            <div>
              Application status will be updated within 24 working hours
            </div>
          </div>
        </Card>
      </div>
    </HeaderLayout>
  );
};
export default Success;
