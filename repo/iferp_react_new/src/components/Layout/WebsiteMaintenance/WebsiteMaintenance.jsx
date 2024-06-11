import React from "react";
import { icons } from "utils/constants";
import "./WebsiteMaintenance.scss";

const WebsiteMaintenance = () => {
  return (
    <div
      id="website-maintenance-container"
      className="d-flex align-items-center justify-content-center vh-100"
    >
      <div className="body-container">
        <div className="image-container">
          <img
            src={icons.maintenance}
            alt="website maintenance"
            className="website-maintenance"
          />
        </div>
        <div className="title-container">Sorry! We Are Under Maintenance</div>
        <div className="message-container">
          Sorry for the inconvenience, but performing some maintenance at the
          moment.
          <br />
          If you need to reach us, you can always contact us on{" "}
          <span className="color-new-car">helpdesk@iferp.in</span>
        </div>
      </div>
    </div>
  );
};

export default WebsiteMaintenance;
