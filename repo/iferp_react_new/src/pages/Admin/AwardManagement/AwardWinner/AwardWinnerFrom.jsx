import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import Dropdown from "components/form/Dropdown";
import Card from "components/Layout/Card";
import NewAwardWinner from "./NewAwardWinner";
import OldAwardWinner from "./OldAwardWinner";
import { icons } from "utils/constants";
import RadioInput from "components/form/RadioInput/RadioInput";
import { useDispatch } from "react-redux";
import { fetchAwardWinnersDetails } from "store/slices";
import { getDataFromLocalStorage } from "utils/helpers";

const fileAcceptTypes = [
  "jpg",
  "jpeg",
  "png",
  "doc",
  "pdf",
  "docx",
  "vnd.openxmlformats-officedocument.wordprocessingml.document",
  "msword",
];

const AwardWinnerFrom = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [userType, setUserType] = useState("1");
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate(-1);
  };
  const getAwardDetails = async () => {
    const response = await dispatch(
      fetchAwardWinnersDetails(params?.awardWinnerId)
    );
    setEditData(response?.data || {});
    setUserType(
      response?.data?.type && response?.data?.type === "1" ? "2" : "1"
    );
  };
  useEffect(() => {
    if (["0", "6"].includes(getDataFromLocalStorage("user_type"))) {
      if (params?.awardWinnerId !== "add-award-winners") {
        setIsEdit(true);
        getAwardDetails();
      }
    } else {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Card className="cps-30 cpe-30 cpt-30 cpb-30 cmb-30">
      <div className="d-flex align-items-center justify-content-between cmb-30">
        <div className="d-flex">
          <span className="d-flex" onClick={handleRedirect}>
            <img
              src={icons.leftArrow}
              alt="back"
              className="h-21 me-3 pointer"
            />
          </span>
          <span className="text-16-400 color-black-olive">
            {`${isEdit ? "Edit" : "Add"} Award Winner`}
          </span>
        </div>
        <div className="d-flex">
          <RadioInput
            label="New User"
            className="pe-4"
            checked={userType === "1"}
            onChange={() => {
              setUserType("1");
            }}
          />
          <RadioInput
            label="Old User"
            checked={userType === "2"}
            onChange={() => {
              setUserType("2");
            }}
          />
        </div>
      </div>

      {userType === "1" && (
        <NewAwardWinner editData={editData} fileAcceptTypes={fileAcceptTypes} />
      )}
      {userType === "2" && (
        <OldAwardWinner editData={editData} fileAcceptTypes={fileAcceptTypes} />
      )}
    </Card>
  );
};
export default AwardWinnerFrom;
