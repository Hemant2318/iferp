import { useState } from "react";
import Inbox from "./Inbox";
import SentMessages from "./SentMessages";
import StarredMessages from "./StarredMessages";

const Messages = () => {
  const [type, setType] = useState("1");
  const active = "pointer color-b8e3";
  const inActive = "pointer";
  return (
    <div className="mt-2">
      <div className="d-flex gap-4 text-16-500 pt-3">
        <div
          onClick={() => {
            setType("1");
          }}
          className={`${type === "1" ? active : inActive}`}
        >
          <div className="ps-2 pe-1">Inbox</div>
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
          <div>Sent Messages (4)</div>
          {type === "2" && (
            <div
              style={{
                border: "1.5px solid #28B8E3",
              }}
            />
          )}
        </div>
        <div
          onClick={() => {
            setType("3");
          }}
          className={`${type === "3" ? active : inActive}`}
        >
          <div>Starred Messages</div>
          {type === "3" && (
            <div
              style={{
                border: "1.5px solid #28B8E3",
              }}
            />
          )}
        </div>
      </div>
      {type === "1" && <Inbox />}
      {type === "2" && <SentMessages />}
      {type === "3" && <StarredMessages />}
    </div>
  );
};

export default Messages;
