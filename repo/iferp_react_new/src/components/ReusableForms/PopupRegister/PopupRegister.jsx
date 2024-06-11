import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "components/Layout/Modal";
import { fetchUserDetails, getAllTopicsList } from "store/slices";
import { icons } from "utils/constants";
import PersonalDetails from "./PersonalDetails";
import EducationDetails from "./EducationDetails";
import MembershipDetails from "./MembershipDetails";
import "./PopupRegister.scss";
import { getUserType, titleCaseString } from "utils/helpers";

const PopupRegister = () => {
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({});
  const { registration_status } = userDetails;
  const [type, setType] = useState("");
  const fetchUserData = async () => {
    const response = await dispatch(fetchUserDetails());
    let newData = {};
    if (response?.data) {
      newData = response?.data;
    }
    setUserDetails(newData);
    return response;
  };

  const fetchTopicList = async () => {
    await dispatch(getAllTopicsList());
  };
  const subTitle = {
    "personal-details": "Crafting Your Unique Identity",
    "education-details": "Shaping Your Academic Journey",
    "membership-details": "Choose Your Path to Success",
  };
  const arrayOption = [
    {
      id: 1,
      title: "Personal Details",
      type: "personal-details",
      isActive: +registration_status > 0,
    },
    {
      id: 2,
      title: "Education Details",
      type: "education-details",
      isActive: +registration_status > 1,
    },
    {
      id: 3,
      title: "Membership Details",
      type: "membership-details",
      isActive: false,
    },
  ];
  useEffect(() => {
    if (
      localStorage.paymentIntent ||
      userDetails?.registration_status === "2"
    ) {
      setType("membership-details");
    } else if (userDetails?.registration_status === "0") {
      setType("personal-details");
    } else if (userDetails?.registration_status === "1") {
      setType("education-details");
    } else {
      setType("personal-details");
    }
  }, [userDetails]);

  useEffect(() => {
    fetchUserData();
    fetchTopicList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const userType = getUserType();

  return (
    <>
      {type && (
        <Modal size="lg" width="1000px" className="register-popup" hideClose>
          <div id="popup-register-container">
            <div className="text-24-600 color-raisin-black text-center mb-3">
              {titleCaseString(userType)} Member Registration
            </div>
            <div className="text-16-500 color-subtitle-navy text-center mb-4">
              {subTitle[type]}
            </div>
            <div className="details-list cmb-30">
              {arrayOption.map((elem, index) => {
                return (
                  <React.Fragment key={index}>
                    <div className="details-block">
                      {elem.isActive ? (
                        <img
                          src={icons.activeDetails}
                          alt="active"
                          className="active-selection"
                        />
                      ) : (
                        <div className="number-block">{elem.id}</div>
                      )}
                      <div
                        className={`text-18-400 ${
                          elem.isActive ? "color-new-car" : "color-black-olive"
                        }`}
                        // onClick={() => {
                        //   setType(elem.type);
                        // }}
                      >
                        {elem.title}
                      </div>
                    </div>
                    {arrayOption.length - 1 !== index && (
                      <div
                        className={`border-saprator ${
                          elem.isActive ? "active-border" : ""
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <div
              id="register-popup-body-block"
              className="cps-40 cpe-40 cpb-10"
            >
              {type === "personal-details" && (
                <PersonalDetails
                  setType={setType}
                  userDetails={userDetails}
                  fetchUserData={fetchUserData}
                />
              )}
              {type === "education-details" && (
                <EducationDetails
                  setType={setType}
                  userDetails={userDetails}
                  fetchUserData={fetchUserData}
                />
              )}
              {type === "membership-details" && (
                <MembershipDetails
                  setType={setType}
                  userDetails={userDetails}
                />
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PopupRegister;
