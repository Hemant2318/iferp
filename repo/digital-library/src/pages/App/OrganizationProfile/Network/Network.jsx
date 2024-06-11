import { useState } from "react";
import { icons } from "utils/constants";
import Following from "./Following";
import Followers from "./Followers";
import Requests from "./Requests";

const Network = () => {
  const [type, setType] = useState("1");
  const active = "pointer color-b8e3";
  const inActive = "pointer";
  return (
    <div className="mt-3">
      <div className="shadow fb-center">
        <div className="d-flex gap-5 text-16-500 pt-3">
          <div
            onClick={() => {
              setType("1");
            }}
            className={`${type === "1" ? active : inActive}`}
          >
            <div className="ps-2">Following (58)</div>
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
            <div>Followers (94)</div>
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
            <div>Requests</div>
            {type === "3" && (
              <div
                style={{
                  border: "1.5px solid #28B8E3",
                }}
              />
            )}
          </div>
        </div>
        <div className="fa-center gap-2 pe-3">
          <span>
            <img src={icons.search} alt="search" />
          </span>
          <span>Search</span>
        </div>
      </div>
      {type === "1" && <Following />}
      {type === "2" && <Followers />}
      {type === "3" && <Requests />}
    </div>
  );
};

export default Network;
