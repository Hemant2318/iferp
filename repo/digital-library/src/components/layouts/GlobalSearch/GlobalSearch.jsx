import React from "react";
import "./GlobalSearch.scss";
import { icons } from "utils/constants";

const GlobalSearch = () => {
  return (
    // <div className="global-input-search flex-grow-1">
    //   <input id="my-search-input" type="text" placeholder="Search..." />
    //   <img src={icons.search} alt="search" className="search-i pointer" />
    // </div>
    <div className="search-container">
      <img src={icons.search} alt="search" className="search-i pointer" />
      <input type="text" placeholder="Search" className="globalSearch" />
    </div>

    /* <div style={{ border: "1px solid #DDD" }}>
      <img src={icons.search} alt="l" />
      <input style={{ border: "none" }} />
    </div> */
  );
};

export default GlobalSearch;
