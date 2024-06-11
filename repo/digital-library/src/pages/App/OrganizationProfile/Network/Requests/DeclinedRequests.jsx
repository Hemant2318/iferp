import React from "react";
import ProfileCard from "../ProfileCard";

const DeclinedRequests = () => {
  const list = [
    {
      name: "Yue Chen",
      bio: "PhD - Physics",
      des: "Professor at University of England",
      presentations: "192",
    },
    {
      name: "M. Kimberly MacLin",
      bio: "PhD in Chemistry",
      des: "Associate Professor at University of London",
      presentations: "123",
      follow: true,
    },
  ];
  return (
    <div className="row mt-3">
      {list.map((elm, index) => {
        return (
          <React.Fragment key={index}>
            <ProfileCard data={elm} isDeclinedRequests />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default DeclinedRequests;
