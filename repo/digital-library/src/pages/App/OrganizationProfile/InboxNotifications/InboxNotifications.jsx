import { useState } from "react";
import { Button } from "components";
import { icons } from "utils/constants";
import Updates from "./Updates";
import Messages from "./Messages";
import Compose from "./Compose";

const InboxNotifications = () => {
  const [isShow, setIsShow] = useState(false);
  const [type, setType] = useState("1");
  const active = "pointer color-b8e3";
  const inActive = "pointer";
  return (
    <div className="mt-3">
      {isShow && (
        <Compose
          onHide={() => {
            setIsShow(false);
          }}
        />
      )}
      <div className="shadow fb-center gap-2">
        <div className="d-flex gap-4 text-16-500 pt-3">
          <div
            onClick={() => {
              setType("1");
            }}
            className={`${type === "1" ? active : inActive}`}
          >
            <div className="ps-2 pe-1"> Updates (4)</div>
            {type === "1" && (
              <div
                style={{
                  border: "1.5px solid #28B8E3",
                }}
              />
            )}
          </div>
          <div
            onClick={() => {
              setType("2");
            }}
            className={`${type === "2" ? active : inActive}`}
          >
            <div>Messages (46)</div>
            {type === "2" && (
              <div
                style={{
                  border: "1.5px solid #28B8E3",
                }}
              />
            )}
          </div>
        </div>
        <div className="fa-center gap-2 pe-2">
          <div className="fa-center gap-2 pe-3">
            <span>
              <img src={icons.search} alt="search" />
            </span>
            <span>Search</span>
          </div>
          <Button
            btnText="Compose"
            btnStyle="PO"
            className="h-32 text-13-400"
            onClick={() => {
              setIsShow(true);
            }}
          />
        </div>
      </div>
      {type === "1" && <Updates />}
      {type === "2" && <Messages />}
    </div>
  );
};

export default InboxNotifications;
