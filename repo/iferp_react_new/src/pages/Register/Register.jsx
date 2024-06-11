import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { find, result } from "lodash";
import Card from "components/Layout/Card";
import { membershipType } from "utils/constants";
import { fetchUserDetails } from "store/slices";
import HeaderLayout from "components/Layout/HeaderLayout";
import WhatsAppChat from "components/Layout/WhatsAppChat";
import MembershipPreviewDetails from "./MembershipPreviewDetails";
import MemberDetails from "./MemberDetails";
import "./Register.scss";

const Register = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const memberType = result(
    find(membershipType, { type: params.memberType }),
    "type"
  );
  const memberTypeId = result(
    find(membershipType, { type: params.memberType }),
    "id"
  );
  const fetchUserData = async () => {
    const response = await dispatch(fetchUserDetails());
    let newData = {};
    if (response?.data) {
      newData = response?.data;
    }
    setUserDetails(newData);
    return response;
  };
  useEffect(() => {
    if (userDetails?.registration_status === "4") {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <HeaderLayout>
      <div id="register-container">
        <div className="row">
          <Card className="col-md-5 col-md-3 m-auto card-padding">
            {params?.formType === "preview-details" ? (
              <MembershipPreviewDetails
                userDetails={userDetails}
                fetchUserData={fetchUserData}
                memberType={memberType}
                memberTypeId={memberTypeId}
              />
            ) : (
              <MemberDetails
                userDetails={userDetails}
                fetchUserData={fetchUserData}
                memberType={memberType}
                memberTypeId={memberTypeId}
              />
            )}
          </Card>
        </div>
      </div>
      <WhatsAppChat />
    </HeaderLayout>
  );
};
export default Register;
