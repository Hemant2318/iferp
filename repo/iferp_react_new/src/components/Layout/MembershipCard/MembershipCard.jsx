import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { saveAs } from "file-saver";
import { icons, membershipType, profilePath } from "utils/constants";
import {
  generatePreSignedUrl,
  getDataFromLocalStorage,
  getFilenameFromUrl,
  objectToFormData,
} from "utils/helpers";
import Loader from "../Loader";
import { throwError } from "store/slices";
import "./MembershipCard.scss";

const MembershipCard = () => {
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false);
  const [profileURL, setProfileURL] = useState("");
  const userData = getDataFromLocalStorage();
  const {
    id,
    first_name,
    last_name,
    member_id,
    profile_photo_path,
    membership_details,
    user_type,
    membership_plan_id,
  } = userData;
  const findType = membershipType.find((o) => o.id === user_type)?.type;
  const data = {
    membership: [2, 11].includes(membership_plan_id)
      ? "MEMBERSHIP"
      : "PREMIUM MEMBERSHIP",
    number: member_id,
    date: moment(membership_details?.expire_date).format("MM/YY"),
    name: `${first_name.toUpperCase()} ${last_name.toUpperCase()}`,
    type: `${findType.toUpperCase()} MEMBER`,
    profile: profile_photo_path
      ? `https://dashboard-iferp-in.s3.ap-south-1.amazonaws.com/Profile/${profile_photo_path}`
      : "",
    apiURL:
      "https://iferpmembership.in/membership/fellowship/examples/membershipcard.php",
    apiHeader: {
      "Content-Type": "application/json",
      Accept: "application/pdf",
    },
  };
  const { profile, membership, number, date, name, type, apiURL, apiHeader } =
    data;

  const downloadCard = () => {
    let payload = objectToFormData({
      member_type: membership,
      user_profile: profileURL,
      user_id: id,
      membership_id: number,
      valid_to: date,
      user_name: name,
      user_type: type,
      submit: "1",
    });
    axios
      .post(apiURL, payload, {
        responseType: "arraybuffer",
        headers: apiHeader,
      })
      .then(async (response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        saveAs(url, `${first_name.toLowerCase()}-membership-card.pdf`);
        setIsLoader(false);
      })
      .catch(() => {
        setIsLoader(false);
        dispatch(
          throwError({
            message: "Something went wrong with membership card!",
          })
        );
      });
  };
  const getPresignProfile = async () => {
    let retunURL = "";
    const response = await generatePreSignedUrl(
      getFilenameFromUrl(profile),
      profilePath
    );
    retunURL = response;
    setProfileURL(retunURL);
  };
  useEffect(() => {
    if (profile) {
      getPresignProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div
        id="membership-card-container"
        onClick={() => {
          setIsLoader(true);
          downloadCard();
        }}
      >
        {isLoader ? (
          <div className="text-16-500 color-new-car text-center">
            <Loader size="md" />
          </div>
        ) : (
          <>
            <div>
              <img
                src={icons.primaryMembershipCard}
                alt="cer"
                className="me-3"
              />
            </div>
            <div className="text-16-500 color-new-car text-center">
              <div>Download Membership </div>
              <div>Card</div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default MembershipCard;
