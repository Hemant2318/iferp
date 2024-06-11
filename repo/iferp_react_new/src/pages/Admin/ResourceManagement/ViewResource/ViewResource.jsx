import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import ExportButton from "components/Layout/ExportButton";
import { adminRoute, icons } from "utils/constants";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import { exportResourceData, fetchResourceDetails } from "store/slices";

const ViewResource = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [resourceData, setResourceData] = useState({});
  const getResourceDetails = async () => {
    let forData = objectToFormData({ id: params.resourceId });
    const response = await dispatch(fetchResourceDetails(forData));
    const data = response?.data || {};
    setResourceData(data);
    setLoading(false);
  };
  const handleRedirect = () => {
    navigate(`${adminRoute.resourceManagement}`);
  };

  useEffect(() => {
    if (["0"].includes(getDataFromLocalStorage("user_type"))) {
      getResourceDetails();
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    first_name,
    last_name,
    resource_id: resourceId,
    phone_number: phone,
    email,
    resource_additional_states_name,
    resource_additional_countries_name,
  } = resourceData;
  return (
    <div id="paper-container">
      <div className="cpt-12 cpb-12 d-flex align-items-center justify-content-between cmb-12">
        <div className="d-flex align-items-center">
          <span className="d-flex" onClick={handleRedirect}>
            <img
              src={icons.leftArrow}
              alt="back"
              className="h-21 me-3 pointer"
            />
          </span>
          <span className="text-18-500 color-black-olive">View Details</span>
        </div>
        <ExportButton
          exportAPI={exportResourceData}
          payload={objectToFormData({ id: params.resourceId })}
        />
      </div>
      <Card>
        <div className="cps-28 cpe-28 cpt-22 cpb-22 d-flex align-items-center justify-content-between">
          <div className="text-18-500 color-title-navy font-poppins">
            Resource Details
          </div>

          <div
            className="text-14-400 color-silver-gray pointer"
            onClick={() => {
              navigate(
                `/admin/resource-management/manage-resource/${params.resourceId}`
              );
            }}
          >
            <i className="bi bi-pencil me-2" />
            Edit
          </div>
        </div>
        <hr className="unset-m unset-p" />
        {isLoading ? (
          <div className="pt-5 pb-5">
            <Loader size="md" />
          </div>
        ) : (
          <div className="row cps-28 cpe-28 cpt-22 cpb-22">
            <div className="row cmb-20">
              <div className="col-md-3 text-16-400 color-black-olive">
                Resource Name
              </div>
              <div className="col-md-9 text-16-500 color-black-olive">
                {`${first_name} ${last_name}`}
              </div>
            </div>
            <div className="row cmb-20">
              <div className="col-md-3 text-16-400 color-black-olive">
                Resource ID
              </div>
              <div className="col-md-9 text-16-500 color-black-olive">
                {resourceId}
              </div>
            </div>
            <div className="row cmb-20">
              <div className="col-md-3 text-16-400 color-black-olive">
                Email ID
              </div>
              <div className="col-md-9 text-16-500 color-black-olive">
                {email}
              </div>
            </div>
            <div className="row cmb-20">
              <div className="col-md-3 text-16-400 color-black-olive">
                Contact Number
              </div>
              <div className="col-md-9 text-16-500 color-black-olive">
                {phone}
              </div>
            </div>
            <div className="row cmb-20">
              <div className="col-md-3 text-16-400 color-black-olive">
                Allocated State/Province
              </div>
              <div className="col-md-9 text-16-500 color-black-olive">
                {resource_additional_states_name}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 text-16-400 color-black-olive">
                Allocated Country
              </div>
              <div className="col-md-9 text-16-500 color-black-olive">
                {resource_additional_countries_name}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
export default ViewResource;
