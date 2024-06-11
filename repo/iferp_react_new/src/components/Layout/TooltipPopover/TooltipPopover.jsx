import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./TooltipPopover.scss";

function TooltipPopover() {
  return (
    <div className="d-flex" id="tooltip-popover-container">
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id="button-tooltip-2">
            <div className="text-12-400 color-black text-start">
              User not verified yet.
            </div>
          </Tooltip>
        }
      >
        <i className="bi bi-info-circle test-10-400 pointer d-flex align-items-center" />
      </OverlayTrigger>
    </div>
  );
}

export default TooltipPopover;
