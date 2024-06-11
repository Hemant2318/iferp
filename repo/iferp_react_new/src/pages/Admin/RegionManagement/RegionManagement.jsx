import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useNavigate, useParams } from "react-router-dom";
import { adminRoute } from "utils/constants";
import { getDataFromLocalStorage } from "utils/helpers";
import CountryManagement from "./CountryManagement";
import StateManagement from "./StateManagement";
import CityManagement from "./CityManagement";

const RegionManagement = () => {
  const params = useParams();
  const navigate = useNavigate();

  const handleRedirect = (type) => {
    navigate(`${adminRoute.regionManagement}/${type}`);
  };
  return (
    <div>
      {getDataFromLocalStorage("user_type") === "0" && (
        <Tabs
          defaultActiveKey={params?.rType}
          id="uncontrolled-tab-example"
          className="mb-3 gap-4"
        >
          <Tab
            eventKey="country"
            title="Country"
            onEnter={() => {
              handleRedirect("country");
            }}
          />
          <Tab
            eventKey="state"
            title="State"
            onEnter={() => {
              handleRedirect("state");
            }}
          />
          <Tab
            eventKey="city"
            title="City"
            onEnter={() => {
              handleRedirect("city");
            }}
          />
        </Tabs>
      )}
      {params?.rType === "country" && <CountryManagement />}
      {params?.rType === "state" && <StateManagement />}
      {params?.rType === "city" && <CityManagement />}
    </div>
  );
};

export default RegionManagement;
