import { useState } from "react";
import NewRequests from "./NewRequests";
import SentRequests from "./SentRequests";
import DeclinedRequests from "./DeclinedRequests";

const Requests = () => {
  const [type, setType] = useState("1");
  const active = "pointer color-b176";
  const inActive = "pointer";
  return (
    <div className="mt-2">
      <div className="d-flex gap-5 text-15-400 pt-3">
        <div
          onClick={() => {
            setType("1");
          }}
          className={`${type === "1" ? active : inActive}`}
        >
          <div>New Requests (3)</div>
          {type === "1" && (
            <div
              style={{
                border: "1.5px solid #24b176",
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
          <div>Sent Requests</div>
          {type === "2" && (
            <div
              style={{
                border: "1.5px solid #24b176",
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
          <div>Declined Requests</div>
          {type === "3" && (
            <div
              style={{
                border: "1.5px solid #24b176",
              }}
            />
          )}
        </div>
      </div>
      {type === "1" && <NewRequests />}
      {type === "2" && <SentRequests />}
      {type === "3" && <DeclinedRequests />}
    </div>
  );
};

export default Requests;
