import React from "react";
import ProfileCard from "./ProfileCard";

const Followers = () => {
  const list = [
    {
      name: "Arumugam Nallanathan",
      bio: "B.E - Computer Science Engineering",
      des: "Professor at University of England",
      presentations: "192",
    },
    {
      name: "Yuanwei Liu",
      bio: "Doctor of Philosophy",
      des: "Associate Professor at University of London",
      presentations: "123",
      follow: true,
    },
    {
      name: "Mohammad Reza Nakhai",
      bio: "Doctor of Philosophy",
      des: "Associate Professor at University of London",
      presentations: "123",
      follow: true,
    },
    {
      name: "Yue Chen",
      bio: "Doctor of Philosophy",
      des: "Associate Professor at University of London",
      presentations: "123",
    },
    {
      name: "Navera Karim",
      bio: "Doctor of Philosophy",
      des: "Associate Professor at University of London",
      presentations: "123",
    },
  ];
  return (
    <div className="row mt-3">
      {list.map((elm, index) => {
        return (
          <React.Fragment key={index}>
            <ProfileCard data={elm} isFollower />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Followers;
