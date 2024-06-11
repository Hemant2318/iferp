import { useState } from "react";
// import { toJpeg } from "html-to-image";
import { saveAs } from "file-saver";
import moment from "moment";
import { icons, membershipType } from "utils/constants";
import {
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import Loader from "../Loader";
import "./MembershipCertificate.scss";
import axios from "axios";
import { useDispatch } from "react-redux";
import { throwError } from "store/slices";

const MembershipCertificate = () => {
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false);
  const userData = getDataFromLocalStorage();
  const {
    first_name,
    last_name,
    member_id,
    user_type,
    membership_details,
    personal_details,
    educational_details,
    institution_details,
    company_details,
  } = userData;
  const findType = membershipType.find((o) => o.id === user_type)?.type;
  let { ug_institution_name, pg_institution_name, phd_institution_name } =
    educational_details;
  const { institution_name } = institution_details;
  const { company_name } = company_details;
  let instituteValue =
    phd_institution_name ||
    pg_institution_name ||
    ug_institution_name ||
    institution_name ||
    company_name;
  const data = {
    name: `${first_name} ${last_name}`,
    bio: instituteValue,
    memberType: titleCaseString(findType),
    from: moment(membership_details?.start_date).format("DD/MM/YYYY"),
    to: moment(membership_details?.expire_date).format("DD/MM/YYYY"),
    membershipID: member_id,
    nationality:
      personal_details?.country_name ||
      institution_details?.country_name ||
      company_details?.company_country_name ||
      "",
    dateOfIssue: moment(membership_details?.start_date).format("DD/MM/YYYY"),
    cert_mem: "-",
    apiURL:
      "https://iferpmembership.in/membership/fellowship/examples/newpremium.php",
    apiHeader: {
      "Content-Type": "application/json",
      Accept: "application/pdf",
    },
  };
  const {
    name,
    bio,
    memberType,
    from,
    to,
    membershipID,
    nationality,
    dateOfIssue,
    cert_mem,
    apiURL,
    apiHeader,
  } = data;
  const downloadCertificate = () => {
    let payload = objectToFormData({
      user_name: name,
      institute_name: bio,
      member_type: memberType,
      valid_from: from,
      valid_to: to,
      membership_id: membershipID,
      nationality: nationality,
      date_of_issue: dateOfIssue,
      cert_mem: cert_mem,
      submit: "1",
    });
    axios
      .post(apiURL, payload, {
        responseType: "arraybuffer",
        headers: apiHeader,
      })
      .then(async (response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        saveAs(url, `${first_name.toLowerCase()}-membership-certificate.pdf`);
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
  // const handelDownload = () => {
  //   setIsLoader(true);
  //   var newDiv = document.createElement("div");
  //   newDiv.id = "membership-certificate-image";
  //   newDiv.innerHTML = `<div class="name-block">${name}</div>
  //   <div class="bio-block">${bio}</div>
  //   <div class="memberType-block">${memberType}</div>
  //   <div class="from-block">${from}</div>
  //   <div class="to-block">${to}</div>
  //   <div class="membershipID-block">${membershipID}</div>
  //   <div class="nationality-block">${nationality}</div>
  //   <div class="dateOfIssue-block">${dateOfIssue}</div>
  //   <div class="cert_mem-block">${cert_mem}</div>
  //   <img
  //     src=${icons.membershipCertificate}
  //     alt="membership-certificate"
  //     className="fit-image fill"
  //   />`;
  //   document.body.appendChild(newDiv);
  //   setTimeout(() => {
  //     const node = document.getElementById("membership-certificate-image");
  //     toJpeg(node)
  //       .then((dataURL) => {
  //         saveAs(dataURL, `${first_name}-membership-certificate.jpeg`);
  //         document.body.removeChild(newDiv);
  //       })
  //       .catch(() => {
  //         document.body.removeChild(newDiv);
  //       });
  //     setIsLoader(false);
  //   }, 500);
  // };

  return (
    <>
      <div
        id="membership-certificate-container"
        onClick={() => {
          setIsLoader(true);
          downloadCertificate();
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
                src={icons.primaryMemberCertificate}
                alt="cer"
                className="me-3"
              />
            </div>
            <div className="text-16-500 color-new-car text-center">
              <div>Download Membership </div>
              <div>Certificate</div>
            </div>
          </>
        )}
      </div>
      {/* <div id="membership-certificate-image">
         <div className="name-block">{name}</div>
        <div className="bio-block">{bio}</div>
        <div className="memberType-block">{memberType}</div>
        <div className="from-block">{from}</div>
        <div className="to-block">{to}</div>
        <div className="membershipID-block">{membershipID}</div>
        <div className="nationality-block">{nationality}</div>
        <div className="dateOfIssue-block">{dateOfIssue}</div>
        <div className="cert_mem-block">{cert_mem}</div> 
        <img
          src={icons.membershipCertificate}
          alt="membership-certificate"
          className="fit-image fill"
        />
      </div> */}
    </>
  );
};
export default MembershipCertificate;
